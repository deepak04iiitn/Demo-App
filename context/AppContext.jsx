import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

import { categories, defaultProfile, notificationsSeed, orderSeed, productsSeed, usersSeed } from '../data/mockData';
import { paginate, simulateError, simulateNetwork } from '../utils/mockApi';

const STORAGE_KEY = 'flowmart-state-v1';
const TAX_RATE = 0.08;
const AppContext = createContext(null);

const initialState = {
  isHydrated: false,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  role: 'user',
  language: 'English',
  themeMode: 'light',
  settings: { notifications: true },
  user: defaultProfile,
  products: productsSeed,
  categories,
  cart: [],
  coupon: null,
  orders: orderSeed,
  notifications: notificationsSeed,
  users: usersSeed,
  addresses: [
    { id: 'a1', label: 'Home Studio', address: '42 Residency Road, Bengaluru' },
    { id: 'a2', label: 'Client Office', address: '9 River View, Mumbai' },
  ],
  selectedAddressId: 'a1',
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, isHydrated: true };
    case 'SET_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: { ...state.user, ...action.payload.user } };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, role: 'user', cart: [], coupon: null };
    case 'DELETE_ACCOUNT':
      return { ...initialState, hasCompletedOnboarding: true, isHydrated: true };
    case 'TOGGLE_THEME':
      return { ...state, themeMode: state.themeMode === 'light' ? 'dark' : 'light' };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, settings: { ...state.settings, notifications: !state.settings.notifications } };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'ADD_TO_CART': {
      const existing = state.cart.find((item) => item.productId === action.payload.productId);
      const cart = existing
        ? state.cart.map((item) =>
            item.productId === action.payload.productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...state.cart, { productId: action.payload.productId, quantity: 1 }];
      return { ...state, cart };
    }
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart
          .map((item) => (item.productId === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item))
          .filter((item) => item.quantity > 0),
      };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((item) => item.productId !== action.payload) };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };
    case 'SET_ADDRESS':
      return { ...state, selectedAddressId: action.payload };
    case 'PLACE_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
        coupon: null,
        notifications: [
          {
            id: `n-${Date.now()}`,
            type: 'order',
            title: 'Order placed',
            message: `Order ${action.payload.id} was placed successfully.`,
            time: 'Just now',
            read: false,
          },
          ...state.notifications,
        ],
      };
    case 'CANCEL_ORDER':
      return { ...state, orders: state.orders.map((order) => (order.id === action.payload ? { ...order, status: 'Cancelled' } : order)) };
    case 'MARK_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) };
    case 'ADD_PRODUCT':
      return { ...state, products: [{ ...action.payload, id: `p-${Date.now()}` }, ...state.products] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map((product) => (product.id === action.payload.id ? { ...product, ...action.payload } : product)) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter((product) => product.id !== action.payload) };
    case 'UPDATE_ORDER_STATUS':
      return { ...state, orders: state.orders.map((order) => (order.id === action.payload.id ? { ...order, status: action.payload.status } : order)) };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
          return;
        }
      } catch (error) {
        console.warn('Unable to hydrate app state', error);
      }
      dispatch({ type: 'HYDRATE', payload: {} });
    })();
  }, []);

  useEffect(() => {
    if (!state.isHydrated) return;

    const persistedState = {
      isAuthenticated: state.isAuthenticated,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
      role: state.role,
      language: state.language,
      themeMode: state.themeMode,
      settings: state.settings,
      user: state.user,
      cart: state.cart,
      coupon: state.coupon,
      orders: state.orders,
      notifications: state.notifications,
      products: state.products,
      users: state.users,
      addresses: state.addresses,
      selectedAddressId: state.selectedAddressId,
    };

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState)).catch((error) =>
      console.warn('Unable to persist app state', error)
    );
  }, [state]);

  const cartItemsDetailed = useMemo(
    () =>
      state.cart.map((item) => {
        const product = state.products.find((entry) => entry.id === item.productId);
        return { ...item, product, lineTotal: (product?.price ?? 0) * item.quantity };
      }),
    [state.cart, state.products]
  );

  const cartSubtotal = cartItemsDetailed.reduce((sum, item) => sum + item.lineTotal, 0);
  const couponDiscount = state.coupon?.type === 'percent' ? cartSubtotal * state.coupon.value : 0;
  const tax = Math.max(cartSubtotal - couponDiscount, 0) * TAX_RATE;
  const total = Math.max(cartSubtotal - couponDiscount, 0) + tax;

  const actions = useMemo(
    () => ({
      completeOnboarding: () => dispatch({ type: 'SET_ONBOARDING' }),
      toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
      toggleNotifications: () => dispatch({ type: 'TOGGLE_NOTIFICATIONS' }),
      setLanguage: (language) => dispatch({ type: 'SET_LANGUAGE', payload: language }),
      setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
      updateProfile: (payload) => dispatch({ type: 'UPDATE_PROFILE', payload }),
      logout: async () => simulateNetwork(dispatch({ type: 'LOGOUT' }), 400),
      deleteAccount: async () => simulateNetwork(dispatch({ type: 'DELETE_ACCOUNT' }), 900),
      login: async ({ email, password }) => {
        if (!email.includes('@') || password.length < 6) return simulateError('Enter a valid email and password');
        await simulateNetwork(null, 900);
        dispatch({ type: 'LOGIN', payload: { user: { email } } });
        return { success: true };
      },
      signup: async ({ name, email, password }) => {
        if (!name || !email.includes('@') || password.length < 6) return simulateError('Please complete all fields');
        await simulateNetwork(null, 1100);
        dispatch({ type: 'LOGIN', payload: { user: { name, email } } });
        return { success: true };
      },
      socialLogin: async (provider) => {
        await simulateNetwork(null, 1200);
        dispatch({ type: 'LOGIN', payload: { user: { email: `${provider.toLowerCase()}@flowmart.app`, name: `${provider} User` } } });
        return { success: true };
      },
      forgotPassword: async (email) => {
        if (!email.includes('@')) return simulateError('Enter a valid email');
        return simulateNetwork({ message: 'Reset link sent' }, 900);
      },
      fetchProducts: async ({ search = '', filter = 'All', sort = 'Popular', page = 1 }) => {
        let items = [...state.products];
        if (filter !== 'All') items = items.filter((product) => product.category === filter);
        if (search) {
          const query = search.toLowerCase();
          items = items.filter((product) =>
            [product.name, product.category, product.description].some((value) => value.toLowerCase().includes(query))
          );
        }
        if (sort === 'Price: Low to High') items.sort((a, b) => a.price - b.price);
        else if (sort === 'Price: High to Low') items.sort((a, b) => b.price - a.price);
        else if (sort === 'Top Rated') items.sort((a, b) => b.rating - a.rating);
        else items.sort((a, b) => b.sales - a.sales);
        return simulateNetwork(paginate(items, page, 4), 800);
      },
      addToCart: (productId) => dispatch({ type: 'ADD_TO_CART', payload: { productId } }),
      updateCartItem: (productId, quantity) => dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity } }),
      removeFromCart: (productId) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId }),
      applyCoupon: async (code) => {
        await simulateNetwork(null, 900);
        if (code.trim().toUpperCase() === 'FLEX20') {
          dispatch({ type: 'APPLY_COUPON', payload: { code: 'FLEX20', type: 'percent', value: 0.2 } });
          return { success: true, message: 'Coupon applied' };
        }
        return simulateError('Invalid coupon code');
      },
      setAddress: (id) => dispatch({ type: 'SET_ADDRESS', payload: id }),
      placeOrder: async (paymentMethod) => {
        await simulateNetwork(null, 1500);
        const shouldFail = paymentMethod === 'Wallet' && total > 300;
        if (shouldFail) return simulateError('Wallet balance is insufficient');
        const order = {
          id: `o-${Date.now()}`,
          createdAt: new Date().toISOString().slice(0, 10),
          status: 'Placed',
          total: Number(total.toFixed(2)),
          address: state.addresses.find((item) => item.id === state.selectedAddressId)?.address,
          items: cartItemsDetailed.map((item) => ({ productId: item.productId, quantity: item.quantity, price: item.product.price })),
          paymentMethod,
        };
        dispatch({ type: 'PLACE_ORDER', payload: order });
        return order;
      },
      cancelOrder: async (id) => {
        await simulateNetwork(null, 800);
        dispatch({ type: 'CANCEL_ORDER', payload: id });
      },
      markNotificationsRead: () => dispatch({ type: 'MARK_NOTIFICATIONS_READ' }),
      addProduct: async (payload) => {
        await simulateNetwork(null, 700);
        dispatch({ type: 'ADD_PRODUCT', payload });
      },
      updateProduct: async (payload) => {
        await simulateNetwork(null, 700);
        dispatch({ type: 'UPDATE_PRODUCT', payload });
      },
      deleteProduct: async (id) => {
        await simulateNetwork(null, 500);
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
      },
      updateOrderStatus: async (id, status) => {
        await simulateNetwork(null, 600);
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
      },
    }),
    [cartItemsDetailed, state.addresses, state.products, state.selectedAddressId, total]
  );

  return (
    <AppContext.Provider
      value={{
        state,
        actions,
        cartSummary: {
          items: cartItemsDetailed,
          subtotal: Number(cartSubtotal.toFixed(2)),
          discount: Number(couponDiscount.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          total: Number(total.toFixed(2)),
        },
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

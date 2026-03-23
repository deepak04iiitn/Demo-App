export const onboardingSlides = [
  {
    id: 'discover',
    title: 'Discover premium services in seconds',
    subtitle: 'Browse verified creatives, digital tools, and ready-to-ship packages built for modern teams.',
    accent: '#0f62fe',
  },
  {
    id: 'manage',
    title: 'Manage projects, orders, and payments',
    subtitle: 'Simulated workflows mirror a real marketplace so the app feels credible from first tap to checkout.',
    accent: '#14b8a6',
  },
  {
    id: 'scale',
    title: 'Switch from buyer mode to admin control',
    subtitle: 'Role-based UI, analytics, order operations, and catalog management turn the app into a full product story.',
    accent: '#f97316',
  },
];

export const categories = ['Branding', 'Development', 'UI Kits', 'Content', 'Marketing', 'Automation'];

export const productsSeed = [
  {
    id: 'p1',
    name: 'Premium Brand Sprint',
    category: 'Branding',
    price: 249,
    rating: 4.9,
    sales: 218,
    description: 'A focused 5-day branding sprint with strategy, logo concepts, and a refined visual system.',
    stock: 12,
    tags: ['popular', 'featured'],
    deliveryTime: '5 days',
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    id: 'p2',
    name: 'Launch-Ready Mobile UI Kit',
    category: 'UI Kits',
    price: 89,
    rating: 4.7,
    sales: 560,
    description: 'Responsive mobile components, onboarding screens, checkout flows, and polished motion-ready layouts.',
    stock: 64,
    tags: ['new'],
    deliveryTime: 'Instant',
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    id: 'p3',
    name: 'Growth Landing Page Pack',
    category: 'Marketing',
    price: 119,
    rating: 4.8,
    sales: 332,
    description: 'Copy-first landing page concepts with conversion-driven sections and editable assets.',
    stock: 38,
    tags: ['featured'],
    deliveryTime: '2 days',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    id: 'p4',
    name: 'Custom API Prototype',
    category: 'Development',
    price: 399,
    rating: 5,
    sales: 97,
    description: 'Mock-first API contract design and frontend integration scaffolding for product validation.',
    stock: 9,
    tags: ['popular'],
    deliveryTime: '7 days',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    id: 'p5',
    name: 'Weekly Content Engine',
    category: 'Content',
    price: 149,
    rating: 4.6,
    sales: 145,
    description: 'A content framework with scripts, social post templates, and campaign hooks for weekly publishing.',
    stock: 24,
    tags: ['new'],
    deliveryTime: '3 days',
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    id: 'p6',
    name: 'Workflow Automation Setup',
    category: 'Automation',
    price: 179,
    rating: 4.9,
    sales: 187,
    description: 'Automation audit, process mapping, and reusable workflow templates for internal operations.',
    stock: 16,
    tags: ['featured'],
    deliveryTime: '4 days',
    images: ['https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'],
  },
];

export const notificationsSeed = [
  { id: 'n1', type: 'order', title: 'Order shipped', message: 'Your Premium Brand Sprint assets are on the way.', time: '2h ago', read: false },
  { id: 'n2', type: 'offer', title: '48-hour bundle deal', message: 'Get 20% off selected UI kits with code FLEX20.', time: '5h ago', read: false },
  { id: 'n3', type: 'system', title: 'Security update', message: 'Your account settings were synced on this device.', time: '1d ago', read: true },
];

export const usersSeed = [
  { id: 'u1', name: 'Ava Patel', email: 'ava@flowmart.app', role: 'admin', location: 'Mumbai', occupation: 'Marketplace Lead' },
  { id: 'u2', name: 'Jordan Lee', email: 'jordan@example.com', role: 'user', location: 'New York', occupation: 'Product Designer' },
  { id: 'u3', name: 'Mira Chen', email: 'mira@example.com', role: 'user', location: 'Singapore', occupation: 'Growth Strategist' },
];

export const orderSeed = [
  {
    id: 'o1',
    createdAt: '2026-03-18',
    status: 'Shipped',
    total: 268.92,
    address: '221B Baker Street, London',
    items: [{ productId: 'p1', quantity: 1, price: 249 }],
    paymentMethod: 'Card',
  },
  {
    id: 'o2',
    createdAt: '2026-03-10',
    status: 'Delivered',
    total: 96.12,
    address: '77 Market Street, San Francisco',
    items: [{ productId: 'p2', quantity: 1, price: 89 }],
    paymentMethod: 'Wallet',
  },
];

export const quickActions = [
  { id: 'browse', label: 'Browse Services', icon: 'grid-outline' },
  { id: 'cart', label: 'Open Cart', icon: 'bag-handle-outline' },
  { id: 'orders', label: 'Track Orders', icon: 'cube-outline' },
  { id: 'admin', label: 'Admin Panel', icon: 'speedometer-outline' },
];

export const defaultProfile = {
  id: 'current-user',
  name: 'Nia Mercer',
  email: 'nia@example.com',
  location: 'Bengaluru',
  occupation: 'Freelance Product Designer',
  avatar: '',
  bio: 'Building polished experiences for ambitious digital products.',
};

import { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ProductCard } from '../../../components/ProductCard';
import { AppInput } from '../../../components/forms/AppInput';
import { AppText } from '../../../components/ui/AppText';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ModePill } from '../../../components/ui/ModePill';
import { Screen } from '../../../components/ui/Screen';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { ShimmerBlock } from '../../../components/ui/ShimmerBlock';
import { Toast } from '../../../components/ui/Toast';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

const sortOptions = ['Popular', 'Top Rated', 'Price: Low to High', 'Price: High to Low'];

export default function CatalogScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState('Grid');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Popular');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const debouncedQuery = useDebouncedValue(query, 350);

  const fetchPage = async (nextPage, reset = false) => {
    if (loading && !reset) return;
    setLoading(true);
    const result = await actions.fetchProducts({ search: debouncedQuery, filter, sort, page: nextPage });
    setHasMore(result.hasMore);
    setItems((prev) => (reset ? result.items : [...prev, ...result.items]));
    setPage(nextPage);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await actions.fetchProducts({ search: debouncedQuery, filter, sort, page: 1 });
      setHasMore(result.hasMore);
      setItems(result.items);
      setPage(1);
      setLoading(false);
    };

    load();
  }, [actions, debouncedQuery, filter, sort]);

  const refresh = async () => {
    setRefreshing(true);
    await fetchPage(1, true);
    setRefreshing(false);
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} style={[styles.skeletonCard, { backgroundColor: colors.surface }]}>
          <ShimmerBlock height={120} />
          <ShimmerBlock width="40%" />
          <ShimmerBlock width="75%" />
          <ShimmerBlock width="55%" />
        </View>
      ))}
    </View>
  );

  return (
    <Screen scroll={false} contentContainerStyle={{ paddingHorizontal: 0 }}>
      <FlatList
        data={items}
        key={viewMode}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'Grid' ? 2 : 1}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        onEndReached={() => hasMore && !loading && fetchPage(page + 1)}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.header}>
            <SectionHeader title="Browse Services" caption="Search, filter, sort, and scroll through mocked catalog data." />
            <AppInput placeholder="Search products, categories, descriptions..." value={query} onChangeText={setQuery} />
            <View style={styles.controls}>
              <ModePill options={['Grid', 'List']} value={viewMode} onChange={setViewMode} />
              <Pressable onPress={() => router.push('/(app)/cart')} style={[styles.cartButton, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name="bag-handle-outline" size={22} color={colors.primary} />
              </Pressable>
            </View>
            <View style={styles.filterRow}>
              {['All', ...state.categories].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  style={[styles.filterChip, { backgroundColor: filter === item ? colors.primary : colors.surface, borderColor: colors.border }]}>
                  <AppText weight="700" style={{ color: filter === item ? '#fff' : colors.text }}>
                    {item}
                  </AppText>
                </Pressable>
              ))}
            </View>
            <View style={styles.sortRow}>
              {sortOptions.map((item) => (
                <Pressable key={item} onPress={() => setSort(item)} style={[styles.sortChip, { backgroundColor: sort === item ? colors.surfaceTint : colors.surfaceAlt }]}>
                  <AppText variant="caption" weight="700">
                    {item}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListFooterComponent={loading && items.length ? <View style={styles.footerLoading}><ShimmerBlock width={120} /></View> : null}
        ListEmptyComponent={loading ? renderSkeleton() : <EmptyState title="No matching services" description="Try a different search term or clear the category filter." />}
        renderItem={({ item }) => (
          <View style={[styles.itemWrap, viewMode === 'List' && styles.listItem]}>
            <ProductCard
              product={item}
              compact={viewMode === 'Grid'}
              onPress={() => router.push(`/(app)/product/${item.id}`)}
              onAdd={() => {
                actions.addToCart(item.id);
                setToast({ visible: true, message: `${item.name} added to cart`, type: 'success' });
              }}
            />
          </View>
        )}
      />
      <Toast {...toast} onHide={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, gap: 16 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartButton: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  sortRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999 },
  itemWrap: { paddingHorizontal: 10, paddingBottom: 20, flex: 1 },
  listItem: { flexBasis: '100%' },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20 },
  skeletonCard: { width: '47%', borderRadius: 24, padding: 14, gap: 12 },
  footerLoading: { paddingVertical: 22, alignItems: 'center' },
});

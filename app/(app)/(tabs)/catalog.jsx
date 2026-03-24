import { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ProductCard } from '../../../components/ProductCard';
import { AppInput } from '../../../components/forms/AppInput';
import { AppText } from '../../../components/ui/AppText';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Screen } from '../../../components/ui/Screen';
import { ShimmerBlock } from '../../../components/ui/ShimmerBlock';
import { Toast } from '../../../components/ui/Toast';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useApp } from '../../../context/AppContext';

// ── Brand tokens ──────────────────────────────────────
const C = {
  bg:           '#F5F5F0',
  surface:      '#FFFFFF',
  accentSoft:   '#ECEAFF',
  accent:       '#5B54E8',
  accentMid:    '#7C77EE',
  text:         '#1A1A2E',
  textMid:      '#6B6B8A',
  textLight:    '#A8A8C0',
  border:       '#E8E8E2',
  borderAccent: '#C8C5F5',
  green:        '#22C55E',
};

const sortOptions = [
  { id: 'Popular',          icon: 'flame-outline' },
  { id: 'Top Rated',        icon: 'star-outline' },
  { id: 'Price: Low',       icon: 'arrow-up-outline' },
  { id: 'Price: High',      icon: 'arrow-down-outline' },
];

export default function CatalogScreen() {
  const { state, actions } = useApp();
  const [query, setQuery]       = useState('');
  const [viewMode, setViewMode] = useState('Grid');
  const [filter, setFilter]     = useState('All');
  const [sort, setSort]         = useState('Popular');
  const [page, setPage]         = useState(1);
  const [items, setItems]       = useState([]);
  const [hasMore, setHasMore]   = useState(true);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast]       = useState({ visible: false, message: '', type: 'success' });
  const [showSortSheet, setShowSortSheet] = useState(false);

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

  const activeSort = sortOptions.find((o) => o.id === sort) || sortOptions[0];

  const renderSkeleton = () => (
    <View style={s.skeletonGrid}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={s.skeletonCard}>
          <ShimmerBlock height={130} style={{ borderRadius: 16 }} />
          <View style={{ gap: 8, padding: 12 }}>
            <ShimmerBlock width="40%" height={10} />
            <ShimmerBlock width="75%" height={12} />
            <ShimmerBlock width="50%" height={10} />
          </View>
        </View>
      ))}
    </View>
  );

  const ListHeader = (
    <View style={s.header}>
      {/* ── Title row ── */}
      <View style={s.titleRow}>
        <View>
          <AppText weight="900" style={s.pageTitle}>Browse</AppText>
          <AppText style={s.pageSubtitle}>Find the right service</AppText>
        </View>
        <Pressable
          onPress={() => router.push('/(app)/cart')}
          style={s.cartBtn}
        >
          <Ionicons name="bag-handle-outline" size={20} color={C.accent} />
        </Pressable>
      </View>

      {/* ── Search bar ── */}
      <View style={s.searchWrap}>
        <View style={s.searchIcon}>
          <Ionicons name="search-outline" size={16} color={C.textLight} />
        </View>
        <AppInput
          placeholder="Search services..."
          value={query}
          onChangeText={setQuery}
          style={s.searchInput}
          containerStyle={s.searchContainer}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} style={s.searchClear}>
            <Ionicons name="close-circle" size={17} color={C.textLight} />
          </Pressable>
        )}
      </View>

      {/* ── Filter chips (horizontal scroll) ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterScroll}
      >
        {['All', ...state.categories].map((item) => {
          const active = filter === item;
          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[s.filterChip, active && s.filterChipActive]}
            >
              {active && <View style={s.filterChipDot} />}
              <AppText
                weight="700"
                style={[s.filterChipText, active && s.filterChipTextActive]}
              >
                {item}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Toolbar: results count + sort + view toggle ── */}
      <View style={s.toolbar}>
        <AppText style={s.resultCount}>
          <AppText weight="800" style={[s.resultCount, { color: C.text }]}>
            {items.length}
          </AppText>{' '}
          services found
        </AppText>

        <View style={s.toolbarRight}>
          {/* Sort button */}
          <Pressable
            onPress={() => setShowSortSheet((v) => !v)}
            style={[s.sortBtn, showSortSheet && s.sortBtnActive]}
          >
            <Ionicons
              name={activeSort.icon}
              size={13}
              color={showSortSheet ? C.accent : C.textMid}
            />
            <AppText
              weight="700"
              style={[s.sortBtnText, showSortSheet && s.sortBtnTextActive]}
            >
              {activeSort.id}
            </AppText>
            <Ionicons
              name={showSortSheet ? 'chevron-up' : 'chevron-down'}
              size={11}
              color={showSortSheet ? C.accent : C.textLight}
            />
          </Pressable>

          {/* View toggle */}
          <View style={s.viewToggle}>
            {['Grid', 'List'].map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setViewMode(mode)}
                style={[s.viewToggleBtn, viewMode === mode && s.viewToggleBtnActive]}
              >
                <Ionicons
                  name={mode === 'Grid' ? 'grid-outline' : 'list-outline'}
                  size={15}
                  color={viewMode === mode ? C.accent : C.textLight}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* ── Sort dropdown sheet ── */}
      {showSortSheet && (
        <View style={s.sortSheet}>
          {sortOptions.map((opt) => {
            const active = sort === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => { setSort(opt.id); setShowSortSheet(false); }}
                style={[s.sortOption, active && s.sortOptionActive]}
              >
                <View style={[s.sortOptionIcon, active && s.sortOptionIconActive]}>
                  <Ionicons name={opt.icon} size={14} color={active ? C.accent : C.textMid} />
                </View>
                <AppText
                  weight={active ? '800' : '600'}
                  style={[s.sortOptionText, active && s.sortOptionTextActive]}
                >
                  {opt.id}
                </AppText>
                {active && (
                  <Ionicons name="checkmark" size={14} color={C.accent} style={{ marginLeft: 'auto' }} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <Screen scroll={false} contentContainerStyle={{ paddingHorizontal: 0, backgroundColor: C.bg }}>
      <FlatList
        data={items}
        key={viewMode}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'Grid' ? 2 : 1}
        style={{ backgroundColor: C.bg }}
        contentContainerStyle={s.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
        onEndReached={() => hasMore && !loading && fetchPage(page + 1)}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          loading && items.length > 0
            ? (
              <View style={s.footerLoading}>
                <View style={s.footerLoadingInner}>
                  <ShimmerBlock width={80} height={10} />
                </View>
              </View>
            )
            : null
        }
        ListEmptyComponent={
          loading
            ? renderSkeleton()
            : (
              <View style={s.emptyWrap}>
                <View style={s.emptyIconCircle}>
                  <Ionicons name="search-outline" size={28} color={C.accentMid} />
                </View>
                <AppText weight="800" style={s.emptyTitle}>No services found</AppText>
                <AppText style={s.emptyDesc}>Try a different search or clear the filter</AppText>
                <Pressable onPress={() => { setQuery(''); setFilter('All'); }} style={s.emptyBtn}>
                  <AppText weight="700" style={s.emptyBtnText}>Clear filters</AppText>
                </Pressable>
              </View>
            )
        }
        renderItem={({ item, index }) => (
          <View style={[
            s.itemWrap,
            viewMode === 'List' && s.listItem,
            viewMode === 'Grid' && index % 2 === 0 && s.gridItemLeft,
            viewMode === 'Grid' && index % 2 === 1 && s.gridItemRight,
          ]}>
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

const s = StyleSheet.create({
  listContent: { paddingBottom: 48 },

  // ── Header ──────────────────────────────────────────
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 18,
    backgroundColor: C.bg,
  },

  // Title row
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 2 },
  cartBtn: {
    width: 44, height: 44,
    borderRadius: 14,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon:      {},
  searchContainer: { flex: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 0, height: '100%' },
  searchInput:     { backgroundColor: 'transparent', borderWidth: 0, fontSize: 14, color: C.text },
  searchClear:     {},

  // Filter chips
  filterScroll: { gap: 8, paddingRight: 4 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.surface,
  },
  filterChipActive:     { backgroundColor: C.accentSoft, borderColor: C.borderAccent },
  filterChipDot:        { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.accent },
  filterChipText:       { fontSize: 13, color: C.textMid },
  filterChipTextActive: { color: C.accent },

  // Toolbar
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCount: { fontSize: 12, color: C.textLight },
  toolbarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // Sort button
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1.5, borderColor: C.border,
  },
  sortBtnActive:     { backgroundColor: C.accentSoft, borderColor: C.borderAccent },
  sortBtnText:       { fontSize: 12, color: C.textMid },
  sortBtnTextActive: { color: C.accent },

  // View toggle
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border,
    overflow: 'hidden',
  },
  viewToggleBtn: {
    width: 34, height: 34,
    alignItems: 'center', justifyContent: 'center',
  },
  viewToggleBtnActive: { backgroundColor: C.accentSoft },

  // Sort dropdown
  sortSheet: {
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 1.5, borderColor: C.border,
    overflow: 'hidden',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  sortOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  sortOptionActive:     { backgroundColor: C.accentSoft },
  sortOptionIcon: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: '#F0F0EC',
    alignItems: 'center', justifyContent: 'center',
  },
  sortOptionIconActive: { backgroundColor: '#FFFFFF' },
  sortOptionText:       { fontSize: 14, color: C.textMid },
  sortOptionTextActive: { color: C.accent },

  // Grid items
  itemWrap:     { paddingBottom: 14, flex: 1 },
  listItem:     { flexBasis: '100%', paddingHorizontal: 20 },
  gridItemLeft: { paddingLeft: 20, paddingRight: 7 },
  gridItemRight:{ paddingLeft: 7, paddingRight: 20 },

  // Skeleton
  skeletonGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, gap: 14, paddingTop: 8,
  },
  skeletonCard: {
    width: '47%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border,
  },

  // Footer loading
  footerLoading: { paddingVertical: 24, alignItems: 'center' },
  footerLoadingInner: {
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border,
  },

  // Empty state
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconCircle: {
    width: 68, height: 68,
    borderRadius: 22,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle:  { fontSize: 18, color: C.text, letterSpacing: -0.4 },
  emptyDesc:   { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 24, paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
  },
  emptyBtnText: { fontSize: 13, color: C.accent },
});
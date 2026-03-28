import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { Toast } from '../../../components/ui/Toast';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';

// ── Brand tokens ──────────────────────────────────────
const C = {
  bg:           '#F5F5F0',
  surface:      '#FFFFFF',
  accentSoft:   '#ECEAFF',
  accent:       '#5B54E8',
  text:         '#1A1A2E',
  textMid:      '#6B6B8A',
  textLight:    '#A8A8C0',
  border:       '#E8E8E2',
  borderAccent: '#C8C5F5',
  green:        '#22C55E',
  greenSoft:    '#DCFCE7',
  amber:        '#F59E0B',
  amberSoft:    '#FEF3C7',
  blueSoft:     '#EFF6FF',
  blue:         '#3B82F6',
};

const INCLUDED = [
  { label: 'Strategy call',           icon: 'chatbubble-ellipses-outline' },
  { label: 'Editable source files',   icon: 'document-text-outline' },
  { label: 'Responsive deliverables', icon: 'phone-portrait-outline' },
  { label: 'Support after delivery',  icon: 'headset-outline' },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { state, actions } = useApp();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const product = state.products.find((item) => item.id === id);

  if (!product) return null;

  return (
    <Screen showHeader>
      {/* ── Hero image ── */}
      <View style={s.imageWrap}>
        <Image source={{ uri: product.images?.[0] }} style={s.image} />
        {/* Category badge overlaid on image */}
        <View style={s.categoryBadge}>
          <Ionicons name="grid-outline" size={10} color={C.accent} />
          <AppText weight="800" style={s.categoryText}>{product.category}</AppText>
        </View>
        {/* Rating badge overlaid */}
        <View style={s.ratingBadge}>
          <Ionicons name="star" size={10} color={C.amber} />
          <AppText weight="800" style={s.ratingText}>{product.rating}</AppText>
        </View>
      </View>

      {/* ── Title block ── */}
      <View style={s.titleBlock}>
        <AppText weight="900" style={s.name}>{product.name}</AppText>
        <AppText style={s.desc}>{product.description}</AppText>
      </View>

      {/* ── Metrics strip ── */}
      <View style={s.metricsStrip}>
        <MetricCell icon="pricetag-outline" label="Price"    value={`$${product.price}`}       color={C.accent}  bg={C.accentSoft} border={C.borderAccent} />
        <View style={s.metricDivider} />
        <MetricCell icon="time-outline"     label="Delivery" value={product.deliveryTime}        color={C.amber}   bg={C.amberSoft}  border="#FDE68A" />
        <View style={s.metricDivider} />
        <MetricCell icon="bag-outline"      label="Sales"    value={`${product.sales ?? 0}`}    color={C.blue}    bg={C.blueSoft}   border="#BFDBFE" />
      </View>

      {/* ── What's included ── */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <View style={s.cardIconBox}>
            <Ionicons name="checkmark-done-outline" size={14} color={C.accent} />
          </View>
          <AppText weight="900" style={s.cardTitle}>What's included</AppText>
        </View>
        <View style={s.divider} />
        <View style={s.includedList}>
          {INCLUDED.map((item) => (
            <View key={item.label} style={s.includedRow}>
              <View style={s.includedIconBox}>
                <Ionicons name={item.icon} size={13} color={C.green} />
              </View>
              <AppText weight="600" style={s.includedText}>{item.label}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* ── Tags ── */}
      {product.tags?.length > 0 && (
        <View style={s.tagsRow}>
          {product.tags.map((tag) => (
            <View key={tag} style={s.tag}>
              <AppText weight="700" style={s.tagText}>#{tag}</AppText>
            </View>
          ))}
        </View>
      )}

      {/* ── CTA row ── */}
      <View style={s.ctaRow}>
        <Pressable
          onPress={() => { actions.addToCart(product.id); setToast({ visible: true, message: 'Added to cart!', type: 'success' }); }}
          style={({ pressed }) => [s.ctaPrimary, pressed && { opacity: 0.88 }]}
        >
          <Ionicons name="cart-outline" size={16} color="#fff" />
          <AppText weight="800" style={s.ctaPrimaryText}>Add to Cart</AppText>
        </Pressable>

        <Pressable
          onPress={() => { actions.addToCart(product.id); router.push('/(app)/cart'); }}
          style={({ pressed }) => [s.ctaSecondary, pressed && { opacity: 0.88 }]}
        >
          <AppText weight="800" style={s.ctaSecondaryText}>Buy Now</AppText>
          <Ionicons name="arrow-forward" size={14} color={C.accent} />
        </Pressable>
      </View>

      <Toast {...toast} onHide={() => setToast((p) => ({ ...p, visible: false }))} />
    </Screen>
  );
}

function MetricCell({ icon, label, value, color, bg, border }) {
  return (
    <View style={[mc.wrap, { backgroundColor: bg, borderColor: border }]}>
      <View style={[mc.iconBox, { backgroundColor: C.surface }]}>
        <Ionicons name={icon} size={12} color={color} />
      </View>
      <AppText style={mc.label}>{label}</AppText>
      <AppText weight="900" style={[mc.value, { color }]}>{value}</AppText>
    </View>
  );
}

const mc = StyleSheet.create({
  wrap:    { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 5, borderRadius: 18, borderWidth: 1 },
  iconBox: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  label:   { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3 },
  value:   { fontSize: 16, letterSpacing: -0.4 },
});

const s = StyleSheet.create({
  // Image
  imageWrap:    { position: 'relative' },
  image:        { width: '100%', height: 240, borderRadius: 24 },
  categoryBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1, borderColor: C.borderAccent,
  },
  categoryText: { fontSize: 11, color: C.accent },
  ratingBadge: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1, borderColor: '#FDE68A',
  },
  ratingText: { fontSize: 11, color: C.amber },

  // Title
  titleBlock: { gap: 8 },
  name:       { fontSize: 26, color: C.text, letterSpacing: -0.8, lineHeight: 30 },
  desc:       { fontSize: 13, color: C.textLight, lineHeight: 20 },

  // Metrics
  metricsStrip:  { flexDirection: 'row', gap: 10 },
  metricDivider: { width: 0 },

  // Card
  card: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  cardHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle:   { fontSize: 15, color: C.text, letterSpacing: -0.3 },
  divider:     { height: 1, backgroundColor: C.border },
  includedList:{ gap: 12 },
  includedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  includedIconBox: {
    width: 28, height: 28, borderRadius: 9,
    backgroundColor: C.greenSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  includedText: { fontSize: 13, color: C.text },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
  },
  tagText: { fontSize: 11, color: C.textMid },

  // CTAs
  ctaRow:      { flexDirection: 'row', gap: 12, marginTop: 4 },
  ctaPrimary: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.accent,
    borderRadius: 16, paddingVertical: 15,
  },
  ctaPrimaryText:   { fontSize: 14, color: '#fff', letterSpacing: -0.2 },
  ctaSecondary: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    borderRadius: 16, paddingVertical: 15,
  },
  ctaSecondaryText: { fontSize: 14, color: C.accent, letterSpacing: -0.2 },
});
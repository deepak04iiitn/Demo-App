import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { AppInput } from '../../../components/forms/AppInput';
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
  red:          '#EF4444',
  redSoft:      '#FEE2E2',
};

const emptyForm = {
  name: '',
  category: '',
  price: '',
  description: '',
  images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'],
  rating: 4.8,
  sales: 0,
  stock: 12,
  tags: ['new'],
  deliveryTime: '3 days',
};

// ── Form card ─────────────────────────────────────────
function FormCard({ form, setForm, editingId, onSubmit, onCancel }) {
  const isEditing = !!editingId;

  return (
    <View style={fc.wrap}>
      {/* Header row */}
      <View style={fc.headerRow}>
        <View style={fc.iconBox}>
          <Ionicons name={isEditing ? 'create-outline' : 'add-circle-outline'} size={14} color={C.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="900" style={fc.title}>{isEditing ? 'Edit Product' : 'Add Product'}</AppText>
          <AppText style={fc.subtitle}>{isEditing ? 'Update the product details below' : 'Fill in the details to add a new product'}</AppText>
        </View>
        {isEditing && (
          <Pressable onPress={onCancel} style={fc.cancelBtn}>
            <Ionicons name="close" size={14} color={C.textMid} />
          </Pressable>
        )}
      </View>

      <View style={fc.divider} />

      {/* Fields */}
      <View style={fc.fields}>
        <AppInput label="Name" value={form.name} onChangeText={(name) => setForm((p) => ({ ...p, name }))} />
        <View style={fc.row}>
          <View style={{ flex: 1 }}>
            <AppInput label="Category" value={form.category} onChangeText={(category) => setForm((p) => ({ ...p, category }))} />
          </View>
          <View style={{ flex: 1 }}>
            <AppInput label="Price" value={String(form.price)} onChangeText={(price) => setForm((p) => ({ ...p, price }))} keyboardType="numeric" />
          </View>
        </View>
        <AppInput label="Description" value={form.description} onChangeText={(description) => setForm((p) => ({ ...p, description }))} multiline />
      </View>

      <View style={fc.divider} />

      {/* Submit */}
      <Pressable onPress={onSubmit} style={({ pressed }) => [fc.submitBtn, pressed && { opacity: 0.85 }]}>
        <Ionicons name={isEditing ? 'checkmark-circle-outline' : 'add-circle-outline'} size={16} color="#fff" />
        <AppText weight="800" style={fc.submitText}>{isEditing ? 'Update Product' : 'Add Product'}</AppText>
      </Pressable>
    </View>
  );
}

const fc = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1.5,
    borderColor: C.borderAccent,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  title:    { fontSize: 15, color: C.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 11, color: C.textLight, marginTop: 1 },
  cancelBtn: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: C.border },
  fields: { gap: 12 },
  row:    { flexDirection: 'row', gap: 12 },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 14,
  },
  submitText: { fontSize: 14, color: '#fff', letterSpacing: -0.2 },
});

// ── Product card ──────────────────────────────────────
function ProductCard({ product, onEdit, onDelete }) {
  return (
    <View style={pc.wrap}>
      {/* Top row */}
      <View style={pc.topRow}>
        <View style={pc.idIconBox}>
          <Ionicons name="cube-outline" size={14} color={C.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="900" style={pc.name}>{product.name}</AppText>
          <AppText style={pc.meta}>{product.category}</AppText>
        </View>
        <View style={pc.priceBadge}>
          <AppText weight="900" style={pc.price}>${product.price}</AppText>
        </View>
      </View>

      <View style={pc.divider} />

      {/* Stats row */}
      <View style={pc.statsRow}>
        <View style={[pc.stat, { backgroundColor: C.greenSoft }]}>
          <Ionicons name="storefront-outline" size={11} color={C.green} />
          <AppText weight="700" style={[pc.statText, { color: C.green }]}>{product.sales ?? 0} sold</AppText>
        </View>
        <View style={[pc.stat, { backgroundColor: C.amberSoft }]}>
          <Ionicons name="layers-outline" size={11} color={C.amber} />
          <AppText weight="700" style={[pc.statText, { color: C.amber }]}>{product.stock ?? 0} stock</AppText>
        </View>
        {product.rating != null && (
          <View style={[pc.stat, { backgroundColor: C.accentSoft }]}>
            <Ionicons name="star-outline" size={11} color={C.accent} />
            <AppText weight="700" style={[pc.statText, { color: C.accent }]}>{product.rating}</AppText>
          </View>
        )}

        {/* Actions */}
        <View style={pc.actions}>
          <Pressable onPress={onEdit} style={pc.editBtn}>
            <Ionicons name="create-outline" size={14} color={C.accent} />
            <AppText weight="700" style={pc.editText}>Edit</AppText>
          </Pressable>
          <Pressable onPress={onDelete} style={pc.deleteBtn}>
            <Ionicons name="trash-outline" size={14} color={C.red} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const pc = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  topRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  idIconBox: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 14, color: C.text, letterSpacing: -0.3 },
  meta: { fontSize: 11, color: C.textLight, marginTop: 1 },
  priceBadge: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
  },
  price: { fontSize: 13, color: C.accent },
  divider: { height: 1, backgroundColor: C.border },

  statsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  statText: { fontSize: 11 },

  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 'auto' },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
  },
  editText:   { fontSize: 12, color: C.accent },
  deleteBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.redSoft,
    borderWidth: 1.5, borderColor: C.redSoft,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Summary strip ─────────────────────────────────────
function SummaryStrip({ products }) {
  const total    = products.length;
  const totalRevenue = products.reduce((s, p) => s + (parseFloat(p.price) || 0) * (p.sales || 0), 0).toFixed(0);
  const avgRating = products.length
    ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1)
    : '–';

  const stats = [
    { label: 'Products', value: total,          icon: 'cube-outline',      color: C.accent, bg: C.accentSoft },
    { label: 'Revenue',  value: `$${totalRevenue}`, icon: 'wallet-outline', color: C.amber,  bg: C.amberSoft },
    { label: 'Avg Rating', value: avgRating,    icon: 'star-outline',      color: C.green,  bg: C.greenSoft },
  ];

  return (
    <View style={strip.wrap}>
      {stats.map((s, i) => (
        <View key={s.label} style={[strip.cell, i < 2 && strip.cellBorder]}>
          <View style={[strip.iconWrap, { backgroundColor: s.bg }]}>
            <Ionicons name={s.icon} size={13} color={s.color} />
          </View>
          <AppText weight="900" style={strip.value}>{s.value}</AppText>
          <AppText style={strip.label}>{s.label}</AppText>
        </View>
      ))}
    </View>
  );
}

const strip = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 22,
    borderWidth: 1.5, borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6,
    elevation: 1,
  },
  cell:       { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 5 },
  cellBorder: { borderRightWidth: 1, borderRightColor: C.border },
  iconWrap:   { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  value:      { fontSize: 18, color: C.text, letterSpacing: -0.5 },
  label:      { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3 },
});

// ── Main screen ───────────────────────────────────────
export default function AdminProductsScreen() {
  const { state, actions } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const submit = async () => {
    const payload = { ...form, price: Number(form.price) };
    if (editingId) await actions.updateProduct({ ...payload, id: editingId });
    else await actions.addProduct(payload);
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm(product);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <Screen>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={18} color={C.accent} />
        </Pressable>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Manage Products</AppText>
          <AppText style={s.pageSubtitle}>Add, edit &amp; remove listings</AppText>
        </View>
        {state.products.length > 0 && (
          <View style={s.countBadge}>
            <AppText weight="800" style={s.countText}>{state.products.length}</AppText>
          </View>
        )}
      </View>

      {/* ── Summary strip ── */}
      {state.products.length > 0 && <SummaryStrip products={state.products} />}

      {/* ── Form ── */}
      <FormCard
        form={form}
        setForm={setForm}
        editingId={editingId}
        onSubmit={submit}
        onCancel={cancelEdit}
      />

      {/* ── Product list ── */}
      {state.products.length === 0 ? (
        <View style={s.emptyWrap}>
          <View style={s.emptyIconCircle}>
            <Ionicons name="cube-outline" size={30} color={C.accent} />
          </View>
          <AppText weight="800" style={s.emptyTitle}>No products yet</AppText>
          <AppText style={s.emptyDesc}>Use the form above to add your first product.</AppText>
        </View>
      ) : (
        state.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => startEdit(product)}
            onDelete={() => actions.deleteProduct(product.id)}
          />
        ))
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  titleWrap:    { flex: 1 },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },
  countBadge: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { fontSize: 15, color: C.accent },

  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40, gap: 12 },
  emptyIconCircle: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, color: C.text, letterSpacing: -0.4 },
  emptyDesc:  { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },
});
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { AppInput } from '../../../components/forms/AppInput';
import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

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

export default function AdminProductsScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const currentTitle = useMemo(() => (editingId ? 'Edit Product' : 'Add Product'), [editingId]);

  const submit = async () => {
    const payload = { ...form, price: Number(form.price) };
    if (editingId) await actions.updateProduct({ ...payload, id: editingId });
    else await actions.addProduct(payload);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>
        <AppText variant="h1" weight="900">
          Manage Products
        </AppText>
      </View>

      <Card>
        <AppText variant="h3" weight="800">
          {currentTitle}
        </AppText>
        <AppInput label="Name" value={form.name} onChangeText={(name) => setForm((prev) => ({ ...prev, name }))} />
        <AppInput label="Category" value={form.category} onChangeText={(category) => setForm((prev) => ({ ...prev, category }))} />
        <AppInput label="Price" value={String(form.price)} onChangeText={(price) => setForm((prev) => ({ ...prev, price }))} keyboardType="numeric" />
        <AppInput label="Description" value={form.description} onChangeText={(description) => setForm((prev) => ({ ...prev, description }))} multiline />
        <AppButton label={editingId ? 'Update Product' : 'Add Product'} onPress={submit} />
      </Card>

      {state.products.map((product) => (
        <Card key={product.id}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText variant="h3" weight="800">
                {product.name}
              </AppText>
              <AppText style={{ color: colors.textMuted }}>
                {product.category} · ${product.price}
              </AppText>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={() => {
                  setEditingId(product.id);
                  setForm(product);
                }}>
                <Ionicons name="create-outline" size={18} color={colors.primary} />
              </Pressable>
              <Pressable onPress={() => actions.deleteProduct(product.id)}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  actions: { flexDirection: 'row', gap: 14 },
});

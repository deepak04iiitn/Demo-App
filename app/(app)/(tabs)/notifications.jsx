import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '../../../components/ui/AppText';
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

// ── Notification type config ──────────────────────────
const TYPE_CONFIG = {
  order:  { icon: 'cube-outline',              color: C.accent, bg: C.accentSoft, border: C.borderAccent, label: 'Order' },
  offer:  { icon: 'pricetag-outline',          color: C.amber,  bg: C.amberSoft,  border: '#FCD34D',       label: 'Offer' },
  system: { icon: 'shield-checkmark-outline',  color: C.green,  bg: C.greenSoft,  border: '#86EFAC',       label: 'System' },
  alert:  { icon: 'warning-outline',           color: C.red,    bg: C.redSoft,    border: '#FCA5A5',       label: 'Alert' },
};

const FILTERS = ['All', 'Order', 'Offer', 'System'];

// ── Unread dot ────────────────────────────────────────
function UnreadDot() {
  return <View style={dot.wrap} />;
}
const dot = StyleSheet.create({
  wrap: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.accent, marginTop: 5 },
});

// ── Type pill ─────────────────────────────────────────
function TypePill({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.system;
  return (
    <View style={[pill.wrap, { backgroundColor: cfg.bg }]}>
      <AppText weight="700" style={[pill.text, { color: cfg.color }]}>{cfg.label}</AppText>
    </View>
  );
}
const pill = StyleSheet.create({
  wrap: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  text: { fontSize: 10, letterSpacing: 0.2 },
});

// ── Notification card ─────────────────────────────────
function NotifCard({ item, onPress }) {
  const cfg     = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;
  const unread  = !item.read;

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={({ pressed }) => [
        nc.wrap,
        unread && nc.wrapUnread,
        pressed && nc.wrapPressed,
      ]}
    >
      {/* Left: icon */}
      <View style={[nc.iconBox, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
        <Ionicons name={cfg.icon} size={18} color={cfg.color} />
      </View>

      {/* Center: content */}
      <View style={nc.body}>
        <View style={nc.titleRow}>
          <AppText weight="800" style={nc.title} numberOfLines={1}>{item.title}</AppText>
          <TypePill type={item.type} />
        </View>
        <AppText style={nc.message} numberOfLines={2}>{item.message}</AppText>
        <View style={nc.metaRow}>
          <Ionicons name="time-outline" size={11} color={C.textLight} />
          <AppText style={nc.time}>{item.time}</AppText>
        </View>
      </View>

      {/* Right: unread indicator */}
      {unread ? <UnreadDot /> : <View style={{ width: 7 }} />}
    </Pressable>
  );
}

const nc = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: C.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  wrapUnread: {
    borderColor: C.borderAccent,
    backgroundColor: '#FDFCFF',
    shadowColor: C.accent,
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
  wrapPressed: { backgroundColor: '#F8F8F6', transform: [{ scale: 0.99 }] },
  iconBox: {
    width: 44, height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  body:      { flex: 1, gap: 5 },
  titleRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  title:     { fontSize: 14, color: C.text, letterSpacing: -0.2, flexShrink: 1 },
  message:   { fontSize: 13, color: C.textMid, lineHeight: 19 },
  metaRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  time:      { fontSize: 11, color: C.textLight },
});

// ── Summary strip ─────────────────────────────────────
function SummaryStrip({ notifications }) {
  const total  = notifications.length;
  const unread = notifications.filter((n) => !n.read).length;
  const types  = [...new Set(notifications.map((n) => n.type))].length;

  return (
    <View style={ss.wrap}>
      {[
        { label: 'Total',   value: total,  icon: 'notifications-outline', color: C.accent, bg: C.accentSoft },
        { label: 'Unread',  value: unread, icon: 'ellipse',               color: C.red,    bg: C.redSoft },
        { label: 'Types',   value: types,  icon: 'layers-outline',        color: C.amber,  bg: C.amberSoft },
      ].map((s, i) => (
        <View key={s.label} style={[ss.cell, i < 2 && ss.cellBorder]}>
          <View style={[ss.iconWrap, { backgroundColor: s.bg }]}>
            <Ionicons name={s.icon} size={12} color={s.color} />
          </View>
          <AppText weight="900" style={ss.value}>{s.value}</AppText>
          <AppText style={ss.label}>{s.label}</AppText>
        </View>
      ))}
    </View>
  );
}

const ss = StyleSheet.create({
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
  iconWrap:   { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  value:      { fontSize: 18, color: C.text, letterSpacing: -0.5 },
  label:      { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3 },
});

// ── Filter tabs ───────────────────────────────────────
function FilterTabs({ active, onChange, notifications }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ft.row}>
      {FILTERS.map((f) => {
        const isActive = f === active;
        const count    = f === 'All'
          ? notifications.length
          : notifications.filter((n) => n.type === f.toLowerCase()).length;

        return (
          <Pressable
            key={f}
            onPress={() => onChange(f)}
            style={[ft.chip, isActive && ft.chipActive]}
          >
            <AppText weight="700" style={[ft.text, isActive && ft.textActive]}>{f}</AppText>
            {count > 0 && (
              <View style={[ft.count, isActive && ft.countActive]}>
                <AppText weight="800" style={[ft.countText, isActive && ft.countTextActive]}>{count}</AppText>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const ft = StyleSheet.create({
  row:           { gap: 8, paddingRight: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.surface,
  },
  chipActive:     { backgroundColor: C.accentSoft, borderColor: C.borderAccent },
  text:           { fontSize: 13, color: C.textMid },
  textActive:     { color: C.accent },
  count: {
    minWidth: 18, height: 18, borderRadius: 999,
    backgroundColor: C.border,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countActive:    { backgroundColor: C.borderAccent },
  countText:      { fontSize: 10, color: C.textMid },
  countTextActive:{ color: C.accent },
});

// ── Main screen ───────────────────────────────────────
export default function NotificationsScreen() {
  const { state, actions } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = state.notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    return n.type === activeFilter.toLowerCase();
  });

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  const handleCardPress = (id) => {
    // Mark individual notification as read if available
    actions.markNotificationRead?.(id) ?? actions.markNotificationsRead?.();
  };

  return (
    <Screen>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <View>
          <AppText weight="900" style={s.pageTitle}>Notifications</AppText>
          <AppText style={s.pageSubtitle}>Alerts, offers &amp; updates</AppText>
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={actions.markNotificationsRead} style={s.markReadBtn}>
            <Ionicons name="checkmark-done-outline" size={14} color={C.accent} />
            <AppText weight="700" style={s.markReadText}>Mark all read</AppText>
          </Pressable>
        )}
      </View>

      {!state.notifications.length ? (
        /* ── Empty state ── */
        <View style={s.emptyWrap}>
          <View style={s.emptyIconCircle}>
            <Ionicons name="notifications-off-outline" size={30} color={C.accent} />
          </View>
          <AppText weight="800" style={s.emptyTitle}>All caught up</AppText>
          <AppText style={s.emptyDesc}>
            Fresh alerts, order updates, and offers will appear here.
          </AppText>
        </View>
      ) : (
        <>
          {/* ── Summary strip ── */}
          <SummaryStrip notifications={state.notifications} />

          {/* ── Filter tabs ── */}
          <FilterTabs
            active={activeFilter}
            onChange={setActiveFilter}
            notifications={state.notifications}
          />

          {/* ── Unread section label ── */}
          {activeFilter === 'All' && unreadCount > 0 && (
            <View style={s.sectionLabelRow}>
              <View style={s.sectionBar} />
              <AppText weight="800" style={s.sectionLabel}>Unread</AppText>
              <View style={s.sectionUnreadBadge}>
                <AppText weight="800" style={s.sectionUnreadText}>{unreadCount}</AppText>
              </View>
            </View>
          )}

          {/* ── Unread cards ── */}
          {activeFilter === 'All' && filtered.filter((n) => !n.read).map((item) => (
            <NotifCard key={item.id} item={item} onPress={handleCardPress} />
          ))}

          {/* ── Read section label ── */}
          {activeFilter === 'All' && filtered.filter((n) => n.read).length > 0 && (
            <View style={s.sectionLabelRow}>
              <View style={[s.sectionBar, { backgroundColor: C.textLight }]} />
              <AppText weight="800" style={[s.sectionLabel, { color: C.textLight }]}>Earlier</AppText>
            </View>
          )}

          {/* ── Read / filtered cards ── */}
          {(activeFilter === 'All'
            ? filtered.filter((n) => n.read)
            : filtered
          ).map((item) => (
            <NotifCard key={item.id} item={item} onPress={handleCardPress} />
          ))}

          {filtered.length === 0 && (
            <View style={s.emptyFilter}>
              <Ionicons name="filter-outline" size={22} color={C.textLight} />
              <AppText style={s.emptyFilterText}>No {activeFilter.toLowerCase()} notifications</AppText>
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  // Page header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 8, paddingBottom: 4,
  },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },
  markReadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
  },
  markReadText: { fontSize: 12, color: C.accent },

  // Section labels
  sectionLabelRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: -4 },
  sectionBar:        { width: 3, height: 14, borderRadius: 2, backgroundColor: C.accent },
  sectionLabel:      { fontSize: 13, color: C.text, letterSpacing: -0.2 },
  sectionUnreadBadge:{
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
  },
  sectionUnreadText: { fontSize: 11, color: C.accent },

  // Empty (no notifications)
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconCircle: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, color: C.text, letterSpacing: -0.4 },
  emptyDesc:  { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },

  // Empty filter
  emptyFilter: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyFilterText: { fontSize: 14, color: C.textLight },
});
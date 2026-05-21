import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserBookings } from '../api';

export default function BookingsScreen({ user, navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getUserBookings(user.id).then(data => {
        setBookings(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const getStatusLabel = (status) => {
    if (!status) return 'În așteptare';
    const s = status.toLowerCase();
    if (s === 'confirmed') return 'CONFIRMAT';
    if (s === 'pending') return 'ÎN AȘTEPTARE';
    if (s === 'cancelled') return 'ANULAT';
    if (s === 'completed') return 'FINALIZAT';
    return status.toUpperCase();
  };

  const getStatusColor = (status) => {
    if (!status) return { bg: '#f0f0f0', text: '#888' };
    const s = status.toLowerCase();
    if (s === 'confirmed') return { bg: '#E1F5EE', text: '#085041' };
    if (s === 'completed') return { bg: '#E1F5EE', text: '#085041' };
    if (s === 'cancelled') return { bg: '#FDECEA', text: '#A32D2D' };
    return { bg: '#FFF8E1', text: '#BA7517' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Programări</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1a1a2e" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emoji}>📅</Text>
          <Text style={styles.title}>Nicio programare</Text>
          <Text style={styles.sub}>Găsește un garaj și fă prima ta programare!</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Programările tale</Text>
          {bookings.map(b => {
            const statusColor = getStatusColor(b.status);
            return (
              <TouchableOpacity
                key={b.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('BookingDetail', { booking: b })}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                    <Text style={[styles.statusText, { color: statusColor.text }]}>{getStatusLabel(b.status)}</Text>
                  </View>
                  <Text style={styles.cardId}>#{b.id}</Text>
                </View>
                <Text style={styles.serviceName}>{b.service}</Text>
                <View style={styles.divider} />
                <View style={styles.cardRow}>
                  <Ionicons name="calendar-outline" size={14} color="#888" />
                  <Text style={styles.cardMeta}>{b.date}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons name="time-outline" size={14} color="#888" />
                  <Text style={styles.cardMeta}>{b.time_slot}</Text>
                </View>
                <View style={styles.cardArrow}>
                  <Ionicons name="chevron-forward" size={16} color="#ccc" />
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#1a1a2e', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  sub: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 4 },
  list: { flex: 1, padding: 16 },
  sectionLabel: { fontSize: 13, color: '#888', fontWeight: '500', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardId: { fontSize: 12, color: '#aaa' },
  serviceName: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  divider: { height: 0.5, backgroundColor: '#eee', marginBottom: 10 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardMeta: { fontSize: 13, color: '#666' },
  cardArrow: { alignItems: 'flex-end', marginTop: 8 },
});
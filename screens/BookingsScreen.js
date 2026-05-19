import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserBookings } from '../api';

export default function BookingsScreen({ user }) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1a1a2e" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emoji}>📅</Text>
          <Text style={styles.title}>No bookings yet</Text>
          <Text style={styles.sub}>Find a garage and book your first slot!</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {bookings.map(b => (
            <View key={b.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{b.status}</Text>
                </View>
                <Text style={styles.cardId}>#{b.id}</Text>
              </View>
              <Text style={styles.serviceName}>{b.service}</Text>
              <View style={styles.cardRow}>
                <Ionicons name="calendar-outline" size={14} color="#888" />
                <Text style={styles.cardMeta}>{b.date}</Text>
              </View>
              <View style={styles.cardRow}>
                <Ionicons name="time-outline" size={14} color="#888" />
                <Text style={styles.cardMeta}>{b.time_slot}</Text>
              </View>
            </View>
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#1a1a2e', padding: 20 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  sub: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 4 },
  list: { flex: 1, padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { backgroundColor: '#E1F5EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#085041' },
  cardId: { fontSize: 12, color: '#aaa' },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardMeta: { fontSize: 13, color: '#666' },
});
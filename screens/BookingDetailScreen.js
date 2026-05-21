import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BookingDetailScreen({ route, navigation }) {
  const { booking } = route.params;

  const getStatusColor = (status) => {
    if (!status) return { bg: '#f0f0f0', text: '#888' };
    const s = status.toLowerCase();
    if (s === 'confirmed') return { bg: '#E1F5EE', text: '#085041' };
    if (s === 'completed') return { bg: '#E1F5EE', text: '#085041' };
    if (s === 'cancelled') return { bg: '#FDECEA', text: '#A32D2D' };
    return { bg: '#FFF8E1', text: '#BA7517' };
  };

  const getStatusLabel = (status) => {
    if (!status) return 'În așteptare';
    const s = status.toLowerCase();
    if (s === 'confirmed') return 'CONFIRMAT';
    if (s === 'pending') return 'ÎN AȘTEPTARE';
    if (s === 'cancelled') return 'ANULAT';
    if (s === 'completed') return 'FINALIZAT';
    return status.toUpperCase();
  };

  const statusColor = getStatusColor(booking.status);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalii programare</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>{getStatusLabel(booking.status)}</Text>
          </View>
          <Text style={styles.serviceTitle}>{booking.service}</Text>
          <Text style={styles.bookingId}>Programare #{booking.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalii</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={18} color="#1a1a2e" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Data</Text>
              <Text style={styles.detailValue}>{booking.date}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="time-outline" size={18} color="#1a1a2e" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Ora</Text>
              <Text style={styles.detailValue}>{booking.time_slot}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="construct-outline" size={18} color="#1a1a2e" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Serviciu</Text>
              <Text style={styles.detailValue}>{booking.service}</Text>
            </View>
          </View>
          {booking.garage_id && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="business-outline" size={18} color="#1a1a2e" />
              </View>
              <View>
                <Text style={styles.detailLabel}>ID Garaj</Text>
                <Text style={styles.detailValue}>#{booking.garage_id}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#1a1a2e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#ffffff22', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  scroll: { flex: 1 },
  statusCard: { backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, marginBottom: 16 },
  statusText: { fontSize: 12, fontWeight: '700' },
  serviceTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', textAlign: 'center', marginBottom: 6 },
  bookingId: { fontSize: 13, color: '#aaa' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  detailIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
});
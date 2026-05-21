import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBooking } from '../api';

const DAYS = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sm'];
const DATES = ['19', '20', '21', '22', '23', '24'];
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
const UNAVAILABLE = ['09:30', '11:00', '14:30'];

export default function BookingScreen({ route, navigation, user }) {
  const { garage, service } = route.params;
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    if (!selectedSlot) {
      Alert.alert('Alege ora', 'Te rugăm să selectezi un interval orar disponibil.');
      return;
    }
    setConfirming(true);
    const booking = await createBooking({
      user_id: user?.id || 1,
      garage_id: garage.id,
      service: service?.name || 'Service general',
      date: `${DAYS[selectedDay]}, Mai ${DATES[selectedDay]}`,
      time_slot: selectedSlot,
    });
    setConfirming(false);
    if (booking) {
      setConfirmed(true);
    } else {
      Alert.alert('Eroare', 'Programarea nu a putut fi salvată. Încearcă din nou.');
    }
  };

  if (confirmed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Programare confirmată!</Text>
          <Text style={styles.successSub}>Locul tău a fost rezervat la</Text>
          <Text style={styles.successGarage}>{garage.name}</Text>

          <View style={styles.confirmCard}>
            <View style={styles.confirmRow}>
              <Ionicons name="construct-outline" size={16} color="#888" />
              <Text style={styles.confirmLabel}>Serviciu</Text>
              <Text style={styles.confirmValue}>{service?.name || 'Service general'}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.confirmLabel}>Data</Text>
              <Text style={styles.confirmValue}>{DAYS[selectedDay]}, Mai {DATES[selectedDay]}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Ionicons name="time-outline" size={16} color="#888" />
              <Text style={styles.confirmLabel}>Ora</Text>
              <Text style={styles.confirmValue}>{selectedSlot}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Ionicons name="location-outline" size={16} color="#888" />
              <Text style={styles.confirmLabel}>Adresă</Text>
              <Text style={styles.confirmValue}>{garage.address}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('Main')}>
            <Text style={styles.doneBtnText}>Înapoi acasă</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rezervă un loc</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.garageSummary}>
          <View style={styles.garageIcon}>
            <Text style={{ fontSize: 24 }}>🏪</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.garageName}>{garage.name}</Text>
            <Text style={styles.garageAddress}>
              <Ionicons name="location-outline" size={11} color="#888" /> {garage.address}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviciu selectat</Text>
          <View style={styles.serviceSelected}>
            <View>
              <Text style={styles.serviceSelectedName}>{service?.name || 'Service general'}</Text>
              <Text style={styles.serviceSelectedDuration}>⏱ {service?.duration || '30 min'}</Text>
            </View>
            <Text style={styles.serviceSelectedPrice}>{service?.price || garage.price_from + ' RON'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alege data</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
            {DAYS.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.dayCard, selectedDay === i && styles.dayCardActive]}
                onPress={() => { setSelectedDay(i); setSelectedSlot(null); }}
              >
                <Text style={[styles.dayName, selectedDay === i && styles.dayNameActive]}>{day}</Text>
                <Text style={[styles.dayDate, selectedDay === i && styles.dayDateActive]}>{DATES[i]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alege ora</Text>
          <View style={styles.slotsGrid}>
            {SLOTS.map(slot => {
              const unavailable = UNAVAILABLE.includes(slot);
              const selected = selectedSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slot, unavailable && styles.slotUnavailable, selected && styles.slotSelected]}
                  onPress={() => !unavailable && setSelectedSlot(slot)}
                  disabled={unavailable}
                >
                  <Text style={[styles.slotText, unavailable && styles.slotTextUnavailable, selected && styles.slotTextSelected]}>{slot}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' }]} />
              <Text style={styles.legendText}>Disponibil</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#1a1a2e' }]} />
              <Text style={styles.legendText}>Selectat</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f0f0f0' }]} />
              <Text style={styles.legendText}>Ocupat</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.confirmBar}>
        <View>
          <Text style={styles.confirmBarLabel}>
            {selectedSlot ? `${DAYS[selectedDay]}, Mai ${DATES[selectedDay]} la ${selectedSlot}` : 'Niciun interval selectat'}
          </Text>
          <Text style={styles.confirmBarPrice}>{service?.price || garage.price_from + ' RON'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, (!selectedSlot || confirming) && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={confirming}
        >
          {confirming
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.confirmBtnText}>Confirmă →</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#1a1a2e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#ffffff22', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  garageSummary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 14, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  garageIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  garageName: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  garageAddress: { fontSize: 12, color: '#888', marginTop: 3 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  serviceSelected: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f4ff', borderRadius: 12, padding: 14 },
  serviceSelectedName: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  serviceSelectedDuration: { fontSize: 12, color: '#888', marginTop: 3 },
  serviceSelectedPrice: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
  daysScroll: { marginHorizontal: -4 },
  dayCard: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, marginHorizontal: 4, backgroundColor: '#f4f4f4', minWidth: 60 },
  dayCardActive: { backgroundColor: '#1a1a2e' },
  dayName: { fontSize: 12, color: '#888', fontWeight: '600' },
  dayNameActive: { color: '#aaa' },
  dayDate: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginTop: 4 },
  dayDateActive: { color: '#fff' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', minWidth: 75, alignItems: 'center' },
  slotUnavailable: { backgroundColor: '#f0f0f0', borderColor: '#f0f0f0' },
  slotSelected: { backgroundColor: '#1a1a2e', borderColor: '#1a1a2e' },
  slotText: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  slotTextUnavailable: { color: '#ccc' },
  slotTextSelected: { color: '#fff' },
  legend: { flexDirection: 'row', gap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#888' },
  confirmBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32, borderTopWidth: 0.5, borderTopColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  confirmBarLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  confirmBarPrice: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  confirmBtn: { backgroundColor: '#1a1a2e', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  confirmBtnDisabled: { backgroundColor: '#ccc' },
  confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E1F5EE', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successEmoji: { fontSize: 48 },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginBottom: 8 },
  successSub: { fontSize: 14, color: '#888' },
  successGarage: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 24 },
  confirmCard: { backgroundColor: '#f4f4f4', borderRadius: 16, padding: 16, width: '100%', marginBottom: 32 },
  confirmRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0' },
  confirmLabel: { fontSize: 13, color: '#888', flex: 1 },
  confirmValue: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  doneBtn: { backgroundColor: '#1a1a2e', borderRadius: 14, paddingHorizontal: 40, paddingVertical: 16 },
  doneBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
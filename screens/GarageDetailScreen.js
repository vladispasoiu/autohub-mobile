import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Linking, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

const SERVICES_DETAIL = [
  { name: 'Diagnoză și reparații motor', duration: '45 min' },
  { name: 'Schimb ulei și filtre', duration: '30 min' },
  { name: 'Reparații frâne', duration: '90 min' },
  { name: 'Service AC și climatizare', duration: '60 min' },
  { name: 'Inspecție Tehnică Periodică', duration: '60 min' },
  { name: 'Schimb anvelope', duration: '30 min' },
  { name: 'Echilibrare și geometrie roți', duration: '45 min' },
  { name: 'Testare și înlocuire baterie', duration: '20 min' },
  { name: 'Reparații suspensie și direcție', duration: '120 min' },
  { name: 'Service transmisie/cutie viteze', duration: '180 min' },
  { name: 'Diagnoză electrică auto', duration: '45 min' },
  { name: 'Reparații sistem evacuare', duration: '60 min' },
  { name: 'Service radiator și răcire', duration: '90 min' },
  { name: 'Înlocuire curea distribuție', duration: '240 min' },
  { name: 'Reparații ambreiaj', duration: '300 min' },

];

export default function GarageDetailScreen({ route, navigation }) {
  const { garage } = route.params;

  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.find(s => s.name === service.name)
        ? prev.filter(s => s.name !== service.name)
        : [...prev, service]
    );
  };

  const isSelected = (service) => !!selectedServices.find(s => s.name === service.name);

  const submitRating = async () => {
    if (userRating === 0) {
      Alert.alert('Alege o stea', 'Te rugăm să selectezi un rating înainte de a trimite.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(
        `https://web-production-72bd.up.railway.app/garages/${garage.id}/ratings?user_id=1&score=${userRating}&comment=${encodeURIComponent(comment)}`,
        { method: 'POST' }
      );
      if (response.ok) {
        setSubmitted(true);
        Alert.alert('Mulțumim pentru recenzie!');
      } else if (response.status === 409) {
        Alert.alert('Ai evaluat deja acest garaj');
      } else {
        Alert.alert('Ceva a mers greșit, încearcă din nou');
      }
    } catch (e) {
      Alert.alert('Nu există conexiune la internet');
    }
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{garage.name}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>🏪</Text>
          </View>
          <Text style={styles.heroName}>{garage.name}</Text>
          <View style={styles.heroMeta}>
            <Ionicons name="location-outline" size={13} color="#888" />
            <Text style={styles.heroAddress}>{garage.address}, {garage.city}</Text>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {garage.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{garage.total_reviews || 0}</Text>
              <Text style={styles.statLabel}>Recenzii</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{garage.price_from} RON</Text>
              <Text style={styles.statLabel}>De la</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Despre</Text>
          <Text style={styles.description}>{garage.description || 'Informații indisponibile.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selectează servicii</Text>
          <Text style={styles.sectionSubtitle}>Bifează ce ai nevoie și rezervă</Text>
          {SERVICES_DETAIL.map((s, i) => {
            const selected = isSelected(s);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.serviceRow, selected && styles.serviceRowSelected]}
                onPress={() => toggleService(s)}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.serviceName, selected && styles.serviceNameSelected]}>{s.name}</Text>
                  <Text style={styles.serviceDuration}>⏱ {s.duration}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evaluează garajul</Text>
          {submitted ? (
            <Text style={{ color: '#4CAF50', fontWeight: '600', textAlign: 'center' }}>✓ Mulțumim pentru recenzie!</Text>
          ) : (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                    <Text style={{ fontSize: 36, color: star <= userRating ? '#FFD700' : '#ddd' }}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Lasă un comentariu (opțional)"
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={submitRating}
                disabled={submitting}
              >
                <Text style={styles.submitBtnText}>{submitting ? 'Se trimite...' : 'Trimite recenzia'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL(`tel:${garage.phone}`)}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="call" size={18} color="#1a1a2e" />
            </View>
            <Text style={styles.contactText}>{garage.phone}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          {garage.latitude && garage.longitude && (
            <>
              <TouchableOpacity
                style={[styles.contactRow, { marginTop: 10 }]}
                onPress={() => Linking.openURL(`maps://app?daddr=${garage.latitude},${garage.longitude}`)}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="map" size={18} color="#1a1a2e" />
                </View>
                <Text style={styles.contactText}>Deschide în Apple Maps</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactRow, { marginTop: 10 }]}
                onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${garage.latitude},${garage.longitude}`)}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="navigate" size={18} color="#1a1a2e" />
                </View>
                <Text style={styles.contactText}>Deschide în Google Maps</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactRow, { marginTop: 10 }]}
                onPress={() => Linking.openURL(`https://waze.com/ul?ll=${garage.latitude},${garage.longitude}&navigate=yes`)}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="navigate-circle" size={18} color="#1a1a2e" />
                </View>
                <Text style={styles.contactText}>Deschide în Waze</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bookBar}>
        <View>
          {selectedServices.length > 0 ? (
            <>
              <Text style={styles.bookBarLabel}>{selectedServices.length} servicii selectate</Text>
              <Text style={styles.bookBarPrice}>Prețul va fi stabilit de garaj</Text>
            </>
          ) : (
            <>
              <Text style={styles.bookBarLabel}>De la</Text>
              <Text style={styles.bookBarPrice}>{garage.price_from} RON</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.bookBarBtn}
          onPress={() => navigation.navigate('Booking', { 
            garage, 
            service: selectedServices.length > 0 
              ? { name: selectedServices.map(s => s.name).join(', '), duration: '' }
              : null 
          })}
        >
          <Text style={styles.bookBarBtnText}>Rezervă un loc</Text>
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
  heroCard: { backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
  heroIcon: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroIconText: { fontSize: 36 },
  heroName: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', textAlign: 'center' },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, marginBottom: 20 },
  heroAddress: { fontSize: 13, color: '#888' },
  heroStats: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  statLabel: { fontSize: 11, color: '#aaa', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#eee' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: '#aaa', marginBottom: 12 },
  description: { fontSize: 13, color: '#666', lineHeight: 20 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0', gap: 12 },
  serviceRowSelected: { backgroundColor: '#f0f4ff', marginHorizontal: -16, paddingHorizontal: 16, borderBottomColor: '#dde8ff' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: '#1a1a2e', borderColor: '#1a1a2e' },
  serviceName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  serviceNameSelected: { color: '#1a1a2e' },
  serviceDuration: { fontSize: 11, color: '#aaa', marginTop: 2 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center' },
  contactText: { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },
  bookBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32, borderTopWidth: 0.5, borderTopColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  bookBarLabel: { fontSize: 11, color: '#aaa' },
  bookBarPrice: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
  bookBarBtn: { backgroundColor: '#1a1a2e', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  bookBarBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  commentInput: { borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1a1a', minHeight: 80, textAlignVertical: 'top', marginBottom: 12 },
  submitBtn: { backgroundColor: '#1a1a2e', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
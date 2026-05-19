import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Linking, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

const SERVICES_DETAIL = [
  { name: 'Oil Change', price: '50–80 RON', duration: '30 min' },
  { name: 'Brake Inspection', price: '30 RON', duration: '20 min' },
  { name: 'Brake Replacement', price: '200–400 RON', duration: '90 min' },
  { name: 'AC Service', price: '150–250 RON', duration: '60 min' },
  { name: 'Full Revision', price: '300–500 RON', duration: '3 hours' },
  { name: 'Diagnostics', price: '80 RON', duration: '45 min' },
];

export default function GarageDetailScreen({ route, navigation }) {
  const { garage } = route.params;

  const [userRating, setUserRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const submitRating = async () => {
    if (userRating === 0) {
      Alert.alert('Pick a star rating first');
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
        Alert.alert('Thanks for your review!');
      } else if (response.status === 409) {
        Alert.alert('You already rated this garage');
      } else {
        Alert.alert('Something went wrong, try again');
      }
    } catch (e) {
      Alert.alert('No internet connection');
    }
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{garage.name}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero card */}
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
              <Text style={styles.statValue}>{garage.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{garage.price_from} RON</Text>
              <Text style={styles.statLabel}>From</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{garage.description}</Text>
        </View>

        {/* Services & Prices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services & Prices</Text>
          {SERVICES_DETAIL.map((s, i) => (
            <View key={i} style={styles.serviceRow}>
              <View>
                <Text style={styles.serviceName}>{s.name}</Text>
                <Text style={styles.serviceDuration}>⏱ {s.duration}</Text>
              </View>
              <Text style={styles.servicePrice}>{s.price}</Text>
            </View>
          ))}
        </View>

{/* Rate this garage */}
<View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate this garage</Text>
          {submitted ? (
            <Text style={{ color: '#4CAF50', fontWeight: '600', textAlign: 'center' }}>✓ Thanks for your review!</Text>
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
                placeholder="Leave a comment (optional)"
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={submitRating}
                disabled={submitting}
              >
                <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Contact */}
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
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Book button */}
      <View style={styles.bookBar}>
        <View>
          <Text style={styles.bookBarLabel}>Starting from</Text>
          <Text style={styles.bookBarPrice}>{garage.price_from} RON</Text>
        </View>
        <TouchableOpacity 
  style={styles.bookBarBtn}
  onPress={() => navigation.navigate('Booking', { garage, service: null })}
>
  <Text style={styles.bookBarBtnText}>Book a Slot</Text>
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
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  description: { fontSize: 13, color: '#666', lineHeight: 20 },

  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  serviceName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  serviceDuration: { fontSize: 11, color: '#aaa', marginTop: 2 },
  servicePrice: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },

  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center' },
  contactText: { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },

  bookBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32, borderTopWidth: 0.5, borderTopColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  bookBarLabel: { fontSize: 11, color: '#aaa' },
  bookBarPrice: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  bookBarBtn: { backgroundColor: '#1a1a2e', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  bookBarBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  commentInput: { borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1a1a', minHeight: 80, textAlignVertical: 'top', marginBottom: 12 },
  submitBtn: { backgroundColor: '#1a1a2e', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

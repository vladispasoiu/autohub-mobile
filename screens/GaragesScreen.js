import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getGarages } from '../api';

export default function GaragesScreen({ navigation }) {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGarages = async () => {
    const data = await getGarages('Bucharest', null);
    if (data.length === 0) {
      setGarages([
        { id: 1, name: 'Service Auto Vlad', city: 'Bucharest', address: 'Str. Mihai Eminescu 12', rating: 4.8, total_reviews: 124, phone: '0722123456', price_from: 50 },
        { id: 2, name: 'Garage Pro Center', city: 'Bucharest', address: 'Bd. Unirii 45', rating: 4.6, total_reviews: 89, phone: '0733456789', price_from: 80 },
      ]);
    } else {
      setGarages(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchGarages(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchGarages(); };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Garaje</Text>
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={12} color="#fff" />
          <Text style={styles.locationText}>București</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a1a2e" />
          <Text style={styles.loadingText}>Se încarcă...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.sectionTitle}>{garages.length} garaje în apropiere</Text>
          {garages.map(garage => (
            <TouchableOpacity
              key={garage.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('GarageDetail', { garage })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Text style={styles.cardIconText}>🏪</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{garage.name}</Text>
                  <Text style={styles.cardAddress}>
                    <Ionicons name="location-outline" size={11} color="#888" /> {garage.address}
                  </Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {garage.rating || '—'}</Text>
                  <Text style={styles.reviewsText}>{garage.total_reviews || 0} recenzii</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.priceText}>
                  De la <Text style={styles.priceAmount}>{garage.price_from || '—'} RON</Text>
                </Text>
                <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('GarageDetail', { garage })}>
                  <Text style={styles.bookBtnText}>Rezervă →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#1a1a2e', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
  locationText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 13, color: '#888', marginBottom: 12, fontWeight: '500' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#888' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  cardIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  cardAddress: { fontSize: 12, color: '#888', marginTop: 3 },
  ratingBadge: { alignItems: 'flex-end' },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  reviewsText: { fontSize: 11, color: '#aaa', marginTop: 2 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { fontSize: 13, color: '#666' },
  priceAmount: { fontWeight: '700', color: '#1a1a1a', fontSize: 15 },
  bookBtn: { backgroundColor: '#1a1a2e', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
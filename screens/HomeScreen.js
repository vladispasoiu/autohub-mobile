import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ImageBackground, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Se încarcă...');

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCity('Locație indisponibilă');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geocode.length > 0) {
        setCity(geocode[0].city || geocode[0].region || 'Locație necunoscută');
      }
    };
    getLocation();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ImageBackground source={require('../assets/homebanner.png')} style={styles.header} resizeMode="cover">
        <View style={styles.headerOverlay}>
        <View style={styles.locationBadge}>
            <Ionicons name="location" size={12} color="#fff" />
            <Text style={styles.locationText}>{city}</Text>
          </View>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#999" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Caută servicii auto..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.categoriesTitle}>Servicii auto</Text>
        <View style={styles.categoriesGrid}>
          {[
            { label: 'Diagnoză motor', icon: '🔧' },
            { label: 'Schimb ulei', icon: '🛢️' },
            { label: 'Reparații frâne', icon: '🛑' },
            { label: 'Service AC', icon: '❄️' },
            { label: 'Schimb anvelope', icon: '🔄' },
            { label: 'Geometrie roți', icon: '⚙️' },
            { label: 'Testare baterie', icon: '🔋' },
            { label: 'Suspensie', icon: '🚗' },
            { label: 'Transmisie', icon: '⚡' },
            { label: 'Diagnoză electrică', icon: '💡' },
            { label: 'Sistem evacuare', icon: '💨' },
            { label: 'Radiator', icon: '🌡️' },
            { label: 'Curea distribuție', icon: '🔩' },
            { label: 'Ambreiaj', icon: '🔁' },
            { label: 'Întreținere periodică', icon: '📋' },
          ].map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryChip}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { height: 260, justifyContent: 'flex-end' },
  headerOverlay: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00000055', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4, alignSelf: 'flex-end' },
  locationText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffffee', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11 },
  searchInput: { flex: 1, fontSize: 15, color: '#1a1a1a' },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  categoriesTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a1a', marginBottom: 14 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryChip: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, width: '47%' },
  categoryIcon: { fontSize: 28, marginBottom: 6 },
  categoryLabel: { fontSize: 12, fontWeight: '600', color: '#1a1a2e', textAlign: 'center' },
});
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ user, onLogout }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}> AutoHub</Text>
      </View>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.full_name || 'Guest'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.phone && <Text style={styles.phone}>{user?.phone}</Text>}
      </View>
      {[['car-outline', 'Are you a garage owner?'], ['star-outline', 'Rate the app'], ['help-circle-outline', 'Help & Support']].map(([icon, label]) => (
        <TouchableOpacity key={label} style={styles.menuRow}>
          <Ionicons name={icon} size={20} color="#1a1a2e" />
          <Text style={styles.menuLabel}>{label}</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#1a1a2e', padding: 20 },
  logo: { color: '#fff', fontSize: 22, fontWeight: '800' },
  avatarSection: { alignItems: 'center', padding: 32, backgroundColor: '#fff', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36 },
  name: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  email: { fontSize: 13, color: '#888', marginTop: 4 },
  phone: { fontSize: 13, color: '#888', marginTop: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, padding: 16, borderRadius: 14, gap: 12 },
  menuLabel: { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 8, padding: 16, borderRadius: 14, gap: 12 },
  logoutText: { fontSize: 15, color: '#ff4444', fontWeight: '600' },
});
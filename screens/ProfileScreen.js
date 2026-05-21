import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ user, onLogout }) {
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.full_name || 'Utilizator'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.phone && <Text style={styles.phone}>{user?.phone}</Text>}
        </View>

        {/* Menu */}
        <View style={styles.section}>
          {[
            { icon: 'person-outline', label: 'Detalii cont' },
            { icon: 'calendar-outline', label: 'Programările mele' },
            { icon: 'star-outline', label: 'Evaluează aplicația' },
            { icon: 'car-outline', label: 'Înregistrează-ți garajul' },
            { icon: 'help-circle-outline', label: 'Centru de ajutor' },
          ].map(({ icon, label }, i, arr) => (
            <TouchableOpacity key={label} style={[styles.menuRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.menuIcon}>
                <Ionicons name={icon} size={20} color="#1a1a2e" />
              </View>
              <Text style={styles.menuLabel}>{label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.menuRow, { borderBottomWidth: 0 }]} onPress={onLogout}>
            <View style={[styles.menuIcon, { backgroundColor: '#FDECEA' }]}>
              <Ionicons name="log-out-outline" size={20} color="#ff4444" />
            </View>
            <Text style={[styles.menuLabel, { color: '#ff4444' }]}>Ieși din cont</Text>
            <Ionicons name="chevron-forward" size={16} color="#ffaaaa" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  avatarSection: { alignItems: 'center', padding: 32, backgroundColor: '#fff', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  name: { fontSize: 22, fontWeight: '800', color: '#1a1a2e' },
  email: { fontSize: 13, color: '#888', marginTop: 4 },
  phone: { fontSize: 13, color: '#888', marginTop: 2 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, paddingHorizontal: 16 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0', gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },
});
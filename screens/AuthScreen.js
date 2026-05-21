import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const API_URL = 'https://web-production-72bd.up.railway.app';

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: ''
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '377444014715-mo5r05mn8c1h4moa6tju1v6lkkecp1a0.apps.googleusercontent.com',
    webClientId: '377444014715-3e57m295hu469edhoibo19po1nmb6vah.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchGoogleUser(authentication.accessToken);
    }
  }, [response]);

  const fetchGoogleUser = async (token) => {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    onLogin({
      id: user.id,
      full_name: user.name,
      email: user.email,
      phone: '',
    }, token);
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Câmpuri lipsă', 'Te rugăm să completezi email și parola.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/users/login' : '/users/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { full_name: form.full_name, email: form.email, phone: form.phone, password: form.password };
      const res = await axios.post(`${API_URL}${endpoint}`, body);
      onLogin(res.data.user, res.data.access_token);
    } catch (err) {
      Alert.alert('Eroare', err.response?.data?.detail || 'Ceva a mers greșit.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>

        <View style={styles.logoSection}>
          <Image source={require('../assets/icon.png')} style={styles.logoImage} />
          <Text style={styles.appName}>AutoHub</Text>
          <Text style={styles.tagline}>Find. Compare. Book.</Text>
        </View>

        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>Intră în cont</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'register' && styles.toggleBtnActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.toggleText, mode === 'register' && styles.toggleTextActive]}>Înregistrare</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {mode === 'register' && (
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nume complet"
                placeholderTextColor="#aaa"
                value={form.full_name}
                onChangeText={v => update('full_name', v)}
              />
            </View>
          )}

          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color="#aaa" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Adresă email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={v => update('email', v)}
            />
          </View>

          {mode === 'register' && (
            <View style={styles.inputRow}>
              <Ionicons name="call-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Număr de telefon"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={v => update('phone', v)}
              />
            </View>
          )}

          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Parolă"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={form.password}
              onChangeText={v => update('password', v)}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#1a1a2e" />
              : <Text style={styles.submitText}>{mode === 'login' ? 'Intră în cont' : 'Creează cont'}</Text>
            }
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>sau</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleBtn}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Image source={{ uri: 'https://www.google.com/favicon.ico' }} style={{ width: 20, height: 20, marginRight: 10 }} />
            <Text style={styles.googleBtnText}>Continuă cu Google</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          {mode === 'login' ? 'Nu ai cont? ' : 'Ai deja cont? '}
          <Text style={styles.footerLink} onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Înregistrează-te' : 'Intră în cont'}
          </Text>
        </Text>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  inner: { flex: 1, padding: 25, justifyContent: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoImage: { width: 400, height: 170, marginBottom: 15 },
  appName: { color: '#fff', fontSize: 40, fontWeight: '600' },
  tagline: { color: '#aaa', fontSize: 20, marginTop: 5 },
  toggle: { flexDirection: 'row', backgroundColor: '#ffffff15', borderRadius: 14, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#fff' },
  toggleText: { fontSize: 15, fontWeight: '600', color: '#aaa' },
  toggleTextActive: { color: '#1a1a2e' },
  form: { gap: 15, marginBottom: 24 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff15', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14 },
  inputIcon: { marginRight: 20 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  submitBtn: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  submitText: { color: '#1a1a2e', fontWeight: '800', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center' },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: '#ffffff33' },
  dividerText: { color: '#aaa', paddingHorizontal: 10, fontSize: 13 },
  googleBtn: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#ddd', flexDirection: 'row', justifyContent: 'center' },
  googleBtnText: { color: '#1a1a1a', fontWeight: '700', fontSize: 15 },
  footerText: { color: '#aaa', textAlign: 'center', fontSize: 13 },
  footerLink: { color: '#fff', fontWeight: '700' },
});
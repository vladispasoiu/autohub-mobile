import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'search-circle',
    colors: ['#1a1a2e', '#16213e', '#e63946'],
    accent: '#e63946',
    title: 'Găsește',
    subtitle: 'Descoperă garaje verificate în apropierea ta, oriunde te-ai afla în România.',
    particles: ['🔧', '⚙️', '🛠️', '🔩', '🪛', '🔨'],
  },
  {
    id: '2',
    icon: 'star',
    colors: ['#1a1a2e', '#16213e', '#f4a261'],
    accent: '#f4a261',
    title: 'Compară',
    subtitle: 'Vezi prețuri, recenzii reale și servicii disponibile înainte să alegi.',
    particles: ['⭐', '💰', '📊', '✅', '🏆', '💎'],
  },
  {
    id: '3',
    icon: 'calendar',
    colors: ['#1a1a2e', '#16213e', '#2a9d8f'],
    accent: '#2a9d8f',
    title: 'Rezervă',
    subtitle: 'Programează-te în câteva secunde. Fără apeluri, fără așteptare.',
    particles: ['📅', '⏰', '🚗', '✨', '🎯', '🏁'],
  },
];

const POSITIONS = [
  { x: width * 0.1 },
  { x: width * 0.25 },
  { x: width * 0.45 },
  { x: width * 0.6 },
  { x: width * 0.75 },
  { x: width * 0.88 },
];

function FloatingParticle({ emoji, delay, posX }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.9, duration: 600, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: -height * 0.7, duration: 3500, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 3500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text style={{
      position: 'absolute',
      bottom: 120,
      left: posX,
      fontSize: 22,
      transform: [{ translateY }, { scale }],
      opacity,
    }}>
      {emoji}
    </Animated.Text>
  );
}

function Slide({ item }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(40);
    scaleAnim.setValue(0.85);

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View style={[styles.slide, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Animated.View style={[styles.iconCircle, {
        backgroundColor: item.accent + '20',
        borderColor: item.accent + '50',
        transform: [{ scale: pulseAnim }],
      }]}>
        <Ionicons name={item.icon} size={90} color={item.accent} />
      </Animated.View>
      <Animated.Text style={[styles.title, { color: item.accent, transform: [{ scale: scaleAnim }] }]}>
        {item.title}
      </Animated.Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Animated.View>
  );
}

export default function OnboardingScreen({ onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = SLIDES[currentIndex];

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onDone();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={slide.colors}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {slide.particles.map((emoji, i) => (
        <FloatingParticle
          key={`${currentIndex}-${i}`}
          emoji={emoji}
          delay={i * 500}
          posX={POSITIONS[i].x}
        />
      ))}

      <View style={styles.logoHeader}>
      <Image source={require('../assets/logo_transparent.png')} style={styles.logo} />
        <Text style={styles.logoText}>AutoHub</Text>
      </View>

      <TouchableOpacity style={styles.skip} onPress={onDone}>
        <Text style={styles.skipText}>Sari peste</Text>
      </TouchableOpacity>

      <View style={styles.slideContainer}>
        <Slide item={slide} key={currentIndex} />
      </View>

      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View key={i} style={[
            styles.dot,
            currentIndex === i && { backgroundColor: slide.accent, width: 28 },
          ]} />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: slide.accent }]}
        onPress={goNext}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>
          {currentIndex === SLIDES.length - 1 ? '🚀 Începe acum' : 'Continuă'}
        </Text>
        {currentIndex < SLIDES.length - 1 && <Ionicons name="arrow-forward" size={18} color="#fff" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  logoHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 90, overflow: 'hidden' },
logo: { width: 130, height: 130, resizeMode: 'contain', marginRight: 4 },
logoText: { color: '#fff', fontSize: 42, fontWeight: '900', letterSpacing: 1 },
  skip: { position: 'absolute', top: 80, right: 24 },
  skipText: { color: '#ffffff88', fontSize: 14, fontWeight: '600' },
  slideContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  slide: { alignItems: 'center', paddingHorizontal: 40 },
  iconCircle: { width: 180, height: 180, borderRadius: 90, alignItems: 'center', justifyContent: 'center', marginBottom: 40, borderWidth: 2 },
  title: { fontSize: 52, fontWeight: '900', marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 17, color: '#ffffffbb', textAlign: 'center', lineHeight: 28 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff33' },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 18, paddingHorizontal: 48, paddingVertical: 18, marginBottom: 60, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 17 },
});
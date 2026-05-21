import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'https://web-production-72bd.up.railway.app';

const BRANDS_MODELS = {
  'Alfa Romeo': ['147','156','159','Brera','Giulia','Giulietta','Spider','Stelvio','Tonale'],
  'Aston Martin': ['DB11','DBS','DBX','Vantage'],
  'Audi': ['A1','A2','A3','A4','A5','A6','A7','A8','e-tron','Q2','Q3','Q4 e-tron','Q5','Q7','Q8','R8','RS3','RS4','RS5','RS6','RS7','S3','S4','S5','S6','TT'],
  'Bentley': ['Bentayga','Continental','Flying Spur'],
  'BMW': ['iX','i3','i4','i5','i7','M2','M3','M4','M5','M8','Seria 1','Seria 2','Seria 3','Seria 4','Seria 5','Seria 6','Seria 7','Seria 8','X1','X2','X3','X4','X5','X6','X7','Z4','320d','320i','330d','330i','520d','520i','530d','530i','630d','640d','640i','730d','740d','M135i','M235i'],
  'BYD': ['Atto 3','Dolphin','Han','Seal','Tang'],
  'Cadillac': ['CT4','CT5','Escalade','XT4','XT5','XT6'],
  'Chevrolet': ['Aveo','Camaro','Corvette','Cruze','Equinox','Malibu','Spark','Trax'],
  'Chrysler': ['300C','Pacifica','Voyager'],
  'Citroën': ['Berlingo','C1','C2','C3','C3 Aircross','C4','C4 Cactus','C5','C5 Aircross','Jumper','Spacetourer'],
  'Cupra': ['Ateca','Born','Formentor','Leon'],
  'Dacia': ['Dokker','Duster','Jogger','Lodgy','Logan','Sandero','Spring','Stepway'],
  'Dodge': ['Challenger','Charger','Durango','Journey','Ram'],
  'Ferrari': ['296','812','F8','Portofino','Roma','SF90'],
  'Fiat': ['500','500L','500X','Bravo','Doblo','Ducato','Freemont','Panda','Punto','Stilo','Tipo'],
  'Ford': ['EcoSport','Edge','Explorer','Fiesta','Focus','Galaxy','Kuga','Mondeo','Mustang','Puma','Ranger','S-Max','Transit'],
  'Genesis': ['G70','G80','G90','GV70','GV80'],
  'Honda': ['Accord','Civic','CR-V','e','HR-V','Jazz','NSX'],
  'Hyundai': ['Elantra','i10','i20','i30','i40','Ioniq','Ioniq 5','Ioniq 6','ix20','ix35','Kona','Santa Fe','Tucson'],
  'Infiniti': ['Q30','Q50','Q60','QX30','QX50','QX70','QX80'],
  'Jaguar': ['E-Pace','F-Pace','F-Type','I-Pace','XE','XF','XJ'],
  'Jeep': ['Cherokee','Compass','Gladiator','Grand Cherokee','Renegade','Wrangler'],
  'Kia': ['Carnival','Ceed','EV6','Niro','Picanto','ProCeed','Rio','Sorento','Sportage','Stinger','XCeed'],
  'Lamborghini': ['Aventador','Huracán','Urus'],
  'Land Rover': ['Defender','Discovery','Discovery Sport','Freelander','Range Rover','Range Rover Evoque','Range Rover Sport','Range Rover Velar'],
  'Lancia': ['Delta','Musa','Phedra','Ypsilon'],
  'Lexus': ['ES','GS','IS','LC','LS','LX','NX','RX','UX'],
  'Lynk & Co': ['01','02','03'],
  'Maserati': ['Ghibli','GranTurismo','Grecale','Levante','Quattroporte'],
  'Mazda': ['2','3','6','CX-3','CX-5','CX-30','CX-60','MX-5','RX-8'],
  'McLaren': ['570S','600LT','720S','Artura'],
  'Mercedes-Benz': ['A 180','A 200','AMG GT','B 180','B 200','C 180','C 200','C 220','C 250','C 300','CLA','CLS','E 200','E 220','E 250','E 300','E 350','EQC','EQS','GLA','GLB','GLC','GLE','GLS','S 350','S 400','S 500','Sprinter','Vito'],
  'MG': ['EHS','HS','MG4','MG5','ZS'],
  'Mini': ['Clubman','Cooper','Countryman','One','Paceman','Roadster'],
  'Mitsubishi': ['ASX','Colt','Eclipse Cross','Galant','L200','Lancer','Outlander','Pajero'],
  'Nissan': ['350Z','370Z','GT-R','Juke','Leaf','Micra','Navara','Patrol','Qashqai','X-Trail'],
  'Opel': ['Astra','Corsa','Crossland','Grandland','Insignia','Meriva','Mokka','Vectra','Vivaro','Zafira'],
  'Peugeot': ['107','108','206','207','208','2008','301','307','308','3008','406','407','408','4008','5008','Expert','Partner'],
  'Polestar': ['1','2','3','4'],
  'Porsche': ['718','911','Cayenne','Macan','Panamera','Taycan'],
  'Renault': ['Arkana','Austral','Captur','Clio','Kadjar','Kangoo','Koleos','Laguna','Master','Megane','Scenic','Trafic','Twingo','Zoe'],
  'Rolls-Royce': ['Cullinan','Ghost','Phantom','Wraith'],
  'Seat': ['Alhambra','Arona','Ateca','Ibiza','Leon','Mii','Tarraco','Toledo'],
  'Skoda': ['Enyaq','Fabia','Kamiq','Karoq','Kodiaq','Octavia','Rapid','Scala','Superb'],
  'Smart': ['EQ ForTwo','ForFour','ForTwo'],
  'Subaru': ['BRZ','Forester','Impreza','Legacy','Outback','WRX','XV'],
  'Suzuki': ['Baleno','Ignis','Jimny','S-Cross','Swift','SX4','Vitara'],
  'Tesla': ['Cybertruck','Model 3','Model S','Model X','Model Y'],
  'Toyota': ['Auris','Avensis','Aygo','C-HR','Camry','Corolla','Hilux','Land Cruiser','Prius','RAV4','Supra','Yaris'],
  'Volkswagen': ['Arteon','Caddy','Golf','ID.3','ID.4','ID.5','Passat','Polo','Sharan','T-Cross','T-Roc','Tiguan','Touareg','Touran','Transporter','Up'],
  'Volvo': ['S40','S60','S80','S90','V40','V60','V70','V90','XC40','XC60','XC70','XC90'],
};

const ENGINES = [
  '1.0', '1.0 TSI', '1.0 EcoBoost',
  '1.2', '1.2 TSI', '1.2 THP',
  '1.4', '1.4 TSI', '1.4 THP', '1.4 HDi',
  '1.5', '1.5 TSI', '1.5 dCi', '1.5 BlueHDi', '1.5 TDCi',
  '1.6', '1.6 TDI', '1.6 HDi', '1.6 TDCi', '1.6 dCi', '1.6 THP',
  '1.8', '1.8 TSI', '1.8 TDCi',
  '2.0', '2.0 TDI', '2.0 TSI', '2.0 HDi', '2.0 TDCi', '2.0 dCi', '2.0 BlueHDi', '2.0 d',
  '2.2', '2.2 HDi', '2.2 TDCi', '2.2 d',
  '2.5', '2.5 TDI', '2.5 d',
  '3.0', '3.0 TDI', '3.0 d', '3.0 V6', '3.0 BiTDI',
  '3.5 V6', '4.0 V8', '4.4 V8', '5.0 V8', '6.2 V8',
  '2.0 Hybrid', '2.5 Hybrid', 'Plug-in Hybrid',
  'Electric',
  'Altă motorizare',
];

const YEARS = Array.from({ length: 35 }, (_, i) => (2025 - i).toString());

export default function ProfileScreen({ user, token, onLogout }) {
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [step, setStep] = useState('brand');
  const [form, setForm] = useState({ brand: '', model: '', year: '', engine: '' });
  const [customEngine, setCustomEngine] = useState('');
  const [models, setModels] = useState([]);
  const [brands] = useState(Object.keys(BRANDS_MODELS).sort());
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    setLoadingCars(true);
    try {
      const res = await axios.get(`${API_URL}/cars/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCars(res.data);
    } catch (e) {
      console.log('fetchCars error', e);
    }
    setLoadingCars(false);
  };

  const openAdd = () => {
    setEditCar(null);
    setForm({ brand: '', model: '', year: '', engine: '' });
    setCustomEngine('');
    setBrandSearch('');
    setModelSearch('');
    setStep('brand');
    setModalVisible(true);
  };

  const openEdit = (car) => {
    setEditCar(car);
    setForm({ brand: car.brand, model: car.model, year: car.year.toString(), engine: car.engine });
    setCustomEngine('');
    setBrandSearch('');
    setModelSearch('');
    setStep('brand');
    setModalVisible(true);
  };

  const selectBrand = (brand) => {
    setForm(f => ({ ...f, brand, model: '' }));
    setModels(BRANDS_MODELS[brand] || ['Alt model']);
    setModelSearch('');
    setStep('model');
  };

  const selectModel = (model) => {
    setForm(f => ({ ...f, model }));
    setStep('year');
  };

  const selectYear = (year) => {
    setForm(f => ({ ...f, year }));
    setStep('engine');
  };

  const selectEngine = (engine) => {
    if (engine === 'Altă motorizare') {
      setForm(f => ({ ...f, engine: '' }));
      setCustomEngine('');
    } else {
      setForm(f => ({ ...f, engine }));
    }
  };

  const saveCar = async () => {
    const finalEngine = form.engine || customEngine;
    if (!form.brand || !form.model || !form.year || !finalEngine) {
      Alert.alert('Atenție', 'Te rugăm să completezi toate câmpurile.');
      return;
    }
    try {
      const payload = { brand: form.brand, model: form.model, year: parseInt(form.year), engine: finalEngine };
      if (editCar) {
        await axios.put(`${API_URL}/cars/${editCar.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/cars/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setModalVisible(false);
      fetchCars();
    } catch (e) {
      Alert.alert('Eroare', e.response?.data?.detail || 'Ceva a mers greșit.');
    }
  };

  const deleteCar = (car) => {
    Alert.alert('Șterge mașina', `Ești sigur că vrei să ștergi ${car.brand} ${car.model}?`, [
      { text: 'Anulează', style: 'cancel' },
      {
        text: 'Șterge', style: 'destructive',
        onPress: async () => {
          await axios.delete(`${API_URL}/cars/${car.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchCars();
        }
      }
    ]);
  };

  const renderModalContent = () => {
    if (step === 'brand') return (
      <View>
        <Text style={styles.modalStepTitle}>Alege marca</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Caută marca... (ex: BMW, Dacia)"
          placeholderTextColor="#aaa"
          value={brandSearch}
          onChangeText={setBrandSearch}
        />
        <ScrollView style={{ maxHeight: 320 }}>
          {brands
            .filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
            .map(b => (
              <TouchableOpacity key={b} style={[styles.optionRow, form.brand === b && styles.optionRowActive]} onPress={() => selectBrand(b)}>
                <Text style={[styles.optionText, form.brand === b && styles.optionTextActive]}>{b}</Text>
                {form.brand === b && <Ionicons name="checkmark" size={18} color="#e63946" />}
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    );

    if (step === 'model') return (
      <View>
        <TouchableOpacity onPress={() => setStep('brand')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color="#e63946" />
          <Text style={styles.backText}>Înapoi</Text>
        </TouchableOpacity>
        <Text style={styles.modalStepTitle}>Alege modelul — {form.brand}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Caută modelul..."
          placeholderTextColor="#aaa"
          value={modelSearch}
          onChangeText={setModelSearch}
        />
        <ScrollView style={{ maxHeight: 300 }}>
          {models
            .filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()))
            .map(m => (
              <TouchableOpacity key={m} style={[styles.optionRow, form.model === m && styles.optionRowActive]} onPress={() => selectModel(m)}>
                <Text style={[styles.optionText, form.model === m && styles.optionTextActive]}>{m}</Text>
                {form.model === m && <Ionicons name="checkmark" size={18} color="#e63946" />}
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    );

    if (step === 'year') return (
      <View>
        <TouchableOpacity onPress={() => setStep('model')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color="#e63946" />
          <Text style={styles.backText}>Înapoi</Text>
        </TouchableOpacity>
        <Text style={styles.modalStepTitle}>Alege anul</Text>
        <ScrollView style={{ maxHeight: 350 }}>
          {YEARS.map(y => (
            <TouchableOpacity key={y} style={[styles.optionRow, form.year === y && styles.optionRowActive]} onPress={() => selectYear(y)}>
              <Text style={[styles.optionText, form.year === y && styles.optionTextActive]}>{y}</Text>
              {form.year === y && <Ionicons name="checkmark" size={18} color="#e63946" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );

    if (step === 'engine') return (
      <View>
        <TouchableOpacity onPress={() => setStep('year')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color="#e63946" />
          <Text style={styles.backText}>Înapoi</Text>
        </TouchableOpacity>
        <Text style={styles.modalStepTitle}>Alege motorizarea</Text>
        <ScrollView style={{ maxHeight: 250 }}>
          {ENGINES.map(e => (
            <TouchableOpacity key={e} style={[styles.optionRow, form.engine === e && styles.optionRowActive]} onPress={() => selectEngine(e)}>
              <Text style={[styles.optionText, form.engine === e && styles.optionTextActive]}>{e}</Text>
              {form.engine === e && <Ionicons name="checkmark" size={18} color="#e63946" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        {(form.engine === '' || form.engine === 'Altă motorizare') && (
          <TextInput
            style={styles.customInput}
            placeholder="Scrie motorizarea (ex: 3.0 BiTDI)"
            placeholderTextColor="#aaa"
            value={customEngine}
            onChangeText={setCustomEngine}
          />
        )}
        <TouchableOpacity style={styles.saveBtn} onPress={saveCar}>
          <Text style={styles.saveBtnText}>{editCar ? 'Salvează modificările' : 'Adaugă mașina'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.full_name || 'Utilizator'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.phone && <Text style={styles.phone}>{user?.phone}</Text>}
        </View>

        <View style={styles.carsSection}>
          <View style={styles.carsSectionHeader}>
            <Text style={styles.carsSectionTitle}>🚗 Mașinile mele</Text>
            {cars.length < 3 && (
              <TouchableOpacity style={styles.addCarBtn} onPress={openAdd}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addCarText}>Adaugă</Text>
              </TouchableOpacity>
            )}
          </View>
          {loadingCars
            ? <ActivityIndicator color="#e63946" style={{ marginTop: 12 }} />
            : cars.length === 0
              ? (
                <TouchableOpacity style={styles.emptyCarCard} onPress={openAdd}>
                  <Ionicons name="car-outline" size={32} color="#aaa" />
                  <Text style={styles.emptyCarText}>Adaugă prima ta mașină</Text>
                  <Text style={styles.emptyCarSub}>Service-ul va ști exact ce mașină vine</Text>
                </TouchableOpacity>
              )
              : cars.map(car => (
                <View key={car.id} style={styles.carCard}>
                  <View style={styles.carCardIcon}>
                    <Ionicons name="car-sport-outline" size={22} color="#e63946" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.carBrand}>{car.brand} {car.model}</Text>
                    <Text style={styles.carDetails}>{car.year} · {car.engine}</Text>
                  </View>
                  <TouchableOpacity onPress={() => openEdit(car)} style={styles.carAction}>
                    <Ionicons name="pencil-outline" size={18} color="#888" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteCar(car)} style={styles.carAction}>
                    <Ionicons name="trash-outline" size={18} color="#e63946" />
                  </TouchableOpacity>
                </View>
              ))
          }
        </View>

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

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editCar ? 'Editează mașina' : 'Adaugă mașină'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>
            <View style={styles.stepper}>
              {['brand', 'model', 'year', 'engine'].map((s, i) => (
                <View key={s} style={styles.stepperItem}>
                  <View style={[styles.stepperDot, step === s && styles.stepperDotActive,
                    ['brand', 'model', 'year', 'engine'].indexOf(step) > i && styles.stepperDotDone
                  ]}>
                    <Text style={styles.stepperDotText}>{i + 1}</Text>
                  </View>
                </View>
              ))}
            </View>
            {renderModalContent()}
          </View>
        </View>
      </Modal>

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
  carsSection: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  carsSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  carsSectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  addCarBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e63946', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, gap: 4 },
  addCarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  emptyCarCard: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  emptyCarText: { fontSize: 15, fontWeight: '600', color: '#555' },
  emptyCarSub: { fontSize: 12, color: '#aaa', textAlign: 'center' },
  carCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 12, padding: 12, marginBottom: 8, gap: 12 },
  carCardIcon: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#fff0f1', alignItems: 'center', justifyContent: 'center' },
  carBrand: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  carDetails: { fontSize: 13, color: '#888', marginTop: 2 },
  carAction: { padding: 6 },
  modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  modalStepTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  stepper: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 },
  stepperItem: { alignItems: 'center' },
  stepperDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  stepperDotActive: { backgroundColor: '#e63946' },
  stepperDotDone: { backgroundColor: '#1a1a2e' },
  stepperDotText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  optionRowActive: { backgroundColor: '#fff0f1', borderRadius: 8, paddingHorizontal: 8 },
  optionText: { fontSize: 15, color: '#333' },
  optionTextActive: { color: '#e63946', fontWeight: '700' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backText: { color: '#e63946', fontWeight: '600', fontSize: 14 },
  searchInput: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, fontSize: 15, color: '#1a1a2e', marginBottom: 10, backgroundColor: '#f8f8f8' },
  customInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginTop: 12, fontSize: 15, color: '#1a1a2e' },
  saveBtn: { backgroundColor: '#e63946', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
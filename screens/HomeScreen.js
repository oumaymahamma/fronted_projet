import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState({ username: 'Guest' });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/profile/');
      setProfile(res.data || { username: 'Guest' });
    } catch (err) {
      console.log('fetchProfile error', err.response?.data || err.message);
      setProfile({ username: 'Guest' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9BD79F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header row: greeting + bell */}
    <View style={styles.headerRow}>
  {/* MENU ICON */}
  <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
  <Ionicons name="menu" size={28} color="#000" />
</TouchableOpacity>


  <View style={{ flex: 1, marginLeft: 10 }}>
    <Text style={styles.hello}>Hello {profile.username}!</Text>
    <Text style={styles.updateText}>Update your profile</Text>
  </View>

  <TouchableOpacity activeOpacity={1}>
    <Image source={require('../assets/bell.png')} style={styles.bell} />
  </TouchableOpacity>
</View>


        {/* Search box */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color="#9aa0a6" style={{ marginLeft: 12 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#9aa0a6"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Welcome card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextWrap}>
            <Text style={styles.welcomeTitle}>Welcome !</Text>
            <Text style={styles.welcomeSubtitle}>Your journey to wellness starts here.</Text>
          </View>
          <Image source={require('../assets/coach.png')} style={styles.coachImage} />
        </View>

        {/* Recommendation header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommendation</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Cards grid */}
        <View style={styles.grid}>
          <View style={styles.card}>
            {/* empty card body */}
          </View>
          <View style={styles.card}>
            {/* empty card body */}
          </View>

          <View style={styles.card}>
            {/* empty card body */}
          </View>
          <View style={styles.card}>
            {/* empty card body */}
          </View>
        </View>

      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hello: {
    color: '#9FCC9A', // soft green
    fontWeight: '700',
    fontSize: 16,
  },
  updateText: {
    color: '#bfc7c1',
    fontSize: 12,
    marginTop: 4,
  },
  bell: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#222',
  },

  welcomeCard: {
    marginTop: 18,
    backgroundColor: '#9BD79F',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // shadow
    shadowColor: '#9BD79F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  welcomeTextWrap: { flex: 1, paddingRight: 8 },
  welcomeTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  welcomeSubtitle: { color: '#f6fff6', fontSize: 13, lineHeight: 18 },

  coachImage: { width: 100, height: 100, resizeMode: 'contain' },
menuBtn: {
  padding: 6,
},

  sectionHeader: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  seeAll: { color: '#9aa0a6', fontSize: 13 },

  grid: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    // shadow / floating card
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  gridLabels: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  gridLabel: {
    width: '48%',
    textAlign: 'left',
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    username: '', email: '', age: '', poids: '', taille: '', allergie: '', preference: '', besoin_calorique: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/profile/');
      setProfile(res.data);
    } catch (error) {
      console.log('Erreur chargement profil:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', 'Impossible de charger le profil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await api.put('/profile/', profile);
      setProfile(res.data);
      Alert.alert('Succès', 'Profil mis à jour ✅');
    } catch (error) {
      console.log('Erreur mise à jour:', error.response?.data || error.message);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Erreur déconnexion:', error);
    }
  };

  useEffect(() => { 
    fetchProfile(); 
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <Text style={styles.value}>{profile.username}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Informations personnelles</Text>
      
      <TextInput
        placeholder="Âge"
        style={styles.input}
        value={profile.age?.toString()}
        onChangeText={val => setProfile({...profile, age: val})}
        keyboardType="numeric"
      />
      
      <TextInput
        placeholder="Poids (kg)"
        style={styles.input}
        value={profile.poids?.toString()}
        onChangeText={val => setProfile({...profile, poids: val})}
        keyboardType="numeric"
      />
      
      <TextInput
        placeholder="Taille (cm)"
        style={styles.input}
        value={profile.taille?.toString()}
        onChangeText={val => setProfile({...profile, taille: val})}
        keyboardType="numeric"
      />
      
      <TextInput
        placeholder="Allergies"
        style={styles.input}
        value={profile.allergie}
        onChangeText={val => setProfile({...profile, allergie: val})}
      />
      
      <TextInput
        placeholder="Préférences alimentaires"
        style={styles.input}
        value={profile.preference}
        onChangeText={val => setProfile({...profile, preference: val})}
      />
      
      <TextInput
        placeholder="Besoin calorique journalier"
        style={styles.input}
        value={profile.besoin_calorique?.toString()}
        onChangeText={val => setProfile({...profile, besoin_calorique: val})}
        keyboardType="numeric"
      />

      <TouchableOpacity 
        style={[styles.updateButton, isUpdating && styles.buttonDisabled]} 
        onPress={handleUpdate}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Mettre à jour le profil</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  input: { 
    backgroundColor: 'white',
    borderWidth: 1, 
    borderColor: '#ddd',
    padding: 12, 
    marginVertical: 5, 
    borderRadius: 8,
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});
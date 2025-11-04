import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, 
  ActivityIndicator, ScrollView, Image 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api'; // ton fichier api axios

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    username: '', email: '', age: '', poids: '', taille: '', allergie: '', preference: '', besoin_calorique: '', photo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);

  // Charger le profil depuis Django
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

  // Sélection d'une image depuis la galerie
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission refusée", "L'accès à la galerie est requis.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewPhoto(result.assets[0].uri);
    }
  };

  // Mise à jour du profil
  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();

      // Champs texte / numériques
      const fields = ['age', 'poids', 'taille', 'allergie', 'preference', 'besoin_calorique'];
      fields.forEach(key => {
        const value = profile[key];
        if (value !== null && value !== '') {
          // Convertir les nombres
          if (['age','poids','taille','besoin_calorique'].includes(key)) {
            formData.append(key, Number(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      // Champs immuables (username, email)
      formData.append('username', profile.username);
      formData.append('email', profile.email);

      // Photo
      if (newPhoto) {
        const filename = newPhoto.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('photo', { uri: newPhoto, name: filename, type });
      }

      // Debug : vérifier ce qui est envoyé
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await api.put('/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfile(res.data);
      setNewPhoto(null);
      Alert.alert('✅ Succès', 'Profil mis à jour');
    } catch (error) {
      console.log('Erreur mise à jour:', error.response?.data || error.message);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setIsUpdating(false);
    }
  };

  // Déconnexion
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

      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: newPhoto 
              ? newPhoto 
              : profile.photo 
                ? `http://10.10.242.81:8000${profile.photo}` 
                : 'https://via.placeholder.com/150'
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Changer la photo</Text>
        </TouchableOpacity>
      </View>

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
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#007bff' },
  photoButton: { marginTop: 10, backgroundColor: '#007bff', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  photoButtonText: { color: 'white', fontWeight: 'bold' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  value: { fontSize: 16, color: '#666' },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', padding: 12, marginVertical: 5, borderRadius: 8 },
  updateButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  logoutButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  buttonDisabled: { backgroundColor: '#6c757d' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

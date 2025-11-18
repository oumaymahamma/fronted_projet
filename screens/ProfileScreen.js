import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, ScrollView, Image, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    username: '', email: '', age: '', poids: '', taille: '', allergie: '', preference: '', besoin_calorique: '', photo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);

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

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      const fields = ['age', 'poids', 'taille', 'allergie', 'preference', 'besoin_calorique'];
      fields.forEach(key => {
        const value = profile[key];
        if (value !== null && value !== undefined && value !== '') {
          if (['age','poids','taille','besoin_calorique'].includes(key)) {
            formData.append(key, Number(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      formData.append('username', profile.username);
      formData.append('email', profile.email);

      if (newPhoto) {
        const filename = newPhoto.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('photo', { uri: newPhoto, name: filename, type });
      }

      // send
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Erreur déconnexion:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9BD79F" />
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Image
            source={
              newPhoto
                ? { uri: newPhoto }
                : profile.photo
                  ? { uri: profile.photo.startsWith('http') ? profile.photo : `http://10.10.242.81:8000${profile.photo}` }
                  : require('../assets/avatar_default.png')
            }
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.addIcon} onPress={pickImage}>
            <View style={styles.addInner}>
              <Ionicons name="add" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Inputs two columns */}
        <View style={styles.row}>
          <View style={styles.inputBox}>
            <Text style={styles.labelSmall}>Height</Text>
            <TextInput
              placeholder="cm"
              style={styles.input}
              value={profile.taille?.toString()}
              onChangeText={val => setProfile({ ...profile, taille: val })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.labelSmall}>Weight</Text>
            <TextInput
              placeholder="kg"
              style={styles.input}
              value={profile.poids?.toString()}
              onChangeText={val => setProfile({ ...profile, poids: val })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputBox}>
            <Text style={styles.labelSmall}>Age</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              value={profile.age?.toString()}
              onChangeText={val => setProfile({ ...profile, age: val })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.labelSmall}>Preference</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              value={profile.preference}
              onChangeText={val => setProfile({ ...profile, preference: val })}
            />
          </View>
        </View>

        {/* Full width fields */}
        <View style={styles.fullWidth}>
          <Text style={styles.labelSmall}>Allergie</Text>
          <TextInput
            placeholder=""
            style={[styles.input, styles.inputFull]}
            value={profile.allergie}
            onChangeText={val => setProfile({ ...profile, allergie: val })}
          />
        </View>

        <View style={styles.fullWidth}>
          <Text style={styles.labelSmall}>Caloric need</Text>
          <TextInput
            placeholder=""
            style={[styles.input, styles.inputFull]}
            value={profile.besoin_calorique?.toString()}
            onChangeText={val => setProfile({ ...profile, besoin_calorique: val })}
            keyboardType="numeric"
          />
        </View>

        {/* Complete Profile Button */}
        <TouchableOpacity
          style={[styles.completeBtn, isUpdating && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.completeText}>Complete Profile</Text>}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  backBtn: {
    marginLeft: 4,
    marginBottom: 6,
  },
  avatarWrap: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 18,
    width: 140,
    height: 140,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    alignSelf: 'center',
    resizeMode: 'cover',
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  addIcon: {
    position: 'absolute',
    right: -4,
    bottom: -4,
  },
  addInner: {
    backgroundColor: '#ffffff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    // small green circle
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputBox: {
    width: '48%',
  },
  labelSmall: {
    fontSize: 13,
    color: '#222',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    // shadow like card
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 0,
  },
  fullWidth: {
    marginBottom: 12,
  },
  inputFull: {
    width: '100%',
  },
  completeBtn: {
    marginTop: 18,
    backgroundColor: '#9BD79F',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
    shadowColor: '#9BD79F',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  completeText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

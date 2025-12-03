import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';


const ProfileFormScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    poids: '',
    taille: '',
    allergie: '',
    preference: '',
    besoin_calorique: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age?.toString() || '',
        poids: user.poids?.toString() || '',
        taille: user.taille?.toString() || '',
        allergie: user.allergie || '',
        preference: user.preference || '',
        besoin_calorique: user.besoin_calorique?.toString() || '',
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateCalories = () => {
    const age = parseInt(formData.age) || 0;
    const poids = parseFloat(formData.poids) || 0;
    const taille = parseFloat(formData.taille) || 0;

    if (age > 0 && poids > 0 && taille > 0) {
      const bmr = 88.362 + (13.397 * poids) + (4.799 * taille) - (5.677 * age);
      const calories = bmr * 1.2;
      handleChange('besoin_calorique', Math.round(calories).toString());
      Alert.alert(
        'Calcul réussi',
        `Votre besoin calorique estimé est de ${Math.round(calories)} kcal/jour`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Données manquantes',
        'Veuillez renseigner l\'âge, le poids et la taille pour calculer les besoins caloriques',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSubmit = async () => {
    if (!formData.age || !formData.poids || !formData.taille) {
      Alert.alert(
        'Champs requis',
        'Veuillez renseigner au moins l\'âge, le poids et la taille',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    const submitData = {
      age: parseInt(formData.age),
      poids: parseFloat(formData.poids),
      taille: parseFloat(formData.taille),
      allergie: formData.allergie,
      preference: formData.preference,
      besoin_calorique: formData.besoin_calorique ? parseFloat(formData.besoin_calorique) : null,
    };

    const result = await updateProfile(submitData);
    setIsLoading(false);

    if (result.success) navigation.goBack();
  };

  const isFormValid = formData.age && formData.poids && formData.taille;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f2f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        
        <View style={styles.card}>
           <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
          <Text style={styles.title}>Compléter le profil</Text>

          {/* Deux colonnes */}
          <View style={styles.row}>
            <View style={styles.inputBox}>
              <Text style={styles.labelSmall}>Taille (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.taille}
                onChangeText={val => handleChange('taille', val)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.labelSmall}>Poids (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.poids}
                onChangeText={val => handleChange('poids', val)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputBox}>
              <Text style={styles.labelSmall}>Âge</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={val => handleChange('age', val)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.labelSmall}>Besoins caloriques</Text>
              <TextInput
                style={styles.input}
                value={formData.besoin_calorique}
                onChangeText={val => handleChange('besoin_calorique', val)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Bouton calcul */}
          <TouchableOpacity style={styles.calculateButton} onPress={calculateCalories}>
            <Text style={styles.calculateButtonText}>Calculer les besoins caloriques</Text>
          </TouchableOpacity>

          {/* Champs pleine largeur */}
          <View style={styles.fullWidth}>
            <Text style={styles.labelSmall}>Allergies</Text>
            <TextInput
              style={[styles.input, styles.inputFull, { height: 80 }]}
              value={formData.allergie}
              onChangeText={val => handleChange('allergie', val)}
              multiline
            />
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.labelSmall}>Préférences alimentaires</Text>
            <TextInput
              style={[styles.input, styles.inputFull, { height: 80 }]}
              value={formData.preference}
              onChangeText={val => handleChange('preference', val)}
              multiline
            />
          </View>

          {/* Bouton enregistrer */}
          <TouchableOpacity
            style={[styles.completeBtn, (!isFormValid || isLoading) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.completeText}>Enregistrer le profil</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#9BD79F',
    textAlign: 'center',
    marginBottom: 25,
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
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f4f6f8',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    fontSize: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fullWidth: {
    marginBottom: 12,
  },
  inputFull: {
    width: '100%',
  },
  calculateButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
        width: '90%',
         alignItems: 'center',
    alignSelf: 'center',

  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    
  },
  completeBtn: {
    marginTop: 15,
    backgroundColor: '#9BD79F', // ✅ vert principal
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    shadowColor: '#9BD79F',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
    backBtn: {
    marginBottom: 10,
  },

  completeText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: '#AEE5B1', // version claire du vert
  },
});

export default ProfileFormScreen;

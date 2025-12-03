import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MealDetailScreen = ({ route, navigation }) => {
  const { meal } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  // ----------------------------------------------------
  // 🔥 Vérifier si le repas est déjà favori
  // ----------------------------------------------------
  useEffect(() => {
    const checkFavorite = async () => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      const exists = favorites.some((item) => item.id === meal.id);
      setIsFavorite(exists);
    };

    checkFavorite();
  }, []);

  // ----------------------------------------------------
  // 🔥 Ajouter / Retirer des favoris
  // ----------------------------------------------------
  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        // 🔴 Remove
        favorites = favorites.filter((item) => item.id !== meal.id);
      } else {
        // 🟢 Add
        favorites.push(meal);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);

    } catch (error) {
      console.log("Error updating favorites:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={meal.image} style={styles.mealImage} />
        </View>

        <View style={styles.content}>
          {/* Name */}
          <Text style={styles.mealName}>{meal.name}</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description :</Text>
            <Text style={styles.description}>{meal.description}</Text>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.ingredients}>
              <Text style={styles.ingredientsBold}>Ingredients : </Text>
              {meal.ingredients}
            </Text>
          </View>

          {/* Nutritional Values */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutritional Values :</Text>

            <View style={styles.nutritionCardsContainer}>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{meal.proteines}</Text>
                <Text style={styles.nutritionLabel}>Proteins</Text>
              </View>

              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{meal.glucides}</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>

              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{meal.lipides}</Text>
                <Text style={styles.nutritionLabel}>Fats</Text>
              </View>
            </View>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.favoriteButtonText}>
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            setActiveTab('Camera');
            navigation.navigate('FruitDetector');
          }}
        >
          <View style={activeTab === 'Camera' ? styles.activeIconContainer : null}>
            <Ionicons 
              name="camera-outline" 
              size={24} 
              color={activeTab === 'Camera' ? "#fff" : "#333"}
            />
          </View>
          <Text style={activeTab === 'Camera' ? styles.activeMenuText : styles.menuText}>
            Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            setActiveTab('Home');
            navigation.navigate('Home');
          }}
        >
          <View style={activeTab === 'Home' ? styles.activeIconContainer : null}>
            <Ionicons 
              name="home-outline" 
              size={24} 
              color={activeTab === 'Home' ? "#fff" : "#333"}
            />
          </View>
          <Text style={activeTab === 'Home' ? styles.activeMenuText : styles.menuText}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            setActiveTab('Profile');
            navigation.navigate('Profile');
          }}
        >
          <View style={activeTab === 'Profile' ? styles.activeIconContainer : null}>
            <Ionicons 
              name="person-outline" 
              size={24} 
              color={activeTab === 'Profile' ? "#fff" : "#333"}
            />
          </View>
          <Text style={activeTab === 'Profile' ? styles.activeMenuText : styles.menuText}>
            Profile
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

// --------------------------------------------------
// 🎨 STYLES (inchangés, identiques à ton code)
// --------------------------------------------------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 4 },
  placeholder: { width: 32 },
  container: { paddingBottom: 100 },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#91C789',
  },
  mealImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  mealName: { fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  description: { fontSize: 14, color: '#666', lineHeight: 20 },
  ingredients: { fontSize: 14, color: '#666', lineHeight: 20 },
  ingredientsBold: { fontWeight: '600', color: '#333', fontSize: 16 },
  nutritionSection: { marginBottom: 30 },
  nutritionCardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  nutritionCard: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  nutritionValue: { fontSize: 16, fontWeight: '700', color: '#9FCC9A', marginBottom: 6 },
  nutritionLabel: { fontSize: 12, color: '#666', fontWeight: '500', textAlign: 'center' },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9FCC9A',
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 4,
  },
  favoriteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },

  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 10,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  menuItem: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  menuText: { fontSize: 12, marginTop: 4, color: '#666' },
  activeIconContainer: {
    backgroundColor: '#9FCC9A',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 6,
  },
  activeMenuText: { color: '#333', fontWeight: '700' },
});

export default MealDetailScreen;

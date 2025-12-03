import React, { useState } from 'react';
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

const RecommendationScreen = ({ route, navigation }) => {
  const { allRecommendations } = route.params;
  const [favorites, setFavorites] = useState([2]);
  const [activeTab, setActiveTab] = useState('Home');

  const toggleFavorite = (mealId) => {
    setFavorites(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
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
        <Text style={styles.headerTitle}>All Recommendations</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Liste des repas recommandés */}
        {allRecommendations.map((meal) => (
          <TouchableOpacity 
            key={meal.id} 
            style={styles.mealCard}
            onPress={() => navigation.navigate('MealDetails', { meal })}
          >
            {/* Image du repas avec badge de catégorie */}
            <View style={styles.imageContainer}>
              <Image source={meal.image} style={styles.mealImage} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{meal.category}</Text>
              </View>
            </View>

            {/* Contenu de la carte */}
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <View style={styles.preparationTime}>
                  <Ionicons name="time-outline" size={16} color="#9aa0a6" />
                  <Text style={styles.durationLabel}>Duration : </Text>
                  <Text style={styles.preparationText}>{meal.preparation}</Text>
                </View>
              </View>

              {/* Bouton Favori */}
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(meal.id)}
              >
                <Ionicons 
                  name={favorites.includes(meal.id) ? "heart" : "heart-outline"} 
                  size={26} 
                  color={favorites.includes(meal.id) ? "#FF6B6B" : "#9aa0a6"} 
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Menu fixe */}
      <View style={styles.bottomMenu}>
        {/* Camera */}
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
              color={activeTab === 'Camera' ? '#fff' : '#333'} 
            />
          </View>
          <Text style={activeTab === 'Camera' ? styles.activeMenuText : styles.menuText}>
            Camera
          </Text>
        </TouchableOpacity>

        {/* Home */}
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
              color={activeTab === 'Home' ? '#fff' : '#333'} 
            />
          </View>
          <Text style={activeTab === 'Home' ? styles.activeMenuText : styles.menuText}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Profile */}
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
              color={activeTab === 'Profile' ? '#fff' : '#333'} 
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  placeholder: { width: 32 },
  container: { paddingHorizontal: 18, paddingVertical: 16, paddingBottom: 100 }, // espace pour Bottom Menu
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: { width: '100%', height: 140, backgroundColor: '#f8f8f8', position: 'relative' },
  mealImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#9FCC9A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  categoryText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  cardContent: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textContainer: { flex: 1 },
  mealName: { fontSize: 16, fontWeight: '700', color: '#9BD79F', marginBottom: 8 },
  preparationTime: { flexDirection: 'row', alignItems: 'center' },
  durationLabel: { fontSize: 14, color: '#9aa0a6', marginLeft: 6 },
  preparationText: { fontSize: 14, color: '#9FCC9A', fontWeight: '500' },
  favoriteButton: { padding: 4 },

  // Bottom Menu
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
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
    shadowColor: '#9FCC9A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  activeMenuText: { color: '#333', fontWeight: '700' },
});

export default RecommendationScreen;

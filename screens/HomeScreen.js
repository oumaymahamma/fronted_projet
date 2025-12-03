import React, { useState, useEffect } from 'react';
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
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';


const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Home');
const { user, logout } = useAuth();
console.log("User:", user);
  const [dailyNotification, setDailyNotification] = useState(null);
const [showNotifications, setShowNotifications] = useState(false);
const [notifications, setNotifications] = useState([]);

  const isProfileComplete = user?.age && user?.poids && user?.taille;

  const allRecommendations = [
    {
      id: 1,
      name: 'Gritted Chicken Salad',
      category: 'Salad',
      preparation: '20 min',
      image: require('../assets/Gritted Chicken Salad.png'),
      description: 'A fresh, protein-packed salad with quinoa, grilled chicken, avocado, and olive oil dressing. Ideal for muscle recovery and weight management.',
      ingredients: 'Chicken Breast, Quinoa, Avocado, Mixed Greens, Cherry Tomatoes, Olive Oil, Lemon Juice',
      proteines: '35g',
      glucides: '25g',
      lipides: '15g',
      rating: 4.7,
    },
    {
      id: 2,
      name: 'Energy Smoothie Bowl',
      category: 'Breakfast',
      preparation: '10 min',
      image: require('../assets/Energy Smoothie Bowl.png'),
      description: 'A vibrant and nutritious smoothie bowl packed with antioxidants, perfect for an energetic start to your day.',
      ingredients: 'Banana, Mixed Berries, Greek Yogurt, Granola, Chia Seeds, Honey',
      proteines: '20g',
      glucides: '55g',
      lipides: '8g',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Salmon Quinoa Bowl',
      category: 'Dinner',
      preparation: '25 min',
      image: require('../assets/Salmon Quinoa Bowl.png'),
      description: 'A complete meal rich in omega-3 and proteins, featuring grilled salmon and nutrient-dense quinoa with fresh vegetables.',
      ingredients: 'Salmon Fillet, Quinoa, Broccoli, Avocado, Lemon, Olive Oil, Herbs',
      proteines: '38g',
      glucides: '35g',
      lipides: '24g',
      rating: 4.6,
    },
    {
      id: 4,
      name: 'Mediterranean Veggie Wrap',
      category: 'Lunch',
      preparation: '15 min',
      image: require('../assets/Mediterranean Veggie Wrap.png'),
      description: 'A fresh and flavorful wrap inspired by Mediterranean cuisine, packed with vegetables and healthy fats.',
      ingredients: 'Whole Wheat Tortilla, Hummus, Roasted Vegetables, Feta Cheese, Spinach, Olive Tapenade',
      proteines: '15g',
      glucides: '40g',
      lipides: '12g',
      rating: 4.4,
    },
    {
      id: 5,
      name: 'Protein Power Omelette',
      category: 'Breakfast',
      preparation: '12 min',
      image: require('../assets/Protein Power Omelette.png'),
      description: 'A fluffy and protein-rich omelette filled with fresh vegetables, perfect for a sustaining breakfast.',
      ingredients: 'Eggs, Spinach, Mushrooms, Bell Peppers, Cheese, Olive Oil, Herbs',
      proteines: '28g',
      glucides: '10g',
      lipides: '22g',
      rating: 4.7,
    },
    {
      id: 6,
      name: 'Vegan Buddha Bowl',
      category: 'Dinner',
      preparation: '18 min',
      image: require('../assets/Vegan Buddha Bowl.png'),
      description: 'A colorful and balanced plant-based bowl, 100% vegan and full of essential nutrients and flavors.',
      ingredients: 'Brown Rice, Avocado, Carrots, Chickpeas, Kale, Tahini Dressing, Sesame Seeds',
      proteines: '18g',
      glucides: '50g',
      lipides: '16g',
      rating: 4.5,
    },
    {
      id: 7,
      name: 'Turkey Avocado Sandwich',
      category: 'Lunch',
      preparation: '8 min',
      image: require('../assets/Turkey Avocado Sandwich.png'),
      description: 'A lean protein sandwich with fresh avocado and whole grain bread, perfect for a quick and healthy lunch.',
      ingredients: 'Whole Grain Bread, Turkey Breast, Avocado, Lettuce, Tomato, Mustard',
      proteines: '30g',
      glucides: '32g',
      lipides: '14g',
      rating: 4.3,
    },
    {
      id: 8,
      name: 'Greek Yogurt Parfait',
      category: 'Snack',
      preparation: '5 min',
      image: require('../assets/Greek Yogurt Parfait.png'),
      description: 'A creamy and delicious yogurt parfait layered with fresh fruits and crunchy granola for a perfect snack.',
      ingredients: 'Greek Yogurt, Mixed Berries, Granola, Honey, Chia Seeds',
      proteines: '22g',
      glucides: '35g',
      lipides: '6g',
      rating: 4.6,
    }
  ];

  const [favorites, setFavorites] = useState([2]);
  const [randomMeals, setRandomMeals] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredMeals, setFilteredMeals] = useState([]);

useEffect(() => {
const fetchNotifications = async () => {
  try {
    const response = await fetch('http://192.168.1.17:8000/api/daily-message/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}` // Assure-toi que user.token contient le JWT
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setDailyNotification(data);
  } catch (error) {
    console.error("Erreur fetch notifications:", error);
  }
};


  fetchNotifications();
}, []);


  useEffect(() => {
    const getRandomMeals = () => {
      const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    };
    const meals = getRandomMeals();
    setRandomMeals(meals);
    setFilteredMeals(meals);
  }, []);

  // Filtrage des repas selon la recherche
  useEffect(() => {
    const filtered = randomMeals.filter(meal =>
      meal.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMeals(filtered);
  }, [searchText, randomMeals]);

  const toggleFavorite = (mealId, event) => {
    event.stopPropagation();
    setFavorites(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header row: greeting + notification + logout */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.hello}>Hello {user?.username || 'Guest'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.profileLink}>Update your profile </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
<View style={{ position: 'relative' }}>
  <TouchableOpacity
    style={{ marginRight: 10 }}
    onPress={() => setShowNotifications(prev => !prev)}
  >
    <Image source={require('../assets/bell.png')} style={styles.bell} />
  </TouchableOpacity>

  {showNotifications && (
    <View style={styles.notificationDropdown}>
      {notifications.length === 0 ? (
        <Text style={styles.notificationText}>Aucune notification</Text>
      ) : (
        notifications.map((note, index) => (
          <View key={index} style={styles.notificationItem}>
            <Text style={styles.notificationText}>{note.message}</Text>
          </View>
        ))
      )}
    </View>
  )}
</View>

            <TouchableOpacity onPress={logout}>
              <Ionicons name="log-out-outline" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search box */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color="#9aa0a6" style={{ marginLeft: 12 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#9aa0a6"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
        </View>

        {/* Welcome card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextWrap}>
            <Text style={styles.welcomeTitle}>Welcome !</Text>
            <Text style={styles.welcomeSubtitle}>Your journey to wellness starts here.</Text>
            {isProfileComplete ? (
              <View style={styles.completedButton}>
                <Text style={styles.completedButtonText}>✓ Profile completed</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('ProfileForm')}
              >
                <Text style={styles.editButtonText}>✏️ Edit your profile</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.imageContainer}>
            <Image source={require('../assets/coach.png')} style={styles.coachImage} />
          </View>
        </View>

        {/* Recommendation section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommendation</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Recommendation', { allRecommendations })}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Grid des repas recommandés */}
        <View style={styles.grid}>
          {filteredMeals.map((meal) => (
            <TouchableOpacity 
              key={meal.id} 
              style={styles.mealCard}
              onPress={() => navigation.navigate('MealDetails', { meal })}
            >
              <View style={styles.mealImageContainer}>
                <Image source={meal.image} style={styles.mealCardImage} />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{meal.category}</Text>
                </View>
              </View>
              <View style={styles.mealCardContent}>
                <Text style={styles.mealCardName} numberOfLines={2}>
                  {meal.name}
                </Text>
                <View style={styles.mealDetails}>
                  <View style={styles.durationContainer}>
                    <Ionicons name="time-outline" size={12} color="#9aa0a6" />
                    <Text style={styles.durationText}>{meal.preparation}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.favoriteIcon}
                    onPress={(e) => toggleFavorite(meal.id, e)}
                  >
                    <Ionicons 
                      name={favorites.includes(meal.id) ? "heart" : "heart-outline"} 
                      size={16} 
                      color={favorites.includes(meal.id) ? "#FF6B6B" : "#9aa0a6"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Menu fixé */}
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
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 100, // espace pour bottom menu
    backgroundColor: '#fff',
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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

  hello: { color: '#9FCC9A', fontWeight: '700', fontSize: 16 },
  bell: { width: 60, height: 60, resizeMode: 'contain' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 14, color: '#222' },
  welcomeCard: {
    marginTop: 18,
    backgroundColor: '#9BD79F',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#9BD79F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    minHeight: 140,
    overflow: 'hidden',
  },
  welcomeTextWrap: { flex: 1, paddingRight: 8 },
  welcomeTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  welcomeSubtitle: { color: '#f6fff6', fontSize: 13, lineHeight: 18, marginBottom: 16 },
  imageContainer: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
  coachImage: { width: 170, height: 170, resizeMode: 'contain' },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignSelf: 'flex-start',
  },
  editButtonText: { color: 'white', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  completedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignSelf: 'flex-start',
  },
  completedButtonText: { color: 'white', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  profileLink: { color: '#c2c7c2ff', fontSize: 14, fontWeight: '600', marginTop: 4, textDecorationLine: 'none' },
  sectionHeader: { marginTop: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, color: '#333' },
  seeAll: { color: '#9aa0a6', fontSize: 13 },
  grid: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  mealCard: { width: '48%', backgroundColor: '#fff', borderRadius: 14, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  mealImageContainer: { position: 'relative' },
  mealCardImage: { width: '100%', height: 120, resizeMode: 'cover' },
  categoryBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  categoryText: { fontSize: 10, fontWeight: '700', color: '#9FCC9A' },
  mealCardContent: { padding: 10 },
  mealCardName: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 6 },
  mealDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  durationContainer: { flexDirection: 'row', alignItems: 'center' },
  durationText: { fontSize: 10, color: '#9aa0a6', marginLeft: 4 },
  favoriteIcon: { padding: 6 },
  notificationDropdown: {
  position: 'absolute',
  top: 60,
  right: 0,
  width: 250,
  maxHeight: 300,
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
  elevation: 8,
  zIndex: 999,
},

notificationItem: {
  paddingVertical: 8,
  borderBottomWidth: 0.5,
  borderBottomColor: '#ccc',
},

notificationText: {
  fontSize: 14,
  color: '#333',
}

});

export default HomeScreen;

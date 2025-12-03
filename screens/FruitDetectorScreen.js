import React, { useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  Image, 
  RefreshControl, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const Icons = {
  Camera: '📷',
  Gallery: '🖼️',
  Analyze: '🔍',
  Calories: '🔥',
  Carbs: '🍚',
  Protein: '💪',
  Reset: '🔄',
  Zap: '⚡'
};

export default function FruitDetectorScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Camera');

  const requestPermissions = async (isCamera = false) => {
    const permission = isCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        `We need access to your ${isCamera ? 'camera' : 'gallery'} to work properly.`
      );
      return false;
    }
    return true;
  };

  const handleImagePick = async (isCamera = false) => {
    const hasPermission = await requestPermissions(isCamera);
    if (!hasPermission) return;

    try {
      const pickerResult = isCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
          });

      if (!pickerResult.canceled) {
        setImage(pickerResult.assets[0].uri);
        setResult(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to pick the image.');
    }
  };

  const processImageUri = async (uri) => {
    if (uri.startsWith('content://')) {
      const destPath = FileSystem.cacheDirectory + `photo_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: uri, to: destPath });
      return destPath;
    }
    return uri;
  };

  const analyzeFruit = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const processedUri = await processImageUri(image);
      const formData = new FormData();
      formData.append('photo', {
        uri: processedUri,
        name: `fruit_analysis_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
      const response = await fetch('http://192.168.1.17:8000/api/predict/', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const analysisResult = await response.json();
      setResult(analysisResult);
    } catch (error) {
      Alert.alert(
        'Analysis Error',
        'Unable to analyze the image. Please check your connection and try again.'
      );
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
  };

  const onRefresh = () => {
    setRefreshing(true);
    resetAnalysis();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const NutritionCard = ({ icon, label, value, unit = '' }) => (
    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionIcon}>{icon}</Text>
      <Text style={styles.nutritionLabel}>{label}</Text>
      <Text style={styles.nutritionValue}>
        {value} {unit}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Fruit Analyzer</Text>
            <Text style={styles.subtitle}>Identify fruits and their nutritional values</Text>
          </View>

          {/* Image Upload / Preview with placeholder */}
          <View style={styles.previewSection}>
            <Image
              source={image ? { uri: image } : require('../assets/fruit_placeholder.png')}
              style={styles.imagePreview}
            />
            
            {!image ? (
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={[styles.button, styles.primaryButton]}
                  onPress={() => handleImagePick(true)}
                >
                  <Text style={styles.buttonText}>Take a Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => handleImagePick(false)}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.previewActions}>
                <TouchableOpacity 
                  style={[styles.button, styles.analyzeButton]}
                  onPress={analyzeFruit}
                  disabled={loading}
                >
                  <Text style={styles.buttonIcon}>{Icons.Analyze}</Text>
                  <Text style={styles.buttonText}>
                    {loading ? 'Analyzing...' : 'Analyze Fruit'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.button, styles.outlineButton]}
                  onPress={resetAnalysis}
                  disabled={loading}
                >
                  <Text style={styles.outlineButtonText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Loading */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9FCC9A" />
              <Text style={styles.loadingText}>Analyzing your fruit...</Text>
            </View>
          )}

          {/* Result Section */}
          {result && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Analysis Results</Text>
              <View style={styles.fruitCard}>
                <View style={styles.fruitHeader}>
                  <Text style={styles.fruitNameLabel}>
                    Fruit Name: <Text style={styles.fruitName}>{result.fruit}</Text>
                  </Text>
                </View>
                <View style={styles.nutritionGrid}>
                  <NutritionCard icon={Icons.Calories} label="Calories" value={result.calories} unit="kcal" />
                  <NutritionCard icon={Icons.Carbs} label="Carbs" value={result.carbs} unit="g" />
                  <NutritionCard icon={Icons.Protein} label="Protein" value={result.protein} unit="g" />
                </View>
              </View>
              <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={resetAnalysis}>
                <Text style={styles.outlineButtonText}>Analyze Another Fruit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab('Camera')}>
          <View style={activeTab === 'Camera' ? styles.activeIconContainer : null}>
            <Ionicons name="camera-outline" size={24} color={activeTab === 'Camera' ? '#fff' : '#333'} />
          </View>
          <Text style={activeTab === 'Camera' ? styles.activeMenuText : styles.menuText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveTab('Home'); navigation.navigate('Home'); }}>
          <View style={activeTab === 'Home' ? styles.activeIconContainer : null}>
            <Ionicons name="home-outline" size={24} color={activeTab === 'Home' ? '#fff' : '#333'} />
          </View>
          <Text style={activeTab === 'Home' ? styles.activeMenuText : styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveTab('Profile'); navigation.navigate('Profile'); }}>
          <View style={activeTab === 'Profile' ? styles.activeIconContainer : null}>
            <Ionicons name="person-outline" size={24} color={activeTab === 'Profile' ? '#fff' : '#333'} />
          </View>
          <Text style={activeTab === 'Profile' ? styles.activeMenuText : styles.menuText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F8FAFC', paddingBottom: 100 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: '100%', paddingHorizontal: 20, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  headerIcon: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 22 },
  previewSection: { width: '100%', alignItems: 'center' },
  imagePreview: { width: 280, height: 280, borderRadius: 20, marginBottom: 24, borderWidth: 4, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width:0, height:6 }, shadowOpacity:0.1, shadowRadius:12, elevation:6 },
  buttonGroup: { gap: 12, width: '100%' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16, gap: 12, marginBottom: 12 },
  primaryButton: { backgroundColor: '#9FCC9A' },
  secondaryButton: { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E2E8F0' },
  analyzeButton: { backgroundColor: '#9FCC9A' },
  outlineButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#E2E8F0' },
  buttonIcon: { fontSize: 20 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { color: '#9FCC9A' },
  outlineButtonText: { color: '#64748B', fontSize: 16, fontWeight: '600' },
  previewActions: { width: '100%' },
  loadingContainer: { alignItems: 'center', paddingVertical: 40, gap: 16 },
  loadingText: { fontSize: 16, color: '#64748B', fontWeight: '500' },
  resultsSection: { width: '100%', alignItems: 'center', marginTop: 20 },
  resultsTitle: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginBottom: 24 },
  fruitCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, width: '100%', marginBottom: 24, shadowColor: '#000', shadowOffset: { width:0, height:6 }, shadowOpacity:0.1, shadowRadius:12, elevation:6 },
  fruitHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  fruitNameLabel: { fontSize: 18, color: '#64748B', fontWeight: '600' },
  fruitName: { fontSize: 20, fontWeight: '700', color: '#1E293B', textTransform: 'capitalize' },
  nutritionGrid: { gap: 12 },
  nutritionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, gap: 12 },
  nutritionIcon: { fontSize: 20, width: 24, textAlign: 'center' },
  nutritionLabel: { fontSize: 16, color: '#64748B', flex: 1 },
  nutritionValue: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
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
    shadowOffset: { width:0, height:4 },
    shadowRadius: 6,
    elevation: 6,
  },
  activeMenuText: { color: '#333', fontWeight: '700' },
});

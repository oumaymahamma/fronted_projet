import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Animated,
  TouchableOpacity,
  Dimensions,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Alert = ({ 
  visible, 
  message, 
  type = 'info',
  title,
  onClose, 
  duration = 5000,
  position = 'top',
  showClose = true,
  showIcon = true
}) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      progressAnim.setValue(0);

      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        })
      ]).start();

      // Progress bar animation
      if (duration > 0) {
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: duration - 300,
          useNativeDriver: false,
          easing: Easing.linear
        }).start();
      }

      // Auto close
      if (duration > 0) {
        const timer = setTimeout(handleClose, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, duration]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic)
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic)
      })
    ]).start(() => {
      onClose?.();
    });
  };

  if (!visible) return null;

  const getAlertConfig = () => {
    const configs = {
      success: {
        backgroundColor: '#10B981',
        gradient: ['#10B981', '#059669'],
        icon: 'checkmark-circle',
        title: 'Success',
        iconColor: '#fff'
      },
      error: {
        backgroundColor: '#EF4444',
        gradient: ['#EF4444', '#DC2626'],
        icon: 'close-circle',
        title: 'Error',
        iconColor: '#fff'
      },
      warning: {
        backgroundColor: '#F59E0B',
        gradient: ['#F59E0B', '#D97706'],
        icon: 'warning',
        title: 'Warning',
        iconColor: '#fff'
      },
      info: {
        backgroundColor: '#3B82F6',
        gradient: ['#3B82F6', '#2563EB'],
        icon: 'information-circle',
        title: 'Information',
        iconColor: '#fff'
      }
    };
    return configs[type] || configs.info;
  };

  const config = getAlertConfig();
  const alertTitle = title || config.title;

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { top: 60 };
      case 'bottom':
        return { bottom: 30 };
      case 'center':
        return { top: height / 2 - 100 };
      default:
        return { top: 60 };
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.alertContainer,
            getPositionStyle(),
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.alert, { backgroundColor: config.backgroundColor }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                {showIcon && (
                  <Ionicons 
                    name={config.icon} 
                    size={22} 
                    color={config.iconColor} 
                    style={styles.icon} 
                  />
                )}
                <Text style={styles.alertTitle}>{alertTitle}</Text>
              </View>
              
              {showClose && (
                <TouchableOpacity 
                  onPress={handleClose} 
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            {/* Message */}
            <Text style={styles.alertMessage}>{message}</Text>

            {/* Progress Bar */}
            {duration > 0 && (
              <View style={styles.progressBarContainer}>
                <Animated.View 
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]} 
                />
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  alertContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  alert: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  alertTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: -2,
  },
  alertMessage: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.1,
    opacity: 0.95,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
  },
});

export default Alert;
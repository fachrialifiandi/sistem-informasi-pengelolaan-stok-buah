import React, { createContext, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null); // { title, body }
  const slideAnim = useRef(new Animated.Value(-150)).current;

  const showNotification = (title, body) => {
    setNotification({ title, body });
    // Slide down
    Animated.spring(slideAnim, {
      toValue: 20, // Slide below status bar
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      dismissNotification();
    }, 4500);
  };

  const dismissNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -150,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(null);
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Animated.View
          style={[
            styles.bannerContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={dismissNotification}
            style={styles.banner}
          >
            {/* WhatsApp App Badge Header */}
            <View style={styles.header}>
              <View style={styles.appIconContainer}>
                <Feather name="bell" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.appName}>STOCK FRUIT</Text>
              <Text style={styles.timeText}>sekarang</Text>
            </View>

            {/* Notification Body */}
            <View style={styles.bodyContainer}>
              <Text style={styles.titleText}>{notification.title}</Text>
              <Text style={styles.bodyText} numberOfLines={2}>{notification.body}</Text>
            </View>

            {/* Pull-down Bar */}
            <View style={styles.bar} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 30, // Safely below status bar
    left: 12,
    right: 12,
    zIndex: 9999,
    elevation: 10,
  },
  banner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#ECEEF0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  appIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#006C49',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  appName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#006C49',
    letterSpacing: 1,
    flex: 1,
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  bodyContainer: {
    paddingLeft: 4,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  bodyText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  bar: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 4,
  }
});

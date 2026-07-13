import React from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen() {
  return (
    <View className="flex-1 bg-[#006C49] justify-center items-center px-6">
      <StatusBar style="light" />
      
      {/* Centered Logo Container */}
      <View className="items-center">
        {/* Outer Glowing Circle */}
        <View className="bg-white/10 p-5 rounded-full border border-white/20 shadow-2xl">
          {/* Inner Card (White circle with green leaf icon matching Dashboard) */}
          <View className="bg-white w-28 h-28 rounded-full items-center justify-center shadow-lg">
            <MaterialIcons name="eco" size={60} color="#006C49" />
          </View>
        </View>

        {/* App Title */}
        <Text className="text-[32px] font-bold text-white tracking-wide mt-6">
          Stock Fruit
        </Text>

        {/* Subtitle / Tagline */}
        <Text className="text-[#A2E9C1] text-sm font-medium text-center px-4 leading-5 mt-1">
          Sistem Pengelolaan Stok Buah Real-time & Segar
        </Text>
      </View>

      {/* Loading Indicator at the bottom */}
      <View className="absolute bottom-16 items-center">
        <ActivityIndicator size="small" color="#A2E9C1" className="mb-3" />
        <Text className="text-[#A2E9C1]/60 text-[10px] tracking-widest uppercase">
          Memuat Sistem
        </Text>
      </View>
    </View>
  );
}

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { inventoryService } from '../services/inventory.service';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function AddFruitScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [initialStock, setInitialStock] = useState('0.0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!sku.trim() || !name.trim()) {
      Alert.alert("Input Invalid", "Fruit ID dan Nama Buah wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryService.addFruit({
        sku: sku.trim(),
        name: name.trim(),
        initialStock: initialStock
      });

      Alert.alert("Berhasil", "Buah baru berhasil ditambahkan!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Gagal", error.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        className="flex-1"
      >
        {/* Top App Bar */}
        <View className="flex-row justify-between items-center px-5 pt-3 pb-2 bg-[#F7F9FB] dark:bg-[#121212] shadow-sm z-10 border-b border-gray-100 dark:border-gray-800">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              activeOpacity={0.6}
              className="w-10 h-10 rounded-full items-center justify-center bg-[#ECEEF0] dark:bg-[#2D3133]"
            >
              <MaterialIcons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#4EDEA3' : '#006C49'} />
            </TouchableOpacity>
            <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Tambah Buah</Text>
          </View>
          <View className="w-10 h-10" />
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 60 }} 
          className="flex-grow px-5 pt-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white dark:bg-[#1E1E1E] rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">

            {/* Form Fields */}
            <View className="space-y-4">
              {/* Fruit ID */}
              <View>
                <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">Fruit ID</Text>
                <TextInput
                  placeholder="e.g., FR-001"
                  placeholderTextColor={colorScheme === 'dark' ? '#6C7A71' : '#BBCABF'}
                  value={sku}
                  onChangeText={setSku}
                  className="w-full bg-gray-50 dark:bg-[#2D3133] rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-white border border-gray-200 dark:border-gray-850"
                />
              </View>

              {/* Fruit Name */}
              <View>
                <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">Fruit Name</Text>
                <TextInput
                  placeholder="e.g., Pink Lady Apple"
                  placeholderTextColor={colorScheme === 'dark' ? '#6C7A71' : '#BBCABF'}
                  value={name}
                  onChangeText={setName}
                  className="w-full bg-gray-50 dark:bg-[#2D3133] rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-white border border-gray-200 dark:border-gray-850"
                />
              </View>

              {/* Initial Stock */}
              <View>
                <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">Initial Stock</Text>
                <View className="relative">
                  <TextInput
                    placeholder="0.0"
                    placeholderTextColor={colorScheme === 'dark' ? '#6C7A71' : '#BBCABF'}
                    keyboardType="numeric"
                    value={initialStock}
                    onChangeText={setInitialStock}
                    className="w-full bg-gray-50 dark:bg-[#2D3133] rounded-lg pl-4 pr-12 py-3 text-sm text-gray-800 dark:text-white border border-gray-200 dark:border-gray-850"
                  />
                  <Text className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">kg</Text>
                </View>
              </View>
            </View>

            {/* Spacer */}
            <View className="py-4" />

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#006C49] dark:bg-[#006C49] py-3.5 rounded-full shadow-lg shadow-[#006C49]/20 flex-row items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <MaterialIcons name="save" size={20} color="white" />
                  <Text className="text-white font-bold text-base">Save Fruit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

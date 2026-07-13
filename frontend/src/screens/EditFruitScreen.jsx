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

export default function EditFruitScreen({ route, navigation }) {
  const { colorScheme } = useColorScheme();
  const { fruit } = route.params; // Expecting { id_buah, sku, nama_buah, current_stock }

  const [name, setName] = useState(fruit.nama_buah);
  const [stock, setStock] = useState(String(fruit.current_stock));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incrementStock = () => {
    setStock(prev => {
      const parsed = parseFloat(prev) || 0;
      return String(parseFloat((parsed + 1).toFixed(1)));
    });
  };

  const decrementStock = () => {
    setStock(prev => {
      const parsed = parseFloat(prev) || 0;
      const next = parsed - 1;
      return next >= 0 ? String(parseFloat(next.toFixed(1))) : '0';
    });
  };

  const handleStockChange = (val) => {
    // Sanitize input to only permit numbers and decimals
    let sanitized = val.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    setStock(sanitized);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Input Invalid", "Nama Buah wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryService.updateFruit(fruit.id_buah, {
        name: name.trim(),
        stock: stock
      });

      Alert.alert("Berhasil", "Data buah berhasil diperbarui!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Gagal", error.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus produk "${fruit.nama_buah}" dari inventaris? Tindakan ini tidak dapat dibatalkan.`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: executeDelete 
        }
      ]
    );
  };

  const executeDelete = async () => {
    setIsSubmitting(true);
    try {
      await inventoryService.deleteFruit(fruit.id_buah);
      Alert.alert("Berhasil", "Produk berhasil dihapus dari inventaris.", [
        { text: "OK", onPress: () => navigation.popToTop() }
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
            <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Edit Data Buah</Text>
          </View>
          <View className="w-10 h-10" />
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 60 }} 
          className="flex-grow px-5 pt-6"
          keyboardShouldPersistTaps="handled"
        >


          {/* Form Fields */}
          <View className="bg-white dark:bg-[#1E1E1E] rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            
            {/* Fruit ID (Read Only) */}
            <View className="space-y-1">
              <Text className="text-xs font-semibold text-gray-500 px-1">Fruit ID</Text>
              <View className="flex-row items-center bg-[#E6E8EA]/50 dark:bg-[#2D3133]/50 rounded-lg px-4 h-12 border border-gray-200 dark:border-gray-800 opacity-80">
                <MaterialIcons name="fingerprint" size={20} color="#6C7A71" style={{ marginRight: 10 }} />
                <TextInput
                  editable={false}
                  value={fruit.sku}
                  className="flex-1 text-sm font-semibold text-gray-450 dark:text-gray-500 p-0"
                />
              </View>
              <Text className="text-[10px] text-gray-400 italic px-1">ID unik tidak dapat diubah</Text>
            </View>

            {/* Fruit Name */}
            <View className="space-y-1">
              <Text className="text-xs font-semibold text-gray-500 px-1">Nama Buah</Text>
              <View className="flex-row items-center bg-gray-50 dark:bg-[#2D3133] rounded-lg px-4 h-12 border border-gray-205 dark:border-gray-850">
                <MaterialIcons name="spa" size={20} color="#6C7A71" style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="Masukkan nama buah"
                  placeholderTextColor={colorScheme === 'dark' ? '#6C7A71' : '#BBCABF'}
                  value={name}
                  onChangeText={setName}
                  className="flex-1 text-sm font-semibold text-gray-800 dark:text-white p-0"
                />
              </View>
            </View>

            {/* Current Stock */}
            <View className="space-y-1">
              <Text className="text-xs font-semibold text-gray-500 px-1">Stok Saat Ini (kg)</Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 flex-row items-center bg-gray-50 dark:bg-[#2D3133] rounded-lg px-4 h-12 border border-gray-205 dark:border-gray-850">
                  <MaterialIcons name="scale" size={20} color="#6C7A71" style={{ marginRight: 10 }} />
                  <TextInput
                    keyboardType="numeric"
                    placeholder="0.0"
                    value={stock}
                    onChangeText={handleStockChange}
                    className="flex-1 text-sm font-semibold text-gray-800 dark:text-white p-0"
                  />
                </View>

                {/* Toggles */}
                <View className="flex-row bg-gray-100 dark:bg-[#2D3133] rounded-lg p-0.5 gap-1 items-center border border-gray-200 dark:border-gray-800">
                  <TouchableOpacity 
                    onPress={decrementStock}
                    className="w-10 h-10 items-center justify-center rounded-lg bg-white dark:bg-[#1E1E1E] shadow-sm active:scale-95"
                  >
                    <MaterialIcons name="remove" size={18} color="#006C49" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={incrementStock}
                    className="w-10 h-10 items-center justify-center rounded-lg bg-[#006C49] active:scale-95"
                  >
                    <MaterialIcons name="add" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Info Helper Box */}
          <View className="flex-row items-start gap-3 p-4 bg-[#FFDBCA] dark:bg-[#783200]/20 rounded-xl mt-5 border border-[#FFDBCA]/10">
            <MaterialIcons name="info" size={18} color="#9D4300" />
            <Text className="flex-1 text-xs font-semibold text-[#341100] dark:text-[#FFDBCA] leading-4">
              Perubahan data stok akan langsung diperbarui di sistem inventaris utama dan dashboard penjualan.
            </Text>
          </View>

          {/* Save Button */}
          <View className="pt-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#006C49] py-3.5 rounded-full shadow-lg shadow-[#006C49]/20 flex-row items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <MaterialIcons name="save" size={20} color="white" />
                  <Text className="text-white font-bold text-base">Simpan Perubahan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Delete Button */}
          <View className="pt-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDelete}
              disabled={isSubmitting}
              className="w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 py-3.5 rounded-full flex-row items-center justify-center gap-2 active:scale-95"
            >
              <MaterialIcons name="delete-forever" size={20} color="#BA1A1A" />
              <Text className="text-[#BA1A1A] font-bold text-base">Hapus Produk</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import React, { useState, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { inventoryService } from '../services/inventory.service';
import { getFruitEmoji } from '../utils/fruit';
import { StatusBar } from 'expo-status-bar';

export default function StockOutScreen({ navigation }) {
  const [fruits, setFruits] = useState([]);
  const [filteredFruits, setFilteredFruits] = useState([]);
  
  // State untuk menyimpan angka desimal
  const [selectedQuantities, setSelectedQuantities] = useState({}); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Form Stok Keluar
  const [exitReason, setExitReason] = useState('dibeli'); // 'dibeli' atau 'dibuang'
  const [exitDate, setExitDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set tanggal hari ini
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    setExitDate(`${dd}/${mm}/${yyyy}`);

    // Ambil data inventory
    inventoryService.getInventory().then((invData) => {
      setFruits(invData);
      setFilteredFruits(invData);
      
      const initialQtys = {};
      invData.forEach(f => {
        initialQtys[f.id_buah] = "0"; 
      });
      setSelectedQuantities(initialQtys);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredFruits(fruits);
    } else {
      setFilteredFruits(
        fruits.filter(f => f.nama_buah.toLowerCase().includes(text.toLowerCase()))
      );
    }
  };

  // Logika ditambah 1
  const incrementQty = (id_buah) => {
    setSelectedQuantities(prev => {
      const current = parseFloat(prev[id_buah]) || 0;
      return {
        ...prev,
        [id_buah]: String(parseFloat((current + 1).toFixed(2)))
      };
    });
  };

  // Logika dikurang 1
  const decrementQty = (id_buah) => {
    setSelectedQuantities(prev => {
      const current = parseFloat(prev[id_buah]) || 0;
      const next = current - 1;
      return {
        ...prev,
        [id_buah]: next > 0 ? String(parseFloat(next.toFixed(2))) : "0"
      };
    });
  };

  // Logika input desimal & UX perbaikan angka 0
  const handleQtyChange = (id_buah, value) => {
    let sanitized = value.replace(/[^0-9.]/g, '');
    
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    if (sanitized === "") {
      sanitized = "0";
    } else if (sanitized.length > 1 && sanitized.startsWith('0') && !sanitized.startsWith('0.')) {
      sanitized = sanitized.replace(/^0+/, '');
    }

    // Validasi agar tidak melebihi stok yang ada
    const fruitData = fruits.find(f => f.id_buah === id_buah);
    const parsedValue = parseFloat(sanitized) || 0;
    
    if (fruitData && parsedValue > fruitData.current_stock) {
      Alert.alert("Stok Tidak Cukup", `Sisa stok ${fruitData.nama_buah} hanya ${fruitData.current_stock} kg.`);
      sanitized = String(fruitData.current_stock);
    }

    setSelectedQuantities(prev => ({
      ...prev,
      [id_buah]: sanitized
    }));
  };

  const selectedItemsList = fruits.filter(f => (parseFloat(selectedQuantities[f.id_buah]) || 0) > 0);
  const totalWeight = selectedItemsList.reduce((sum, item) => sum + (parseFloat(selectedQuantities[item.id_buah]) || 0), 0);

  const handleSubmit = async () => {
    if (selectedItemsList.length === 0) {
      Alert.alert("Input Invalid", "Silakan masukkan jumlah untuk minimal satu buah yang akan dikeluarkan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsPayload = selectedItemsList.map(item => ({
        id_buah: item.id_buah,
        jumlah: parseFloat(selectedQuantities[item.id_buah])
      }));

      await inventoryService.postOutgoingStock({
        items: itemsPayload,
        reason: exitReason,
        notes: notes.trim()
      });

      Alert.alert("Berhasil", "Data stok keluar berhasil dicatat dan inventaris telah diperbarui!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Gagal", error.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB]">
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        className="flex-1"
      >
        {/* Top Header Navigation */}
        <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-50">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              onPress={() => navigation.navigate('InventoryList')}
              className="p-1 rounded-full active:scale-90"
            >
              <Feather name="arrow-left" size={22} color="#006C49" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-[#006C49]">Stok Keluar</Text>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#006C49" />
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={{ paddingBottom: 40 }}
            className="px-6 pt-5"
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Text */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-800">Kelola Stok Keluar</Text>
              <Text className="text-sm text-gray-500 mt-1">Catat pengeluaran stok buah secara massal.</Text>
            </View>

            {/* Search Input */}
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-6 border border-transparent focus:border-[#10b981]">
              <Feather name="search" size={16} color="#6C7A71" />
              <TextInput
                className="flex-1 bg-transparent border-none py-1 px-2.5 text-[14px]"
                placeholder="Cari buah..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {/* List of Fruits */}
            <Text className="text-base font-bold text-gray-800 mb-3">Pilih Buah</Text>
            <View className="mb-6 space-y-4">
              {filteredFruits.map((item) => {
                const currentQty = selectedQuantities[item.id_buah] || "0";

                return (
                  <View 
                    key={item.id_buah}
                    className="bg-white rounded-2xl p-4 shadow-[0px_4px_20px_rgba(0,108,73,0.03)] border border-gray-100 flex-row gap-4 items-center"
                  >
                    <View className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-[#2D3133] items-center justify-center">
                      <Text className="text-[32px]">{getFruitEmoji(item.nama_buah)}</Text>
                    </View>

                    <View className="flex-1">
                      <View className="flex-row justify-between items-start">
                        <Text className="text-[15px] font-bold text-gray-800">{item.nama_buah}</Text>
                        <View className="bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                          <Text className="text-[9px] font-bold text-[#006C49] uppercase">Tersedia</Text>
                        </View>
                      </View>
                      
                      <Text className="text-xs text-gray-500 mt-1">
                        Sisa: <Text className="font-semibold text-gray-700">{item.current_stock} kg</Text>
                      </Text>

                      <View className="flex-row items-center justify-between mt-3">
                        <View className="flex-row items-center bg-gray-50 rounded-full px-2 py-0.5 border border-gray-200">
                          <TouchableOpacity 
                            onPress={() => decrementQty(item.id_buah)}
                            className="w-7 h-7 rounded-full items-center justify-center bg-white border border-gray-100 active:scale-90"
                          >
                            <Feather name="minus" size={14} color="#006C49" />
                          </TouchableOpacity>

                          <TextInput
                            keyboardType="decimal-pad"
                            className="w-12 text-center font-bold text-[#006C49] text-xs p-0 m-0"
                            value={currentQty === "0" ? "" : String(currentQty)}
                            placeholder="0"
                            placeholderTextColor="#006C49"
                            onChangeText={(val) => handleQtyChange(item.id_buah, val)}
                          />

                          <TouchableOpacity 
                            onPress={() => incrementQty(item.id_buah)}
                            className="w-7 h-7 rounded-full items-center justify-center bg-white border border-gray-100 active:scale-90"
                          >
                            <Feather name="plus" size={14} color="#006C49" />
                          </TouchableOpacity>
                        </View>
                        <Text className="text-[11px] text-gray-400">Unit: kg</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Rincian Stok Keluar Summary Card */}
            <View className="bg-white rounded-2xl p-5 shadow-md shadow-gray-200 border border-gray-100 mt-2">
              <Text className="text-[16px] font-bold text-gray-800 mb-4">Rincian Stok Keluar</Text>

              {/* Alasan Keluar (Radio Buttons Kustom) */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-gray-500 mb-2 ml-1">Alasan Keluar</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => setExitReason('dibeli')}
                    className={`flex-1 p-3 rounded-xl border flex-col items-center justify-center gap-1 ${exitReason === 'dibeli' ? 'bg-[#10B981]/10 border-[#10B981]' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <MaterialIcons name="shopping-cart" size={20} color={exitReason === 'dibeli' ? '#006C49' : '#6C7A71'} />
                    <Text className={`text-[12px] font-bold ${exitReason === 'dibeli' ? 'text-[#006C49]' : 'text-[#6C7A71]'}`}>Dibeli</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => setExitReason('dibuang')}
                    className={`flex-1 p-3 rounded-xl border flex-col items-center justify-center gap-1 ${exitReason === 'dibuang' ? 'bg-[#BA1A1A]/10 border-[#BA1A1A]' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <MaterialIcons name="delete-outline" size={20} color={exitReason === 'dibuang' ? '#BA1A1A' : '#6C7A71'} />
                    <Text className={`text-[12px] font-bold ${exitReason === 'dibuang' ? '#BA1A1A' : 'text-[#6C7A71]'}`}>Dibuang</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Input */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">Tanggal Keluar</Text>
                <View className="bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-200 flex-row justify-between items-center">
                  <TextInput
                    className="text-sm font-semibold text-gray-800 flex-1 p-0"
                    value={exitDate}
                    onChangeText={setExitDate}
                  />
                  <Feather name="calendar" size={16} color="#6C7A71" />
                </View>
              </View>

              {/* Notes Input */}
              <View className="mb-5">
                <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">Catatan Tambahan (Opsional)</Text>
                <View className="bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-200">
                  <TextInput
                    className="text-sm text-gray-800 p-0 text-left"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholder="Contoh: Barang cacat atau terjual offline"
                    placeholderTextColor="#BBCABF"
                    value={notes}
                    onChangeText={setNotes}
                  />
                </View>
              </View>

              {/* Summary Items list */}
              <View className="border-y border-gray-100 py-4 mb-4">
                {selectedItemsList.length === 0 ? (
                  <Text className="text-xs italic text-gray-400 ml-1">Belum ada item dipilih</Text>
                ) : (
                  selectedItemsList.map(item => (
                    <View key={item.id_buah} className="flex-row justify-between items-center mb-2 ml-1">
                      <Text className="text-sm font-medium text-gray-700">{item.nama_buah}</Text>
                      <Text className="text-sm font-bold text-[#006C49]">{parseFloat(selectedQuantities[item.id_buah]) || 0} kg</Text>
                    </View>
                  ))
                )}
              </View>

              {/* Total Weight Display */}
              <View className="flex-row justify-between items-end mb-6">
                <View>
                  <Text className="text-[10px] text-gray-400 uppercase tracking-wider">Total Stok Keluar</Text>
                  <Text className="text-2xl font-bold text-[#006C49]">{totalWeight.toFixed(2).replace(/\.00$/, '')} kg</Text>
                </View>
                <MaterialIcons name="outbox" size={32} color="#006C49" />
              </View>

              {/* Submit CTA button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#006C49] py-3.5 rounded-full shadow-lg shadow-[#006C49]/20 flex-row items-center justify-center"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Feather name="save" size={18} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-base">Konfirmasi Stok Keluar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
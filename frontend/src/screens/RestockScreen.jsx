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
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { inventoryService } from '../services/inventory.service';
import { getFruitEmoji } from '../utils/fruit';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

export default function RestockScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const [fruits, setFruits] = useState([]);
  const [filteredFruits, setFilteredFruits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  // State untuk menyimpan angka desimal
  const [selectedQuantities, setSelectedQuantities] = useState({}); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Dropdown Supplier
  const [selectedSupplierId, setSelectedSupplierId] = useState(1);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  
  const [restockDate, setRestockDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    setRestockDate(`${dd}/${mm}/${yyyy}`);

    Promise.all([
      inventoryService.getInventory(),
      inventoryService.getSuppliers()
    ]).then(([invData, suppData]) => {
      setFruits(invData);
      setFilteredFruits(invData);
      setSuppliers(suppData);
      
      const initialQtys = {};
      invData.forEach(f => {
        initialQtys[f.id_buah] = "0"; // Inisialisasi sebagai string
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

const handleQtyChange = (id_buah, value) => {
    // Hanya izinkan angka dan titik
    let sanitized = value.replace(/[^0-9.]/g, '');
    
    // Mencegah lebih dari satu titik diketik
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    // Jika input dihapus sampai habis, kembalikan ke "0"
    if (sanitized === "") {
      sanitized = "0";
    } 
    // Mencegah angka seperti "05", otomatis ubah menjadi "5"
    else if (sanitized.length > 1 && sanitized.startsWith('0') && !sanitized.startsWith('0.')) {
      sanitized = sanitized.replace(/^0+/, '');
    }

    setSelectedQuantities(prev => ({
      ...prev,
      [id_buah]: sanitized
    }));
  };

  const selectedItemsList = fruits.filter(f => (parseFloat(selectedQuantities[f.id_buah]) || 0) > 0);
  const totalWeight = selectedItemsList.reduce((sum, item) => sum + (parseFloat(selectedQuantities[item.id_buah]) || 0), 0);

  const getBadgeStyle = (status) => {
    switch (status) {
      case "Out of Stock":
        return { bg: "bg-red-100", text: "text-red-600", label: "Habis" };
      case "Low Stock":
        return { bg: "bg-orange-100", text: "text-[#9d4300]", label: "Stok Rendah" };
      default:
        return { bg: "bg-green-100", text: "text-[#446900]", label: "Stok Aman" };
    }
  };

  const handleSubmit = async () => {
    if (selectedItemsList.length === 0) {
      Alert.alert("Input Invalid", "Silakan tambahkan kuantitas restok minimal untuk satu buah.");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsPayload = selectedItemsList.map(item => ({
        id_buah: item.id_buah,
        jumlah: parseFloat(selectedQuantities[item.id_buah])
      }));

      await inventoryService.postRestock({
        id_supplier: selectedSupplierId,
        items: itemsPayload
      });

      Alert.alert("Berhasil", "Data Restok berhasil dikonfirmasi dan stok telah diperbarui!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Gagal", error.message || "Terjadi kesalahan sistem.");
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
              onPress={() => navigation.navigate("InventoryList")} 
              activeOpacity={0.6}
              className="w-10 h-10 rounded-full items-center justify-center bg-[#ECEEF0] dark:bg-[#2D3133]"
            >
              <MaterialIcons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#4EDEA3' : '#006C49'} />
            </TouchableOpacity>
            <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Restok Buah</Text>
          </View>
          
          {/* Visual Balance Placeholder */}
          <View className="w-10 h-10" />
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
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-6 border border-transparent focus:border-[#10b981]">
              <Feather name="search" size={16} color="#6C7A71" />
              <TextInput
                className="flex-1 bg-transparent border-none py-1 px-2.5 text-[14px]"
                placeholder="Cari buah yang ingin di restok..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            <Text className="text-base font-bold text-gray-800 mb-3">Pilih Buah</Text>
            <View className="mb-6 space-y-4">
              {filteredFruits.map((item) => {
                const badge = getBadgeStyle(item.status);
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
                        <View className={`px-2 py-0.5 rounded-full ${badge.bg}`}>
                          <Text className={`text-[9px] font-bold ${badge.text}`}>{badge.label}</Text>
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
                              // Logika ajaib: Jika nilainya "0", kosongkan value agar placeholder muncul
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

            <View className="bg-white rounded-2xl p-5 shadow-md shadow-gray-200 border border-gray-100 mt-2 z-50">
              <Text className="text-[16px] font-bold text-gray-800 mb-4">Rincian Restok</Text>

              {/* FITUR DROPDOWN PEMASOK */}
              <View className="mb-4 relative z-50">
                <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">Pilih Pemasok</Text>
                
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => setIsSupplierDropdownOpen(!isSupplierDropdownOpen)}
                  className="bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-200 flex-row justify-between items-center"
                >
                  <Text className="text-sm font-semibold text-gray-800">
                    {suppliers.find(s => s.id_supplier === selectedSupplierId)?.nama_supplier || "Pilih Pemasok"}
                  </Text>
                  <Feather name={isSupplierDropdownOpen ? "chevron-up" : "chevron-down"} size={18} color="#6C7A71" />
                </TouchableOpacity>

                {/* List Dropdown */}
                {isSupplierDropdownOpen && (
                  <View className="absolute top-[68px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {suppliers.map((s) => (
                      <TouchableOpacity 
                        key={s.id_supplier}
                        onPress={() => {
                          setSelectedSupplierId(s.id_supplier);
                          setIsSupplierDropdownOpen(false);
                        }}
                        className={`px-4 py-3.5 border-b border-gray-50 flex-row items-center justify-between ${selectedSupplierId === s.id_supplier ? 'bg-[#006C49]/10' : 'bg-white'}`}
                      >
                        <Text className={`text-sm ${selectedSupplierId === s.id_supplier ? 'font-bold text-[#006C49]' : 'font-medium text-gray-700'}`}>
                          {s.nama_supplier}
                        </Text>
                        {selectedSupplierId === s.id_supplier && <Feather name="check" size={16} color="#006C49" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View className="mb-5 relative -z-10">
                <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">Tanggal Restok</Text>
                <View className="bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-200 flex-row justify-between items-center">
                  <TextInput
                    className="text-sm font-semibold text-gray-800 flex-1 p-0"
                    value={restockDate}
                    onChangeText={setRestockDate}
                  />
                  <Feather name="calendar" size={16} color="#6C7A71" />
                </View>
              </View>

              <View className="border-b border-gray-100 pb-4 mb-4 relative -z-10">
                <Text className="text-xs font-semibold text-gray-500 mb-2">Item Terpilih:</Text>
                {selectedItemsList.length === 0 ? (
                  <Text className="text-xs italic text-gray-400 ml-1">Belum ada item dipilih</Text>
                ) : (
                  selectedItemsList.map(item => (
                    <View key={item.id_buah} className="flex-row justify-between items-center mb-2 ml-1">
                      <Text className="text-xs font-semibold text-gray-700">{item.nama_buah}</Text>
                      <Text className="text-xs font-bold text-[#006C49]">{parseFloat(selectedQuantities[item.id_buah]) || 0} kg</Text>
                    </View>
                  ))
                )}
              </View>

              <View className="flex-row justify-between items-end mb-6 relative -z-10">
                <View>
                  <Text className="text-[10px] text-gray-400 uppercase tracking-wider">Estimasi Total Berat</Text>
                  <Text className="text-2xl font-bold text-[#006C49]">{totalWeight.toFixed(2).replace(/\.00$/, '')} kg</Text>
                </View>
                <Feather name="truck" size={24} color="#006C49" />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#006C49] py-3.5 rounded-full shadow-lg shadow-[#006C49]/20 flex-row items-center justify-center relative -z-10"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-bold text-base">Konfirmasi Data</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

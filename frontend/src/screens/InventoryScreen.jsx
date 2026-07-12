import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  FlatList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { inventoryService } from '../services/inventory.service';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

export default function InventoryScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch inventory data whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setIsLoading(true);
      
      inventoryService.getInventory().then((data) => {
        if (isMounted) {
          setInventory(data);
          // Apply existing search filter
          if (searchQuery) {
            setFilteredInventory(data.filter(item => 
              item.nama_buah.toLowerCase().includes(searchQuery.toLowerCase())
            ));
          } else {
            setFilteredInventory(data);
          }
          setIsLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
    }, [searchQuery])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item => 
          item.nama_buah.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "High Stock":
        return {
          bg: "bg-[#78b300]/10",
          text: "text-[#446900]",
          border: ""
        };
      case "Low Stock":
        return {
          bg: "bg-[#fd761a]/10",
          text: "text-[#9d4300]",
          border: "border border-[#fd761a]/30"
        };
      case "Out of Stock":
        return {
          bg: "bg-gray-100",
          text: "text-gray-500",
          border: "border border-gray-200"
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Top App Bar */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-2 bg-[#F7F9FB] dark:bg-[#121212] shadow-sm z-10 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-[#006C49] dark:bg-[#004F32] items-center justify-center shadow-sm shadow-[#006C49]/10">
             <MaterialIcons name="eco" size={22} color="white" />
          </View>
          <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Stock Fruit</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Setting')} 
          activeOpacity={0.6}
          className="w-10 h-10 rounded-full items-center justify-center bg-[#ECEEF0] dark:bg-[#2D3133]"
        >
          <MaterialIcons name="settings" size={24} color={colorScheme === 'dark' ? '#4EDEA3' : '#006C49'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-6 pt-5">
        {/* Header Title */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Inventory Management</Text>
        </View>

        {/* Search Bar */}
        <View className="relative mb-6 w-full">
          <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Feather name="search" size={18} color="#6C7A71" />
          </View>
          <TextInput
            className="w-full bg-[#ECEEF0]/60 pl-11 pr-5 py-3 rounded-full text-base focus:border-[#006C49] focus:ring-1 focus:ring-[#006C49]"
            placeholder="Search inventory..."
            placeholderTextColor="#6C7A71"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-5">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Restock')}
          className="flex-1 h-14 bg-white border border-[#D6E4DB] rounded-2xl flex-row items-center justify-center shadow-sm">
          <View className="w-8 h-8 rounded-full bg-[#EAF7F1] items-center justify-center">
            <Feather name="refresh-cw" size={16} color="#006C49" />
          </View>

          <Text className="ml-3 text-[15px] font-semibold text-[#006C49]">
            Restock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddFruit')}
          className="flex-1 h-14 bg-[#006C49] rounded-2xl flex-row items-center justify-center shadow-sm"
        >
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
            <Feather name="plus" size={16} color="#FFFFFF" />
          </View>

          <Text className="ml-3 text-[15px] font-semibold text-white">
            Tambah Buah
          </Text>
        </TouchableOpacity>
      </View>

          <TouchableOpacity
            activeOpacity={0.8}
            // Mengarahkan ke nama screen yang kita daftarkan di Langkah 1
            onPress={() => navigation.navigate('StockOut')}
            className="w-full py-3.5 px-4 bg-[#446900] rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
          >
            <Feather name="log-out" size={16} color="white" />
            <Text className="text-sm font-semibold text-white">Tambahkan Buah Keluar</Text>
          </TouchableOpacity>

        {/* Grid List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#006C49" style={{ marginTop: 20 }} />
        ) : filteredInventory.length === 0 ? (
          <View className="items-center py-10">
            <Feather name="info" size={32} color="#6C7A71" />
            <Text className="text-gray-500 mt-2 text-sm">Tidak ada buah yang cocok.</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {filteredInventory.map((item) => {
              const statusStyle = getStatusStyle(item.status);
              const isOut = item.current_stock === 0;

              return (
                <View 
                  key={item.id_buah}
                  className={`w-[48%] bg-white rounded-2xl p-3.5 mb-4 shadow-[0px_4px_20px_rgba(0,108,73,0.03)] border border-gray-100 relative ${isOut ? 'opacity-70' : ''}`}
                >
                  {/* SKU Badge */}
                  <View className="absolute top-3.5 right-3.5 z-10 bg-white/95 px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                    <Text className="text-[10px] text-gray-500 font-semibold">SKU: {item.sku}</Text>
                  </View>

                  {/* Image */}
                  <View className="h-28 w-full rounded-xl bg-[#ECEEF0]/60 overflow-hidden mb-3">
                    <Image
                      source={{ uri: item.image }}
                      className="w-full h-full object-cover"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Title & Status */}
                  <View className="mb-2">
                    <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                      {item.nama_buah}
                    </Text>
                    <View className={`self-start px-2 py-0.5 rounded-full mt-1 ${statusStyle.bg} ${statusStyle.border}`}>
                      <Text className={`text-[9px] font-bold ${statusStyle.text}`}>{item.status}</Text>
                    </View>
                  </View>

                  {/* Bottom Line Info */}
                  <View className="flex-row justify-between items-end mt-2 pt-2 border-t border-gray-100">
                    <View>
                      <Text className="text-[10px] text-gray-400">Current Stock</Text>
                      <Text className={`text-sm font-bold ${isOut ? 'text-gray-400' : 'text-[#006C49]'}`}>
                        {item.current_stock} <Text className="text-[10px] text-gray-500">kg</Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EditFruit', { fruit: item })}
                      className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 active:scale-90"
                    >
                      <Feather name="edit-2" size={12} color="#006C49" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

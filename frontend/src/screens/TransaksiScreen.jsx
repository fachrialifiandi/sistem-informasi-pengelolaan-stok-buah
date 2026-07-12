import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  FlatList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { inventoryService } from '../services/inventory.service';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransaksiScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transactions list whenever screen is opened
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setIsLoading(true);
      
      inventoryService.getTransactions().then((data) => {
        if (isMounted) {
          setTransactions(data);
          if (searchQuery) {
            setFilteredTransactions(data.filter(t => 
              t.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.id_transaksi.toLowerCase().includes(searchQuery.toLowerCase())
            ));
          } else {
            setFilteredTransactions(data);
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
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter(t => 
          t.supplier_name.toLowerCase().includes(text.toLowerCase()) ||
          t.id_transaksi.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  // Helper to group transactions by date_group ("Hari Ini", "Kemarin", etc.)
  const getGroupedTransactions = () => {
    const groups = {};
    filteredTransactions.forEach(t => {
      if (!groups[t.date_group]) {
        groups[t.date_group] = [];
      }
      groups[t.date_group].push(t);
    });
    return groups;
  };

  const grouped = getGroupedTransactions();

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Top App Bar */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-2 bg-[#F7F9FB] dark:bg-[#121212] shadow-sm z-10 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center gap-3">
          {/* Logo brand icon from Login page leaf style */}
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

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-5 pt-5">
        
        {/* Content Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">Riwayat Transaksi</Text>
          <Text className="text-sm text-gray-500 dark:text-[#8B9990] mt-1">
            Pantau aktivitas restok inventaris buah Anda
          </Text>
        </View>

        {/* Search & Filter Section */}
        <View className="flex-row gap-3 items-center mb-6">
          <View className="flex-1 relative justify-center">
            <MaterialIcons 
              name="search" 
              size={20} 
              color={colorScheme === 'dark' ? '#8B9990' : '#6C7A71'} 
              style={{ position: 'absolute', left: 16, zIndex: 1 }} 
            />
            <TextInput 
              placeholder="Cari pemasok atau ID..." 
              placeholderTextColor={colorScheme === 'dark' ? '#8B9990' : '#BBCABF'}
              value={searchQuery}
              onChangeText={handleSearch}
              className="w-full h-12 pl-11 pr-5 rounded-xl bg-[#F2F4F6] dark:bg-[#2D3133] text-[15px] text-[#191C1E] dark:text-white"
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => Alert.alert("Filter Tanggal", "Filter kalender belum diaktifkan.")}
            activeOpacity={0.7}
            className="w-12 h-12 rounded-xl bg-[#F2F4F6] dark:bg-[#2D3133] items-center justify-center"
          >
            <MaterialIcons name="calendar-today" size={18} color="#6C7A71" />
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#006C49" style={{ marginTop: 20 }} />
        ) : filteredTransactions.length === 0 ? (
          <View className="items-center py-12">
            <MaterialIcons name="receipt" size={32} color="#6C7A71" />
            <Text className="text-gray-400 mt-2 text-sm">Tidak ada transaksi ditemukan.</Text>
          </View>
        ) : (
          Object.keys(grouped).map((groupName) => (
            <View key={groupName} className="mb-5">
              {/* Date Group Heading */}
              <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">
                {groupName}
              </Text>
              
              {/* Transactions in Group */}
              {grouped[groupName].map((item) => {
                const isIncoming = item.type === "incoming";
                const isSuccess = item.status === "Berhasil";
                
                return (
                  <TouchableOpacity
                    key={item.id_transaksi}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
                    className="flex-row items-center p-3.5 bg-white dark:bg-[#1E1E1E] rounded-xl border border-transparent dark:border-gray-800 shadow-sm shadow-gray-200/40 mb-3"
                  >
                    {/* Left Icon Container */}
                    <View className={`w-11 h-11 rounded-lg items-center justify-center mr-3.5 ${isIncoming ? 'bg-[#10B981]/15' : 'bg-[#FD761A]/15'}`}>
                      <MaterialIcons 
                        name={isIncoming ? "archive" : "local-shipping"} 
                        size={20} 
                        color={isIncoming ? "#006C49" : "#9D4300"} 
                      />
                    </View>

                    {/* Middle Details */}
                    <View className="flex-1">
                      <Text className="text-[15px] font-bold text-gray-800 dark:text-white" numberOfLines={1}>
                        {item.supplier_name}
                      </Text>
                      <Text className="text-[12px] text-gray-400 mt-1">
                        {item.time_str} • {item.total_weight} kg
                      </Text>
                    </View>

                    {/* Right Status & Chevron */}
                    <View className="flex-row items-center gap-2">
                      <View className={`px-2.5 py-0.5 rounded-full ${isSuccess ? 'bg-[#10B981]/10' : 'bg-[#FD761A]/10'}`}>
                        <Text className={`text-[10px] font-bold ${isSuccess ? 'text-[#006C49]' : 'text-[#9D4300]'}`}>
                          {item.status}
                        </Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}

        {/* Load More Button */}
        {!isLoading && filteredTransactions.length > 0 && (
          <TouchableOpacity 
            onPress={() => Alert.alert("Muat Lebih Banyak", "Semua riwayat transaksi lokal telah dimuat.")}
            className="py-4 justify-center items-center mt-3"
          >
            <Text className="text-[#006C49] font-bold text-[14px]">Muat lebih banyak</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) on Bottom Right */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('InventoryTab', { screen: 'Restock' })}
        className="fixed absolute bottom-24 right-5 w-14 h-14 bg-[#006C49] dark:bg-[#4EDEA3] rounded-full shadow-lg shadow-[#006C49]/30 items-center justify-center z-40 active:scale-95"
      >
        <MaterialIcons name="add" size={28} color={colorScheme === 'dark' ? '#002113' : 'white'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

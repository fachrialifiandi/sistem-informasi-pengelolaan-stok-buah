import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Switch, 
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingScreen({ navigation }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { logout, user } = useContext(AuthContext);
  
  const [fullName, setFullName] = useState(user?.full_name || 'Pemilik Toko');
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const handleToggleDark = (value) => {
    setIsDarkMode(value);
    toggleColorScheme();
  };

  const handleSaveChanges = () => {
    Alert.alert("Berhasil", "Perubahan profil berhasil disimpan.");
  };

  const handleLogout = () => {
    Alert.alert(
      "Keluar Akun", 
      "Apakah Anda yakin ingin keluar dari aplikasi?", 
      [
        { text: "Batal", style: "cancel" },
        { text: "Keluar", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  const handleBackup = () => {
    Alert.alert("Backup Data", "Backup database berhasil dibuat dan diunggah ke cloud.");
  };

  const handleRestore = () => {
    Alert.alert("Restore Backup", "Fungsionalitas restore cadangan berhasil disimulasikan.");
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset Semua Data",
      "PERINGATAN: Tindakan ini akan menghapus semua database inventaris secara permanen. Apakah Anda yakin?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => Alert.alert("Berhasil", "Database inventaris telah di-reset.") }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
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
          <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Pengaturan</Text>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} className="flex-1 px-5 pt-5">
        
        {/* Header Visual Card */}
        <View className="relative overflow-hidden rounded-2xl bg-[#10B981]/15 p-5 flex-row items-center gap-4 mb-6 border border-[#10B981]/10">
          <View className="bg-white dark:bg-[#2D3133] w-12 h-12 rounded-full flex items-center justify-center shadow-md">
            <MaterialIcons name="settings" size={24} color="#006C49" />
          </View>
          <View className="flex-1 pr-4">
            <Text className="text-base font-bold text-gray-850 dark:text-white">Konfigurasi Sistem</Text>
            <Text className="text-xs text-gray-500 mt-0.5 leading-4">Kelola preferensi dan akun vendor Anda.</Text>
          </View>
        </View>

        {/* Section 1: Akun */}
        <View className="mb-6">
          <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">Akun</Text>
          
          <View className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-4 space-y-4">
            {/* Profil Pengguna Title */}
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-[#006C49]/10 p-1.5 rounded-lg">
                <MaterialIcons name="person" size={18} color="#006C49" />
              </View>
              <Text className="text-sm font-bold text-gray-800 dark:text-white">Profil Pengguna</Text>
            </View>

            {/* Nama Lengkap Input */}
            <View className="space-y-1">
              <Text className="text-xs font-semibold text-gray-500 px-1">Nama Lengkap</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                className="w-full bg-gray-50 dark:bg-[#2D3133] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-white"
              />
            </View>

            {/* Email Display */}
            <View className="space-y-1">
              <Text className="text-xs font-semibold text-gray-500 px-1">Email</Text>
              <View className="w-full bg-gray-150/50 dark:bg-[#2D3133]/50 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 opacity-80">
                <Text className="text-sm text-gray-500 font-medium">{user?.username || 'contoh@freshvitality.com'}</Text>
              </View>
            </View>

            {/* Save Changes Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveChanges}
              className="w-full bg-[#006C49] py-2.5 rounded-lg items-center justify-center mt-2"
            >
              <Text className="text-white font-bold text-sm">Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>
          
          {/* Ubah Password Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => Alert.alert("Ubah Password", "Fungsionalitas mengubah password belum diaktifkan.")}
            className="flex-row items-center justify-between p-4 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mt-3"
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-[#006C49]/10 p-1.5 rounded-lg">
                <MaterialIcons name="lock" size={18} color="#006C49" />
              </View>
              <View>
                <Text className="text-sm font-bold text-gray-800 dark:text-white">Ubah Password</Text>
                <Text className="text-[10px] text-gray-400 mt-0.5">Perbarui keamanan akun Anda</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Section 2: Preferensi */}
        <View className="mb-6">
          <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">Preferensi</Text>
          
          <View className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Tema Gelap */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <View className="flex-row items-center gap-3">
                <View className="bg-[#006C49]/10 p-1.5 rounded-lg">
                  <MaterialIcons name="dark-mode" size={18} color="#006C49" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-gray-800 dark:text-white">Tema Gelap</Text>
                  <Text className="text-[10px] text-gray-400 mt-0.5">Gunakan tampilan mode malam</Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleToggleDark}
                trackColor={{ false: '#ECEEF0', true: '#10B981' }}
                thumbColor={isDarkMode ? '#white' : '#f4f3f4'}
              />
            </View>

            {/* Bahasa */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => Alert.alert("Pilih Bahasa", "Saat ini hanya mendukung Bahasa Indonesia.")}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-[#006C49]/10 p-1.5 rounded-lg">
                  <MaterialIcons name="language" size={18} color="#006C49" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-gray-800 dark:text-white">Bahasa</Text>
                  <Text className="text-[10px] text-[#006C49] font-medium mt-0.5">Bahasa Indonesia</Text>
                </View>
              </View>
              <MaterialIcons name="expand-more" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 3: Manajemen Data */}
        <View className="mb-6">
          <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">Manajemen Data</Text>
          
          <View className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Backup Data */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleBackup}
              className="flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800"
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-[#006C49]/10 p-1.5 rounded-lg">
                  <MaterialIcons name="cloud-upload" size={18} color="#006C49" />
                </View>
                <Text className="text-sm font-bold text-gray-800 dark:text-white">Backup Data</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Restore Backup */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRestore}
              className="flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800"
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-[#006C49]/10 p-1.5 rounded-lg">
                  <MaterialIcons name="cloud-download" size={18} color="#006C49" />
                </View>
                <Text className="text-sm font-bold text-gray-800 dark:text-white">Restore Backup</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Reset Semua Data */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleResetData}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-red-50 dark:bg-red-950/20 p-1.5 rounded-lg">
                  <MaterialIcons name="delete-forever" size={18} color="#BA1A1A" />
                </View>
                <Text className="text-sm font-bold text-[#BA1A1A]">Reset Semua Data</Text>
              </View>
              <MaterialIcons name="warning" size={16} color="#BA1A1A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 4: Sistem */}
        <View className="mb-6">
          <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">Sistem</Text>
          
          <View className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="bg-[#006C49]/10 p-1.5 rounded-lg">
                  <MaterialIcons name="code" size={18} color="#006C49" />
                </View>
                <Text className="text-sm font-bold text-gray-800 dark:text-white">Versi Aplikasi</Text>
              </View>
              <Text className="text-xs text-gray-450 font-mono">1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Footer: Logout */}
        <View className="pt-4">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            className="w-full flex-row items-center justify-center gap-2 py-3.5 bg-[#FFDAD6] dark:bg-[#93000A]/20 rounded-xl"
          >
            <MaterialIcons name="logout" size={18} color="#BA1A1A" />
            <Text className="text-[#BA1A1A] font-bold text-sm">Keluar</Text>
          </TouchableOpacity>
          <Text className="text-center text-[10px] text-gray-400 mt-5">StockFruit © 2024. All produce deserves a home.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

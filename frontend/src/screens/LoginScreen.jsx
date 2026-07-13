import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { loginSchema } from '../utils/validation';
import { Input } from '../components/Input';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await login(data.username, data.password);
      // Pengalihan navigasi otomatis ditangani oleh AuthGuard di AppNavigator/App.jsx
    } catch (error) {
      setServerError(error.detail || 'Terjadi kesalahan. Periksa email atau password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F9F6]">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header App Branding */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-[#006B44] rounded-full items-center justify-center mb-4 shadow-sm shadow-[#006B44]/20">
              <MaterialIcons name="eco" size={36} color="white" />
            </View>
            <Text className="text-[25px] font-bold text-[#006B44] mb-1.5">
              Stock Fruit
            </Text>
            <Text className="text-gray-500 text-[14px] text-center">
              Manajemen Inventaris buah segar Anda.
            </Text>
          </View>

          {/* Form Card Container */}
          <View className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200 border border-gray-100">
            {serverError && (
              <View className="bg-red-50 border border-red-100 rounded-xl p-3 mb-5 flex-row items-center">
                <Feather name="alert-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                <Text className="text-red-600 text-xs flex-1 font-medium">{serverError}</Text>
              </View>
            )}

            <Input
              control={control}
              name="username"
              label="Email Akun"
              placeholder="Masukkan Email Anda"
              iconName="user"
              keyboardType="email-address"
            />

            <Input
              control={control}
              name="password"
              label="Password"
              placeholder="Masukkan password Anda"
              iconName="lock"
              secureTextEntry
              rightElement={
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text className="text-xs text-[#006B7B] font-bold">
                    Lupa Password?
                  </Text>
                </TouchableOpacity>
              }
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-[#006B44] flex-row items-center justify-center h-12 rounded-3xl mt-4 shadow-sm shadow-[#006B44]/20"
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Text className="text-white font-bold text-base mr-2">Masuk</Text>
                  <Feather name="arrow-right" size={18} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-gray-500 text-sm">Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-[#006B7B] font-bold text-sm">
                Daftar sekarang
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
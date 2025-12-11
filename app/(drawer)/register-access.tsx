import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '../../api/axiosConfig';

export default function RegisterAccess() {
    const router = useRouter();
    const [dni, setDni] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegisterAccess = async () => {
        setError('');
        
        if (!dni.trim()) {
            setError('Por favor ingresa el DNI');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/users/attendance', { dni: dni.trim() });
            
            console.log('✅ Acceso registrado:', response.data);
            
            Alert.alert(
                '✅ Acceso Registrado',
                `Acceso registrado exitosamente para DNI: ${dni}`,
                [
                    {
                        text: 'Registrar Otro',
                        onPress: () => setDni(''),
                    },
                    {
                        text: 'Volver al Inicio',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (err: any) {
            console.error('❌ Error al registrar acceso:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error al registrar el acceso. Verifica el DNI.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#e0f2fe', '#bfdbfe', '#dbeafe']}
            className="flex-1"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <View className="flex-1 p-6">
                    {/* Header */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-4">
                            <TouchableOpacity onPress={() => router.back()} className="mr-3">
                                <Ionicons name="arrow-back" size={28} color="#1f2937" />
                            </TouchableOpacity>
                            <View>
                                <Text className="text-gray-800 text-2xl font-bold">
                                    Registrar Acceso
                                </Text>
                                <Text className="text-gray-600 text-sm">
                                    Ingresa el DNI del usuario
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Form Card */}
                    <View className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80">
                        {/* Icon */}
                        <View className="items-center mb-6">
                            <View className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 items-center justify-center">
                                <LinearGradient
                                    colors={['#06b6d4', '#14b8a6']}
                                    className="w-24 h-24 rounded-full items-center justify-center"
                                >
                                    <Ionicons name="finger-print" size={48} color="#FFF" />
                                </LinearGradient>
                            </View>
                        </View>

                        {/* DNI Input */}
                        <View className="mb-6">
                            <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                DNI del Usuario *
                            </Text>
                            <View className="flex-row items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/80">
                                <Ionicons name="card-outline" size={24} color="#0891b2" />
                                <TextInput
                                    placeholder="Ingresa el DNI"
                                    placeholderTextColor="#64748b"
                                    className="ml-3 flex-1 text-gray-800 text-lg bg-transparent"
                                    value={dni}
                                    onChangeText={(text) => {
                                        setDni(text);
                                        setError('');
                                    }}
                                    keyboardType="numeric"
                                    maxLength={20}
                                    autoFocus
                                />
                            </View>
                        </View>

                        {/* Error */}
                        {error ? (
                            <View className="bg-rose-100/60 border border-rose-300 rounded-xl px-4 py-3 mb-4 backdrop-blur-sm">
                                <Text className="text-rose-600 text-center text-sm font-medium">
                                    {error}
                                </Text>
                            </View>
                        ) : null}

                        {/* Botón Registrar */}
                        <TouchableOpacity
                            onPress={handleRegisterAccess}
                            disabled={loading}
                            activeOpacity={0.8}
                            className="rounded-xl shadow-lg overflow-hidden"
                        >
                            <LinearGradient
                                colors={['#06b6d4', '#14b8a6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ paddingVertical: 16, alignItems: 'center' }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <View className="flex-row items-center">
                                        <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                        <Text className="text-white text-lg font-bold ml-2">
                                            REGISTRAR ACCESO
                                        </Text>
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Info */}
                        <View className="mt-6 bg-cyan-50/60 rounded-xl p-4">
                            <View className="flex-row items-start">
                                <Ionicons name="information-circle" size={20} color="#0891b2" />
                                <Text className="text-cyan-800 text-xs ml-2 flex-1">
                                    El sistema registrará automáticamente la entrada o salida del usuario según su último estado.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
    return (
        <LinearGradient
            colors={['#0f172a', '#1e293b']}
            className="flex-1"
        >
            <ScrollView className="flex-1">
                <View className="p-6">
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-white text-3xl font-bold mb-2">
                            Bienvenido al UTN GYM
                        </Text>
                        <Text className="text-gray-400 text-base">
                            Sistema de Control de Acceso
                        </Text>
                    </View>

                    {/* Stats Grid */}
                    <View className="flex-row flex-wrap gap-4 mb-6">
                        <View className="flex-1 min-w-[45%] bg-red-600 rounded-2xl p-5">
                            <Ionicons name="people" size={32} color="#FFF" />
                            <Text className="text-white text-3xl font-bold mt-3">
                                150
                            </Text>
                            <Text className="text-red-100 text-sm">
                                Usuarios Activos
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-yellow-500 rounded-2xl p-5">
                            <Ionicons name="checkmark-circle" size={32} color="#FFF" />
                            <Text className="text-white text-3xl font-bold mt-3">
                                45
                            </Text>
                            <Text className="text-yellow-100 text-sm">
                                Accesos Hoy
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-green-600 rounded-2xl p-5">
                            <Ionicons name="fitness" size={32} color="#FFF" />
                            <Text className="text-white text-3xl font-bold mt-3">
                                28
                            </Text>
                            <Text className="text-green-100 text-sm">
                                En el Gimnasio
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-blue-600 rounded-2xl p-5">
                            <Ionicons name="time" size={32} color="#FFF" />
                            <Text className="text-white text-3xl font-bold mt-3">
                                2.5h
                            </Text>
                            <Text className="text-blue-100 text-sm">
                                Promedio Sesión
                            </Text>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View className="mb-6">
                        <Text className="text-white text-xl font-bold mb-4">
                            Acciones Rápidas
                        </Text>
                        
                        <TouchableOpacity className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center">
                            <View className="bg-red-600 w-12 h-12 rounded-xl items-center justify-center mr-4">
                                <Ionicons name="person-add" size={24} color="#FFF" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-base font-semibold">
                                    Registrar Acceso
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    Entrada/Salida de usuarios
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center">
                            <View className="bg-yellow-500 w-12 h-12 rounded-xl items-center justify-center mr-4">
                                <Ionicons name="list" size={24} color="#FFF" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-base font-semibold">
                                    Ver Historial
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    Registro de accesos
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-gray-800 rounded-xl p-4 flex-row items-center">
                            <View className="bg-blue-600 w-12 h-12 rounded-xl items-center justify-center mr-4">
                                <Ionicons name="settings" size={24} color="#FFF" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-base font-semibold">
                                    Configuración
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    Ajustes del sistema
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

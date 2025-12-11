import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllUsersService } from '../../services/userService';

const { width } = Dimensions.get('window');

export default function Home() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTotalUsers();
    }, []);

    const loadTotalUsers = async () => {
        setLoading(true);
        const result = await getAllUsersService();
        if (result.success) {
            setTotalUsers(result.total);
        }
        setLoading(false);
    };

    // Datos de ejemplo para la gráfica
    const weeklyData = [
        { day: 'Lun', count: 42 },
        { day: 'Mar', count: 38 },
        { day: 'Mié', count: 45 },
        { day: 'Jue', count: 50 },
        { day: 'Vie', count: 55 },
        { day: 'Sáb', count: 48 },
        { day: 'Dom', count: 30 },
    ];

    const maxCount = Math.max(...weeklyData.map(d => d.count));

    return (
        <LinearGradient
            colors={['#e0f2fe', '#bfdbfe', '#dbeafe']}
            className="flex-1"
        >
            <ScrollView className="flex-1">
                <View className="p-6">
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-gray-800 text-3xl font-bold mb-2">
                            Bienvenido al UTN GYM
                        </Text>
                        <Text className="text-gray-600 text-base">
                            Sistema de Control de Acceso
                        </Text>
                    </View>

                    {/* Stats Cards - 3 cards en una fila */}
                    <View className="flex-row gap-3 mb-6">
                        <View className="flex-1 bg-cyan-500/80 backdrop-blur-lg rounded-2xl p-4 border border-white/50">
                            <Ionicons name="people" size={28} color="#FFF" />
                            {loading ? (
                                <ActivityIndicator color="#FFF" size="small" style={{ marginTop: 8 }} />
                            ) : (
                                <Text className="text-white text-2xl font-bold mt-2">
                                    {totalUsers}
                                </Text>
                            )}
                            <Text className="text-cyan-50 text-xs">
                                Usuarios Activos
                            </Text>
                        </View>

                        <View className="flex-1 bg-teal-500/80 backdrop-blur-lg rounded-2xl p-4 border border-white/50">
                            <Ionicons name="checkmark-circle" size={28} color="#FFF" />
                            <Text className="text-white text-2xl font-bold mt-2">
                                45
                            </Text>
                            <Text className="text-teal-50 text-xs">
                                Accesos Hoy
                            </Text>
                        </View>

                        <View className="flex-1 bg-emerald-500/80 backdrop-blur-lg rounded-2xl p-4 border border-white/50">
                            <Ionicons name="fitness" size={28} color="#FFF" />
                            <Text className="text-white text-2xl font-bold mt-2">
                                28
                            </Text>
                            <Text className="text-emerald-50 text-xs">
                                En el Gimnasio
                            </Text>
                        </View>
                    </View>

                    {/* Gráfica de Accesos Semanales */}
                    <View className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 mb-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-gray-800 text-lg font-bold">
                                Accesos de la Semana
                            </Text>
                            <Ionicons name="bar-chart" size={24} color="#0891b2" />
                        </View>

                        {/* Chart */}
                        <View className="flex-row items-end justify-between h-48">
                            {weeklyData.map((item, index) => {
                                const barHeight = (item.count / maxCount) * 100;
                                return (
                                    <View key={index} className="flex-1 items-center mx-1">
                                        {/* Valor */}
                                        <Text className="text-gray-700 text-xs font-semibold mb-2">
                                            {item.count}
                                        </Text>
                                        
                                        {/* Barra */}
                                        <LinearGradient
                                            colors={['#06b6d4', '#14b8a6']}
                                            style={{ 
                                                width: '100%', 
                                                height: `${barHeight}%`,
                                                borderRadius: 8,
                                                minHeight: 20
                                            }}
                                        />
                                        
                                        {/* Día */}
                                        <Text className="text-gray-600 text-xs font-medium mt-2">
                                            {item.day}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Estadística adicional */}
                        <View className="flex-row justify-between mt-6 pt-4 border-t border-gray-200">
                            <View>
                                <Text className="text-gray-500 text-xs">Total Semanal</Text>
                                <Text className="text-gray-800 text-xl font-bold">
                                    {weeklyData.reduce((acc, curr) => acc + curr.count, 0)}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-gray-500 text-xs">Promedio Diario</Text>
                                <Text className="text-gray-800 text-xl font-bold">
                                    {Math.round(weeklyData.reduce((acc, curr) => acc + curr.count, 0) / weeklyData.length)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

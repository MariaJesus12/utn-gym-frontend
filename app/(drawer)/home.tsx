import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getAllUsersService, getGymEvenAttendanceService, getUsersService } from '../../services/userService';
import { useWebSocket } from '../../hooks/useWebSocket';

const { width } = Dimensions.get('window');

interface UserToday {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    dni: string;
    tipo: 'estudiante' | 'funcionario';
    foto_url?: string;
}

export default function Home() {
    const router = useRouter();
    const [totalUsers, setTotalUsers] = useState(0);
    const [assistanceToday, setAssistanceToday] = useState(0);
    const [usersToday, setUsersToday] = useState<UserToday[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [gymCount, setGymCount] = useState(0); // Contador del Raspberry Pi
    const [raspberryData, setRaspberryData] = useState<any>(null); // Dato raw del Raspberry Pi

    // WebSocket para Raspberry Pi
    const { isConnected, lastMessage } = useWebSocket({
        url: 'ws://10.50.41.65:8765',
        onMessage: (data) => {
            console.log('📡 Datos recibidos del Raspberry Pi:', data);
            setRaspberryData(data); // Guardar dato completo del Raspberry
            
            // También mantener la lógica de gymCount por si acaso
            if (typeof data === 'number') {
                setGymCount(data);
            } else if (data?.count !== undefined) {
                setGymCount(data.count);
            } else if (data?.users !== undefined) {
                setGymCount(data.users);
            } else if (data?.total !== undefined) {
                setGymCount(data.total);
            }
        },
        onOpen: () => {
            console.log('✅ Conectado al Raspberry Pi en ws://10.50.41.65:8765');
        },
        onError: (error) => {
            console.error('❌ Error en conexión con Raspberry Pi:', error);
        },
        onClose: () => {
            console.log('🔌 Desconectado del Raspberry Pi');
        },
        autoReconnect: true,
        reconnectInterval: 5000,
    });

    // Recargar stats cuando llegue un mensaje del WebSocket
    useEffect(() => {
        if (lastMessage !== null) {
            console.log('🔄 Recargando stats por mensaje WebSocket');
            loadStats();
        }
    }, [lastMessage]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        
        // Cargar usuarios totales, accesos gym-even y usuarios paginados en paralelo
        const [usersResult, assistanceResult, allUsersResult] = await Promise.all([
            getAllUsersService(),
            getGymEvenAttendanceService(),
            getUsersService(undefined, 1, 500) // Obtener todos los usuarios con sus fotos
        ]);
        
        if (usersResult.success) {
            setTotalUsers(usersResult.total);
        }
        
        if (assistanceResult.success) {
            setAssistanceToday(assistanceResult.total);
            
            // Mostrar SOLO los usuarios que accedieron hoy, enriqueciendo con fotos si están disponibles
            if (assistanceResult.data) {
                console.log('📋 Datos de asistencia hoy:', assistanceResult.data);
                
                let usersToShow = assistanceResult.data;
                
                // Si tenemos datos completos de usuarios, enriquecer con fotos
                if (allUsersResult.success && allUsersResult.data) {
                    console.log('📊 Total usuarios en allUsers:', allUsersResult.data.length);
                    
                    usersToShow = assistanceResult.data.map((todayUser: any) => {
                        // Buscar datos completos del usuario (con foto)
                        const fullUserData = allUsersResult.data.find((u: any) => u.dni === todayUser.dni);
                        
                        // Si encontramos datos completos, usar esos; si no, usar los datos básicos de hoy
                        return fullUserData || todayUser;
                    });
                }
                
                console.log('👥 Usuarios de hoy a mostrar:', usersToShow.length);
                console.log('📋 Usuarios de hoy:', usersToShow);
                setUsersToday(usersToShow);
            }
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
                    <View className="mb-6 flex-row justify-between items-start">
                        <View className="flex-1">
                            <Text className="text-gray-800 text-3xl font-bold mb-2">
                                Bienvenido al UTN GYM
                            </Text>
                            <Text className="text-gray-600 text-base">
                                Sistema de Control de Acceso
                            </Text>
                        </View>
                        
                        {/* Botón Registrar Acceso */}
                        <TouchableOpacity
                            onPress={() => router.push('/(drawer)/register-access')}
                            activeOpacity={0.8}
                            className="rounded-2xl shadow-lg overflow-hidden"
                        >
                            <LinearGradient
                                colors={['#06b6d4', '#14b8a6']}
                                className="px-4 py-3 flex-row items-center"
                            >
                                <Ionicons name="finger-print" size={24} color="#FFF" />
                                <Text className="text-white text-sm font-bold ml-2">
                                    Registrar{'\n'}Acceso
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
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
                            {loading ? (
                                <ActivityIndicator color="#FFF" size="small" style={{ marginTop: 8 }} />
                            ) : (
                                <Text className="text-white text-2xl font-bold mt-2">
                                    {assistanceToday}
                                </Text>
                            )}
                            <Text className="text-teal-50 text-xs">
                                Accesos Hoy
                            </Text>
                        </View>

                        <View className="flex-1 bg-emerald-500/80 backdrop-blur-lg rounded-2xl p-4 border border-white/50">
                            <Ionicons name="fitness" size={28} color="#FFF" />
                            <Text className="text-white text-2xl font-bold mt-2">
                                {typeof raspberryData?.contador === 'number'
                                    ? raspberryData.contador
                                    : gymCount}
                            </Text>
                            <Text className="text-emerald-50 text-xs">
                                En el Gimnasio
                            </Text>
                        </View>
                    </View>

                    {/* Lista de Usuarios Registrados Hoy */}
                    <View className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 mb-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-gray-800 text-lg font-bold">
                                Usuarios Activos
                            </Text>
                            <View className="bg-cyan-500/20 rounded-full px-3 py-1">
                                <Text className="text-cyan-700 font-semibold text-xs">
                                    {usersToday.length} usuarios
                                </Text>
                            </View>
                        </View>

                        {loading ? (
                            <View className="py-8">
                                <ActivityIndicator color="#0891b2" size="large" />
                            </View>
                        ) : usersToday.length === 0 ? (
                            <View className="py-8 items-center">
                                <Ionicons name="calendar-outline" size={48} color="#94a3b8" />
                                <Text className="text-gray-500 mt-3 text-sm">
                                    No hay registros de hoy
                                </Text>
                            </View>
                        ) : (
                            <View className="space-y-3">
                                {usersToday.map((user) => (
                                    <View 
                                        key={user.id} 
                                        className="bg-white/60 rounded-xl p-3 flex-row items-center border border-white/60"
                                    >
                                        {/* Foto */}
                                        {user.foto_url ? (
                                            <TouchableOpacity 
                                                onPress={() => {
                                                    const imageUrl = user.foto_url?.startsWith('http') 
                                                        ? user.foto_url 
                                                        : `data:image/jpeg;base64,${user.foto_url}`;
                                                    setSelectedImage(imageUrl);
                                                }}
                                                className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 mr-3"
                                            >
                                                <Image 
                                                    source={{ 
                                                        uri: user.foto_url.startsWith('http') 
                                                            ? user.foto_url 
                                                            : `data:image/jpeg;base64,${user.foto_url}` 
                                                    }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <View className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 mr-3">
                                                <View className="w-full h-full items-center justify-center bg-cyan-100">
                                                    <Ionicons name="person" size={28} color="#0891b2" />
                                                </View>
                                            </View>
                                        )}

                                        {/* Info */}
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-bold text-base">
                                                {user.nombre} {user.apellido1} {user.apellido2 || ''}
                                            </Text>
                                            <View className="flex-row items-center mt-1">
                                                <Ionicons 
                                                    name="card-outline" 
                                                    size={14} 
                                                    color="#64748b" 
                                                />
                                                <Text className="text-gray-600 text-sm ml-1">
                                                    {user.dni}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Badge de Tipo */}
                                        <View 
                                            className={`px-3 py-1 rounded-full ${
                                                user.tipo === 'estudiante' 
                                                    ? 'bg-cyan-500/20' 
                                                    : 'bg-emerald-500/20'
                                            }`}
                                        >
                                            <Text 
                                                className={`text-xs font-semibold ${
                                                    user.tipo === 'estudiante' 
                                                        ? 'text-cyan-700' 
                                                        : 'text-emerald-700'
                                                }`}
                                            >
                                                {user.tipo === 'estudiante' ? 'Estudiante' : 'Funcionario'}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
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

            {/* Modal para zoom de imagen */}
            <Modal
                visible={selectedImage !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <Pressable 
                    className="flex-1 bg-black/90 justify-center items-center"
                    onPress={() => setSelectedImage(null)}
                >
                    <View className="w-full h-full justify-center items-center p-6">
                        <TouchableOpacity
                            onPress={() => setSelectedImage(null)}
                            className="absolute top-12 right-6 bg-white/20 p-3 rounded-full z-10"
                        >
                            <Ionicons name="close" size={28} color="#FFF" />
                        </TouchableOpacity>
                        
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={{
                                    width: '90%',
                                    height: '70%',
                                    borderRadius: 20,
                                }}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </Pressable>
            </Modal>
        </LinearGradient>
    );
}

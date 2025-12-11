import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    Image,
    Modal,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsers } from '../../hooks/useUsers';

type TabType = 'students' | 'funcionarios';

export default function UsersList() {
    const { users, loading, error, fetchUsers, deleteUser } = useUsers();
    const [activeTab, setActiveTab] = useState<TabType>('students');
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        await fetchUsers();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUsers();
        setRefreshing(false);
    };

    const handleDelete = async (id_persona: number, nombre: string) => {
        if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
            await deleteUser(id_persona);
            await loadUsers();
        }
    };

    // Asegurar que users sea un array
    const usersArray = Array.isArray(users) ? users : [];

    const students = usersArray.filter(user => user.tipo === 'estudiante');
    const funcionarios = usersArray.filter(user => user.tipo === 'funcionario');

    const filteredUsers = activeTab === 'students' 
        ? students.filter(user => 
            `${user.nombre} ${user.apellido1} ${user.apellido2}`.toLowerCase().includes(searchText.toLowerCase()) ||
            user.dni.includes(searchText)
          )
        : funcionarios.filter(user => 
            `${user.nombre} ${user.apellido1} ${user.apellido2}`.toLowerCase().includes(searchText.toLowerCase()) ||
            user.dni.includes(searchText)
          );

    return (
        <LinearGradient
            colors={['#e0f2fe', '#bfdbfe', '#dbeafe']}
            className="flex-1"
        >
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0891b2" />
                }
            >
                <View className="p-6">
                    {/* Header */}
                    <View className="mb-6">
                        <Text className="text-gray-800 text-3xl font-bold mb-2">
                            Lista de Usuarios
                        </Text>
                        <Text className="text-gray-600 text-sm">
                            Gestiona estudiantes y funcionarios del gimnasio
                        </Text>
                    </View>

                    {/* Search Bar */}
                    <View className="mb-4">
                        <View className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/80 px-4 py-3 flex-row items-center">
                            <Ionicons name="search" size={20} color="#64748b" />
                            <TextInput
                                className="flex-1 ml-3 text-gray-800"
                                placeholder="Buscar por nombre o DNI..."
                                placeholderTextColor="#94a3b8"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                            {searchText !== '' && (
                                <TouchableOpacity onPress={() => setSearchText('')}>
                                    <Ionicons name="close-circle" size={20} color="#64748b" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/80">
                        <TouchableOpacity
                            onPress={() => setActiveTab('students')}
                            className="flex-1"
                        >
                            {activeTab === 'students' ? (
                                <LinearGradient
                                    colors={['#06b6d4', '#0891b2']}
                                    className="py-3 rounded-lg"
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text className="text-white text-center font-semibold">
                                        Estudiantes ({students.length})
                                    </Text>
                                </LinearGradient>
                            ) : (
                                <View className="py-3">
                                    <Text className="text-gray-600 text-center font-medium">
                                        Estudiantes ({students.length})
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab('funcionarios')}
                            className="flex-1"
                        >
                            {activeTab === 'funcionarios' ? (
                                <LinearGradient
                                    colors={['#14b8a6', '#10b981']}
                                    className="py-3 rounded-lg"
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text className="text-white text-center font-semibold">
                                        Funcionarios ({funcionarios.length})
                                    </Text>
                                </LinearGradient>
                            ) : (
                                <View className="py-3">
                                    <Text className="text-gray-600 text-center font-medium">
                                        Funcionarios ({funcionarios.length})
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Loading */}
                    {loading && !refreshing && (
                        <View className="py-8 items-center">
                            <ActivityIndicator size="large" color="#0891b2" />
                            <Text className="text-gray-600 mt-3">Cargando usuarios...</Text>
                        </View>
                    )}

                    {/* Error */}
                    {error && (
                        <View className="bg-rose-100/60 border border-rose-300 rounded-xl px-4 py-3 mb-4 backdrop-blur-sm">
                            <Text className="text-rose-600 text-center text-sm font-medium">
                                {error}
                            </Text>
                        </View>
                    )}

                    {/* Users List */}
                    {!loading && filteredUsers.length === 0 && (
                        <View className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-white/80 items-center">
                            <Ionicons name="people-outline" size={48} color="#94a3b8" />
                            <Text className="text-gray-600 mt-4 text-center">
                                {searchText !== '' 
                                    ? 'No se encontraron resultados'
                                    : activeTab === 'students'
                                    ? 'No hay estudiantes registrados'
                                    : 'No hay funcionarios registrados'}
                            </Text>
                        </View>
                    )}

                    {!loading && filteredUsers.map((user) => (
                        <View
                            key={user.id_persona}
                            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-3 border border-white/80"
                        >
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-2">
                                        {user.foto_url ? (
                                            <TouchableOpacity onPress={() => setSelectedImage(user.foto_url.startsWith('http') ? user.foto_url : `data:image/jpeg;base64,${user.foto_url}`)}>
                                                <Image 
                                                    source={{ uri: user.foto_url.startsWith('http') ? user.foto_url : `data:image/jpeg;base64,${user.foto_url}` }}
                                                    className="w-12 h-12 rounded-full"
                                                    style={{ 
                                                        resizeMode: 'cover',
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 24
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <View className={`w-12 h-12 rounded-full items-center justify-center ${
                                                activeTab === 'students' ? 'bg-cyan-100' : 'bg-emerald-100'
                                            }`}>
                                                <Ionicons 
                                                    name={activeTab === 'students' ? 'school' : 'briefcase'} 
                                                    size={20} 
                                                    color={activeTab === 'students' ? '#0891b2' : '#10b981'} 
                                                />
                                            </View>
                                        )}
                                        <View className="ml-3 flex-1">
                                            <Text className="text-gray-800 text-lg font-bold">
                                                {user.nombre} {user.apellido1} {user.apellido2}
                                            </Text>
                                            <Text className="text-gray-600 text-sm">
                                                DNI: {user.dni}
                                            </Text>
                                        </View>
                                    </View>

                                    {user.detalle && (
                                        <View className={`rounded-lg px-3 py-2 mt-2 ${
                                            activeTab === 'students' ? 'bg-cyan-50' : 'bg-emerald-50'
                                        }`}>
                                            <Text className={`text-xs font-medium ${
                                                activeTab === 'students' ? 'text-cyan-700' : 'text-emerald-700'
                                            }`}>
                                                {activeTab === 'students' ? '📚 ' : '💼 '}{user.detalle}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <TouchableOpacity
                                    onPress={() => handleDelete(user.id_persona, user.nombre)}
                                    className="ml-3 bg-rose-100 p-2 rounded-lg"
                                >
                                    <Ionicons name="trash-outline" size={20} color="#e11d48" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
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

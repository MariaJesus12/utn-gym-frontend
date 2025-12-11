// app/(drawer)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Redirect, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { secureStorage } from '../../utils/secureStorage';

function CustomDrawerContent(props: any) {
    const router = useRouter();

    const handleLogout = async () => {
        //Borrar tokens reales
        await secureStorage.deleteItem("access_token");
        await secureStorage.deleteItem("refresh_token");

        router.dismiss(); // Cierra el drawer
        router.replace("/(auth)/login"); // Mandar al login
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1">
                <DrawerItemList {...props} />
            </View>

            <View className="px-4 pb-4 border-t border-gray-200 pt-4">
                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center py-3 px-4 bg-red-50 rounded-lg"
                >
                    <Ionicons name="log-out-outline" size={22} color="#dc2626" />
                    <Text className="ml-3 text-base font-semibold text-red-600">Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

export default function Layout() {
    const [checking, setChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = await secureStorage.getItem("access_token");
            setIsAuthenticated(!!token);
            setChecking(false);
        };

        verifyToken();
    }, []);

    // Pantalla de espera mientras carga
    if (checking) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // ❗Si NO hay token → no permitir ver el drawer
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{ headerShown: true }}
            >
                <Drawer.Screen
                    name="home"
                    options={{
                        drawerLabel: 'Inicio',
                        title: 'Inicio',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="register-student"
                    options={{
                        drawerLabel: 'Registrar Estudiante',
                        title: 'Registrar Estudiante',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="school-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="register-admin"
                    options={{
                        drawerLabel: 'Registrar Administrativo',
                        title: 'Registrar Administrativo',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="briefcase-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="users-list"
                    options={{
                        drawerLabel: 'Lista de Usuarios',
                        title: 'Lista de Usuarios',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="people-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="register-access"
                    options={{
                        drawerLabel: 'Registrar Acceso',
                        title: 'Registrar Acceso',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="finger-print" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="map"
                    options={{
                        drawerLabel: 'Mapa',
                        title: 'Búsqueda de Árboles',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="map-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="censo"
                    options={{
                        drawerLabel: 'censo',
                        title: 'Senso de Árboles',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="create-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="perfil"
                    options={{
                        drawerLabel: 'perfil',
                        title: 'Perfil de Usuario',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}

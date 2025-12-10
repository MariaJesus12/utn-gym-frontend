// app/(auth)/_layout.tsx
import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { secureStorage } from "../../utils/secureStorage";
import { ActivityIndicator, View } from "react-native";

export default function AuthLayout() {
    const [checking, setChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await secureStorage.getItem("access_token");
                setIsAuthenticated(!!token);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setChecking(false);
            }
        };

        checkAuth();
    }, []);

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Si está logueado → ir al drawer/home
    if (isAuthenticated) {
        return <Redirect href="/(drawer)/home" />;
    }

    // Si NO está logueado → mostrar login/register
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    );
}

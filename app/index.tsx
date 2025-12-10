import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { secureStorage } from "../utils/secureStorage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
    const [checking, setChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = await secureStorage.getItem("access_token");
                setIsAuthenticated(!!token);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setChecking(false);
            }
        };

        verifyToken();
    }, []);

    useEffect(() => {
        if (checking || isAuthenticated === null) return;

        if (isAuthenticated) {
            router.replace("/(drawer)/home");
        } else {
            router.replace("/(auth)/login");
        }
    }, [isAuthenticated, checking]);

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}

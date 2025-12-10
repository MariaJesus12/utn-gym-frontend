// utils/secureStorage.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Almacenamiento seguro multiplataforma
 * - iOS/Android: usa SecureStore (encriptado)
 * - Web: usa localStorage (no encriptado pero funcional)
 */

export const secureStorage = {
    async setItem(key: string, value: string): Promise<void> {
        if (Platform.OS === "web") {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },

    async getItem(key: string): Promise<string | null> {
        if (Platform.OS === "web") {
            return localStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },

    async deleteItem(key: string): Promise<void> {
        if (Platform.OS === "web") {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    },
};


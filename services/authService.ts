// services/authService.ts
import { Platform } from "react-native";
import api from "../api/axiosConfig";
import { secureStorage } from "../utils/secureStorage";

export const loginService = async (dni: string, password: string) => {
    try {
        console.log("[authService] Enviando login con DNI:", dni);
        
        const res = await api.post("/auth/login", {
            dni,
            password,
        });

        console.log("[authService] Respuesta del servidor:", res.data);

        // Estructura de respuesta del backend: {success: true, message: '', data: {...}}
        const responseData = res.data.data || res.data;
        const { user, accessToken, refreshToken, token, access_token } = responseData;

        // El token puede venir como accessToken, token o access_token
        const finalToken = accessToken || token || access_token;

        if (!finalToken) {
            console.error("[authService] No se encontró token en la respuesta:", res.data);
            throw new Error("No accessToken recibido del servidor");
        }

        // Guardar en storage
        if (Platform.OS === "web") {
            localStorage.setItem("access_token", finalToken);
            if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
            if (user) localStorage.setItem("user", JSON.stringify(user));
            console.log("[authService] Tokens guardados en localStorage");
        } else {
            await secureStorage.setItem("access_token", finalToken);
            if (refreshToken) await secureStorage.setItem("refresh_token", refreshToken);
            if (user) await secureStorage.setItem("user", JSON.stringify(user));
            console.log("[authService] Tokens guardados en SecureStore");
        }

        return res.data;

    } catch (error: any) {
        console.error("[authService] Error en login:", {
            status: error?.response?.status,
            message: error?.response?.data?.message,
            data: error?.response?.data
        });
        throw error;
    }
};

export const logoutService = async () => {
    try {
        await api.post("/auth/logout");
    } catch (e) {
        console.log("Error en logout");
    }

    if (Platform.OS === "web") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    } else {
        await secureStorage.deleteItem("access_token");
        await secureStorage.deleteItem("refresh_token");
    }
};

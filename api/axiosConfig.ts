// api/axiosConfig.ts
import axios from "axios";
import { Platform } from "react-native";

const api = axios.create({
    baseURL: "https://gym-api.utngte.dev",
    timeout: 10000,
});

// Interceptor de request: añade el token a cada petición
api.interceptors.request.use(
    (config) => {
        try {
            if (Platform.OS === "web") {
                const token = localStorage.getItem("access_token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.log("Error añadiendo token:", error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

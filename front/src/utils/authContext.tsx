import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface AuthContextType {
    token: string | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const loadStoredToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Error loading stored token:', error);
            }
        };
        loadStoredToken();
    }, []);

    const login = async (accessToken: string): Promise<void> => {
        if (accessToken) {
            setToken(accessToken);
            try {
                await AsyncStorage.setItem('token', accessToken);
            } catch (error) {
                console.error('Error saving token:', error);
            }
        } else {
            Alert.alert('Erreur lors de la connexion.');
        }
    };

    const logout = () => {
        setToken(null);
        try {
            AsyncStorage.removeItem('token');
        } catch (error) {
            console.error('Error removing token:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

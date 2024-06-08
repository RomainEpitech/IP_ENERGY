import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import fetchApi, { ApiResponse } from "../utils/fetchApi";
import { useAuth } from "../utils/authContext";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigation = useNavigation();
    const { login } = useAuth();

    const handleLogin = async () => {
        let isValid = true;

        if (!email) {
            setEmailError("L'email est requis");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Le mot de passe est requis");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (!isValid) return;

        const response: ApiResponse<any> = await fetchApi('POST', '/login', { email, password });

        if (response.success) {
            if (response.data.token) {
                await login(response.data.token);
                Alert.alert('Connexion réussie', 'Vous êtes connecté(e) avec succès.');
                navigation.navigate('Profile');
            } else {
                Alert.alert('Erreur de connexion', 'Email ou mot de passe incorrect.');
            }
        } else {
            Alert.alert('Erreur', response.error || 'Une erreur est survenue. Veuillez réessayer.');
            console.error(response.error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Se connecter</Text>
            <TextInput
                style={[styles.input, emailError ? styles.errorInput : null]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <TextInput
                style={[styles.input, passwordError ? styles.errorInput : null]}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '80%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        width: '80%',
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
    },
    backButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
});

export default Login;

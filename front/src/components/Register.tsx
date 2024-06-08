import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import fetchApi, { ApiResponse } from "../utils/fetchApi";

const RegisterPage: React.FC = () => {
    const navigation = useNavigation();
    const [firstname, setFirstname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
            return;
        }

        const response: ApiResponse<any> = await fetchApi('POST', '/register', { firstname, name, email, password, password_confirmation: confirmPassword });

        if (response.success) {
            Alert.alert('Inscription réussie', 'Vous êtes inscrit(e) avec succès.');
            navigation.navigate('Login');
        } else {
            let errorMessage = response.error;
            if (response.data && typeof response.data === 'object') {
                errorMessage = Object.values(response.data).join('\n');
            }
            Alert.alert('Erreur', errorMessage || 'Une erreur est survenue. Veuillez réessayer.');
            console.error(response.error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>S'inscrire</Text>
            <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={firstname}
                onChangeText={setFirstname}
            />
            <TextInput
                style={styles.input}
                placeholder="Nom"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmer mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>S'inscrire</Text>
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
        backgroundColor: '#f0f4f7',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '80%',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 25,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        width: '80%',
        padding: 15,
        backgroundColor: '#28a745',
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 10,
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

export default RegisterPage;

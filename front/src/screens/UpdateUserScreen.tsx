import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../utils/authContext';
import fetchApi from '../utils/fetchApi';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const UpdateUserScreen: React.FC = () => {
    const { token, logout } = useAuth();
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                const response = await fetchApi('GET', '/me', null, {
                    Authorization: `Bearer ${token}`,
                });
                if (response.success) {
                    setUserInfo(response.data);
                    setName(response.data.name);
                    setFirstname(response.data.firstname);
                    setEmail(response.data.email);
                } else {
                    setError('Failed to fetch user info.');
                }
                setLoading(false);
            } else {
                setError('No token found.');
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [token]);

    const handleUpdate = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await fetchApi('PUT', '/update', { name, firstname, email, password }, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (response.success) {
                Alert.alert('Succès', 'Profil mis à jour avec succès.');
            } else {
                console.error('Failed to update profile:', response.error);
                Alert.alert('Erreur', response.error);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Erreur', error.message);
        }
    };

    const handleAccountDeletion = async () => {
        try {
            const response = await fetchApi('DELETE', '/delete', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (response.success) {
                logout();
                navigation.navigate('Home');
                Alert.alert('Compte désactivé', 'Votre compte a été désactivé avec succès.');
            } else {
                console.error('Failed to delete account:', response.error);
                Alert.alert('Erreur', response.error);
            }
        } catch (error) {
            console.error('Delete account error:', error);
            Alert.alert('Erreur', error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animatable.View animation="fadeInDown" style={styles.formContainer}>
                    <Text style={styles.title}>Modifier le Profil</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        value={firstname}
                        onChangeText={setFirstname}
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#aaa"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#aaa"
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor="#aaa"
                        secureTextEntry
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                            <Text style={styles.buttonText}>Mettre à jour</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
                <TouchableOpacity style={styles.deleteButton} onPress={handleAccountDeletion}>
                    <Text style={styles.buttonText}>Désactiver le compte</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    updateButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default UpdateUserScreen;

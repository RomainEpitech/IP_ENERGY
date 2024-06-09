import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../utils/authContext';
import fetchApi from '../utils/fetchApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const AdminUsersScreen: React.FC = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (token) {
                const response = await fetchApi('GET', '/admin/users', null, {
                    Authorization: `Bearer ${token}`,
                });
                if (response.success) {
                    setUsers(response.data.users);
                } else {
                    setError('Failed to fetch users.');
                }
                setLoading(false);
            } else {
                setError('No token found.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    if (!token) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Vous devez être connecté pour accéder à cette page.</Text>
            </View>
        );
    }

    const handleUserSelect = (user: any) => {
        setSelectedUser(user);
    };

    const handleDeactivateAccount = async () => {
        Alert.alert(
            "Désactiver le compte",
            `Êtes-vous sûr de vouloir désactiver le compte de ${selectedUser.name} ?`,
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Oui",
                    onPress: async () => {
                        try {
                            const response = await fetchApi('DELETE', `/admin/users/${selectedUser.id}`, null, {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            });
                            if (response.success) {
                                Alert.alert("Succès", "Le compte a été désactivé avec succès.");
                                setSelectedUser(null);
                            } else {
                                Alert.alert("Erreur", response.error);
                            }
                        } catch (error) {
                            Alert.alert("Erreur", error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {selectedUser ? (
                    <>
                        <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#ffffff" />
                            <Text style={styles.backButtonText}>Retour</Text>
                        </TouchableOpacity>
                        <Animatable.View animation="fadeInDown" style={styles.userDetailsContainer}>
                            <Text style={styles.title}>ID: <Text style={styles.info}>{selectedUser.id}</Text></Text>
                            <Text style={styles.label}>Nom: {selectedUser.name}</Text>
                            <Text style={styles.label}>Prénom: {selectedUser.firstname}</Text>
                            <Text style={styles.label}>Email: {selectedUser.email}</Text>
                            <Text style={styles.label}>Status: {selectedUser.admin === 1 ? 'Administrateur' : 'Employé'}</Text>
                            
                        </Animatable.View>
                        <Animatable.View animation="fadeInDown" >
                            {selectedUser.admin !== 1 && (
                                <TouchableOpacity style={styles.deactivateButton} onPress={handleDeactivateAccount}>
                                    <Text style={styles.deactivateButtonText}>Désactiver le compte</Text>
                                </TouchableOpacity>
                            )}
                        </Animatable.View>
                        
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>Utilisateurs</Text>
                        {users.map((user) => (
                            <Animatable.View key={user.id} style={styles.userCard} animation="fadeInUp">
                                <TouchableOpacity onPress={() => handleUserSelect(user)}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        ))}
                    </>
                )}
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 18,
        color: '#ffffff',
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    userDetailsContainer: {
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
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#555',
    },
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    userCard: {
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
        marginBottom: 20,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    deactivateButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    deactivateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdminUsersScreen;

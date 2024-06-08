import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../utils/authContext';
import fetchApi from '../utils/fetchApi';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Profile: React.FC = () => {
    const { token } = useAuth();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                console.log('Fetching user info with token:', token);
                const response = await fetchApi('GET', '/me', null, {
                    Authorization: `Bearer ${token}`,
                });
                console.log('API response:', response);
                if (response.success) {
                    setUserInfo(response.data);
                } else {
                    setError('Failed to fetch user info.');
                    console.error('Failed to fetch user info:', response.error);
                }
                setLoading(false);
            } else {
                setError('No token found.');
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, [token]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
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

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {userInfo && (
                <>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Bonjour {userInfo.firstname} 👋</Text>
                        <Ionicons name="settings-outline" size={30} color="white" style={styles.icon} />
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>Profile</Text>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.info}>{userInfo.email}</Text>
                        <Text style={styles.label}>Firstname:</Text>
                        <Text style={styles.info}>{userInfo.firstname}</Text>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.info}>{userInfo.name}</Text>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.info}>{userInfo.admin ? 'Administrateur' : 'Employé'}</Text>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    scrollContainer: {
        padding: 20
    },
    welcomeContainer: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    icon: {
        marginLeft: 10,
    },
    infoContainer: {
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
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
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default Profile;

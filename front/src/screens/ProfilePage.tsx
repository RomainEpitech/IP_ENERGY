import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../utils/authContext';
import fetchApi from '../utils/fetchApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AbsenceRequestModal from '../components/absenceRequestModal';
import SettingsModal from '../components/SettingModal';

const absenceImage = require('../public/absences.png');

const Profile: React.FC = () => {
    const { token, logout } = useAuth();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [absences, setAbsences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                const response = await fetchApi('GET', '/me', null, {
                    Authorization: `Bearer ${token}`,
                });
                if (response.success) {
                    setUserInfo(response.data);
                } else {
                    setError('Failed to fetch user info.');
                }
            } else {
                setError('No token found.');
            }
        };

        const fetchAbsences = async () => {
            if (token) {
                const response = await fetchApi('GET', '/absences', null, {
                    Authorization: `Bearer ${token}`,
                });
                if (response.success) {
                    setAbsences(response.data.absences);
                } else {
                    setError('Failed to fetch absences.');
                }
                setLoading(false);
            } else {
                setError('No token found.');
                setLoading(false);
            }
        };

        fetchUserInfo();
        fetchAbsences();
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

    const handleLogout = () => {
        logout();
        setSettingsVisible(false);
    };

    const handleEditProfile = () => {
        setSettingsVisible(false);
    };

    const filteredAbsences = absences.filter(absence => absence.status_id === 1).slice(0, 3);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {userInfo && (
                <>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Bonjour {userInfo.firstname} 👋</Text>
                        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
                            <Ionicons name="settings-outline" size={30} color="white" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.absencesContainer}>
                        <TouchableOpacity style={styles.absenceButton} onPress={() => setModalVisible(true)}>
                            <Image source={absenceImage} style={styles.buttonImage} />
                            <Text style={styles.buttonText}>Demande d'absence</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listButton}>
                            <Text style={styles.buttonText}>📂 Mes absences</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.requestsContainer}>
                        <Text style={styles.title}>Mes demandes en cours</Text>
                        {filteredAbsences.length > 0 ? (
                            filteredAbsences.map((absence) => (
                                <View key={absence.id} style={styles.absenceItem}>
                                    <Text style={styles.label}>Date de début: <Text style={styles.info}>{absence.start_date}</Text></Text>
                                    <Text style={styles.label}>Date de fin: <Text style={styles.info}>{absence.end_date}</Text></Text>
                                    <Text style={styles.label}>Statut: <Text style={styles.info}>{absence.status.status}</Text></Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noRequestsText}>Aucune demande en cours.</Text>
                        )}
                    </View>
                </>
            )}
            <AbsenceRequestModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                onLogout={handleLogout}
                onEditProfile={handleEditProfile}
            />
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
        padding: 20,
        alignItems: 'center',
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
    absencesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    absenceButton: {
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
        flexDirection: 'row',
    },
    listButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    buttonImage: {
        width: 24,
        height: 24,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    requestsContainer: {
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
    absenceItem: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        width: '100%',
    },
    noRequestsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default Profile;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../utils/authContext';
import fetchApi from '../utils/fetchApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AdminAbsenceUpdateModal from '../components/AdminAbsenceUpdateModal';

const AdminAbsencesScreen: React.FC = () => {
    const { token } = useAuth();
    const [usersData, setUsersData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('En attente');
    const [selectedAbsence, setSelectedAbsence] = useState<any | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchUsersData();
    }, [token]);

    const fetchUsersData = async () => {
        if (token) {
            const response = await fetchApi('GET', '/admin/absences', null, {
                Authorization: `Bearer ${token}`,
            });
            if (response.success) {
                setUsersData(response.data.users);
            } else {
                setError('Failed to fetch users data.');
            }
            setLoading(false);
        } else {
            setError('No token found.');
            setLoading(false);
        }
    };

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

    const handleAbsenceSelect = (absence: any) => {
        setSelectedAbsence(absence);
        setModalVisible(true);
    };

    const handleStatusChange = (id: number, status: string) => {
        const updatedUsersData = usersData.map(userData => {
            if (userData.user.id === selectedUser.user.id) {
                userData.absences = userData.absences.map((absence: any) =>
                    absence.id === id ? { ...absence, status } : absence
                );
            }
            return userData;
        });
        setUsersData(updatedUsersData);
    };

    const filteredAbsences = selectedUser
        ? selectedUser.absences.filter((absence: any) => absence.status === statusFilter)
        : [];

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {selectedUser ? (
                    <>
                        <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#ffffff" />
                            <Text style={styles.backButtonText}>Retour</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>{selectedUser.user.name}</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setStatusFilter(value)}
                            items={[
                                { label: 'En attente', value: 'En attente' },
                                { label: 'Validé', value: 'Validé' },
                                { label: 'Refusé', value: 'Refusé' },
                            ]}
                            value={statusFilter}
                            style={{
                                inputIOS: styles.picker,
                                inputAndroid: styles.picker,
                            }}
                        />
                        <View style={styles.requestsContainer}>
                            {filteredAbsences.length > 0 ? (
                                filteredAbsences.map((absence: any) => (
                                    <Animatable.View key={absence.id} style={styles.absenceItem} animation="fadeInUp">
                                        <TouchableOpacity onPress={() => handleAbsenceSelect(absence)}>
                                            <View style={styles.cardHeader}>
                                                <Ionicons name="calendar-outline" size={24} color="#4c669f" />
                                                <Text style={styles.cardTitle}>Absence</Text>
                                            </View>
                                            <Text style={styles.label}>Date de début: <Text style={styles.info}>{absence.start_date}</Text></Text>
                                            <Text style={styles.label}>Date de fin: <Text style={styles.info}>{absence.end_date}</Text></Text>
                                            <Text style={styles.label}>Statut: <Text style={styles.info}>{absence.status}</Text></Text>
                                        </TouchableOpacity>
                                    </Animatable.View>
                                ))
                            ) : (
                                <Text style={styles.noRequestsText}>Aucune absence trouvée.</Text>
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>Utilisateurs</Text>
                        {usersData.map((userData: any) => (
                            <Animatable.View key={userData.user.id} style={styles.userCard} animation="fadeInUp">
                                <TouchableOpacity onPress={() => handleUserSelect(userData)}>
                                    <Text style={styles.userName}>{userData.user.name}</Text>
                                    <Text style={styles.userEmail}>{userData.user.email}</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        ))}
                    </>
                )}
                {selectedAbsence && (
                    <AdminAbsenceUpdateModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        absence={selectedAbsence}
                        onStatusChange={handleStatusChange}
                        onRefresh={fetchUsersData} 
                    />
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
        color: '#ffffff',
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: 200,
        color: '#ffffff',
        backgroundColor: '#4c669f',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
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
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1.41,
        elevation: 2,
    },
    noRequestsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#4c669f',
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
});

export default AdminAbsencesScreen;

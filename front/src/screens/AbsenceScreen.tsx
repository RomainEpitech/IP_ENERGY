import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../utils/authContext';
import fetchApi from '../utils/fetchApi';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';

const AbsencesScreen: React.FC = () => {
    const { token } = useAuth();
    const [absences, setAbsences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<number>(1);

    useEffect(() => {
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

        fetchAbsences();
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

    const filteredAbsences = absences.filter(absence => absence.status_id === statusFilter);

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
                <Text style={styles.title}>Mes absences</Text>
                <RNPickerSelect
                    onValueChange={(value) => setStatusFilter(value)}
                    items={[
                        { label: 'En attente', value: 1 },
                        { label: 'Validé', value: 2 },
                        { label: 'Rejetée', value: 3 },
                    ]}
                    value={statusFilter}
                    style={{
                        inputIOS: styles.picker,
                        inputAndroid: styles.picker,
                    }}
                    Icon={() => {
                        return <MaterialIcons name="arrow-drop-down" size={24} color="gray" />;
                    }}
                />
            </Animatable.View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animatable.View animation="fadeInUp" style={styles.requestsContainer}>
                    {filteredAbsences.length > 0 ? (
                        filteredAbsences.map((absence) => (
                            <Animatable.View key={absence.id} style={styles.absenceItem} animation="fadeInUp">
                                <View style={styles.cardHeader}>
                                    <MaterialIcons name="event" size={24} color="#4c669f" />
                                    <Text style={styles.cardTitle}>Absence</Text>
                                </View>
                                <Text style={styles.label}>Date de début: <Text style={styles.info}>{absence.start_date}</Text></Text>
                                <Text style={styles.label}>Date de fin: <Text style={styles.info}>{absence.end_date}</Text></Text>
                                <Text style={styles.label}>Statut: <Text style={styles.info}>{absence.status.status}</Text></Text>
                            </Animatable.View>
                        ))
                    ) : (
                        <Text style={styles.noRequestsText}>Aucune absence trouvée.</Text>
                    )}
                </Animatable.View>
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#007bff',
        padding: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    picker: {
        height: 40,
        width: 150,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#000',
        borderColor: 'gray',
        borderWidth: 1,
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
    errorText: {
        fontSize: 18,
        color: 'red',
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
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 40,
        width: 150,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#000',
        borderColor: 'gray',
        borderWidth: 1,
    },
    inputAndroid: {
        height: 40,
        width: 150,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#000',
        borderColor: 'gray',
        borderWidth: 1,
    },
});

export default AbsencesScreen;

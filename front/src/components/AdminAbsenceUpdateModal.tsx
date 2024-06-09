import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import fetchApi from '../utils/fetchApi';
import { useAuth } from '../utils/authContext';

interface AdminAbsenceStatusModalProps {
    visible: boolean;
    onClose: () => void;
    absence: any;
    onStatusChange: (id: number, status: string) => void;
    onRefresh: () => void;
}

const AdminAbsenceUpdateModal: React.FC<AdminAbsenceStatusModalProps> = ({ visible, onClose, absence, onStatusChange, onRefresh }) => {
    const { token } = useAuth();
    const [status, setStatus] = useState(absence.status);

    const handleConfirm = async () => {
        try {
            const response = await fetchApi('PUT', `/admin/absences/${absence.id}/status`, { status_id: status }, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });
            console.log(absence.id);
            
            if (response.success) {
                onStatusChange(absence.id, status);
                onRefresh(); // Refresh the data after updating the status
                Alert.alert('Succès', 'Le statut a été mis à jour avec succès.');
                onClose();
            } else {
                console.error('Failed to update status:', response.error);
            }
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Modifier le statut</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setStatus(value)}
                        items={[
                            { label: 'En attente', value: '1' },
                            { label: 'Validé', value: '2' },
                            { label: 'Refusé', value: '3' },
                        ]}
                        value={status}
                        style={{
                            inputIOS: styles.picker,
                            inputAndroid: styles.picker,
                        }}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                            <Text style={styles.buttonText}>Confirmer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: 200,
        color: '#000',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdminAbsenceUpdateModal;

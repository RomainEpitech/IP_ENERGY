import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, TextInput } from 'react-native';
import fetchApi from '../utils/fetchApi';
import { useAuth } from '../utils/authContext';

interface AbsenceRequestModalProps {
    visible: boolean;
    onClose: () => void;
}

const AbsenceRequestModal: React.FC<AbsenceRequestModalProps> = ({ visible, onClose }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [startError, setStartError] = useState('');
    const [endError, setEndError] = useState('');
    const [reasonError, setReasonError] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
            resetFields();
        }
    }, [visible, opacity]);

    const resetFields = () => {
        setStartDate('');
        setEndDate('');
        setReason('');
        setStartError('');
        setEndError('');
        setReasonError('');
        setError('');
    };

    const isValidDate = (dateString: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateString.match(regex)) return 'Le format doit être YYYY-MM-DD';

        const parts = dateString.split("-");
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        if (month < 1 || month > 12) return 'Le mois doit être entre 01 et 12';
        if (day < 1 || day > 31) return 'Le jour doit être entre 01 et 31';

        const date = new Date(dateString);
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            return 'Date invalide';
        }

        const currentDate = new Date();
        if (date < currentDate.setHours(0, 0, 0, 0)) {
            return 'La date ne peut pas être antérieure à la date actuelle.';
        }

        return '';
    };

    const handleStartDateChange = (date: string) => {
        setStartDate(date);
        const error = isValidDate(date);
        setStartError(error);

        if (end_date && !error && new Date(end_date) < new Date(date)) {
            setEndError('La date de fin ne peut pas être antérieure à la date de début.');
        } else if (end_date) {
            setEndError(isValidDate(end_date));
        }

        setError('');
    };

    const handleEndDateChange = (date: string) => {
        setEndDate(date);
        const error = isValidDate(date);
        setEndError(error);

        if (!error && start_date && new Date(date) < new Date(start_date)) {
            setEndError('La date de fin ne peut pas être antérieure à la date de début.');
        }

        setError('');
    };

    const handleReasonChange = (text: string) => {
        setReason(text);
        if (text.length === 0) {
            setReasonError('Le motif ne peut pas être vide.');
        } else if (text.length > 255) {
            setReasonError('Le motif ne peut pas dépasser 255 caractères.');
        } else {
            setReasonError('');
        }
    };

    const handleSend = async () => {
        const startValidationError = isValidDate(start_date);
        const endValidationError = isValidDate(end_date);
        const reasonValidationError = reason.length === 0 ? 'Le motif ne peut pas être vide.' : '';

        if (startValidationError || endValidationError || reasonValidationError) {
            setStartError(startValidationError);
            setEndError(endValidationError);
            setReasonError(reasonValidationError);
            setError('Corrigez les erreurs avant de soumettre.');
            return;
        }

        if (new Date(end_date) < new Date(start_date)) {
            setError('La date de fin ne peut pas être antérieure à la date de début.');
            return;
        }

        setError('');

        const data = {
            start_date: start_date,
            end_date: end_date,
            reason: reason,
        };

        try {
            const response = await fetchApi('POST', '/absences', data, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });


            if (response.success) {
                console.log('Form submitted:', data);
                alert('Demande envoyée avec succès.');
                onClose();
            } else {
                // setError(`Erreur: ${response.error}`);
                alert('Vous avez déjà une demande pour cette période.')
            }
        } catch (error) {
            setError(`Erreur: ${error.message}`);
        }
    };

    return (
        <Modal
            transparent
            animationType="none"
            visible={visible}
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.overlay, { opacity }]}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Demande d'absence</Text>
                    <TextInput
                        style={[styles.input, startError ? styles.inputError : null]}
                        placeholder="Date de début (YYYY-MM-DD)"
                        value={start_date}
                        onChangeText={handleStartDateChange}
                        placeholderTextColor="#aaa"
                    />
                    {startError ? <Text style={styles.errorText}>{startError}</Text> : null}
                    <TextInput
                        style={[styles.input, endError ? styles.inputError : null]}
                        placeholder="Date de fin (YYYY-MM-DD)"
                        value={end_date}
                        onChangeText={handleEndDateChange}
                        placeholderTextColor="#aaa"
                    />
                    {endError ? <Text style={styles.errorText}>{endError}</Text> : null}
                    <TextInput
                        style={[styles.input, reasonError ? styles.inputError : null]}
                        placeholder="Motif"
                        value={reason}
                        onChangeText={handleReasonChange}
                        placeholderTextColor="#aaa"
                        multiline
                    />
                    <Text style={styles.charCount}>{reason.length}/255</Text>
                    {reasonError ? <Text style={styles.errorText}>{reasonError}</Text> : null}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <Text style={styles.sendButtonText}>Envoyer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
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
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    charCount: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    sendButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default AbsenceRequestModal;

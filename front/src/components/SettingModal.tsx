import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import fetchApi from '../utils/fetchApi';
import { useAuth } from '../utils/authContext';
import { useNavigation } from '@react-navigation/native';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
    onEditProfile: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose, onLogout, onEditProfile }) => {
    const { token } = useAuth();
    const navigation = useNavigation();
    const translateY = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(translateY, {
                toValue: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, translateY]);

    const handleLogout = async () => {
        try {
            const response = await fetchApi('POST', '/logout', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (response.success) {
                onLogout();
                navigation.navigate('Home');
            } else {
                console.error('Failed to logout:', response.error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Modal
            transparent
            animationType="none"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.overlay} onPress={onClose} />
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
                    <TouchableOpacity style={styles.button} onPress={onEditProfile}>
                        <Text style={styles.buttonText}>Modifier profil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Déconnexion</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SettingsModal;

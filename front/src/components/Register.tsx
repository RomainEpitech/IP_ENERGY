import React, { useState, useEffect } from 'react';
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

    const [firstnameError, setFirstnameError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsFormValid(
            firstname &&
            name &&
            email &&
            password &&
            confirmPassword &&
            !firstnameError &&
            !nameError &&
            !emailError &&
            !passwordError &&
            !confirmPasswordError &&
            !passwordMatchError
        );
    }, [firstname, name, email, password, confirmPassword, firstnameError, nameError, emailError, passwordError, confirmPasswordError, passwordMatchError]);

    const validateField = (field, value) => {
        switch (field) {
            case 'firstname':
                setFirstnameError(value ? '' : 'Le prénom est requis');
                break;
            case 'name':
                setNameError(value ? '' : 'Le nom est requis');
                break;
            case 'email':
                setEmailError(value && /\S+@\S+\.\S+/.test(value) ? '' : 'Email invalide');
                break;
            case 'password':
                setPasswordError(value ? '' : 'Le mot de passe est requis');
                break;
            case 'confirmPassword':
                setConfirmPasswordError(value ? '' : 'Confirmation du mot de passe est requise');
                break;
            default:
                break;
        }
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        validateField('password', text);
        if (text !== confirmPassword) {
            setPasswordMatchError('Les mots de passe ne correspondent pas.');
        } else {
            setPasswordMatchError('');
        }
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        validateField('confirmPassword', text);
        if (text !== password) {
            setPasswordMatchError('Les mots de passe ne correspondent pas.');
        } else {
            setPasswordMatchError('');
        }
    };

    const handleRegister = async () => {
        validateField('firstname', firstname);
        validateField('name', name);
        validateField('email', email);
        validateField('password', password);
        validateField('confirmPassword', confirmPassword);

        if (password !== confirmPassword) {
            setConfirmPasswordError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (!isFormValid) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs correctement.");
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
                style={[styles.input, firstnameError ? styles.errorInput : null]}
                placeholder="Prénom"
                value={firstname}
                onChangeText={(text) => {
                    setFirstname(text);
                    validateField('firstname', text);
                }}
            />
            {firstnameError ? <Text style={styles.errorText}>{firstnameError}</Text> : null}
            <TextInput
                style={[styles.input, nameError ? styles.errorInput : null]}
                placeholder="Nom"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    validateField('name', text);
                }}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            <TextInput
                style={[styles.input, emailError ? styles.errorInput : null]}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    validateField('email', text);
                }}
                keyboardType="email-address"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <TextInput
                style={[styles.input, passwordError ? styles.errorInput : null]}
                placeholder="Mot de passe"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <TextInput
                style={[styles.input, confirmPasswordError || passwordMatchError ? styles.errorInput : null]}
                placeholder="Confirmer mot de passe"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            {passwordMatchError ? <Text style={styles.errorText}>{passwordMatchError}</Text> : null}
            <TouchableOpacity
                style={[styles.button, !isFormValid ? styles.disabledButton : null]}
                onPress={handleRegister}
                disabled={!isFormValid}
            >
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
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginLeft: '10%',
    },
    button: {
        width: '80%',
        padding: 15,
        backgroundColor: '#28a745',
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 10,
    },
    disabledButton: {
        backgroundColor: '#a9a9a9',
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

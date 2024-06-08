import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/utils/authContext';
import Login from './src/components/Login';
import HomePage from './src/screens/HomePage';
import ProtectedRoute from './src/security/protectedRoutes';
import Profile from './src/screens/ProfilePage';

const Stack = createStackNavigator();

const App: React.FC = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Home" component={HomePage} />
                    <Stack.Screen name="Profile">
                        {() => (
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        )}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
};

export default App;

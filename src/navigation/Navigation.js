import React, { useEffect, useState } from 'react';
import { Button, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuNavigation from './MenuNavigation';
import BackButton from '../components/BackButton';
import MenuButton from '../components/MenuButton';
import OnBoardScreen from '../screens/account/OnBoard';
import SignUpScreen from '../screens/account/SignUp';
import SignInScreen from '../screens/account/SignIn';
import ForgotPasswordScreen from '../screens/account/ForgotPassword';

import CustomizeScreen from '../screens/orders/Customize';
import AddressScreen from '../screens/orders/Address';
import InvoiceScreen from '../screens/orders/Invoice';

import EditProfileScreen from '../screens/profile/EditProfile';
import EditAddressScreen from '../screens/profile/EditAddress';

const Stack = createStackNavigator();

function GuestStack() {

    return (
        <Stack.Navigator
            initialRouteName="OnBoard" >
            <Stack.Screen
                name="OnBoard"
                component={OnBoardScreen}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen
                name="Auth"
                component={AuthStack}
                options={{
                    headerShown: false
                }} />
        </Stack.Navigator >
    );
}

function AuthStack() {

    function LogoTitle({ step, text }) {
        return (
            <View style={styles.multiTitle} >
                <Text style={styles.title}>
                    {step}
                </Text>
                <Text style={styles.title}>
                    {text}
                </Text>
            </View>
        );
    }

    function LogoTitle2({ step, text }) {
        return (
            <View style={styles.multiTitle2} >
                <Text style={styles.title2}>
                    {step}
                </Text>
                <Text style={styles.title2}>
                    {text}
                </Text>
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName="Auth" >
            <Stack.Screen
                name="Guest"
                component={GuestStack}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen
                name="Auth"
                component={MenuNavigation}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen
                name="Customize"
                component={CustomizeScreen}
                options={({ navigation }) => ({
                    headerLeft: props => <BackButton navigation={navigation} />,
                    headerTitle: props => <LogoTitle step={'Step 2:'} text={'Choose your frame'} {...props} />,
                    headerStyle: {
                        backgroundColor: '#F52D56',
                        height: 108
                    }
                })} />
            <Stack.Screen
                name="Address"
                component={AddressScreen}
                options={({ navigation }) => ({
                    headerLeft: props => <BackButton navigation={navigation} />,
                    headerTitle: props => <LogoTitle2 step={'Step 3:'} text={'Enter your details'} {...props} />,
                    headerStyle: {
                        backgroundColor: '#F52D56',
                        height: 108
                    }
                })} />
            <Stack.Screen
                name="Invoice"
                component={InvoiceScreen}
                options={({ navigation }) => ({
                    headerLeft: props => <BackButton navigation={navigation} />,
                    headerTitle: (
                        <Text
                            allowFontScaling={false}
                            style={styles.title}>
                            Summary
                        </Text>
                    ),
                    headerStyle: {
                        backgroundColor: '#F52D56',
                    }
                })} />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={({ navigation }) => ({
                    headerLeft: props => <BackButton navigation={navigation} />,
                    headerTitle: (
                        <Text
                            allowFontScaling={false}
                            style={styles.title}>
                            Edit my details
                        </Text>
                    ),
                    headerStyle: {
                        backgroundColor: '#F52D56',
                    }
                })} />
            <Stack.Screen
                name="EditAddress"
                component={EditAddressScreen}
                options={({ navigation }) => ({
                    headerLeft: props => <BackButton navigation={navigation} />,
                    headerTitle: (
                        <Text
                            allowFontScaling={false}
                            style={styles.title}>
                            Edit address
                        </Text>
                    ),
                    headerStyle: {
                        backgroundColor: '#F52D56',
                    }
                })} />
        </Stack.Navigator >
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 22,
        color: '#FFF',
        marginLeft: Platform.OS == 'ios' ? -60 : 0
    },
    multiTitle: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 22,
        paddingTop: 0,
        color: '#FFF',
        marginLeft: Platform.OS == 'ios' ? -0 : 0
    },
    title2: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 22,
        color: '#FFF',
        marginLeft: Platform.OS == 'ios' ? -90 : 0
    },
    multiTitle2: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 22,
        paddingTop: 0,
        color: '#FFF',
        marginLeft: Platform.OS == 'ios' ? -0 : 0
    }
});

export default function AppNavigator() {

    const [authenticate, setAuthenticate] = useState(false);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        let token = await AsyncStorage.getItem('token');
        if (token) {
            setAuthenticate(true);
        } else {
            setAuthenticate(false);
        }
    }

    if (!authenticate) {
        return (
            <NavigationContainer>
                <GuestStack />
            </NavigationContainer>
        );
    } else {
        return (
            <NavigationContainer>
                <AuthStack />
            </NavigationContainer>
        );
    }
}
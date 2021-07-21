import React, { useState, Fragment } from 'react';
import { Alert, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from '../../services/Axios';
import { Button, Input } from 'react-native-elements';
import { validateEmail } from '../../utils/Helpers';
import BackButton from '../../components/BackButton';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const SignIn = ({ ...props }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const _LoginWithMail = async () => {
        if (email == '' || password == '') {
            Alert.alert('Error', 'Please fill in all the fields.');
            return false;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email.');
            return false;
        }
        try {
            setLoading(true);
            let response = await API.post('/login', {
                email,
                password
            });
            setLoading(false);
            if (response.data.state) {
                let { authorization } = response.headers;
                let { email: email_user, name, user_id } = response.data.user;
                AsyncStorage.setItem('token', authorization);
                AsyncStorage.setItem('email', email_user);
                AsyncStorage.setItem('name', name);
                AsyncStorage.setItem('user_id', user_id.toString());
                props.navigation.push('Auth');
            } else {
                Alert.alert('Error', response.data.msg);
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    const goToForgotPassword = () => {
        props.navigation.push('ForgotPassword');
    }

    return (
        <Fragment>
            <StatusBar barStyle="light-content" translucent={true} />
            <ScrollView style={styles.root}>
                <View style={{ marginTop: STATUSBAR_HEIGHT + 20 }} >
                    <BackButton navigation={props.navigation} />
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        style={{ width: 70, height: 62, alignSelf: 'center' }}
                        source={require('../../assets/images/popframes.png')} />
                </View>
                <Text
                    allowFontScaling={false}
                    style={styles.title}>
                    Enter your data to enter
                </Text>
                <Input
                    allowFontScaling={false}
                    inputContainerStyle={{ borderBottomColor: '#FFF', marginTop: 24 }}
                    inputStyle={{ color: '#FFF', fontFamily: 'SFUIText-Regular' }}
                    placeholderTextColor='#FFF'
                    placeholder='Email'
                    keyboardType="email-address"
                    onChangeText={text => setEmail(text)}
                />
                <Input
                    allowFontScaling={false}
                    inputContainerStyle={{ borderBottomColor: '#FFF', marginVertical: 20 }}
                    inputStyle={{ color: '#FFF', fontFamily: 'SFUIText-Regular' }}
                    placeholderTextColor='#FFF'
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                />
                <Button
                    activeOpacity={0.6}
                    onPress={_LoginWithMail}
                    loading={loading}
                    loadingProps={{ color: '#4B187F' }}
                    buttonStyle={styles.mailButton}
                    titleStyle={styles.mailText}
                    title="Log In"
                />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={goToForgotPassword}
                    style={styles.forgetTextContainer}>
                    <Text
                        allowFontScaling={false}
                        style={styles.forgetText}>
                        Forget your password?
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#4B187F',
        padding: 16
    },
    imageContainer: {
        width: 110,
        height: 110,
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'SFUIText-Bold',
        color: '#FFFFFF'
    },
    forgetTextContainer: {
        backgroundColor: '#4B187F',
        justifyContent: 'center',
        height: 40,
        marginVertical: 20
    },
    forgetText: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 14,
        textAlign: 'center',
        color: "#FFF"
    },
    mailButton: {
        marginTop: 42,
        paddingVertical: 12,
        marginBottom: 0,
        borderRadius: 10,
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#4B187F',
        height: 52
    },
    loading: {
        color: 'red'
    },
    mailText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold',
        color: '#4B187F'
    }
});

export default SignIn;
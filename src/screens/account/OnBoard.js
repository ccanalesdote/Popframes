import React, { useState, useEffect, useRef } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import InstagramLogin from 'react-native-instagram-login';
import { Button } from 'react-native-elements';
import ImageWalkthrough from '../../assets/images/walkthrough.png';
import Swiper from '../../components/Swiper';
import Icon from 'react-native-vector-icons/Ionicons';

const swiperSlides = [
    {
        photo: ImageWalkthrough,
        title: 'Decorate your house with your memories'
    },
    {
        photo: ImageWalkthrough,
        title: 'Decorate your house with your memories 2'
    },
    {
        photo: ImageWalkthrough,
        title: 'Decorate your house with your memories 3'
    },
    {
        photo: ImageWalkthrough,
        title: 'Decorate your house with your memories 4'
    },
];

const OnBoard = ({ ...props }) => {

    const _instagramLoginRef = useRef(null);

    useEffect(() => {
        console.log(_instagramLoginRef);
    }, [_instagramLoginRef])

    const signInAsync = () => {
        //
    }

    const goToSignIn = () => {
        props.navigation.push('SignIn')
    }

    const goToSignUp = () => {
        props.navigation.push('SignUp');
    }

    const goToForgotPassword = () => {
        //props.navigation.push('ForgotPassword')
    }

    const loginInstagram = async (data) => {
        console.log(data);
        AsyncStorage.setItem('access_token', data.access_token);
        AsyncStorage.setItem('user_id', (data.user_id).toString());
        props.navigation.push('Auth');
    }

    return (
        <View style={styles.root}>
            <View style={styles.swiperCointainer}>
                <Swiper
                    extraStyles={{
                        root: {
                            marginHorizontal: -24
                        }
                    }}
                    slides={swiperSlides}
                />
            </View>
            <View style={styles.body}>
                {/* <Button
                    icon={
                        <Icon
                            name="logo-instagram"
                            size={32}
                            color="white"
                        />
                    }
                    onPress={() => _instagramLoginRef.current.show()}
                    allowFontScaling={false}
                    buttonStyle={styles.instagramButton}
                    titleStyle={styles.instagramText}
                    title="Continuar con Instagram"
                /> */}
                <Button
                    activeOpacity={0.6}
                    allowFontScaling={false}
                    onPress={goToSignUp}
                    buttonStyle={styles.mailButton}
                    titleStyle={styles.mailText}
                    title="Sign up with email"
                />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={goToSignIn}
                    style={styles.loginLink}>
                    <Text
                        allowFontScaling={false}
                        style={styles.login}>
                        Already have an account? <Text style={{ fontFamily: 'SFUIText-Bold' }}>Log In</Text>
                    </Text>
                </TouchableOpacity>
                {/* <InstagramLogin
                    ref={_instagramLoginRef}
                    appId='211059646802354'
                    appSecret='3a76f6b919fa1100569d19c2c77b5896'
                    redirectUrl="https://www.google.com/"
                    scopes={['user_profile', 'user_media']}
                    onLoginSuccess={loginInstagram}
                    onLoginFailure={(data) => console.log(data)}
                /> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#FFF',
        paddingTop: 20
    },
    swiperCointainer: {
        paddingHorizontal: 24,
        marginBottom: 0,
    },
    body: {
        padding: 24,
        backgroundColor: '#F7F7F7'
    },
    loginLink: {
        height: 40,
        marginVertical: 20,
        justifyContent: 'center',
        marginBottom: 20
    },
    login: {
        fontFamily: 'SFUIText-Regular',
        fontSize: 14,
        textAlign: 'center',
        color: "#9B9B9B"
    },
    instagramButton: {
        paddingVertical: 8,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#4B187F',
        justifyContent: 'flex-start'
    },
    mailButton: {
        paddingVertical: 9,
        marginBottom: 0,
        borderRadius: 10,
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#4B187F',
        height: 52
    },
    instagramText: {
        marginLeft: 40,
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold'
    },
    mailText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold',
        color: '#4B187F'
    }
});

export default OnBoard;
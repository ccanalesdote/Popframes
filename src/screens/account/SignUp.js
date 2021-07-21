import React, { Fragment, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API } from '../../services/Axios';
import { Button, CheckBox, Input } from 'react-native-elements';
import { validateEmail } from '../../utils/Helpers';
import BackButton from '../../components/BackButton';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const SignUp = ({ ...props }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [offers, setOffers] = useState(false);
    const [loading, setLoading] = useState(false);

    const goToSignIn = () => {
        props.navigation.push('SignIn')
    }

    const _signUp = async () => {
        if (email == '' || password == '' || name == '' || repeatPassword == '') {
            Alert.alert('Error', 'Please fill in all the fields.');
            return false;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email.');
            return false;
        }
        if (password != repeatPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return false;
        }
        try {
            setLoading(true);
            let response = await API.post('/user', {
                name,
                email,
                password
            });
            setLoading(false);
            console.log(response.data);
            if (response.data.state) {
                Alert.alert('Success', response.data.msg);
                props.navigation.push('SignIn');
            } else {
                Alert.alert('Error', response.data.msg);
            }
        } catch (error) {
            Alert.alert(error);
        }
    }

    return (
        <Fragment>
            <StatusBar barStyle="light-content" translucent={true} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.root}>
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
                    Enter your data {'\n'}to create an account
                </Text>
                <Input
                    allowFontScaling={false}
                    inputContainerStyle={{ borderBottomColor: '#FFF', marginTop: 24 }}
                    inputStyle={{ color: '#FFF', fontFamily: 'SFUIText-Regular' }}
                    placeholderTextColor='#FFF'
                    placeholder='Name'
                    onChangeText={text => setName(text)}
                    value={name}
                />
                <Input
                    allowFontScaling={false}
                    inputContainerStyle={{ borderBottomColor: '#FFF', marginTop: 20 }}
                    inputStyle={{ color: '#FFF', fontFamily: 'SFUIText-Regular' }}
                    placeholderTextColor='#FFF'
                    placeholder='Email'
                    onChangeText={text => setEmail(text)}
                    value={email}
                />
                <Input
                    allowFontScaling={false}
                    inputContainerStyle={{ borderBottomColor: '#FFF', marginTop: 20 }}
                    inputStyle={{ color: '#FFF', fontFamily: 'SFUIText-Regular' }}
                    placeholderTextColor='#FFF'
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                    value={password}
                />
                <Input
                    allowFontScaling={false}
                    inputContainerStyle={{ borderBottomColor: '#FFF', marginTop: 20 }}
                    inputStyle={{ color: '#FFF', fontFamily: 'SFUIText-Regular' }}
                    placeholderTextColor='#FFF'
                    placeholder='Repeat&nbsp;la&nbsp;password'
                    secureTextEntry={true}
                    onChangeText={text => setRepeatPassword(text)}
                    value={repeatPassword}
                />
                <CheckBox
                    activeOpacity={0.6}
                    allowFontScaling={false}
                    containerStyle={{ backgroundColor: '#4B187F', borderWidth: 0, marginVertical: 20 }}
                    fontFamily="SFUIText-Regular"
                    checkedColor='#FFF'
                    textStyle={{ fontSize: 18, color: '#FFF', fontWeight: 'normal' }}
                    title='Keep me up to date with offers & deals'
                    onPress={() => setOffers(!offers)}
                    checked={offers}
                />
                <Button
                    activeOpacity={0.6}
                    buttonStyle={styles.mailButton}
                    titleStyle={styles.mailText}
                    loading={loading}
                    loadingProps={{ color: '#4B187F' }}
                    title="Register"
                    onPress={_signUp}
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
                <View style={{ height: Platform.OS == 'ios' ? 180 : 0 }} />
            </ScrollView>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#4B187F',
        padding: 16,
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
    loginLink: {
        height: 40,
        marginVertical: 20,
        justifyContent: 'center'
    },
    login: {
        fontFamily: 'SFUIText-Regular',
        fontSize: 14,
        textAlign: 'center',
        color: "#FFF"
    },
    mailButton: {
        paddingVertical: 12,
        marginBottom: 0,
        borderRadius: 10,
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#4B187F',
        height: 52
    },
    mailText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold',
        color: '#4B187F'
    }
});

export default SignUp;
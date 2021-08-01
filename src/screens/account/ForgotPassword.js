import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { API } from '../../services/Axios';
import { Button, Input } from 'react-native-elements';
import { validateEmail } from '../../utils/Helpers';
import BackButton from '../../components/BackButton';
import { ConfirmDialog } from 'react-native-simple-dialogs';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const ForgotPassword = ({ ...props }) => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMsg, setDialogMsg] = useState('');

    const recover = async () => {
        if (email == '') {
            setDialogVisible(true);
            setDialogTitle('Error');
            setDialogMsg('Please complete the email');            
            return false;
        }
        if (!validateEmail(email)) {
            setDialogVisible(true);
            setDialogTitle('Error');
            setDialogMsg('Please enter a valid email');            
            return false;
        }
        try {
            setLoading(true);
            let response = await API.post('/recover_password', {
                email
            });
            setLoading(false);
            if (response.data.state) {
                setDialogVisible(true);
                setDialogTitle('Success');
                setDialogMsg(response.data.msg);
            } else {
                setDialogVisible(true);
                setDialogTitle('Error');
                setDialogMsg(response.data.msg);
            }
        } catch (error) {
            setDialogVisible(true);
            setDialogTitle('Error');
            setDialogMsg(error.message);            
        }
    }

    return (
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
                Enter your email
            </Text>
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#FFF', marginTop: 20 }}
                inputStyle={{ color: '#FFF', fontFamily: 'SFUIText-Regular' }}
                placeholderTextColor='#FFF'
                placeholder='Email'
                keyboardType="email-address"
                onChangeText={text => setEmail(text)}
            />
            <Button
                activeOpacity={0.6}
                onPress={recover}
                buttonStyle={styles.mailButton}
                titleStyle={styles.mailText}
                loading={loading}
                loadingProps={{ color: '#4B187F' }}
                title="Recover password"
            />
            <ConfirmDialog
                title={dialogTitle}
                message={dialogMsg}
                visible={dialogVisible}
                onTouchOutside={() => setDialogVisible(false)}
                positiveButton={{
                    title: "OK",
                    titleStyle: { color: '#4B187F' },
                    onPress: () => setDialogVisible(false)
                }}
            >
            </ConfirmDialog>
        </ScrollView>
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
    mailButton: {
        paddingVertical: 12,
        marginVertical: 40,
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

export default ForgotPassword;
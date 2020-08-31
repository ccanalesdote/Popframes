import React, { useState, useEffect } from 'react';
import { Alert, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

const Profile = ({ ...props }) => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState([]);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getUser();
            getUserAddress();
        });
        return unsubscribe;
    }, [props.navigation]);

    useEffect(() => {
        getUser();
        getUserAddress();
    }, []);

    const getUser = async () => {
        let email = await AsyncStorage.getItem('email');
        let name = await AsyncStorage.getItem('name');
        setEmail(email);
        setName(name);
    }

    const getUserAddress = async () => {
        let token = await AsyncStorage.getItem('token');
        let UID = await AsyncStorage.getItem('user_id');
        let response = await fetch(`http://api.impri.cl/user_address?user_id=${UID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let result = await response.json();
        if (result.state) {
            setAddress(result.address);
        } else {
            setAddress([]);
        }
    }

    const deleteAddress = async (address_id) => {
        let token = await AsyncStorage.getItem('token');
        let response = await fetch(`http://api.impri.cl/user_address?address_id=${address_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let result = await response.json();
        if (result.state) {
            Alert.alert('Success', result.msg);
            getUserAddress();
        } else {
            Alert.alert('Error', result.msg);
        }
    }

    const handleDelete = async (address_id) => {
        Alert.alert(
            'Delete Address',
            'Are you sure to delete the address?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => deleteAddress(address_id) }
            ],
            { cancelable: false }
        );
    }

    return (
        <ScrollView style={styles.root}>
            <Text
                allowFontScaling={false}
                style={styles.title}>
                My personal information
			</Text>
            <Card containerStyle={{ borderRadius: 10, borderColor: '#FFF', height: 100, padding: 14 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2, marginTop: 10 }}>
                        <Text
                            allowFontScaling={false}
                            style={styles.name}>
                            {name}
                        </Text>
                        <Text
                            allowFontScaling={false}
                            style={styles.text}>
                            {email}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => props.navigation.push('EditProfile')}>
                            <View style={styles.buttonCircle}>
                                <Icon
                                    name="pencil"
                                    size={26}
                                    color="#FFF"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
            <Text
                allowFontScaling={false}
                style={styles.title}>
                My addresses
			</Text>
            {
                address.map((item, index) => (
                    <Card key={index} containerStyle={{ borderRadius: 10, borderColor: '#FFF', height: 130, padding: 14 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2, marginTop: 10 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={styles.name}>
                                    {item.name}
                                </Text>
                                <Text
                                    allowFontScaling={false}
                                    style={styles.text}>
                                    {item.address}{'\n'}
                                    {item.commune}, {item.province}{'\n'}
                                    {item.region}
                                </Text>
                            </View>
                            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => props.navigation.push('EditAddress', { address_id: item.id })}
                                    style={{ marginRight: 10 }}>
                                    <View style={styles.buttonCircle}>
                                        <Icon
                                            name="pencil"
                                            size={26}
                                            color="#FFF"
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => handleDelete(item.id)}>
                                    <View style={styles.buttonCircle}>
                                        <Icon
                                            name="trash-can-outline"
                                            size={26}
                                            color="#FFF"
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Card>
                ))
            }
            <View style={{ height: 40 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    title: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 24,
        paddingHorizontal: 24,
        marginTop: 24,
        textAlign: 'left',
        color: '#929292'
    },
    name: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 14,
        textAlign: 'left',
        color: '#000'
    },
    text: {
        marginTop: 10,
        fontFamily: 'SFUIText-Regular',
        fontSize: 14,
        textAlign: 'left',
        color: '#9B9B9B'
    },
    buttonCircle: {
        borderRadius: 50,
        width: 40,
        height: 40,
        backgroundColor: '#F52D56',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    }
});

export default Profile;
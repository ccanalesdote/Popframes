import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { API } from '../../services/Axios';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Invoice = ({ ...props }) => {

    const [load, setLoad] = useState(false);
    const [order, serOrder] = useState([]);

    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = async () => {
        setLoad(true);
        let order_id = await AsyncStorage.getItem('order_id');
        console.log(order_id);
        let response = await API.get('/order', {
            params: {
                order_id
            }
        });
        setLoad(false);
        if (response.data.state) {
            console.log(response.data.order);
            serOrder(response.data.order);
        } else {
            serOrder([]);
        }
    }

    const main = async () => {
        props.navigation.navigate('Auth');  
    }

    return (
        <View style={styles.root}>
            <ScrollView>
                {
                    load ?
                        <ActivityIndicator size="small" color="#000" /> :
                        <Card containerStyle={{ borderRadius: 10, borderColor: '#FFF', height: 340, padding: 14 }}>
                            <Text
                                allowFontScaling={false}
                                style={styles.textTitle}>
                                Order paid successfully
                            </Text>
                            <View
                                style={{
                                    marginTop: 20,
                                    marginBottom: 16,
                                    borderBottomColor: '#E3E3E3',
                                    borderBottomWidth: 1
                                }}
                            />
                            <Text
                                allowFontScaling={false}
                                style={styles.id}>
                                Order Number #{order.id}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 2, marginTop: 18 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.params}>
                                        Email
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.params}>
                                        Status
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.params}>
                                        Photos
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.params}>
                                        Total
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.params}>
                                        Date
                                    </Text>
                                </View>
                                <View style={{ flex: 4, marginTop: 18 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.text}>
                                        {order.email}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.text}>
                                        {order.status}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.text}>
                                        {order.quantity}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.text}>
                                        £{order.total}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.text}>
                                        {order.date}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginTop: 20,
                                    marginBottom: 16,
                                    borderBottomColor: '#E3E3E3',
                                    borderBottomWidth: 1
                                }}
                            />
                            <Text
                                allowFontScaling={false}
                                style={styles.text}>
                                {order.address_line_1} {order.address_line_2} {'\n' + order.city}
                            </Text>
                        </Card>
                }
            </ScrollView>
            <View>
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={main}>
                    <Text style={styles.payText}>Back to the start</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    id: {
        marginTop: 2,
        fontFamily: 'SFUIText-Regular',
        fontSize: 10,
        textAlign: 'left',
        color: '#9B9B9B'
    },
    params: {
        marginTop: 4,
        fontFamily: 'SFUIText-Regular',
        fontSize: 12,
        textAlign: 'left',
        color: '#9B9B9B'
    },
    text: {
        marginTop: 4,
        fontFamily: 'SFUIText-Semibold',
        fontSize: 12,
        textAlign: 'left',
        color: '#4B187F'
    },
    textTitle: {
        alignSelf: 'center',
        marginTop: 4,
        fontFamily: 'SFUIText-Semibold',
        fontSize: 14,
        textAlign: 'left',
        color: '#4B187F'
    },
    payButton: {
        position: 'absolute',
        bottom: 30,
        left: SCREEN_WIDTH * .1,
        width: SCREEN_WIDTH * .8,
        borderRadius: 10,
        backgroundColor: '#4B187F',
        height: 52,
        fontSize: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    payText: {
        fontSize: 18,
        fontFamily: 'SFUIText-Semibold',
        color: 'white'
    },
});

export default Invoice;
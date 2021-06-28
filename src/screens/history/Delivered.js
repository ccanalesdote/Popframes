import React, { useState, useEffect } from 'react';
import { API } from '../../services/Axios';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements';

const Delivered = () => {

    const [orders, serOrders] = useState([]);

    useEffect(() => {
        getUserOrders();
    }, []);

    const getUserOrders = async () => {
        let response = await API.get('/user_orders', {
            params: {
                state: 'delivered'
            }
        });
        if (response.data.state) {
            serOrders(response.data.orders);
        } else {
            serOrders([]);
        }
    }

    return (
        <ScrollView style={styles.root}>
            {
                orders.map((item, index) => (
                    <Card key={index} containerStyle={{ borderRadius: 10, borderColor: '#FFF', height: 200, padding: 14 }}>
                        <Text
                            allowFontScaling={false}
                            style={styles.id}>
                            Order Number #{item.id}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2, marginTop: 10 }}>
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
                            <View style={{ flex: 4, marginTop: 10 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={styles.text}>
                                    {item.email}
                                </Text>
                                <Text
                                    allowFontScaling={false}
                                    style={styles.text}>
                                    {item.status}
                                </Text>
                                <Text
                                    allowFontScaling={false}
                                    style={styles.text}>
                                    {item.quantity}
                                </Text>
                                <Text
                                    allowFontScaling={false}
                                    style={styles.text}>
                                    £{item.total}
                                </Text>
                                <Text
                                    allowFontScaling={false}
                                    style={styles.text}>
                                    {item.date}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                marginTop: 12,
                                marginBottom: 6,
                                borderBottomColor: '#E3E3E3',
                                borderBottomWidth: 1
                            }}
                        />
                        <Text
                            allowFontScaling={false}
                            style={styles.text}>
                            {item.address} #${item.number}, {item.comuna}.
                        </Text>
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
});

export default Delivered;
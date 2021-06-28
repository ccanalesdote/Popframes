import React, { useState, useEffect } from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const Orders = ({ ...props }) => {

    return (
        <View style={styles.root}>
            <View style={styles.body}>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#F7F7F7',
        padding: 24
    },
    payButton: {
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#4B187F'
    },
    payText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold'
    },
    scene: {
        flex: 1,
    }
});

export default Orders;
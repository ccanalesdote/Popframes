import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const Invoice = ({ ...props }) => {

    const [load, setLoad] = useState(false);

    return (
        <View style={styles.root}>
            <View style={styles.body}>
                <View>
                    <TouchableOpacity
                        style={styles.payButton}
                        onPress={console.log('final')}>
                        {
                            load ?
                                <ActivityIndicator size="small" color="#FFF" /> :
                                <Text style={styles.payText}>{totalDescription}</Text>
                        }
                    </TouchableOpacity>
                </View>
                {/* <Button
                    buttonStyle={styles.payButton}
                    titleStyle={styles.payText}
                    title="Pagar $6000"
                /> */}
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
        backgroundColor: '#F52D56'
    },
    payText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold'
    },
    scene: {
        flex: 1,
    }
});

export default Invoice;
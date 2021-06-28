import React, { useState, useEffect } from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const InstagramSearch = ({ ...props }) => {

    const goToCustomization = () => {
        props.navigation.navigate('Customize');
    }

    return (
        <View style={styles.root}>
            <Button
                onPress={goToCustomization}
                buttonStyle={styles.payButton}
                titleStyle={styles.payText}
                title="Print £6000" />
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
        borderRadius: 10,
        backgroundColor: '#4B187F'
    },
    payText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold'
    }
});

export default InstagramSearch;
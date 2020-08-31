import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BlankScreen from '../screens/orders/Blank';

const Tab = createMaterialTopTabNavigator();

export default function MenuNavigation({ ...props }) {
    return (
        <Tab.Navigator
            tabBarOptions={{
                style: { backgroundColor: '#FFF' },
                activeTintColor: '#FD2E61',
                inactiveTintColor: '#DAD9E2',
                labelStyle: { fontFamily: 'SFUIText-Semibold', fontSize: 14 },
                indicatorStyle: { backgroundColor: '#FD2E61' }
            }}>
            <Tab.Screen name="In Progress" component={BlankScreen} />
            <Tab.Screen name="Delivered" component={BlankScreen} />
            <Tab.Screen name="Canceled" component={BlankScreen} />
        </Tab.Navigator>
    );
}
import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BlankScreen from '../screens/orders/Blank';

const Tab = createMaterialTopTabNavigator();

export default function MenuNavigation({ ...props }) {
    return (
        <Tab.Navigator
            tabBarOptions={{
                style: { backgroundColor: '#FFF' },
                activeTintColor: '#7124BF',
                inactiveTintColor: '#DAD9E2',
                labelStyle: { fontFamily: 'SFUIText-Semibold', fontSize: 14 },
                indicatorStyle: { backgroundColor: '#7124BF' }
            }}>
            <Tab.Screen name="In Progress" component={BlankScreen} />
            <Tab.Screen name="Delivered" component={BlankScreen} />
            <Tab.Screen name="Canceled" component={BlankScreen} />
        </Tab.Navigator>
    );
}
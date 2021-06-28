import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProgressScreen from '../screens/history/Progress';
import DeliveredScreen from '../screens/history/Delivered';
import CanceledScreen from '../screens/history/Canceled';

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
            <Tab.Screen name="In Progress" component={ProgressScreen} />
            <Tab.Screen name="Delivered" component={DeliveredScreen} />
            <Tab.Screen name="Canceled" component={CanceledScreen} />
        </Tab.Navigator>
    );
}
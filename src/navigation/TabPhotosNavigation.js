import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/orders/Home';
import InstagramProfile from '../screens/orders/InstagramProfile';
import InstagramSearch from '../screens/orders/InstagramSearch';

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
            <Tab.Screen name="My Photos" component={HomeScreen} />
            <Tab.Screen name="My Instagram" component={InstagramProfile} />
        </Tab.Navigator>
    );
}
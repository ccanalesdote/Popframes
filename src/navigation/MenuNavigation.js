import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import TabPhotosNavigation from './TabPhotosNavigation';
import TabOrdersNavigation from './TabOrdersNavigation';
import MenuButton from '../components/MenuButton';
import ProfileScreen from '../screens/profile/Profile';
import WalletScreen from '../screens/profile/Wallet';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const LogOut = ({ ...props }) => {

	useEffect(() => {
		AsyncStorage.setItem('token', '');
		AsyncStorage.setItem('email', '');
		AsyncStorage.setItem('name', '');
		AsyncStorage.setItem('user_id', '');
		props.navigation.navigate('Guest');
	}, [])

	return null;
};

const HomeStack = () => {

	function LogoTitle() {
		return (
			<View style={styles.multiTitle} >
				<Text style={styles.title}>
					Step 1:
				</Text>
				<Text style={styles.title}>
					Select your photos
				</Text>
			</View>
		);
	}

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Home"
				component={TabPhotosNavigation}
				options={({ navigation }) => ({
					headerLeft: props => <MenuButton navigation={navigation} />,
					headerTitle: props => <LogoTitle {...props} />,
					headerStyle: {
						backgroundColor: '#4B187F',
						height: 108
					}
				})} />
		</Stack.Navigator>
	)
};

const ProfileStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Profile"
			component={ProfileScreen}
			options={({ navigation }) => ({
				headerLeft: props => <MenuButton navigation={navigation} />,
				headerTitle: (
					<Text
						allowFontScaling={false}
						style={styles.title}>
						My Profile
					</Text>
				),
				headerStyle: {
					backgroundColor: '#4B187F',
				}
			})} />
	</Stack.Navigator>
);

const OrdersStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Orders"
			component={TabOrdersNavigation}
			options={({ navigation }) => ({
				headerLeft: props => <MenuButton navigation={navigation} />,
				headerTitle: (
					<Text
						allowFontScaling={false}
						style={styles.title}>
						My Orders
					</Text>
				),
				headerStyle: {
					backgroundColor: '#4B187F',
				}
			})} />
	</Stack.Navigator>
);

const WalletStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Wallet"
			component={WalletScreen}
			options={({ navigation }) => ({
				headerLeft: props => <MenuButton navigation={navigation} />,
				headerTitle: (
					<Text
						allowFontScaling={false}
						style={styles.title}>
						Wallet
					</Text>
				),
				headerStyle: {
					backgroundColor: '#4B187F',
				}
			})} />
	</Stack.Navigator>
);

export default function MenuNavigation({ ...props }) {
	return (
		<Drawer.Navigator
			drawerContentOptions={{
				activeTintColor: '#4B187F',
				labelStyle: { fontFamily: 'SFUIText-Semibold' }
			}}
			drawerStyle={{
				backgroundColor: '#FFF',
				width: 220,
			}}
			initialRouteName="Home">
			<Drawer.Screen
				name="Home"
				component={HomeStack}
				options={{ drawerLabel: 'Home' }} />
			<Drawer.Screen
				name="Profile"
				component={ProfileStack}
				options={{ drawerLabel: 'My Profile' }} />
			<Drawer.Screen
				name="Orders"
				component={OrdersStack}
				options={{ drawerLabel: 'My Orders' }} />
			<Drawer.Screen
				name="Wallet"
				component={WalletStack}
				options={{ drawerLabel: 'Wallet' }} />
			<Drawer.Screen
				name="logout"
				component={LogOut}
				options={{ drawerLabel: 'Sign Out' }} />
		</Drawer.Navigator>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'SFUIText-Semibold',
		fontSize: 22,
		color: '#FFF'
	},
	multiTitle: {
		fontFamily: 'SFUIText-Semibold',
		fontSize: 18,
		paddingTop: 0,
		color: '#FFF',
		marginLeft: Platform.OS == 'ios' ? -40 : 0
	}
});
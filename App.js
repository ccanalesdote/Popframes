import React from 'react';
import { StatusBar } from 'react-native';
import Navigator from './src/navigation/Navigation';
import { RecoilRoot } from 'recoil';

const App = () => {
	return (
		<RecoilRoot>
			<StatusBar barStyle="light-content" translucent={true} />
			<Navigator />
		</RecoilRoot>
	);
};

export default App;
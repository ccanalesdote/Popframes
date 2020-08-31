import React from 'react';
import { View } from 'react-native';

const Separator = ({vertical=true, size=16, ...props}) => (
	<View style={{
		width: vertical ? 0 : size,
		height: vertical ? size : 0
	}} />
)

export default Separator;
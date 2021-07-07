import React, { useState, useEffect, useAnimation } from 'react';
import {
	Animated,
	Dimensions,
	FlatList,
	StyleSheet,
	View
} from 'react-native';

const { width } = Dimensions.get('window');

const SwiperIndicator = ({ ...props }) => {
	const { slidesNum, slideWidth } = props;
	const [progress, setProgress] = useState(new Animated.Value(0));

	useEffect(() => {
		let number = 1 * JSON.stringify(props.progress);
		setProgress(new Animated.Value(number));
	}, [props.progress]);

	return (
		<View style={{ height: 42, position: 'absolute', bottom: 20 }}>
			<FlatList
				keyExtractor={(item, index) => `indicator-bullet-${index}`}
				data={new Array(slidesNum).fill(null)}
				renderItem={({ index }) => (
					<View style={styles.bullet} />
				)}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				ItemSeparatorComponent={() => (
					<View style={styles.separator} />
				)}
				contentContainerStyle={{
					marginTop: 28
				}}
			/>

			<Animated.View style={[styles.bullet, styles.progressBullet, {
				transform: [
					{
						translateX: progress.interpolate({
							inputRange: [0, slideWidth * slidesNum - 48],
							outputRange: [-4, 4 * slidesNum + 16 * (slidesNum - 1) + 4],
							extrapolate: 'clamp'
						})
					}
				]
			}]} />
		</View>
	)
}

const styles = StyleSheet.create({
	bullet: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#8A8683'
	},
	progressBullet: {
		width: 8,
		height: 8,
		borderRadius: 4,
		position: 'absolute',
		left: 4,
		top: 28,
		backgroundColor: '#4B187F'
	},
	separator: {
		width: 10
	}
});

export default SwiperIndicator;
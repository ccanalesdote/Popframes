import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated, FlatList } from 'react-native';
import SwiperIndicator from './SwiperIndicator';
import Separator from './Separator';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width;
const SLIDE_PHOTO_WIDTH = width * 222 / 375;

const Swiper = ({ ...props }) => {

	const [currentX, setCurrentX] = useState(new Animated.Value(0));

	const scrollX = new Animated.Value(0);
	const onScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { x: scrollX } } }],
		{ listener: (event) => setCurrentX(event.nativeEvent.contentOffset.x) },
		{ useNativeDriver: true }
	);

	const renderSlide = ({ item, index }) => {
		return (
			<View style={styles.slide}>
				{(item.photo || item.photoUri) && (
					<Image
						source={item.photo || {
							uri: item.photoUri
						}}
						style={styles.slidePhoto} />
				)}
				<Text
					allowFontScaling={false}
					style={styles.slideTitle}>
					{item.title}
				</Text>
			</View>
		);
	}

	const { slides, extraStyles = {} } = props;

	return (
		<View style={[styles.root, extraStyles.root]}>
			<FlatList
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				pagingEnabled={true}
				decelerationRate={0.3}
				onScroll={onScroll}
				data={slides}
				renderItem={renderSlide}
				keyExtractor={item => item.title}
				style={{
					flexGrow: 0
				}}
				ListHeaderComponent={() => (
					<View style={styles.headerandfooter} />
				)}
			/>
			<SwiperIndicator
				slidesNum={slides.length}
				slideWidth={SLIDE_WIDTH}
				progress={currentX}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		alignItems: 'center'
	},
	slide: {
		width: SLIDE_WIDTH,
		alignItems: 'center'
	},
	slidePhoto: {
		width: width,
		height: width * 1.9
	},
	slideTitle: {
		bottom: 80,
		position: 'absolute',
		fontFamily: 'SFUIText-Bold',
		fontSize: 40,
		marginTop: 18,
		color: '#4B187F',
		textAlign: 'center'
	},
	slideSubtitle: {
		fontFamily: 'SF UI Text',
		fontSize: 16,
		marginTop: 14,
		letterSpacing: .7,
		color: '#bbb',
		textAlign: 'center'
	},
	miniSeparator: {
		width: 20,
		height: 2,
		borderRadius: 100,
		backgroundColor: '#F25C62',
		marginTop: 5
	},
	headerandfooter: {
		width: 0
	},
});

export default Swiper;
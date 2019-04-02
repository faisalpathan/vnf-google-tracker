import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Polyline } from 'react-google-maps';
import Constants from '../constants';
import {
	initialPositionSymbol,
	lastPositionSymbol,
	polylineColor,
	getOptionsForGoogleMaps,
} from '../constants/assests';
import { loadingElement, containerElement, mapElement } from './miniComponents';

const indicationIcons = [
	{
		icon: initialPositionSymbol,
		offset: '0%',
	},
	{
		icon: lastPositionSymbol,
		offset: '100%',
	},
];

const TrackUserLocation = compose(
	withProps({
		googleMapURL: Constants.GOOGLE_MAP_URL,
		loadingElement: loadingElement('100%'),
		containerElement: containerElement('82vh'),
		mapElement: mapElement(`100%`),
	}),
	withScriptjs,
	withGoogleMap
)(props => (
	<GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>
		<Polyline
			path={props.specificUserCoordinates}
			geodesic={true}
			options={getOptionsForGoogleMaps(polylineColor, 1, 4, '0%', indicationIcons)}
		/>
	</GoogleMap>
));

TrackUserLocation.propTypes = {
	specificUserCoordinates: PropTypes.array.isRequired,
	center: PropTypes.object,
	zoom: PropTypes.number,
};

TrackUserLocation.defaultProps = {
	specificUserCoordinates: [],
	center: {
		lat: 19.075983,
		lng: 72.877655,
	},
	zoom: 10,
};

export default TrackUserLocation;

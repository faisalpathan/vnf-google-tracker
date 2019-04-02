import React from 'react';
import PropTypes from 'prop-types';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps, withStateHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Constants from '../constants';
import { loadingElement, containerElement, mapElement } from './miniComponents';

const LiveUserMapComponent = compose(
	withProps({
		googleMapURL: Constants.GOOGLE_MAP_URL,
		loadingElement: loadingElement('100%'),
		containerElement: containerElement('88vh'),
		mapElement: mapElement(`100%`),
	}),
	withStateHandlers(
		() => ({
			isOpen: false,
			currentUserIndex: null,
		}),
		{
			showInfo: ({ isOpen, currentUserIndex }) => index => ({
				isOpen: currentUserIndex !== index || !isOpen,
				currentUserIndex: index,
			}),
		}
	),
	withScriptjs,
	withGoogleMap
)(props => (
	<GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>
		{props.coordinatesForAllUsers.map((coordinate, index) => (
			<Marker
				key={index}
				position={{ lat: coordinate.lat, lng: coordinate.lng }}
				onClick={() => {
					props.showInfo(index);
				}}
			>
				{props.isOpen &&
					props.currentUserIndex === index && (
						<InfoWindow onCloseClick={props.showInfo}>
							<Typography variant="body2" align="justify" color="primary">
								{coordinate.name}
							</Typography>
						</InfoWindow>
					)}
			</Marker>
		))}
	</GoogleMap>
));

LiveUserMapComponent.defaultProps = {
	center: {
		lat: 19.075983,
		lng: 72.877655,
	},
	zoom: 10,
	coordinatesForAllUsers: [],
	currentUserIndex: 0,
	isOpen: false,
};

LiveUserMapComponent.propTypes = {
	coordinatesForAllUsers: PropTypes.array,
	center: PropTypes.object,
	zoom: PropTypes.number,
	currentUserIndex: PropTypes.number,
	isOpen: PropTypes.bool,
};

export default LiveUserMapComponent;

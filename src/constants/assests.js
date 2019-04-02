export const intialPositionColor = '#292';
export const lastPositionColor = '#F00';
export const polylineColor = '#000';

export const initialPositionSymbol = {
	path: 'M -2,0 0,-2 2,0 0,2 z',
	strokeColor: lastPositionColor,
	fillColor: lastPositionColor,
	fillOpacity: 1,
};

export const lastPositionSymbol = {
	path: 'M -2,-2 2,2 M 2,-2 -2,2',
	strokeColor: intialPositionColor,
	strokeWeight: 4,
};

export const getOptionsForGoogleMaps = (
	color = polylineColor,
	strokeOpacity = 2,
	strokeWeight = 5,
	offset = '0px',
	icons = []
) => {
	return {
		strokeColor: color,
		strokeOpacity,
		strokeWeight,
		offset,
		icons,
	};
};

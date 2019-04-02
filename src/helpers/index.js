import moment from 'moment';

import { getLocationOfAllUsers, getListOfAllUsers, getUserCooridnates } from '../services';

export const getCoordinatesOfAllUsers = async () => {
	const allCoordinateDetails = await getLocationOfAllUsers();
	const parsedCoordinateDetails = parseCoordinatedData(allCoordinateDetails.data);
	return parsedCoordinateDetails;
};

const isEmptyObject = dataObject => {
	return !dataObject || Object.entries(dataObject).length === 0;
};

const parseCoordinatedData = coordinatedData => {
	const isEmptyData = isEmptyObject(coordinatedData);
	if (isEmptyData) {
		return [];
	} else if (!coordinatedData.live_location && coordinatedData.live_location.length === 0) {
		return [];
	} else {
		const parsedCoordinateDetails = [];
		for (let currentCoordianteData of coordinatedData.live_location) {
			const name = Object.keys(currentCoordianteData)[0];
			parsedCoordinateDetails.push({
				name,
				lat: currentCoordianteData[name].lat,
				lng: currentCoordianteData[name].lng,
				time: currentCoordianteData[name].time,
			});
		}
		return parsedCoordinateDetails;
	}
};

export const getUserList = async () => {
	const userList = await getListOfAllUsers();
	const isEmptyData = isEmptyObject(userList.data);
	return isEmptyData ? [] : Object.keys(userList.data);
};

const compareWithCurrentDate = date => {
	const currentDate = moment()
		.local()
		.format('YYYY-MM-DD');
	const remappedDate = moment(date)
		.local()
		.format('YYYY-MM-DD');
	if (currentDate === remappedDate) {
		return true;
	}
	return false;
};

const remapUserCoordinates = userCoordinates => {
	if (!userCoordinates || userCoordinates.length < 1) {
		return [];
	}
	const parsedUserCoordinates = [];
	for (let coordinate of userCoordinates) {
		if (compareWithCurrentDate(coordinate.time)) {
			parsedUserCoordinates.push({
				lat: coordinate.lat,
				lng: coordinate.lng,
			});
		}
	}
	return parsedUserCoordinates;
};

const getDistanceTravelByUserToday = parsedUserCoordinates => {
	let distanceTravelledByUser = 0;
	if (parsedUserCoordinates.length > 0) {
		for (let i = 0; i < parsedUserCoordinates.length; i++) {
			if (!parsedUserCoordinates[i + 1]) {
				return distanceTravelledByUser;
			}
			const initialLatAndLng = parsedUserCoordinates[i];
			const currentLatAndLng = parsedUserCoordinates[i + 1];
			const initialLat = initialLatAndLng.lat;
			const initialLng = initialLatAndLng.lng;
			const currentLat = currentLatAndLng.lat;
			const currentLng = currentLatAndLng.lng;
			distanceTravelledByUser += calculateDistanceTravelledByUserToday(
				initialLat,
				initialLng,
				currentLat,
				currentLng
			);
		}
		return distanceTravelledByUser;
	}
	return 0;
};

export const getUserSpecificCooridnates = async username => {
	const userCoordinates = await getUserCooridnates(username);
	const parsedUserCoordinates = remapUserCoordinates(userCoordinates.data);
	const distanceTravelledByUser = await getDistanceTravelByUserToday(parsedUserCoordinates);
	return [parsedUserCoordinates, distanceTravelledByUser.toFixed(2)];
};

export const calculateDistanceTravelledByUserToday = (
	initialLat,
	initialLng,
	currentLat,
	currentLng
) => {
	if (initialLat === currentLat && initialLng === currentLng) {
		return 0;
	} else {
		var radlat1 = (Math.PI * initialLat) / 180;
		var radlat2 = (Math.PI * currentLat) / 180;
		var theta = initialLng - currentLng;
		var radtheta = (Math.PI * theta) / 180;
		var dist =
			Math.sin(radlat1) * Math.sin(radlat2) +
			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;
		return dist * 1.609344;
	}
};

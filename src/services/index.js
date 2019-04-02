import axios from 'axios';
import Constants from '../constants';

export const TIMEOUT = Constants.AXIOS_TIMEOUT;

export const getLocationOfAllUsers = () =>
	axios({
		method: 'GET',
		url: `${Constants.GET_ALL_USER_LIVE_LOCATION}`,
		timeout: TIMEOUT,
		validateStatus: status => status < 505,
	});

export const getListOfAllUsers = () =>
	axios({
		method: 'GET',
		url: `${Constants.GET_USER_LIST_AND_SPECIFIC_USER_LOCATION}.json?shallow=true`,
		timeout: TIMEOUT,
		validateStatus: status => status < 505,
	});

export const getUserCooridnates = username =>
	axios({
		method: 'GET',
		url: `${Constants.GET_USER_LIST_AND_SPECIFIC_USER_LOCATION}/${username}.json`,
		timeout: TIMEOUT,
		validateStatus: status => status < 505,
	});

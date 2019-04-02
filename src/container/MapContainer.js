import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LocationOn from '@material-ui/icons/LocationOn';
import TrackChanges from '@material-ui/icons/TrackChanges';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { getCoordinatesOfAllUsers, getUserList, getUserSpecificCooridnates } from '../helpers';
import TrackUserLocation from '../components/TrackUserLocation';
import LiveUserMapComponent from '../components/LiveUserMapComponent';
import SelectComponent from '../components/SelectComponent';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	markerTitleStyle: {
		width: '21vw',
	},
	selectComponentStyle: {
		margin: theme.spacing.unit,
		minWidth: '40vw',
	},
	userLocationContainerStyle: {
		width: '100%',
	},
});

class MapContainer extends Component {
	state = {
		value: 0,
		coordinatesForAllUsers: [],
		specificUserCoordinates: [],
		selectedUser: '',
		userList: [],
		distanceTravelledByUser: '0',
	};

	async componentDidMount() {
		return this.handleUpdateUserLiveCoordinate();
	}

	handleGetUserSpecificData = async () => {
		const { selectedUser } = this.state;
		if (!selectedUser) {
			return;
		}
		const [specificUserCoordinates, distanceTravelledByUser] = await getUserSpecificCooridnates(
			selectedUser
		);
		if (specificUserCoordinates.length > 0) {
			return this.setState({
				specificUserCoordinates,
				distanceTravelledByUser,
			});
		}
		return alert('User has not travelled today, please select another user');
	};

	handleUserChange = event => {
		this.setState({ [event.target.name]: event.target.value }, this.handleGetUserSpecificData);
	};

	handleUpdateUserLiveCoordinate = async () => {
		const allUserCoordinates = await getCoordinatesOfAllUsers();
		if (allUserCoordinates.length > 0) {
			this.setState({
				coordinatesForAllUsers: allUserCoordinates,
			});
		}
	};

	handleGetUserList = async () => {
		const { userList } = this.state;
		const allUsers = await getUserList();
		if (userList.length < 1) {
			if (allUsers.length > 1) {
				this.setState({ userList: allUsers });
			}
		}
	};

	handleOnTabMount = () => {
		const { value } = this.state;
		if (value === 0) {
			return this.handleUpdateUserLiveCoordinate();
		}
		if (value === 1) {
			return this.handleGetUserList();
		}
	};

	handleTabChange = (event, value) => {
		this.setState(prevState => {
			if (prevState.value === value) {
				return;
			}
			return {
				value,
			};
		}, this.handleOnTabMount);
	};

	renderGoogleMapComponent = () => {
		const { coordinatesForAllUsers } = this.state;
		const { zoom, center } = this.props;
		return (
			<LiveUserMapComponent
				zoom={zoom}
				center={center}
				coordinatesForAllUsers={coordinatesForAllUsers}
			/>
		);
	};

	renderUserTravelHistoryComponent = () => {
		const { specificUserCoordinates, selectedUser, userList, distanceTravelledByUser } = this.state;
		const { classes, center, zoom } = this.props;
		return (
			<Paper>
				<Grid
					classes={{ container: classes.userLocationContainerStyle }}
					container
					direction="row"
					justify="space-evenly"
					alignItems="center"
				>
					<FormControl className={classes.selectComponentStyle}>
						<SelectComponent
							lable="Select User"
							selectedUser={selectedUser}
							userList={userList}
							name="selectedUser"
							handleUserChange={this.handleUserChange}
						/>
					</FormControl>
					<Typography variant="h6" gutterBottom color="primary" align="center">
						Distance Travelled by the User is{' '}
						<Typography variant="body1" align="center" color="secondary">
							{distanceTravelledByUser} Kms
						</Typography>
					</Typography>
				</Grid>
				<TrackUserLocation
					zoom={zoom}
					center={center}
					specificUserCoordinates={specificUserCoordinates}
				/>
			</Paper>
		);
	};

	render() {
		const { classes } = this.props;
		const { value } = this.state;
		return (
			<div>
				<Paper className={classes.root}>
					<Tabs
						value={value}
						onChange={this.handleTabChange}
						indicatorColor="primary"
						textColor="primary"
						centered
						variant="fullWidth"
					>
						<Tab label="LIVE LOCATION" icon={<LocationOn />} />
						<Tab label="USER LOCATION" icon={<TrackChanges />} />
					</Tabs>
					{value === 0 && this.renderGoogleMapComponent()}
					{value === 1 && this.renderUserTravelHistoryComponent()}
				</Paper>
			</div>
		);
	}
}

MapContainer.propTypes = {
	classes: PropTypes.object.isRequired,
};

MapContainer.defaultProps = {
	center: {
		lat: 19.075983,
		lng: 72.877655,
	},
	zoom: 10,
};

export default withStyles(styles)(MapContainer);

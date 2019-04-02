import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

class SelectComponent extends PureComponent {
	render() {
		const { selectedUser, label, userList, name, handleUserChange } = this.props;
		return (
			<>
				<InputLabel htmlFor={`${name}-simple`}>{label}</InputLabel>
				<Select
					value={selectedUser}
					onChange={handleUserChange}
					inputProps={{
						name: name,
						id: `${name}-simple`,
					}}
				>
					<MenuItem value="">
						<em>None</em>
					</MenuItem>
					{userList.map((user, index) => {
						return (
							<MenuItem value={user} key={user + index}>
								{user}
							</MenuItem>
						);
					})}
				</Select>
			</>
		);
	}
}

SelectComponent.propTypes = {
	selectedUser: PropTypes.string,
	label: PropTypes.string,
	userList: PropTypes.array,
	name: PropTypes.string,
	handleUserChange: PropTypes.func,
};

SelectComponent.defaultProps = {
	selectedUser: '',
	label: 'Custom label',
	userList: [],
	name: 'Custom name',
	handleUserChange: () => {},
};

export default SelectComponent;

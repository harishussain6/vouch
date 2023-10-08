import React, { useState } from 'react';
import { Button, withStyles } from '@material-ui/core';
import JwtService from 'app/services/jwtService';
import PointsDialog from './PointsDialog';

const styles = () => ({
	button: {
		marginRight: 8
	}
});
function Points({ classes, reload, email }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({});
	const [message, setMessage] = useState(null);
	const axios = JwtService.getAxios();

	function handleOpen() {
		setOpen(true);
	}
	function handleClose() {
		setOpen(false);
	}
	async function handleClick(points) {
		setLoading(true);
		try {
			const res = await axios.get('/api/admin/add-points-user', {
				params: { points, email }
			});

			if (res.data.status) {
				setOpen(false);
				reload();
			} else {
				setMessage(res.data.message);
				setError(res.data.errors);
			}
		} catch (error) {
			console.log(error);
			setError(error);
		}
		setLoading(false);
	}
	return (
		<>
			<PointsDialog
				open={open}
				handleClose={handleClose}
				title="Add Points"
				handleClick={handleClick}
				loading={loading}
				error={error}
				errorMessage={message}
			/>
			<Button
				onClick={handleOpen}
				className={classes.button + ' mx-8 normal-case'}
				variant="contained"
				color="secondary"
			>
				Add Points
			</Button>
		</>
	);
}

export default withStyles(styles)(Points);

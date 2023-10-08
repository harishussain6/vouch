import React, { useState } from 'react';
import { Button, withStyles } from '@material-ui/core';
import BindDialog from './BindDialog';
import JwtService from 'app/services/jwtService';

const styles = () => ({
	button: {
		marginRight: 8
	}
});
function Add({ classes, reload, email }) {
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
	async function handleClick(premium_key) {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/premium-key/bind', {
				premium_key,
				email
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
			<BindDialog
				open={open}
				handleClose={handleClose}
				title="Bind Key"
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
				Bind Premium Key
			</Button>
		</>
	);
}

export default withStyles(styles)(Add);

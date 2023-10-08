import React, { useState } from 'react';
import { Button, withStyles } from '@material-ui/core';
import VendorChildDialog from './VendorChildDialog';
import JwtService from 'app/services/jwtService';

const styles = () => ({
	button: {
		marginRight: 8
	}
});

function AddChild({ classes, reload, vendor_id }) {
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
	async function handleClick(post) {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/add-vendor-child', { vendor_id, ...post });

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
			<VendorChildDialog
				open={open}
				handleClose={handleClose}
				title="Add Branch"
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
				Add
			</Button>
		</>
	);
}

export default withStyles(styles)(AddChild);

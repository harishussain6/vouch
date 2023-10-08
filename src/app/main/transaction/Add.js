import React, { useState } from 'react';
import { Button, withStyles } from '@material-ui/core';
import RedemptionDialog from './RedemptionDialog';
import JwtService from 'app/services/jwtService';

const styles = () => ({
	button: {
		marginLeft: 4
	}
});
function Add({ classes, reload }) {
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
	async function handleClick(premium_key, voucher_id, vendor_id) {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/redemption', {
				premium_key,
				voucher_id,
				vendor_id
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
			<RedemptionDialog
				open={open}
				handleClose={handleClose}
				title="Add manual redemption"
				handleClick={handleClick}
				loading={loading}
				error={error}
				errorMessage={message}
			/>
			<Button onClick={handleOpen} className={classes.button} variant="contained" color="primary">
				Manual Redemption
			</Button>
		</>
	);
}

export default withStyles(styles)(Add);

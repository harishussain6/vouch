import React, { useEffect, useState } from 'react';
import { Button, withStyles } from '@material-ui/core';
import VendorChildDialog from './VendorChildDialog';
import JwtService from 'app/services/jwtService';

const styles = () => ({
	button: {
		marginRight: 8
	}
});

function EditChild({ classes, reload, vendor_id }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({});
	const [message, setMessage] = useState(null);
	const [vendor, setVendor] = useState(null);
	const axios = JwtService.getAxios();

	useEffect(() => {
		if (vendor) setOpen(true);
	}, [vendor]);
	async function handleOpen() {
		const res = await axios.get('/api/admin/vendor/' + vendor_id);
		const data = res.data.data;
		setVendor(data);
	}
	function handleClose() {
		setVendor(null);
		setOpen(false);
	}
	async function handleClick(post) {
		setLoading(true);
		try {
			const res = await axios.put(`/api/admin/update-vendor-child/${vendor_id}`, { ...post });

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
				title="Update Branch"
				handleClick={handleClick}
				loading={loading}
				error={error}
				errorMessage={message}
				incoming_vendor={vendor}
			/>
			<Button
				onClick={handleOpen}
				className={classes.button + ' mx-8 normal-case'}
				variant="contained"
				color="secondary"
			>
				Edit
			</Button>
		</>
	);
}

export default withStyles(styles)(EditChild);

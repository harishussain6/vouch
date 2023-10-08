import React, { useState } from 'react';
import { Button, withStyles } from '@material-ui/core';
import JwtService from 'app/services/jwtService';
import PingVoucherDialog from './PingVoucherDialog';

const styles = () => ({
	button: {
		marginRight: 8
	}
});
function PingVoucher({ classes, reload, email }) {
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
	async function handleClick(voucher_id) {
		setLoading(true);
		try {
			const res = await axios.get('/api/admin/add-reimbursement-user', {
				params: { voucher_id, email }
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
			<PingVoucherDialog
				open={open}
				handleClose={handleClose}
				title="Ping Voucher"
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
				Ping Voucher Key
			</Button>
		</>
	);
}

export default withStyles(styles)(PingVoucher);

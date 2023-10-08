import React, { useState, useEffect, useContext } from 'react';
import {
	withStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	Grid,
	LinearProgress,
	FormHelperText
} from '@material-ui/core';
import JwtService from 'app/services/jwtService';
import { UserContext } from 'app/context/UserContext';

const styles = () => ({});

function RedemptionDialog({ handleClick, handleClose, open, title, loading, error, errorMessage }) {
	const userContext = useContext(UserContext);
	const [voucher, setVoucher] = useState(1);
	const [premium_key, setPremiumKey] = useState(null);
	const [vouchers, setVouchers] = useState([]);
	const [selectLoading, setSelectLoading] = useState(true);
	const axios = JwtService.getAxios();

	useEffect(() => {
		if (!open) return;

		const getData = async () => {
			try {
				const res = await axios.get('/api/admin/voucher', {
					params: {
						vendor_id: userContext.user.vendor.xid,
						limit: 50
					}
				});
				const data = res.data.data.data;
				setVouchers(
					data.map(voucher => ({
						value: voucher.id,
						label: voucher.name
					}))
				);
				const voucher = data.pop();
				setVoucher(voucher.id);
				setSelectLoading(false);
			} catch (error) {
				console.log(error);
				setSelectLoading(false);
				setVouchers([]);
			}
		};
		getData();
		// eslint-disable-next-line
	}, [open]);

	function checkDisabled() {
		return !premium_key || !voucher || loading;
	}
	function onChange(event) {
		const target = event.target;
		if (target.name === 'premium_key') {
			setPremiumKey(target.value);
		}
		if (target.name === 'voucher') {
			setVoucher(target.value);
		}
	}

	function onClick() {
		handleClick(premium_key, voucher, userContext.user.vendor.xid);
	}
	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
			<DialogTitle id="form-dialog-title">{title} Menu</DialogTitle>
			<DialogContent>
				{loading ? (
					<LinearProgress />
				) : (
					<Grid container spacing={1}>
						<Grid item col-md-12>
							<FormHelperText error>{errorMessage}</FormHelperText>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								id="premium_key"
								name="premium_key"
								label="Premium Key"
								type="text"
								fullWidth
								value={premium_key}
								onChange={onChange}
								variant="outlined"
								error={error.premium_key ? true : false}
								helperText={error.premium_key ? error.premium_key : null}
							/>
						</Grid>
						<Grid item md={12}>
							{selectLoading ? (
								<LinearProgress />
							) : (
								<TextField
									autoFocus
									margin="dense"
									id="voucher"
									name="voucher"
									label="Voucher"
									fullWidth
									select
									onChange={onChange}
									value={voucher}
									variant="outlined"
									error={error.voucher_id ? true : false}
									helperText={error.voucher_id ? error.voucher_id : null}
								>
									{vouchers.map(option => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</TextField>
							)}
						</Grid>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button disabled={checkDisabled()} variant="contained" color="primary" onClick={onClick}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default withStyles(styles)(RedemptionDialog);

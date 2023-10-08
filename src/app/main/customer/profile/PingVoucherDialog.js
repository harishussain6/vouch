import React, { useEffect, useState } from 'react';
import {
	withStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Grid,
	LinearProgress,
	FormHelperText
} from '@material-ui/core';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import JwtService from 'app/services/jwtService';

const styles = () => ({});

function PingableVoucherDialog({ handleClick, handleClose, open, title, loading, error, errorMessage }) {
	const [vendor_id, setVendorId] = useState({});
	const [voucher_id, setVoucherId] = useState({});
	const [vendors, setVendors] = useState([]);
	const [vouchers, setVouchers] = useState([]);
	const axios = JwtService.getAxios();

	useEffect(() => {
		setVendors([]);
		setVouchers([]);
		setVoucherId({});
		setVendorId({});
	}, [open]);
	function checkDisabled() {
		return !vendor_id.id || !voucher_id.value || loading;
	}
	function onChange(value, name) {
		if (name === 'vendor') {
			setVouchers(vendors.find(vendor => vendor.id === value.id).vouchers);
			setVendorId(value);
		} else if (name === 'voucher') {
			setVoucherId(value);
		}
	}

	function promiseOptions(inputValue) {
		if (inputValue.length < 4) return Promise.resolve([]);
		return axios
			.get('/api/admin/get-parent-list', {
				params: { query: inputValue }
			})
			.then(res => {
				const data = res.data;
				setVendors(data.data);
				return data.data.map(vendor => ({ id: vendor.id, label: vendor.name }));
			});
	}

	function onClick() {
		handleClick(voucher_id.value);
	}
	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
			<DialogTitle id="form-dialog-title">{title}</DialogTitle>
			<DialogContent>
				{loading ? (
					<LinearProgress />
				) : (
					<Grid container spacing={1}>
						<Grid item md={12}>
							<FormHelperText error>{errorMessage}</FormHelperText>
						</Grid>
						<Grid item md={12}>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: vendor_id.id,
									label: vendor_id.label
								}}
								onChange={value => onChange(value, 'vendor')}
								textFieldProps={{
									label: 'Vendor',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								required
								variant="async"
								defaultOptions
								loadOptions={promiseOptions}
							/>
						</Grid>
						<Grid item md={12}>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: voucher_id.value,
									label: voucher_id.label
								}}
								onChange={value => onChange(value, 'voucher')}
								textFieldProps={{
									label: 'Voucher',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								options={vouchers.map(category => ({
									value: category.id,
									label: category.name
								}))}
								required
								defaultOptions
								loadOptions={promiseOptions}
							/>
						</Grid>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button disabled={checkDisabled()} variant="contained" color="primary" onClick={onClick}>
					Ping
				</Button>
				<Button disabledvariant="contained" color="secondary" onClick={handleClose}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default withStyles(styles)(PingableVoucherDialog);

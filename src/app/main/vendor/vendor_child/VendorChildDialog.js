import React, { useEffect, useState } from 'react';
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
import FuseChipSelect from '@fuse/core/FuseChipSelect';

const styles = () => ({});

function defaultVendor(vendor) {
	return vendor
		? vendor
		: {
				locality: '',
				latitude: '',
				longitude: '',
				email: '',
				pw: '',
				pin: '',
				phone: '',
				status: ''
		  };
}

function VendorChildDialog({ handleClick, handleClose, open, title, loading, error, errorMessage, incoming_vendor }) {
	const vendor = defaultVendor(incoming_vendor);
	const [locality, setLocality] = useState(vendor.locality);
	const [latitude, setLatitude] = useState(vendor.latitude);
	const [longitude, setLongitude] = useState(vendor.longitude);
	const [email, setEmail] = useState(vendor.email);
	const [pw, setPassword] = useState(vendor.pw);
	const [phone, setPhone] = useState(vendor.phone);
	const [pin, setPin] = useState(vendor.pin);
	const [status, setStatus] = useState(vendor.status);

	useEffect(() => {
		const vendor = defaultVendor(incoming_vendor);
		setLocality(vendor.locality);
		setLatitude(vendor.latitude);
		setLongitude(vendor.longitude);
		setEmail(vendor.email);
		setPassword(vendor.pw);
		setPhone(vendor.phone);
		setPin(vendor.pin);
		setStatus(vendor.status);
	}, [incoming_vendor]);
	function checkDisabled() {
		return loading;
	}
	function onChange(event) {
		const target = event.target;

		if (target.name === 'locality') {
			console.log(target.value);
			setLocality(target.value);
		} else if (target.name === 'latitude') {
			setLatitude(target.value);
		} else if (target.name === 'longitude') {
			setLongitude(target.value);
		} else if (target.name === 'email') {
			setEmail(target.value);
		} else if (target.name === 'pw') {
			setPassword(target.value);
		} else if (target.name === 'phone') {
			setPhone(target.value);
		} else if (target.name === 'pin') {
			setPin(target.value);
		}
	}

	function onClick() {
		handleClick({
			locality,
			longitude: longitude.toString(),
			pin,
			pw,
			phone,
			email,
			latitude: latitude.toString(),
			status: status.value ? status.value : status
		});
	}
	
	function handleChipChange(value, name) {
		setStatus(value);
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
							<TextField
								autoFocus
								margin="dense"
								id="locality"
								name="locality"
								label="Locality"
								type="text"
								fullWidth
								value={locality}
								onChange={onChange}
								variant="outlined"
								error={error.locality ? true : false}
								helperText={error.locality ? error.locality : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								id="latitude"
								name="latitude"
								label="Latitude"
								type="number"
								fullWidth
								value={latitude}
								onChange={onChange}
								variant="outlined"
								error={error.latitude ? true : false}
								helperText={error.latitude ? error.latitude : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								id="longitude"
								name="longitude"
								label="Longitude"
								type="number"
								fullWidth
								value={longitude}
								onChange={onChange}
								variant="outlined"
								error={error.longitude ? true : false}
								helperText={error.longitude ? error.longitude : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								id="email"
								name="email"
								label="Email"
								type="email"
								fullWidth
								value={email}
								onChange={onChange}
								variant="outlined"
								error={error.email ? true : false}
								helperText={error.email ? error.email : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								id="pw"
								name="pw"
								label="Password"
								type="text"
								fullWidth
								value={pw}
								onChange={onChange}
								variant="outlined"
								error={error.pw ? true : false}
								helperText={error.pw ? error.pw : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								id="pin"
								name="pin"
								label="Pin"
								type="number"
								fullWidth
								value={pin}
								onChange={onChange}
								variant="outlined"
								error={error.pin ? true : false}
								helperText={error.pin ? error.pin : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								id="phone"
								name="phone"
								label="Phone"
								type="text"
								fullWidth
								value={phone}
								onChange={onChange}
								variant="outlined"
								error={error.phone ? true : false}
								helperText={error.phone ? error.phone : null}
							/>
						</Grid>
						<Grid item md={12}>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: status.value ? status.value : status,
									label: status.label ? status.label : status.toUpperCase()
								}}
								onChange={value => handleChipChange(value, 'status')}
								textFieldProps={{
									label: 'Status',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								options={[
									{ value: 'active', label: 'Active' },
									{ value: 'inactive', label: 'InActive' }
								]}
								error={error.status ? true : false}
								helperText={error.status ? error.status : null}
							/>
						</Grid>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button disabled={checkDisabled()} variant="contained" color="primary" onClick={onClick}>
					{incoming_vendor ? 'Update' : 'Create'}
				</Button>
				<Button disabledvariant="contained" color="secondary" onClick={handleClose}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default withStyles(styles)(VendorChildDialog);

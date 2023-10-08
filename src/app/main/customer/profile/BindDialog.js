import React, { useState } from 'react';
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

const styles = () => ({});

function BindDialog({ handleClick, handleClose, open, title, loading, error, errorMessage }) {
	const [premium_key, setPremiumKey] = useState('');

	function checkDisabled() {
		return !premium_key || loading;
	}
	function onChange(event) {
		const target = event.target;
		if (target.name === 'premium_key') {
			setPremiumKey(target.value);
		}
	}

	function onClick() {
		handleClick(premium_key);
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
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button disabled={checkDisabled()} variant="contained" color="primary" onClick={onClick}>
					Bind
				</Button>
				<Button disabledvariant="contained" color="secondary" onClick={handleClose}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default withStyles(styles)(BindDialog);

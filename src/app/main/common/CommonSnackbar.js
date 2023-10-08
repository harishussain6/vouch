import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { SnackbarContext } from 'app/context/SnackbarContext';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 *
 * @param {severity: "error","warning","info","success"} param0
 */

export default function CommonSnackbar() {
	const context = useContext(SnackbarContext);
	console.log(context);
	const handleClose = (event, reason) => {
		context.setOpen(false);
	};

	return (
		<Snackbar
			open={context.open}
			autoHideDuration={6000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		>
			<Alert onClose={handleClose} severity={context.severity}>
				{context.message}
			</Alert>
		</Snackbar>
	);
}

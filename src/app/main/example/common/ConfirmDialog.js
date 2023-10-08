import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

function ConfirmDialog({ openDialog, onConfirm, title }) {
	const [open, setOpen] = useState(openDialog);

	useEffect(() => {
		if (openDialog) setOpen(openDialog);
	}, [openDialog]);
	function toggleDialog() {
		setOpen(!open);
	}
	function handleOk() {
		onConfirm();
		toggleDialog();
	}
	return (
		<Dialog maxWidth="xs" open={open}>
			<DialogTitle id="confirmation-dialog-title">Confirm</DialogTitle>
			<DialogContent dividers>{`Are you sure you want to ${title}?`}</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={toggleDialog} color="secondary">
					No
				</Button>
				<Button onClick={handleOk} color="primary">
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;

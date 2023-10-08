import React, { useState } from 'react';
import { Button, withStyles } from '@material-ui/core';
import BindDialog from './BindDialog';
import JwtService from 'app/services/jwtService';

const styles = () => ({
	button: {
		marginRight: 8
	}
});
function AddTask({ classes, reload, task_id }) {
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
	async function handleClick(title, post) {
		setLoading(true);
		try {
			const res = await axios.post(`/api/admin/tasks/${task_id}/posts`, {
				title,
				link: post
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
			<BindDialog
				open={open}
				handleClose={handleClose}
				title="Add Post"
				handleClick={handleClick}
				loading={loading}
				error={error}
				errorMessage={message}
			/>
			<Button
				onClick={handleOpen}
				className={classes.button + ' normal-case'}
				variant="contained"
				color="secondary"
			>
				Add Post
			</Button>
		</>
	);
}

export default withStyles(styles)(AddTask);

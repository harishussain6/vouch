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
	const [postTitle, setPostTitle] = useState('');
	const [post, setPost] = useState('');

	function checkDisabled() {
		return !postTitle || !post || loading;
	}
	function onChange(event) {
		const target = event.target;
		if (target.name === 'title') {
			setPostTitle(target.value);
		}
		if (target.name === 'post') {
			setPost(target.value);
		}
	}

	function onClick() {
		handleClick(postTitle, post);
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
								id="title"
								name="title"
								label="Title"
								type="text"
								fullWidth
								value={postTitle}
								onChange={onChange}
								variant="outlined"
								error={error.title ? true : false}
								helperText={error.title ? error.title : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								id="post"
								name="post"
								label="Post"
								type="text"
								fullWidth
								value={post}
								onChange={onChange}
								variant="outlined"
								error={error.post ? true : false}
								helperText={error.post ? error.post : null}
							/>
						</Grid>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button disabled={checkDisabled()} variant="contained" color="primary" onClick={onClick}>
					Add
				</Button>
				<Button disabledvariant="contained" color="secondary" onClick={handleClose}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default withStyles(styles)(BindDialog);

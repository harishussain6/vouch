import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router';

const styles = () => ({
	button: {
		marginLeft: 4
	}
});
function Edit({ classes, slider_id }) {
	const history = useHistory();

	async function handleOpen() {
		history.push(`/slider/${slider_id}`);
	}

	return (
		<Button onClick={handleOpen} className={classes.button} variant="contained" color="primary">
			Edit
		</Button>
	);
}

export default withStyles(styles)(Edit);

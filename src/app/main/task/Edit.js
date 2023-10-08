import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router';

const styles = () => ({
	button: {
		marginLeft: 4
	}
});
function Edit({ classes, slide_id, is_view }) {
	const history = useHistory();
	function handleOpen() {
		history.push(`/tasks/${slide_id}`);
	}
	return (
		<Button onClick={handleOpen} className={classes.button} variant="contained" color="primary">
			{is_view ? 'View' : 'Edit'}
		</Button>
	);
}

export default withStyles(styles)(Edit);

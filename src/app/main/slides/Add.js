import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router';

const styles = () => ({
	button: {
		marginLeft: 4
	}
});
function Add({ classes, reload, vendor_id }) {
	const history = useHistory();
	function handleOpen() {
		history.push('/slides/new');
	}
	return (
		<>
			<Button onClick={handleOpen} className={classes.button} variant="contained" color="primary">
				Create Slide
			</Button>
		</>
	);
}

export default withStyles(styles)(Add);
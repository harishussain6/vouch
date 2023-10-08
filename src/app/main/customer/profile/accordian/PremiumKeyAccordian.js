import React from 'react';
import { Grid, Chip, IconButton, Icon, withStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

const styles = theme => ({
	root: {
		width: '100%',
		padding: '8px 4px'
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexShrink: 0,
		fontWeight: 800
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary
	},
	gold: {
		backgroundColor: '#ffc400',
		color: '#ffffff'
	},
	retail: {
		backgroundColor: '#3e2723',
		color: '#ffffff'
	}
});

function PremiumKeyAccordian({ premium_key, unbind, classes }) {
	const [expanded, setExpanded] = React.useState(false);

	const handleChange = panel => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	return (
		<div className={classes.root}>
			<ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content">
					<Grid container justify="space-between">
						<Grid item md={10} sm={10} xs={12}>
							<Grid container>
								<Grid item md={12} xs={12}>
									<Typography className={classes.heading}>{premium_key.key}</Typography>
								</Grid>
								<Grid item md={12} xs={12}>
									{premium_key.exp_date}
								</Grid>
								<Grid item md={12} xs={12}>
									<Chip
										icon={<LoyaltyIcon />}
										color="secondary"
										className={classes.gold}
										size="small"
										label={premium_key.membership.name.toUpperCase()}
									/>
								</Grid>
							</Grid>
						</Grid>

						<Grid item md={2} sm={2} xs={12}>
							<IconButton
								onClick={() => {
									unbind(premium_key.key);
								}}
								color="secondary"
							>
								<Icon>delete</Icon>
							</IconButton>
						</Grid>
					</Grid>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container>
						<Grid item md={12}>
							<Grid container direction="row">
								<Grid item md={6}>
									<Typography>
										<b>Name:</b>
									</Typography>
								</Grid>
								<Grid item md={6}>
									{premium_key.name}
								</Grid>
								<Grid item md={6}>
									<Typography>
										<b>Activation Date:</b>
									</Typography>
								</Grid>
								<Grid item md={6}>
									{premium_key.act_date}
								</Grid>
								<Grid item md={6}>
									<Typography>
										<b>Expiry Date:</b>
									</Typography>
								</Grid>
								<Grid item md={6}>
									{premium_key.exp_date}
								</Grid>
							</Grid>
						</Grid>
						<Grid item md={12}>
							<Typography>
								<b>Cities:</b>
							</Typography>
						</Grid>
						<Grid container item md={12} spacing={1}>
							{premium_key.cities.map(city => (
								<Grid item>
									<Chip
										icon={<LocationCityIcon />}
										size="small"
										color="primary"
										label={city.name.toUpperCase()}
									/>
								</Grid>
							))}
						</Grid>
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		</div>
	);
}
export default withStyles(styles)(PremiumKeyAccordian);

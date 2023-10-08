import { Button, Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ConfirmDialog from 'app/main/common/ConfirmDialog';
import JwtService from 'app/services/jwtService';
import React, { useContext, useState } from 'react';
import BindKey from '../BindKey';
import PingVoucher from '../PingVoucher';
import Points from '../Points';
import { SnackbarContext } from 'app/context/SnackbarContext';
import PremiumKeyAccordian from '../accordian/PremiumKeyAccordian';

function AboutTab({ user, setLoading, reload, corporateApp }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [title, setTitle] = useState('');
	const [action, setAction] = useState(() => {});
	const context = useContext(SnackbarContext);

	if (Object.keys(user).length === 0) return null;
	const { membership, premium_keys, user_has_users } = user;
	const axios = JwtService.getAxios();
	function unbindKey(key) {
		setLoading(true);
		axios
			.post('/api/admin/premium-key/unbind', {
				email: user.email,
				premium_key: key
			})
			.then(res => {
				const result = res.data;
				if (result.status) {
					setLoading(false);
					reload();
				} else {
					reload();
					context.setMessage(result.message);
					context.setSeverity('error');
					context.setOpen(true);
				}
			});
	}

	function handleOk() {
		switch (action) {
			case 'unbind-parent':
				unBinParent();
				break;
			case 'clear-redemptions':
				clearRedemptions();
				break;
			case 'log-out':
				logout();
				break;
			default:
				reload();
				break;
		}
	}
	function unBinParent() {
		setTitle(null);
		setOpenDialog(false);
		setAction(null);
		setLoading(true);
		axios.get(`/api/admin/unbind-parent_data?email=${user.email}`).then(res => {
			const result = res.data;
			if (result.status) {
				reload();
			} else {
				reload();
				context.setMessage(result.message);
				context.setSeverity('error');
				context.setOpen(true);
			}
		});
	}

	function clearRedemptions() {
		setOpenDialog(false);
		setTitle(null);
		setAction(null);
		setLoading(true);
		axios
			.post('/api/admin/clear-redemption', {
				email: user.email
			})
			.then(res => {
				const result = res.data;
				if (result.status) {
					setLoading(false);
				} else {
					reload();
					context.setMessage(result.message);
					context.setSeverity('error');
					context.setOpen(true);
				}
			});
	}

	function logout() {
		setTitle(null);
		setOpenDialog(false);
		setAction(null);
		setLoading(true);
		axios.get(`/api/admin/logout-customer?email=${user.email}`).then(res => {
			setLoading(false);
		});
	}

	function resetPassword() {
		setLoading(true);
		axios
			.get('/api/admin/reset-password-user', {
				params: { email: user.email }
			})
			.then(res => {
				const result = res.data;
				if (result.status) {
					setLoading(false);
				} else {
					reload();
					context.setMessage(result.message);
					context.setSeverity('error');
					context.setOpen(true);
				}
			});
	}

	return (
		<div className="md:flex max-w-sm md:max-w-full">
			{/* // <div className="md:flex max-w-2xl"> */}
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				{/* <FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				> */}
				<ConfirmDialog title={title} openDialog={openDialog} onConfirm={handleOk} />

				<Card className="w-full mb-16">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								General Information
							</Typography>
						</Toolbar>
					</AppBar>

					<CardContent>
						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Gender</Typography>
							<Typography>{user.gender}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Birthday</Typography>
							<Typography>{user.dob}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">City</Typography>
							<Typography>{user.city.name}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Membership</Typography>
							<Typography>{membership.name}</Typography>
						</div>
					</CardContent>
				</Card>

				<Card className="w-full mb-16">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								Savings Information
							</Typography>
						</Toolbar>
					</AppBar>

					<CardContent>
						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Savings</Typography>
							<Typography>{user.savings}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Redemption Count</Typography>
							<Typography>{user.redemption_count}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Ping/Reimburse Voucher Count</Typography>
							<Typography>{user.ping_vouvhers_count}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Available Vouch Points</Typography>
							<Typography>{user.a_vpoints}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Used Vouch Points</Typography>
							<Typography>{user.u_vpoints}</Typography>
						</div>
					</CardContent>
				</Card>

				<Card className="w-full mb-16">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								Contact
							</Typography>
						</Toolbar>
					</AppBar>

					<CardContent>
						{/* <div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Address</Typography>
								<Typography>{contact.address}</Typography>
							</div> */}

						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Tel.</Typography>
							<div className="flex items-center">
								<Typography>{user.phone}</Typography>
							</div>
						</div>

						<div className="mb-24">
							<Typography className="font-bold mb-4 text-15">Emails</Typography>

							<div className="flex items-center">
								<Typography>{user.email}</Typography>
							</div>
						</div>
					</CardContent>
				</Card>
				{/* </FuseAnimateGroup> */}
			</div>

			<div className="flex flex-col md:w-320">
				{corporateApp === '0' && (
					<Card className="w-full mb-16">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Actions
								</Typography>
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<Grid container spacing={2} className="mt-4">
								<Grid item md={12} className="mb-5">
									<PingVoucher email={user.email} reload={reload} />
								</Grid>
								<Grid item md={12} className="mb-5">
									<Points email={user.email} reload={reload} />
								</Grid>
								<Grid item md={12} className="mb-5">
									<Button
										className="mx-8 normal-case"
										onClick={resetPassword}
										variant="contained"
										color="secondary"
										aria-label="Follow"
									>
										Reset Password
									</Button>
								</Grid>
								<Grid item md={12} className="mb-5">
									<Button
										className="mx-8 normal-case"
										onClick={() => {
											setTitle('un bind parent');
											setAction('unbind-parent');
											setOpenDialog(true);
										}}
										variant="contained"
										color="secondary"
										aria-label="Follow"
									>
										Unbind Parent
									</Button>
								</Grid>
								<Grid item md={12} className="mb-5">
									<BindKey email={user.email} reload={reload} />
								</Grid>
								<Grid item md={12} className="mb-5">
									<Button
										className="mx-8 normal-case"
										onClick={() => {
											setTitle('clear redemptions');
											setAction('clear-redemptions');
											setOpenDialog(true);
										}}
										variant="contained"
										color="secondary"
										aria-label="Send Message"
									>
										Clear Redemptions
									</Button>
								</Grid>
								<Grid item md={12} className="mb-5">
									<Button
										className="mx-8 normal-case"
										onClick={() => {
											setTitle('logout user');
											setAction('log-out');
											setOpenDialog(true);
										}}
										variant="contained"
										color="secondary"
										aria-label="Send Message"
									>
										Logout
									</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				)}
				<Card className="w-full mb-16">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								Premium Keys
							</Typography>
						</Toolbar>
					</AppBar>
					<CardContent className="flex flex-wrap p-8">
						{premium_keys.map(premium_key => (
							<PremiumKeyAccordian premium_key={premium_key} unbind={unbindKey} />
						))}
					</CardContent>
				</Card>

				<Card className="w-full mb-16">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								Friends And Family
							</Typography>
						</Toolbar>
					</AppBar>
					<CardContent className="p-0">
						<List className="p-0">
							{user_has_users.map(group => (
								<ListItem key={group.id} className="px-8">
									<Avatar className="mx-8" alt={group.name} src={group.user.avatar} />
									<ListItemText
										primary={
											<div className="flex">
												<Typography className="font-medium" color="secondary" paragraph={false}>
													{group.user.fname} {group.user.lname}
												</Typography>

												{group.relation_type ? (
													<Typography className="mx-4" paragraph={false}>
														{group.relation_type.name}
													</Typography>
												) : (
													<></>
												)}
											</div>
										}
										secondary={group.user_type}
									/>
									{/* <ListItemSecondaryAction>
											<IconButton>
												<Icon>more_vert</Icon>
											</IconButton>
										</ListItemSecondaryAction> */}
								</ListItem>
							))}
						</List>
					</CardContent>
				</Card>
				{/* </FuseAnimateGroup> */}
			</div>
		</div>
	);
}

export default AboutTab;

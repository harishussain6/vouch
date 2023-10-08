import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import AboutTab from './tabs/AboutTab';
import { useParams } from 'react-router';
import JwtService from 'app/services/jwtService';
import FuseLoading from '@fuse/core/FuseLoading';
import Redemptions from './tabs/Redemptions';
import PingedVouchers from './tabs/PingedVouchers';
import { Link } from 'react-router-dom';
import { Icon } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
	layoutHeader: {
		height: 320,
		minHeight: 320,
		[theme.breakpoints.down('md')]: {
			height: 240,
			minHeight: 240
		}
	}
}));

function ProfilePage() {
	const theme = useTheme();
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(0);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});
	const { id, corporateApp } = useParams();
	const axios = JwtService.getAxios();
	useEffect(() => {
		load();
		// eslint-disable-next-line
	}, [id]);
	function handleTabChange(event, value) {
		setSelectedTab(value);
	}

	function load() {
		setLoading(true);
		axios
			.get('/api/admin/show-customer', {
				params: {
					id,
					corporate_app: corporateApp
				}
			})
			.then(res => {
				setUser(res.data.data);
				setLoading(false);
			});
	}
	if (loading) {
		return <FuseLoading />;
	}
	return (
		<FusePageSimple
			classes={{
				header: classes.layoutHeader,
				toolbar: 'px-16 sm:px-24'
			}}
			header={
				<div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
					<div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Typography
								className="normal-case flex items-center sm:mb-12"
								component={Link}
								role="button"
								to="/customer"
								color="inherit"
							>
								<Icon className="text-20">
									{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
								</Icon>
							</Typography>
						</FuseAnimate>
						<FuseAnimate animation="transition.expandIn" delay={300}>
							<Avatar className="w-96 h-96" src={user.avatar} />
						</FuseAnimate>
						<FuseAnimate animation="transition.slideLeftIn" delay={300}>
							<Typography className="md:mx-24" variant="h4" color="inherit">
								{user.fname} {user.lname}
							</Typography>
						</FuseAnimate>
					</div>
				</div>
			}
			contentToolbar={
				<Tabs
					value={selectedTab}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="off"
					classes={{
						root: 'h-64 w-full border-b-1'
					}}
				>
					<Tab
						classes={{
							root: 'h-64'
						}}
						label="About"
					/>
					<Tab
						classes={{
							root: 'h-64'
						}}
						label="Redemptions"
					/>
					<Tab
						classes={{
							root: 'h-64'
						}}
						label="Pinged History"
					/>
				</Tabs>
			}
			content={
				<div className="p-16 sm:p-24">
					{selectedTab === 0 && (
						<AboutTab user={user} corporateApp={corporateApp} reload={load} setLoading={setLoading} />
					)}
					{selectedTab === 1 && (
						<Redemptions redemptions={user.redemptions} reload={load} setLoading={setLoading} />
					)}
					{selectedTab === 2 && (
						<PingedVouchers pingedVouchers={user.pingHistory} reload={load} setLoading={setLoading} />
					)}
				</div>
			}
		/>
	);
}

export default ProfilePage;

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import * as authActions from 'app/auth/store/actions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import { Badge, IconButton, List, ListItem, withStyles } from '@material-ui/core';
import JwtService from 'app/services/jwtService';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

const StyledBadge = withStyles(theme => ({
	badge: {
		right: -3,
		top: 13,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: '0 4px'
	}
}))(Badge);

const axios = JwtService.getAxios();
function UserMenu(props) {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);
	const [userMenu, setUserMenu] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const [userNotification, setUserNotification] = useState(null);
	const history = useHistory();
	useEffect(() => {
		setInterval(() => {
			getNotification();
		}, 50000);
	}, []);
	const userMenuClick = event => {
		setUserMenu(event.currentTarget);
	};

	function getNotification() {
		axios.get('/api/admin/notification').then(res => {
			const data = res.data.data;
			setNotifications(data);
		});
	}
	const userMenuClose = () => {
		setUserMenu(null);
	};

	const userMenuNotifcationClick = event => {
		setUserNotification(event.currentTarget);
	};

	const userMenuNotifcationClose = () => {
		setUserNotification(null);
	};

	const notificationIcons = {
		AppNotificationsNewTask: <AssignmentReturnedIcon />,
		AppNotificationsNewCSR: <LiveHelpIcon />,
		AppNotificationsPremiumKeyGeneration: <VpnKeyIcon />
	};
	const routes = {
		AppNotificationsNewTask: '/tasks',
		AppNotificationsNewCSR: '/customer_query',
		AppNotificationsPremiumKeyGeneration: '/premium_key'
	};
	function handleNotification(notification) {
		userMenuNotifcationClose();
		axios.get(`/api/admin/mark-notification/${notification.id}`);
		history.push(routes[notification.type.replace(/\\/g, '')]);
	}
	return (
		<>
			<IconButton onClick={userMenuNotifcationClick}>
				<StyledBadge
					badgeContent={notifications.filter(notification => !notification.read_at).length}
					color="secondary"
				>
					<NotificationImportantIcon />
				</StyledBadge>
			</IconButton>

			<Popover
				open={Boolean(userNotification)}
				anchorEl={userNotification}
				onClose={userMenuNotifcationClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
			>
				<List dense component="nav">
					{notifications.length > 0 ? (
						notifications.map((notification, index) => (
							<ListItem divider key={index} onClick={() => handleNotification(notification)}>
								<ListItemIcon>{notificationIcons[notification.type.replace(/\\/g, '')]}</ListItemIcon>
								<ListItemText primary={notification.data.title} />
							</ListItem>
						))
					) : (
						<ListItem divider>
							<ListItemText primary="No notification found" />
						</ListItem>
					)}
				</List>
			</Popover>
			<Button className="h-64" onClick={userMenuClick}>
				{user.data.photoURL ? (
					<Avatar className="" alt="user photo" src={user.data.photoURL} />
				) : (
					<Avatar className="">{user.data.displayName[0]}</Avatar>
				)}

				<div className="hidden md:flex flex-col mx-12 items-start">
					<Typography component="span" className="normal-case font-600 flex">
						{user.data.displayName}
					</Typography>
					<Typography className="text-11 capitalize" color="textSecondary">
						{user.role.toString()}
					</Typography>
				</div>

				<Icon className="text-16 hidden sm:flex" variant="action">
					keyboard_arrow_down
				</Icon>
			</Button>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
				<>
					<MenuItem component={Link} to={`/user/${user.data.id}`} onClick={userMenuClose} role="button">
						<ListItemIcon className="min-w-40">
							<Icon>account_circle</Icon>
						</ListItemIcon>
						<ListItemText primary="My Profile" />
					</MenuItem>
					<MenuItem
						onClick={() => {
							dispatch(authActions.logoutUser());
							userMenuClose();
						}}
					>
						<ListItemIcon className="min-w-40">
							<Icon>exit_to_app</Icon>
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</MenuItem>
				</>
			</Popover>
		</>
	);
}

export default UserMenu;

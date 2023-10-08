import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import * as userActions from 'app/auth/store/actions';
import { UserContext } from 'app/context/UserContext';
import auth0Service from 'app/services/auth0Service';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import * as Actions from 'app/store/actions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Auth extends Component {
	state = {
		waitAuthCheck: true,
		user: null
	};

	componentDidMount() {
		return Promise.all([
			// Comment the lines which you do not use
			// this.firebaseCheck(),
			// this.auth0Check(),
			this.jwtCheck()
		]).then(() => {
			this.setState({ waitAuthCheck: false });
		});
	}

	jwtCheck = () =>
		new Promise(resolve => {
			jwtService.on('onAutoLogin', () => {
				// this.props.showMessage({ message: 'Welcome Back', variant: 'success' });

				/**
				 * Sign in and retrieve user data from Api
				 */
				jwtService
					.signInWithToken()
					.then(user => {
						this.props.setUserData(user);
						resolve();

						// this.props.showMessage({ message: 'Welcome Back', variant: 'success' });
						this.setState({ user });
					})
					.catch(error => {
						this.props.showMessage({ message: error, variant: 'error' });

						resolve();
					});
			});

			jwtService.on('onAutoLogout', message => {
				if (message) {
					// this.props.showMessage({ message, variant: 'success' });
				}

				this.props.logout();

				resolve();
			});

			jwtService.on('onNoAccessToken', () => {
				resolve();
			});

			jwtService.init();

			return Promise.resolve();
		});

	auth0Check = () =>
		new Promise(resolve => {
			auth0Service.init(success => {
				if (!success) {
					resolve();
				}
			});

			if (auth0Service.isAuthenticated()) {
				this.props.showMessage({ message: 'Logging in with Auth0' });

				/**
				 * Retrieve user data from Auth0
				 */
				auth0Service.getUserData().then(tokenData => {
					this.props.setUserDataAuth0(tokenData);

					resolve();

					this.props.showMessage({ message: 'Logged in with Auth0' });
				});
			} else {
				resolve();
			}

			return Promise.resolve();
		});

	firebaseCheck = () =>
		new Promise(resolve => {
			firebaseService.init(success => {
				if (!success) {
					resolve();
				}
			});

			firebaseService.onAuthStateChanged(authUser => {
				if (authUser) {
					this.props.showMessage({ message: 'Logging in with Firebase' });

					/**
					 * Retrieve user data from Firebase
					 */
					firebaseService.getUserData(authUser.uid).then(
						user => {
							this.props.setUserDataFirebase(user, authUser);

							resolve();

							this.props.showMessage({ message: 'Logged in with Firebase' });
						},
						error => {
							resolve();
						}
					);
				} else {
					resolve();
				}
			});

			return Promise.resolve();
		});

	render() {
		return (
			<UserContext.Consumer>
				{({ create }) => {
					if (this.state.user) create(this.state.user);
					return this.state.waitAuthCheck ? <FuseSplashScreen /> : <>{this.props.children}</>;
				}}
			</UserContext.Consumer>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			logout: userActions.logoutUser,
			setUserData: userActions.setJWTUserData,
			setUserDataAuth0: userActions.setUserDataAuth0,
			setUserDataFirebase: userActions.setUserDataFirebase,
			showMessage: Actions.showMessage,
			hideMessage: Actions.hideMessage
		},
		dispatch
	);
}

export default connect(null, mapDispatchToProps)(Auth);

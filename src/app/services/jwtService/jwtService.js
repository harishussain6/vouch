import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* seslint-disable camelcase */

axios.defaults.baseURL = 'https://portalendpoint.vouch365.xyz/';
// axios.defaults.baseURL = 'https://adminportaltest.vouch365.mobi/';
// axios.defaults.baseURL = 'http://localhost:8000/';
// axios.defaults.baseURL = 'https://adminportalstaging.vouch365.club/';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,PATCH,OPTIONS";

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					console.log(err);
					if (err.response && err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	authBroadcastUrl() {
		return axios.defaults.baseURL + 'api/broadcasting/auth';
	}
	handleAuthentication = () => {
		const access_token = this.getAccessToken();
		const user_type = localStorage.getItem('user_type');
		if (!access_token) {
			this.emit('onNoAccessToken');
			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token, user_type);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.get('api/login', {
					params: {
						email,
						password
					}
				})
				.then(response => {
					const actualResponse = response.data;
					if (actualResponse.status) {
						this.setSession(actualResponse.data.token, actualResponse.data.user.user_type);
						resolve(actualResponse.data.user);
					} else {
						reject(actualResponse.errors);
					}
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			let user_type = localStorage.getItem('user_type');
			user_type = user_type ?? 'api';
			axios
				.get(`/api/admin/verify-token/${user_type}`, {})
				.then(response => {
					const actualResponse = response.data;
					if (actualResponse && actualResponse.status) {
						resolve(actualResponse.data);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					console.log(error);
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = (access_token, user_type) => {
		if (access_token && user_type) {
			user_type = ['vendor', 'vendor_api'].includes(user_type) ? 'vendor_api' : 'api';
			localStorage.setItem('token', access_token);
			localStorage.setItem('user_type', user_type);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('token');
			localStorage.removeItem('user_type');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('token');
	};

	getAxios = () => {
		return axios;
	};
}

const instance = new JwtService();

export default instance;

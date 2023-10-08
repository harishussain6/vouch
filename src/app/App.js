import MomentUtils from '@date-io/moment';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import history from '@history';
import { createGenerateClassName, jssPreset, StylesProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { create } from 'jss';
import jssExtend from 'jss-plugin-extend';
import rtl from 'jss-rtl';
import React from 'react';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import AppContext from './AppContext';
import { Auth } from './auth';
import UserContainer from './containers/UserContainer';
import SnackBarContainer from './containers/SnackbarContainer';
import routes from './fuse-configs/routesConfig';
import store from './store';
import CommonSnackbar from './main/common/CommonSnackbar';

const jss = create({
	...jssPreset(),
	plugins: [...jssPreset().plugins, jssExtend(), rtl()],
	insertionPoint: document.getElementById('jss-insertion-point')
});

const generateClassName = createGenerateClassName();

const App = () => {
	return (
		<AppContext.Provider
			value={{
				routes
			}}
		>
			<StylesProvider jss={jss} generateClassName={generateClassName}>
				<Provider store={store}>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<SnackBarContainer>
							<UserContainer>
								<Auth>
									<Router history={history}>
										<FuseAuthorization>
											<FuseTheme>
												<CommonSnackbar />
												<FuseLayout />
											</FuseTheme>
										</FuseAuthorization>
									</Router>
								</Auth>
							</UserContainer>
						</SnackBarContainer>
					</MuiPickersUtilsProvider>
				</Provider>
			</StylesProvider>
		</AppContext.Provider>
	);
};

export default App;

import { TextFieldFormsy } from '@fuse/core/formsy';
import { CircularProgress, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as authActions from 'app/auth/store/actions';
import Formsy from 'formsy-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function LoginForm(props) {
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);
	const [isFormValid, setIsFormValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const formRef = useRef(null);

	useEffect(() => {
		if (login.error && (login.error.email || login.error.password)) {
			formRef.current.updateInputsWithError({
				...login.error
			});
			disableButton();
			setLoading(false);
		}
		// eslint-disable-next-line
	}, [login]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		setLoading(true);
		dispatch(authActions.submitLogin(model));
	}

	return (
		<div className="w-full">
			<Formsy
				onValidSubmit={handleSubmit}
				onValid={enableButton}
				onInvalid={disableButton}
				ref={formRef}
				className="flex flex-col justify-center w-full"
			>
				<TextFieldFormsy
					className="mb-16"
					type="text"
					name="email"
					label="Username/Email"
					validations={{
						minLength: 4
					}}
					validationErrors={{
						minLength: 'Min character length is 4'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									email
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="password"
					name="password"
					label="Password"
					validations={{
						minLength: 4
					}}
					validationErrors={{
						minLength: 'Min character length is 4'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				{loading ? (
					<Grid container justify="center">
						<CircularProgress />
					</Grid>
				) : (
					<Button
						type="submit"
						variant="contained"
						color="primary"
						className="w-full mx-auto mt-16 normal-case"
						aria-label="LOG IN"
						disabled={!isFormValid}
						value="legacy"
					>
						Login
					</Button>
				)}
			</Formsy>
		</div>
	);
}

export default LoginForm;

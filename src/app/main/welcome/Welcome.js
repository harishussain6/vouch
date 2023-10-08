import { UserContext } from 'app/context/UserContext';
import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

function Welcome({ user }) {
	const context = useContext(UserContext);

	useEffect(() => {
		if (user) context.create(user);
		// eslint-disable-next-line
	}, [user]);

	if (user.data.role !== 'guest') {
		switch (user.data.role) {
			case 'marketing':
			case 'creative':
				return <Redirect to="/tasks" />;
			case 'hr':
				return <Redirect to="/user" />;
			case 'client_support':
			case 'corporate':
				return <Redirect to="/customer_query" />;
			case 'csr':
				return <Redirect to="/customer" />;
			case 'orders':
				return <Redirect to="/order" />;
			default:
				return <Redirect to="/vendor" />;
		}
	}

	return <Redirect to="/login" />;
}

function mapStateToProps({ auth }) {
	return {
		user: auth.user
	};
}

export default connect(mapStateToProps)(Welcome);

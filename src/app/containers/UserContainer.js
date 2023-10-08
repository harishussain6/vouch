import { UserProvider } from 'app/context/UserContext';
import React, { useState } from 'react';

function UserContainer({ children }) {
	const [user, setUser] = useState({ user_type: 'admin' });

	function create(user) {
		setUser(user);
	}
	return (
		<UserProvider
			value={{
				user,
				create
			}}
		>
			{children}
		</UserProvider>
	);
}

export default UserContainer;

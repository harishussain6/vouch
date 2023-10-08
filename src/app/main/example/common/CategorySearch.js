import React, { useState, useEffect } from 'react';
import JwtService from 'app/services/jwtService';
import FuseChipSelect from '@fuse/core/FuseChipSelect';

const axios = JwtService.getAxios();

function CategorySearch({ setValue, error }) {
	const [offers, setOffers] = useState([]);
	const [offer, setOffer] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get('/api/admin/category').then(res => {
			const data = res.data.data;
			setOffers(data.category);
			setLoading(false);
		});
	}, []);
	useEffect(() => {
						if (offer) setValue(offer.id);
						// eslint-disable-next-line
					}, [offer]);
	function onChange(value, name) {
		setOffer(value);
	}

	return (
		<FuseChipSelect
			className="mt-8 mb-8"
			value={{
				value: offer.id,
				label: offer.name
			}}
			onChange={value => onChange(value)}
			placeholder="Select category"
			textFieldProps={{
				label: 'Categories',
				InputLabelProps: {
					shrink: true
				},
				variant: 'outlined'
			}}
			options={offers.map(partner => ({
				value: partner.id,
				label: partner.name
			}))}
			loading={loading}
			error={error}
			helperText={error}
			required
		/>
	);
}

export default CategorySearch;

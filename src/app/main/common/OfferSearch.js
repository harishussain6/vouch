import React, { useState, useEffect } from 'react';
import JwtService from 'app/services/jwtService';
import FuseChipSelect from '@fuse/core/FuseChipSelect';

const axios = JwtService.getAxios();

function OfferSearch({ setValue, error, incomingOffer }) {
	const [offers, setOffers] = useState([]);
	const [offer, setOffer] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get('/api/admin/offer').then(res => {
			const data = res.data.data;
			setOffers(data.offers);

			if (incomingOffer) {
				const offer = data.offers.find(offer => offer.id === incomingOffer);
				if (offer) {
					setOffer({ value: offer.id, label: offer.name });
				}
			}
			setLoading(false);
		});
		// eslint-disable-next-line
	}, []);
	useEffect(() => {
		if (offer) setValue(offer.value);
		// eslint-disable-next-line
	}, [offer]);

	function onChange(value, name) {
		console.log(value);
		setOffer(value);
	}

	return (
		<FuseChipSelect
			className="mt-8 mb-8"
			value={offer}
			onChange={value => onChange(value)}
			placeholder="Select offer"
			textFieldProps={{
				label: 'Offers',
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

export default OfferSearch;

import React, { useState, useEffect } from 'react';
import JwtService from 'app/services/jwtService';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import _ from '@lodash';

const axios = JwtService.getAxios();

function VendorSearch({ setValue, error, selectedVendor, label = 'Vendor', setVendor = null, selectedId = 0 }) {
	const [vendor, setVendorId] = useState({});
	useEffect(() => {
		if (vendor) {
			setValue(vendor.id);
			if (setVendor) setVendor(vendor);
		}
		// eslint-disable-next-line
	}, [vendor]);
	useEffect(() => {
		if (typeof selectedId === 'number' && selectedId > 0) {
			axios
				.get('/api/admin/get-parent-list', {
					params: { query: selectedId }
				})
				.then(res => {
					const data = res.data;
					const compiledData = data.data.map(vendor => ({
						id: vendor.id,
						label: `${vendor.name}, ${vendor.locality}, ${vendor.city.name.toUpperCase()} `
					}));
					if (compiledData && Object.keys(compiledData).length > 0) {
						const vendorToSet = _.values(compiledData)[0];
						if (setVendor)
							setVendor(vendorToSet);
						setValue(vendorToSet.id);
						setVendorId({
							id: vendorToSet.id,
							label: vendorToSet.label
						});
					}
				});
		}
	}, []);
	function onChange(value, name) {
		if (name === 'vendor') {
			setVendorId(value);
		}
	}

	function promiseOptions(inputValue) {
		if (inputValue.length < 4) return Promise.resolve([]);
		return axios
			.get('/api/admin/get-parent-list', {
				params: { query: inputValue }
			})
			.then(res => {
				const data = res.data;
				return data.data.map(vendor => ({
					id: vendor.id,
					label: `${vendor.name}, ${vendor.locality}, ${vendor.city.name.toUpperCase()} `
				}));
			});
	}
	return (
		<FuseChipSelect
			className="mt-8 mb-8"
			value={{
				value: vendor.id,
				label: vendor.label
			}}
			onChange={value => onChange(value, 'vendor')}
			textFieldProps={{
				label,
				InputLabelProps: {
					shrink: true
				},
				variant: 'outlined'
			}}
			required
			variant="async"
			defaultOptions
			loadOptions={promiseOptions}
			error={error}
			helperText={error}
			// defaultInputValue="defaultInputValue"
		/>
	);
}

export default VendorSearch;

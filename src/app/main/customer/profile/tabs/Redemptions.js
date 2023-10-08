import MaterialTable from 'material-table';
import React, { useState } from 'react';
import JwtService from 'app/services/jwtService';
import ConfirmDialog from 'app/main/common/ConfirmDialog';
const axios = JwtService.getAxios();

function Redemptions({ redemptions, setLoading, reload }) {
	const [dialog, setDialog] = useState(false);
	const [selectedRedemption, setSelectedRedemption] = useState(0);
	function deleteRedemption() {
		setDialog(false);
		setLoading(true);
		axios
			.post(`/api/admin/delete-redemption`, {
				id: selectedRedemption
			})
			.then(res => {
				console.log(res.data);
				setLoading(false);
				reload();
			});
	}
	return (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col-12 flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<ConfirmDialog title="delete redemption" onConfirm={deleteRedemption} openDialog={dialog} />
				<MaterialTable
					title="Redemptions"
					data={redemptions}
					columns={[
						{
							title: 'Savings',
							field: 'total_savings'
						},
						{
							title: 'Brand',
							field: 'vendor.name'
						},
						{
							title: 'Locality',
							field: 'vendor.locality'
						},
						{
							title: 'City',
							field: 'vendor.city.name'
						},
						{
							title: 'Voucher',
							field: 'voucher.name'
						},
						{
							title: 'Referrence Code',
							field: 'reference_code'
						},
						{
							title: 'Time',
							field: 'created_at'
						}
					]}
					options={{
						actionsColumnIndex: -1,
						pageSize: 10,
						pageSizeOptions: [10, 20, 50, 100],
						exportButton: true
					}}
					actions={[
						{
							icon: 'delete',
							tooltip: 'Delete Redemption',
							onClick: (event, data) => {
								setSelectedRedemption(data.id);
								setDialog(true);
							}
						}
					]}
				/>
			</div>
		</div>
	);
}

export default Redemptions;

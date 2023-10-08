import MaterialTable from 'material-table';
import React from 'react';
// import JwtService from 'app/services/jwtService';
// import ConfirmDialog from 'app/main/common/ConfirmDialog';
// const axios = JwtService.getAxios();

function PingedVouchers({ pingedVouchers, setLoading, reload }) {
	// const [dialog, setDialog] = useState(false);
	// const [selectedRedemption, setSelectedRedemption] = useState(0);
	// function deleteRedemption() {
	// 	setDialog(false);
	// 	setLoading(true);

	// 	axios
	// 		.post(`/api/admin/delete-redemption`, {
	// 			id: selectedRedemption
	// 		})
	// 		.then(res => {
	// 			console.log(res.data);
	// 			setLoading(false);
	// 			reload();
	// 		});
	// }
	return (
		<div className="md:flex max-w-2xl w-screen">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				{/* <ConfirmDialog title="delete redemption" onConfirm={deleteRedemption} openDialog={dialog} /> */}
				<MaterialTable
					title="Redemptions"
					data={pingedVouchers}
					columns={[
						{
							title: 'Voucher',
							field: 'voucher.name'
						},
						{
							title: 'Type',
							field: 'type'
						}
					]}
					options={{
						actionsColumnIndex: -1,
						pageSize: 10,
						pageSizeOptions: [10, 20, 50, 100],
						exportButton: true
					}}
					// actions={[
					// 	{
					// 		icon: 'delete',
					// 		tooltip: 'Delete Redemption',
					// 		onClick: (event, data) => {
					// 			setSelectedRedemption(data.id);
					// 			setDialog(true);
					// 		}
					// 	}
					// ]}
				/>
			</div>
		</div>
	);
}

export default PingedVouchers;

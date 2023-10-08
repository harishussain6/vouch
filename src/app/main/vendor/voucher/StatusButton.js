import { Button } from "@material-ui/core"
import React from "react"
import JwtService from 'app/services/jwtService';
const axios = JwtService.getAxios();

function StatusButton({data,reload}) {
    async function update(){
        const res = await axios.put(`/api/admin/voucher/${data.id}`,{
            status: data.status === "active" ? "inactive" : "active"
        });
        if (res.data.status) {
			reload()
		}
	}
    return <Button variant="contained" color="secondary" onClick={update}>{data.status === "active" ? "Disable" : "Enable"}</Button>
}

export default StatusButton
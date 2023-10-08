import { SnackbarProvider } from "app/context/SnackbarContext";
import React,{useState} from "react"
export default function SnackBarContainer({children}){
    const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    
	return (
		<SnackbarProvider
			value={{
                open,
                setOpen,
                message,
                setMessage,
                severity,
                setSeverity
			}}
		>
			{children}
		</SnackbarProvider>
	);
}
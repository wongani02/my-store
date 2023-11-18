import { FunctionComponent, useEffect, useState } from "react";
import Modal from "../Modal";
import { Button } from "@/components/ui/button";


interface AlertModalProps {
    isOpen: boolean
    onClose: ()=>void
    onConfirm: ()=>void
    loading: boolean
}
 
const AlertModal: FunctionComponent<AlertModalProps> = ({isOpen, onClose, onConfirm, loading}) => {

    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(()=>{
        setIsMounted(true)
    }, [])

    if(!isMounted){
        return null
    }

    return ( 
        <Modal
        title="Are you sure you want to delete this store?"
        description="This action can not be undone"
        isOpen={isOpen}
        onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant={'outline'} disabled={loading} onClick={onClose}>
                    Cancel
                </Button>
                <Button variant={'destructive'} disabled={loading} onClick={onConfirm}>
                    Delete
                </Button>
            </div>
        </Modal>
    );
}
 
export default AlertModal;
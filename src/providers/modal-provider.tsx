"use client"

import StoreModal from "@/components/app_components/modals/StoreModal";
import { useEffect, useState } from "react"


export const ModalProvider = () =>{
    
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(()=>{
        setIsMounted(true);
    }, [])

    if (!isMounted){
        return null;
    }

    return (
        <>
            <StoreModal/>
        </>
    )
}
'use client'

import Heading from "@/components/app_components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FunctionComponent } from "react";

interface BillBoardClientProps {
    
}
 
const BillBoardClient: FunctionComponent<BillBoardClientProps> = () => {

    const router = useRouter();
    const params = useParams();


    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                title="Billboards (0)"
                description="Manage billboards for your store"
                />
                <Button onClick={()=>router.push(`/${params.store_Id}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add new
                </Button>
            </div>
            <Separator/>
        </>
     );
}
 
export default BillBoardClient;
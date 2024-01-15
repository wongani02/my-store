'use client'

import Heading from "@/components/app_components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/app_components/data-table";
import APIList from "@/components/ui/api-list";

interface BillBoardClientProps {
    data: BillboardColumn[]
}
 
const BillBoardClient: FunctionComponent<BillBoardClientProps> = ({data}) => {

    const router = useRouter();
    const params = useParams();


    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                title={`Billboards (${data.length})`}
                description="Manage billboards for your store"
                />
                <Button onClick={()=>router.push(`/${params.store_Id}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add new
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="label" columns={columns} data={data}/>
            <Heading title="API Routes" description="List of Billboard API routes"/>
            <Separator/>
            <APIList entityIdName="billBoardID" entityName="billboards"/>
        </>
     );
}
 
export default BillBoardClient;
'use client'

import Heading from "@/components/app_components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/app_components/data-table";
import APIList from "@/components/app_components/api-list";

interface OrderClientProps {
    data: OrderColumn[]
}
 
const OrderClient: FunctionComponent<OrderClientProps> = ({data}) => {

    const router = useRouter();
    const params = useParams();


    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                title={`Orders (${data.length})`}
                description="Manage your orders here"
                />
                <Button onClick={()=>router.push(`/${params.store_Id}/orders/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add new
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="label" columns={columns} data={data}/>
        </>
     );
}
 
export default OrderClient;
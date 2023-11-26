'use client'

import Heading from "@/components/app_components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import { SizesColumn, columns } from "./columns";
import { DataTable } from "@/components/app_components/data-table";
import APIList from "@/components/app_components/api-list";

interface SizeClientProps {
    data: SizesColumn[]
}
 
const SizeClient: FunctionComponent<SizeClientProps> = ({data}) => {

    const router = useRouter();
    const params = useParams();


    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                title={`Sizes (${data.length})`}
                description="Manage sizes for your store"
                />
                <Button onClick={()=>router.push(`/${params.store_Id}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add new
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API Routes" description="List of sizes API routes"/>
            <Separator/>
            <APIList entityIdName="sizeId" entityName="sizes"/>
        </>
     );
}
 
export default SizeClient;
'use client'

import Heading from "@/components/app_components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import { CategoriesColumn, columns } from "./columns";
import { DataTable } from "@/components/app_components/data-table";
import APIList from "@/components/app_components/api-list";

interface CategoryClientProps {
    data: CategoriesColumn[]
}
 
const CategoryClient: FunctionComponent<CategoryClientProps> = ({data}) => {

    const router = useRouter();
    const params = useParams();


    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                title={`Categories (${data.length})`}
                description="Manage categories for your store"
                />
                <Button onClick={()=>router.push(`/${params.store_Id}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add new
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API Routes" description="List of Categories API routes"/>
            <Separator/>
            <APIList entityIdName="categoryId" entityName="categories"/>
        </>
     );
}
 
export default CategoryClient;
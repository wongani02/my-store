import { FunctionComponent } from "react";
import prismadb from "@/lib/prismadb";
import { SizesColumn } from "./components/columns";
import { format } from "date-fns";
import SizeClient from "./components/client";


interface SizesPageProps {
    params : {
        store_Id: string,
    }
}
 
const SizesPage: FunctionComponent<SizesPageProps> = async ({params}) => {
    
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.store_Id,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    const formattedCategories: SizesColumn[] = sizes.map((item)=>({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={formattedCategories}/>
            </div>
        </div>
    );
}
 
export default SizesPage;
import { FunctionComponent } from "react";
import prismadb from "@/lib/prismadb";
import { ColorsColumn } from "./components/columns";
import { format } from "date-fns";
import ColorsClient from "./components/client";


interface ColorsPageProps {
    params : {
        store_Id: string,
    }
}
 
const ColorsPage: FunctionComponent<ColorsPageProps> = async ({params}) => {
    
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.store_Id,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    const formattedColors: ColorsColumn[] = colors.map((item)=>({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient data={formattedColors}/>
            </div>
        </div>
    );
}
 
export default ColorsPage;
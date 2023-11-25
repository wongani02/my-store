import { FunctionComponent } from "react";
import BillBoardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { CategoriesColumn } from "./components/columns";
import { format } from "date-fns";
import CategoryClient from "./components/client";

interface CategoriesPageProps {
    params : {
        store_Id: string,
    }
}
 
const CategoriesPage: FunctionComponent<CategoriesPageProps> = async ({params}) => {
    
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.store_Id,
        },
        include: {
            billboard: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    const formattedCategories: CategoriesColumn[] = categories.map((item)=>({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories}/>
            </div>
        </div>
    );
}
 
export default CategoriesPage;
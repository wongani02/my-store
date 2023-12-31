import { FunctionComponent } from "react";
import BillBoardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { BillboardColumn } from "./components/columns";
import { format } from "date-fns";

interface BillBoardPageProps {
    params : {
        store_Id: string,
    }
}
 
const BillBoardPage: FunctionComponent<BillBoardPageProps> = async ({params}) => {
    
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.store_Id,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map((item)=>({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillBoardClient data={formattedBillboards}/>
            </div>
        </div>
    );
}
 
export default BillBoardPage;
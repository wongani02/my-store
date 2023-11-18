import prismadb from "@/lib/prismadb";
import { FunctionComponent } from "react";

interface DashboardPageProps {
    params : {
        store_Id: string
    }
}
 
const DashboardPage: FunctionComponent<DashboardPageProps> = async ({params}) => {

    const store = await prismadb.store.findFirst({
        where: {
            id: params.store_Id,
        }
    })

    return ( 
        <div>
            Dashboard Page {store?.name}
        </div>
    );
}
 
export default DashboardPage;
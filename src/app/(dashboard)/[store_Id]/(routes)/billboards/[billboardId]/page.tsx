import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";
import BillboardForm from "./components/BillboardForm";

interface CreateBillboardPageProps {
    params: {
        billboardId: string
    }
}
 
const CreateBillboardPage: FunctionComponent<CreateBillboardPageProps> = async ({params}) => {

    const userId = auth();

    if(!userId){
        redirect('/sign-in');
    }

    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId,
        }
    })
    
    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard}/>
            </div>
        </div>
    );
}
 
export default CreateBillboardPage;
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";
import SizeForm from "./components/SizeForm";


interface CreateCategoryPageProps {
    params: {
        sizeId: string
        store_Id: string
    }
}
 
const CreateCategoryPage: FunctionComponent<CreateCategoryPageProps> = async ({params}) => {

    const userId = auth();

    if(!userId){
        redirect('/sign-in');
    }

    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId,
        },
    })
    

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm initialData={size}/>
            </div>
        </div>
    );
}
 
export default CreateCategoryPage;
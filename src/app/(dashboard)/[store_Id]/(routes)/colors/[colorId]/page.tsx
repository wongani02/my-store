import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";
import ColorForm from "./components/ColorForm";


interface CreateColorsPageProps {
    params: {
        colorId: string
        store_Id: string
    }
}
 
const CreateColorsPage: FunctionComponent<CreateColorsPageProps> = async ({params}) => {

    const userId = auth();

    if(!userId){
        redirect('/sign-in');
    }

    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId,
        },
    })
    

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={color}/>
            </div>
        </div>
    );
}
 
export default CreateColorsPage;
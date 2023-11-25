import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";
import CategoryForm from "./components/CategoryForm";

interface CreateCategoryPageProps {
    params: {
        categoryId: string
        store_Id: string
    }
}
 
const CreateCategoryPage: FunctionComponent<CreateCategoryPageProps> = async ({params}) => {

    const userId = auth();

    if(!userId){
        redirect('/sign-in');
    }

    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId,
        },
        include: {
            billboard: true
        }
    })
    
    const billboards = await prismadb.billboard.findMany({
        where:{
            storeId: params.store_Id
        }
    })

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm initialData={category} billboards={billboards}/>
            </div>
        </div>
    );
}
 
export default CreateCategoryPage;
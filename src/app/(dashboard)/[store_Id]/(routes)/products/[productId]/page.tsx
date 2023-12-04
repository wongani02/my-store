import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";
import ProductForm from "./components/ProductForm";


interface CreateProductPageProps {
    params: {
        productId: string
        store_Id: string
    }
}
 
const CreateProductPage: FunctionComponent<CreateProductPageProps> = async ({params}) => {

    const userId = auth();

    if(!userId){
        redirect('/sign-in');
    }

    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId,
        },
        include: {
            images: true
        }
    })

    const categories = await prismadb.category.findMany({
        where: {
        storeId: params.store_Id,
        },
    });

    const sizes = await prismadb.size.findMany({
        where: {
        storeId: params.store_Id,
        },
    });

    const colors = await prismadb.color.findMany({
        where: {
        storeId: params.store_Id,
        },
    });
    
    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm 
                categories={categories}
                sizes={sizes}
                colors={colors}
                initialData={product}/>
            </div>
        </div>
    );
}
 
export default CreateProductPage;
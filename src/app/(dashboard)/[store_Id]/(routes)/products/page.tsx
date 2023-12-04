import { FunctionComponent } from "react";
import prismadb from "@/lib/prismadb";
import { ProductColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import ProductClient from "./components/client";

interface ProductsPageProps {
    params : {
        store_Id: string,
    }
}
 
const ProductsPage: FunctionComponent<ProductsPageProps> = async ({params}) => {
    
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.store_Id,
        },
        include:{
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    const formattedProducts: ProductColumn[] = products.map((item)=>({
        id: item.id,
        name: item.name,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
    }))

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    );
}
 
export default ProductsPage;
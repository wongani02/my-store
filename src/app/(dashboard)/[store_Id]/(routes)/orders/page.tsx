import { FunctionComponent } from "react";
import BillBoardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import OrderClient from "./components/client";

interface OrdersPageProps {
    params : {
        store_Id: string,
    }
}
 
const OrdersPage: FunctionComponent<OrdersPageProps> = async ({params}) => {
    
    const orders = await prismadb.order.findMany({
        where: {
        storeId: params.store_Id
        },
        include: {
        orderItems: {
            include: {
            product: true
            }
        }
        },
        orderBy: {
        createdAt: 'desc'
        }
    });

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price)
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders}/>
            </div>
        </div>
    );
}
 
export default OrdersPage;
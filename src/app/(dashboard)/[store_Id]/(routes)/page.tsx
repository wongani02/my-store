import { getGraphRevenue } from "@/actions/getBarChartRevenue";
import { getStockCount } from "@/actions/getProductsInstock";
import { getSalesCount } from "@/actions/getTotalOrders";
import { getTotalRevenue } from "@/actions/getTotalRevenue";
import Heading from "@/components/app_components/Heading";
import Overview from "@/components/app_components/Overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package, ShoppingBag } from "lucide-react";
import { FunctionComponent } from "react";

interface DashboardPageProps {
    params : {
        store_Id: string
    }
}
 
const DashboardPage: FunctionComponent<DashboardPageProps> = async ({params}) => {

    // const store = await prismadb.store.findFirst({
    //     where: {
    //         id: params.store_Id,
    //     }
    // })

    const totalRevenue = await getTotalRevenue(params.store_Id);
    const totalOrders = await getSalesCount(params.store_Id);
    const totalStock = await getStockCount(params.store_Id);
    const graphData = await getGraphRevenue(params.store_Id)

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store"/>
                <Separator/>
                <div className="grid gap-4 grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">
                                Sales
                            </CardTitle>
                            <CreditCard className="w-4 h-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{totalOrders}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">
                                Products in stock
                            </CardTitle>
                            <Package className="w-4 h-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{totalStock}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">
                                Active Carts
                            </CardTitle>
                            <ShoppingBag className="w-4 h-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                50
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>
                            Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Overview data={graphData}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
 
export default DashboardPage;
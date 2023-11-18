import Navbar from "@/components/app_components/Navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FunctionComponent, ReactNode } from "react";

interface DashboardLayoutProps {
    children: React.ReactNode
    params: {
        store_id: string
    }
}
 
const DashboardLayout: FunctionComponent<DashboardLayoutProps> = async ({children, params}) => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.store_id,
            userId
        }
    });

    if (!store) {
        redirect('/')
    }

    return ( 
       <>
            <Navbar/>
            {children}
       </>
    );
}
 
export default DashboardLayout;
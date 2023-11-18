import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";
import SettingsForm from "./components/SettingsForm";
import { Store } from "@prisma/client";

interface SettingsPageProps {
    params: {
        store_Id: string
    }
}
 
const SettingsPage: FunctionComponent<SettingsPageProps> = async ({params}) => {

    const {userId} = auth();

    if(!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            userId,
            id: params.store_Id,
        }
    })

    if (!store){
        redirect('/');
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 p6-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
    );
}
 
export default SettingsPage;
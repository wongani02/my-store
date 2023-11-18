import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";

interface SetUpLayoutProps {
    children: React.ReactNode
}
 
const SetUpLayout: FunctionComponent<SetUpLayoutProps> = async ({children}) => {

    const { userId } = auth();
    
    if (!userId) {
        redirect('/sign-in');
    }


    const store = await prismadb.store.findFirst({
        where: {
            userId: userId
        }
    })

    if (store){
        redirect(`/${store.id}`)
    }

    return ( 
        <>
            {children}
        </>
    );
}
 
export default SetUpLayout;
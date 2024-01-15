import { UserButton, auth } from "@clerk/nextjs";
import { FunctionComponent } from "react";
import { NavLinks } from "./NavLinks";
import StoreSwtcher from "./StoreSwitcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface NavbarProps {
    
}
 
const Navbar: FunctionComponent<NavbarProps> = async() => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId,
        }
    })

    return ( 
        <div className="border-b">
            <div className="flex h-16 items-center px-4">

                <StoreSwtcher items={stores}/>

                <NavLinks className="mx-6"/>
                
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeSwitcher/>
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
     );
}
 
export default Navbar;
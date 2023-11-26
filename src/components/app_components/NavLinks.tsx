'use client'
import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"

 


export function NavLinks({
    className,
    ...props
}:React.HTMLAttributes<HTMLElement>){

    const pathName = usePathname();

    const params = useParams();

    const routes = [
        {
            href: `/${params.store_Id}`,
            label: 'Dashboard',
            active: pathName === `/${params.store_Id}`,
        },
        {
            href: `/${params.store_Id}/billboards`,
            label: 'Billboards',
            active: pathName === `/${params.store_Id}/billboards`,
        },
        {
            href: `/${params.store_Id}/categories`,
            label: 'Categories',
            active: pathName === `/${params.store_Id}/categories`,
        },
        {
            href: `/${params.store_Id}/sizes`,
            label: 'Sizes',
            active: pathName === `/${params.store_Id}/sizes`,
        },
        {
            href: `/${params.store_Id}/settings`,
            label: 'Settings',
            active: pathName === `/${params.store_Id}/settings`,
        },
    ];


    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
            {routes.map((route)=>(
                <Link 
                key={route.href}
                className={cn('text-sm font-medium transition-colors hover:text-primary', route.active ? 'text-black dark:text-white': 'text-muted-foreground')}
                href={route.href}>
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}


import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function PATCH (req: Request, { params }: { params: { store_Id: string } }){
    try {

        const { userId } = auth();

        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse('Unauthorised', {status: 401});
        }
        
        if (!name){
            return new NextResponse('Bad Request, Name is required', {status:400});
        }
        
        if (!params.store_Id){
            return new NextResponse('Store Id is required', {status: 400});
        }
        console.log('params passed', params.store_Id)
        const store = await prismadb.store.updateMany({
            where: {
                userId, 
                id: params.store_Id,
            },
            data:{
                name,
            }
        })

        return NextResponse.json(store);

    } catch (e){
        console.log('[STORE PATCH API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}




export async function DELETE (req: Request, { params }: { params: { store_Id: string } }){
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorised', {status: 401});
        }

        if (!params.store_Id){
            return new NextResponse('Store Id is required', {status: 400});
        }

        const store = await prismadb.store.deleteMany({
            where: {
                userId, 
                id: params.store_Id,
            },
        })

        return NextResponse.json(store);

    } catch (e){
        console.log('[STORE DELETE API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}
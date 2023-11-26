import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";




export async function GET (
    req:Request,
    { params }: { params: { sizeId: string } } 
    ){
    try {

        // const {userId} = auth();

        // if (!userId){
        //     return new NextResponse('Unauthenticated', { status:401 });
        // }

        if (!params.sizeId){
            return new NextResponse('Bad Request, Size Id is required', { status:400 });
        }

        const sizes = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(sizes);


    } catch (error) {

        console.log('[SIZE-Single GET API ROUTE] - ', error);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function PATCH (
    req: Request, 
    { params }: { params: { store_Id: string, sizeId:string } }){
    try {

        const body = await req.json();

        const { name, value } = body;

        const {userId} = auth();

        if (!userId){
            return new NextResponse('Unauthorised', {status:401});
        }

        if (!value){
            return new NextResponse('Bad request, value is required', {status: 400});
        }

        if (!name){
            return new NextResponse('Bad Request, Name is required', {status:400});
        }

        if (!params.store_Id){
            return new NextResponse('Bad Request, Store Id is required', {status:400});
        }

        if (!params.sizeId){
            return new NextResponse('Bad Request, size Id is required', {status:400});
        }

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.store_Id,
                userId,
            }
        })

        if(!storeByUser){
            return new NextResponse('UnAuthorised request', {status:403});
        }

        const sizes = await prismadb.size.update({
            where:{
                id: params.sizeId
            },
            data: {
                name: name,
                value:value,
            }
        });

        return NextResponse.json(sizes);

    } catch (e){
        console.log('[SIZE PATCH API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function DELETE (
    req: Request, 
    { params }: { params: { store_Id: string, sizeId:string } }
    ){
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorised', {status: 401});
        }

        if (!params.store_Id){
            return new NextResponse('Store Id is required', {status: 400});
        }

         if (!params.sizeId){
            return new NextResponse('Bad Request, size Id is required', {status:400});
        }

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.store_Id,
                userId,
            }
        })

        if(!storeByUser){
            return new NextResponse('UnAuthorised request', {status:403});
        }

        const sizes = await prismadb.size.deleteMany({
            where: { 
                id: params.sizeId,
            },
        })

        return NextResponse.json(sizes);

    } catch (e){
        console.log('[SIZE DELETE API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}
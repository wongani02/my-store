import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";




export async function GET (
    req:Request,
    { params }: { params: { colorId: string } } 
    ){
    try {

        // const {userId} = auth();

        // if (!userId){
        //     return new NextResponse('Unauthenticated', { status:401 });
        // }

        if (!params.colorId){
            return new NextResponse('Bad Request, Color Id is required', { status:400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);


    } catch (error) {

        console.log('[COLOR-Single GET API ROUTE] - ', error);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function PATCH (
    req: Request, 
    { params }: { params: { store_Id: string, colorId:string } }){
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

        if (!params.colorId){
            return new NextResponse('Bad Request, color Id is required', {status:400});
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

        const color = await prismadb.color.update({
            where:{
                id: params.colorId
            },
            data: {
                name: name,
                value:value,
            }
        });

        return NextResponse.json(color);

    } catch (e){
        console.log('[COLOR PATCH API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function DELETE (
    req: Request, 
    { params }: { params: { store_Id: string, colorId:string } }
    ){
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorised', {status: 401});
        }

        if (!params.store_Id){
            return new NextResponse('Store Id is required', {status: 400});
        }

         if (!params.colorId){
            return new NextResponse('Bad Request, color Id is required', {status:400});
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

        const color = await prismadb.color.deleteMany({
            where: { 
                id: params.colorId,
            },
        })

        return NextResponse.json(color);

    } catch (e){
        console.log('[COLOR DELETE API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";




export async function GET (
    req:Request,
    { params }: { params: { billboardId: string } } 
    ){
    try {

        const {userId} = auth();

        if (!userId){
            return new NextResponse('Unauthenticated', { status:401 });
        }

        if (!params.billboardId){
            return new NextResponse('Bad Request, Billboard Id is required', { status:400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);


    } catch (error) {

        console.log('[BILLBOARD-Single GET API ROUTE] - ', error);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function PATCH (
    req: Request, 
    { params }: { params: { store_Id: string, billboardId:string } }){
    try {

        const body = await req.json();

        const { label, imageURL } = body;

        const {userId} = auth();

        if (!userId){
            return new NextResponse('Unauthorised', {status:401});
        }

        if (!imageURL){
            return new NextResponse('Bad request, Image URL is required', {status: 400});
        }

        if (!label){
            return new NextResponse('Bad Request, Name is required', {status:400});
        }

        if (!params.store_Id){
            return new NextResponse('Bad Request, Store Id is required', {status:400});
        }

        if (!params.billboardId){
            return new NextResponse('Bad Request, Store Id is required', {status:400});
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

        const billboard = await prismadb.billboard.update({
            where:{
                id: params.billboardId
            },
            data: {
                label,
                imageURL,
            }
        });

        return NextResponse.json(billboard);

    } catch (e){
        console.log('[BILLBOARD PATCH API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function DELETE (
    req: Request, 
    { params }: { params: { store_Id: string, billboardId:string } }
    ){
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorised', {status: 401});
        }

        if (!params.store_Id){
            return new NextResponse('Store Id is required', {status: 400});
        }

         if (!params.billboardId){
            return new NextResponse('Bad Request, Store Id is required', {status:400});
        }

        const storeByUser = await prismadb.store.delete({
            where: {
                id: params.store_Id,
                userId,
            }
        })

        if(!storeByUser){
            return new NextResponse('UnAuthorised request', {status:403});
        }

        const billboard = await prismadb.billboard.deleteMany({
            where: { 
                id: params.billboardId,
            },
        })

        return NextResponse.json(billboard);

    } catch (e){
        console.log('[BILLBOARD DELETE API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}
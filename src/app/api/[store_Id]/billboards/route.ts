import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST (
    req:Request,
    { params }: { params: { store_Id: string } } 
    ){
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
            return new NextResponse('Bad Request, Store Id is required', {status:400})
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageURL,
                storeId: params.store_Id
            }
        });

        return NextResponse.json(billboard);


    } catch (error) {

        console.log('[BILLBOARD POST API ROUTE] - ', error);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function GET (
    req:Request,
    { params }: { params: { store_Id: string } } 
    ){
    try {

        const {userId} = auth();

        if (!userId){
            return new NextResponse('Unauthenticated', { status:401 });
        }

        if (!params.store_Id){
            return new NextResponse('Bad Request, Store Id is required', { status:400 });
        }

        const billboard = await prismadb.billboard.findMany({
            where: {
                storeId: params.store_Id,
            }
        });

        return NextResponse.json(billboard);


    } catch (error) {

        console.log('[BILLBOARD GET API ROUTE] - ', error);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";




export async function GET (
    req:Request,
    { params }: { params: { categoryId: string } } 
    ){
    try {

        // const {userId} = auth();

        // if (!userId){
        //     return new NextResponse('Unauthenticated', { status:401 });
        // }

        if (!params.categoryId){
            return new NextResponse('Bad Request, Category Id is required', { status:400 });
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);


    } catch (error) {

        console.log('[CATEGORY-Single GET API ROUTE] - ', error);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function PATCH (
    req: Request, 
    { params }: { params: { store_Id: string, categoryId:string } }){
    try {

        const body = await req.json();

        const { name, billboardId } = body;

        const {userId} = auth();

        if (!userId){
            return new NextResponse('Unauthorised', {status:401});
        }

        if (!billboardId){
            return new NextResponse('Bad request, billboardId is required', {status: 400});
        }

        if (!name){
            return new NextResponse('Bad Request, Name is required', {status:400});
        }

        if (!params.store_Id){
            return new NextResponse('Bad Request, Store Id is required', {status:400});
        }

        if (!params.categoryId){
            return new NextResponse('Bad Request, category Id is required', {status:400});
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

        const category = await prismadb.category.update({
            where:{
                id: params.categoryId
            },
            data: {
                name,
                billboardId: billboardId,
            }
        });

        return NextResponse.json(category);

    } catch (e){
        console.log('[CATEGORY PATCH API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function DELETE (
    req: Request, 
    { params }: { params: { store_Id: string, categoryId:string } }
    ){
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorised', {status: 401});
        }

        if (!params.store_Id){
            return new NextResponse('Store Id is required', {status: 400});
        }

         if (!params.categoryId){
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

        const category = await prismadb.category.deleteMany({
            where: { 
                id: params.categoryId,
            },
        })

        return NextResponse.json(category);

    } catch (e){
        console.log('[CATEGORY DELETE API ROUTE] - ', e);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}
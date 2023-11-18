import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";



export async function POST (req:Request){
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

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json(store);


    } catch (error) {

        console.log('[STORES POST API ROUTE] - ', error);
        
        return new NextResponse('Internal Error', {status: 500});
    }
}
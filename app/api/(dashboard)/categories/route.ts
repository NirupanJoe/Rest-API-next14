import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async(request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid user ID', {
                status: 400
            })
        }
        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse('User not found in the database', {
                status: 404
            })
        }
        const categories = await Category.find({ user: new Types.ObjectId(userId) });
        return new NextResponse(JSON.stringify(categories), {
            status: 200
        })

    } catch (error: any) {
        return new NextResponse('Error fetching categories ' + error.message, {
            status: 500
        })
    }
}

export const POST = async(request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid user ID', {
                status: 400
            })
        }
        const { title } = await request.json();

        await connect();

        const userExists = await User.findById(userId);
        if (!userExists) {
            return new NextResponse('User not found in the database', {
                status: 404
            })
        }

        const category = await Category.create({ user: new Types.ObjectId(userId), title });
        return new NextResponse(JSON.stringify(category), {
            status: 201
        })
    } catch (error: any) {
        return new NextResponse('Error creating category ' + error.message, {
            status: 500
        })
    }
}
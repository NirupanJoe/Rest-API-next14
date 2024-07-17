import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async(request: Request, context: { params: any }) => {
    const categoryId = context.params.category;
    try {
        const body = await request.json();
        const { title } = body;
        
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid user ID', {
                status: 400
            })
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse('Invalid category ID', {
                status: 400
            })
        }
        await connect();
        const userExists = await User.findById(userId);
        if (!userExists) {
            return new NextResponse('User not found in the database', {
                status: 404
            })
        }
        const categoryExists = await Category.findOne({ _id: categoryId, user: userId });
        if (!categoryExists) {
            return new NextResponse('Category not found in the database', {
                status: 404
            })
        }
        const category = await Category.findByIdAndUpdate(categoryId, { title }, { new: true });
        return new NextResponse(JSON.stringify({ message: "Category updated", category }), {
            status: 200
        })
    } catch (error: any) {
        return new NextResponse('Error updating category ' + error.message, {
            status: 500
        })
    }
}

export const DELETE = async(request: Request, context: { params: any }) => {
    const categoryId = context.params.category;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid user ID', {
                status: 400
            })
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse('Invalid category ID', {
                status: 400
            })
        }
        await connect();
        const userExists = await User.findById(userId);
        if (!userExists) {
            return new NextResponse('User not found in the database', {
                status: 404
            })
        }
        const categoryExists = await Category.findOne({ _id: categoryId, user: userId });
        if (!categoryExists) {
            return new NextResponse('Category not found in the database', {
                status: 404
            })
        }
        const category = await Category.findByIdAndDelete(categoryId);
        return new NextResponse(JSON.stringify({ message: "Category deleted", category }), {
            status: 200
        })
    } catch (error: any) {  
        return new NextResponse('Error deleting category ' + error.message, {
            status: 500
        })
    }
}
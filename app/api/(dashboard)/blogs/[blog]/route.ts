import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async(request: Request, { params }: any) => {
    const blogId = params.blog;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid user ID", {
                status: 400
            })
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse("Invalid category ID", {
                status: 400
            })
        }
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse("Invalid blog ID", {
                status: 400
            })
        }
        await connect();
        const userExists = await User.findById(userId);
        if (!userExists) {
            return new NextResponse("User not found in the database", {
                status: 404
            })
        }        
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return new NextResponse("Category not found in the database", {
                status: 404
            })
        }
        const blogExists = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId
        });
        if (!blogExists) {
            return new NextResponse("Blog not found in the database", {
                status: 404
            })
        }
        return new NextResponse(JSON.stringify(blogExists), {
            status: 200
        })
    } catch (error: any) {
        return new NextResponse('Error fetching blog ' + error.message, {
            status: 500
        })
    }
}


import connect from "@/lib/db"
import Blog from "@/lib/modals/blog"
import Category from "@/lib/modals/category"
import User from "@/lib/modals/user"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const GET = async(request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

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

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("User not found in the database", {
                status: 404
            })
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse("Category not found in the database", {
                status: 404
            })
        }

        const filter: any = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        }

        // TODO
        
        const blog = await Blog.find(filter);

        return new NextResponse(JSON.stringify({ blog }), {
            status: 200
        })

    } catch (error: any) {
        return new NextResponse("Error fetching blog posts " + error.message, {
            status: 500
        })
    }
}

export const POST = async(request: Request) => {
    try {
        const body = await request.json();
        const { title, description } = body;
        
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid user ID', {
                status: 400
            })
        }

        const categoryId = searchParams.get('categoryId');
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
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return new NextResponse('Category not found in the database', {
                status: 404
            })
        }

        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        })

        const blog = await newBlog.save();

        return new NextResponse(JSON.stringify(blog), {
            status: 201
        })
    } catch (error: any) {
        return new NextResponse('Error creating blog post ' + error.message, {
            status: 500
        })
    }
}
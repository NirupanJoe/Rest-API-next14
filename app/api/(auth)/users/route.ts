import { NextResponse } from 'next/server'
import connect from '@/lib/db'
import User from '@/lib/modals/user'
import { Types } from 'mongoose';
 
export const GET = async(request: Request) => {
  try {
    await connect();
    const users = await User.find();
    
    return new NextResponse(JSON.stringify(users), {
      status: 200
    })
  } catch (error: any) {
    return new NextResponse('Error fetching users ' + error.message, {
      status: 500
    })
  }
}

export const POST = async(request: Request) => {
  try {
    await connect();
    const body = await request.json();
    const user = await User.create(body);
    
    return new NextResponse(JSON.stringify(user), {
      status: 201
    })
  } catch (error: any) {
    return new NextResponse('Error creating user ' + error.message, {
      status: 500
    })
  }
}

export const PATCH = async(request: Request) => {
  try {
    await connect();
    const body = await request.json();
    const { _id, name } = body

    if (!_id || !name) {
      return new NextResponse('ID or name not found', {
        status: 400
      })
    }

    if (!Types.ObjectId.isValid(_id)) {
      return new NextResponse('Invalid ID', {
        status: 400
      })
    }

    const user = await User.findByIdAndUpdate(body._id, body, {new: true});
    
    return new NextResponse(JSON.stringify(user), {
      status: 200
    })
  } catch (error: any) {
    return new NextResponse('Error updating user ' + error.message, {
      status: 500
    })
  }
}

export const DELETE = async(request: Request) => {
  try {
    await connect();
    const body = await request.json();
    const { _id } = body
    if (!_id) {
      return new NextResponse('ID not found', {
        status: 400
      })
    }

    if (!Types.ObjectId.isValid(_id)) {
      return new NextResponse('Invalid ID', {
        status: 400
      })
    }

    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return new NextResponse('User not found', {
        status: 404
      })
    }
    
    return new NextResponse(JSON.stringify(user), {
      status: 200
    })
  } catch (error: any) {
    return new NextResponse('Error deleting user ' + error.message, {
      status: 500
    })
  }
}
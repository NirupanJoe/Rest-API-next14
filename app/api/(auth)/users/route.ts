import { NextResponse } from 'next/server'
import connect from '@/lib/db'
import User from '@/lib/modals/user'
 
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
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
import { NextRequest, NextResponse } from 'next/server'
import { JobService } from '@/lib/database'
import { validateEnvironment } from '@/lib/config'

export async function GET(request: NextRequest) {
  try {
    validateEnvironment()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const location = searchParams.get('location') || ''
    const salary = searchParams.get('salary') || ''
    
    let jobs: any[] = []
    
    if (search) {
      jobs = await JobService.search(search, { role, location, salary })
    } else {
      jobs = await JobService.findAll({ role, location, salary })
    }
    
    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    validateEnvironment()
    
    const body = await request.json()
    const newJob = await JobService.create(body)
    
    return NextResponse.json({ success: true, data: newJob })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    )
  }
}

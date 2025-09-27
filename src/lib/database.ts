import { ObjectId } from 'mongodb'
import { getCollection } from './mongodb'
import { DATABASE_CONFIG } from './config'
import { User, Job, Application } from '@/types'

// User operations
export class UserService {
  static async create(user: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const newUser = {
      ...user,
      _id: new ObjectId().toString(),
      createdAt: new Date()
    }
    await collection.insertOne(newUser)
    return newUser as User
  }

  static async findById(id: string): Promise<User | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const user = await collection.findOne({ _id: id })
    return user as User | null
  }

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { returnDocument: 'after' }
    )
    return result as User | null
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const result = await collection.deleteOne({ _id: id })
    return result.deletedCount > 0
  }
}

// Job operations
export class JobService {
  static async create(job: Omit<Job, '_id' | 'createdAt'>): Promise<Job> {
    const collection = await getCollection(DATABASE_CONFIG.collections.jobs)
    const newJob = {
      ...job,
      _id: new ObjectId().toString(),
      createdAt: new Date()
    }
    await collection.insertOne(newJob)
    return newJob as Job
  }

  static async findAll(filters: any = {}): Promise<Job[]> {
    const collection = await getCollection(DATABASE_CONFIG.collections.jobs)
    const jobs = await collection.find(filters).toArray()
    return jobs as Job[]
  }

  static async findById(id: string): Promise<Job | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.jobs)
    const job = await collection.findOne({ _id: id })
    return job as Job | null
  }

  static async search(query: string, filters: any = {}): Promise<Job[]> {
    const collection = await getCollection(DATABASE_CONFIG.collections.jobs)
    const searchQuery = {
      ...filters,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }
    const jobs = await collection.find(searchQuery).toArray()
    return jobs as Job[]
  }
}

// Application operations
export class ApplicationService {
  static async create(application: Omit<Application, '_id' | 'appliedAt'>): Promise<Application> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const newApplication = {
      ...application,
      _id: new ObjectId().toString(),
      appliedAt: new Date()
    }
    await collection.insertOne(newApplication)
    return newApplication as Application
  }

  static async findByUserId(userId: string): Promise<Application[]> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const applications = await collection.find({ userId }).toArray()
    return applications as Application[]
  }

  static async findById(id: string): Promise<Application | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const application = await collection.findOne({ _id: id })
    return application as Application | null
  }

  static async updateStatus(id: string, status: Application['status']): Promise<Application | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: { status } },
      { returnDocument: 'after' }
    )
    return result as Application | null
  }

  static async getStatsByUserId(userId: string): Promise<Record<string, number>> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const pipeline = [
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]
    const stats = await collection.aggregate(pipeline).toArray()
    
    const result: Record<string, number> = { Total: 0 }
    stats.forEach(stat => {
      result[stat._id] = stat.count
      result.Total += stat.count
    })
    
    return result
  }
}

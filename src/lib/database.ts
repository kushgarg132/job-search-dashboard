import { ObjectId } from 'mongodb'
import { getCollection } from './mongodb'
import { DATABASE_CONFIG } from './config'
import { User, Job, Application } from '@/types'

// Helper function to convert string ID to ObjectId
const toObjectId = (id: string) => new ObjectId(id)

// User operations
export class UserService {
  static async create(user: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const newUser = {
      ...user,
      createdAt: new Date()
    }
    const result = await collection.insertOne(newUser)
    return {
      ...newUser,
      _id: result.insertedId.toString()
    } as User
  }

  static async findById(id: string): Promise<User | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const user = await collection.findOne({ _id: toObjectId(id) })
    return user ? { ...user, _id: user._id.toString() } as User : null
  }

  static async findByEmail(email: string): Promise<User | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const user = await collection.findOne({ email })
    return user ? { ...user, _id: user._id.toString() } as User : null
  }

  static async findAll(): Promise<User[]> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const users = await collection.find({}).toArray()
    return users.map(user => ({ ...user, _id: user._id.toString() })) as User[]
  }

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const result = await collection.findOneAndUpdate(
      { _id: toObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    )
    return result ? { ...result, _id: result._id.toString() } as User : null
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await getCollection(DATABASE_CONFIG.collections.users)
    const result = await collection.deleteOne({ _id: toObjectId(id) })
    return result.deletedCount > 0
  }
}

// Job operations
export class JobService {
  static async create(job: Omit<Job, '_id' | 'createdAt'>): Promise<Job> {
    const collection = await getCollection(DATABASE_CONFIG.collections.jobs)
    const newJob = {
      ...job,
      createdAt: new Date()
    }
    const result = await collection.insertOne(newJob)
    return {
      ...newJob,
      _id: result.insertedId.toString()
    } as Job
  }

  static async findAll(filters: any = {}): Promise<Job[]> {
    const collection = await getCollection(DATABASE_CONFIG.collections.jobs)
    const jobs = await collection.find(filters).toArray()
    return jobs.map(job => ({ ...job, _id: job._id.toString() })) as Job[]
  }

  static async findById(id: string): Promise<Job | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.jobs)
    const job = await collection.findOne({ _id: toObjectId(id) })
    return job ? { ...job, _id: job._id.toString() } as Job : null
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
    return jobs.map(job => ({ ...job, _id: job._id.toString() })) as Job[]
  }
}

// Application operations
export class ApplicationService {
  static async create(application: Omit<Application, '_id' | 'appliedAt'>): Promise<Application> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const newApplication = {
      ...application,
      appliedAt: new Date()
    }
    const result = await collection.insertOne(newApplication)
    return {
      ...newApplication,
      _id: result.insertedId.toString()
    } as Application
  }

  static async findByUserId(userId: string): Promise<Application[]> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const applications = await collection.find({ userId }).toArray()
    return applications.map(app => ({ ...app, _id: app._id.toString() })) as Application[]
  }

  static async findById(id: string): Promise<Application | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const application = await collection.findOne({ _id: toObjectId(id) })
    return application ? { ...application, _id: application._id.toString() } as Application : null
  }

  static async updateStatus(id: string, status: Application['status']): Promise<Application | null> {
    const collection = await getCollection(DATABASE_CONFIG.collections.applications)
    const result = await collection.findOneAndUpdate(
      { _id: toObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' }
    )
    return result ? { ...result, _id: result._id.toString() } as Application : null
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

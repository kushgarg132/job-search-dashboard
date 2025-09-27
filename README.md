# Job Search Dashboard

A professional job search dashboard built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Profile Management**: Create and manage your professional profile with skills, experience, and resume upload
- **Job Discovery**: Search and filter through job opportunities with advanced filtering options
- **Application Tracking**: Track your job applications with status updates and timeline view
- **Smart Matching**: Get personalized job recommendations based on your profile
- **Modern UI**: Beautiful, responsive design with smooth animations using Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: MongoDB Atlas (schema included)

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Set up MongoDB Atlas:**
   - Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Create a `.env.local` file in the project root:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-search-dashboard?retryWrites=true&w=majority
   ```

3. **Seed the database (optional):**
```bash
# Visit http://localhost:3000/api/seed in your browser
# Or use curl:
curl -X POST http://localhost:3000/api/seed
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── profile/           # Profile page
│   ├── jobs/              # Jobs feed page
│   └── applications/      # Applications page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Navigation component
│   ├── profile-form-modal.tsx
│   └── job-details-modal.tsx
├── lib/                  # Utility functions
│   └── utils.ts
└── types/                # TypeScript type definitions
    └── index.ts
```

## API Endpoints

The application expects the following API endpoints to be implemented:

- `GET /api/profile` - Fetch user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/resume` - Upload resume
- `GET /api/jobs` - Fetch job listings
- `POST /api/apply` - Apply to a job
- `POST /api/custom-resume` - Generate custom resume
- `GET /api/applications` - Fetch user applications

## Database Schema

The application uses MongoDB Atlas with the following collections:

### User Collection
```typescript
{
  _id: string,           // MongoDB ObjectId as string
  name: string,
  email: string,
  location: string,
  expectedCTC: string,
  skills: string[],
  resumeUrl: string,
  createdAt: Date
}
```

### Job Collection
```typescript
{
  _id: string,           // MongoDB ObjectId as string
  title: string,
  company: string,
  location: string,
  salary: string,
  description: string,
  url: string,
  postedAt: Date,
  createdAt: Date
}
```

### Application Collection
```typescript
{
  _id: string,           // MongoDB ObjectId as string
  userId: string,        // References User._id
  jobId: string,         // References Job._id
  resumeUrl: string,
  status: "Applied" | "Shortlisted" | "Rejected",
  appliedAt: Date
}
```

## Database Operations

The application includes a comprehensive database service layer:

- **UserService**: CRUD operations for user profiles
- **JobService**: Job management with search and filtering
- **ApplicationService**: Application tracking and statistics

### Database Connection

The MongoDB connection is handled through:
- `src/lib/mongodb.ts` - Connection management
- `src/lib/database.ts` - Service layer
- `src/lib/config.ts` - Configuration and validation

## Features in Detail

### Profile Page
- View and edit personal information
- Manage skills list
- Upload and manage resume
- Professional profile display

### Jobs Page
- Search jobs by title, company, or keywords
- Filter by role, location, and salary range
- Job cards with key information
- Detailed job view modal
- Apply directly or generate custom resume

### Applications Page
- Table and timeline view options
- Filter by application status
- Download resume used for each application
- View original job posting
- Application statistics

## Customization

The application uses Tailwind CSS for styling and shadcn/ui components. You can customize:

- Colors in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `src/app/globals.css`

## Deployment

This application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

## License

MIT License

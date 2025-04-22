# DevFlow - Next.js 15 Professional Development Platform

![DevFlow Logo](public/images/logo.png)

## 🌟 Introduction

DevFlow is a modern, full-stack development platform built with Next.js 15, designed to help developers showcase their skills, connect with peers, and find exciting opportunities. Our platform combines the power of AI with a beautiful, intuitive interface to create a seamless experience for both developers and recruiters.

### 🎯 Key Features

- **AI-Powered Profile Optimization**: Get personalized suggestions to improve your profile
- **Smart Job Matching**: Find opportunities that match your skills and preferences
- **Real-time Collaboration**: Work with other developers on projects
- **Portfolio Showcase**: Display your work in a professional manner
- **Community Engagement**: Connect with like-minded developers

## 🚀 Tech Stack

### Frontend

- **Next.js 15**: For server-side rendering and API routes
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For responsive and modern UI design
- **Shadcn/ui**: For beautiful, accessible components
- **React Query**: For efficient data fetching and caching
- **Zustand**: For state management
- **React Hook Form**: For form handling and validation
- **Zod**: For runtime type checking and validation

### Backend

- **MongoDB**: For flexible and scalable data storage
- **Mongoose**: For MongoDB object modeling
- **NextAuth.js**: For authentication and authorization
- **Bcrypt**: For password hashing
- **Pino**: For logging

### DevOps & Tools

- **ESLint & Prettier**: For code quality and formatting
- **Husky**: For git hooks
- **Commitlint**: For commit message validation
- **GitHub Actions**: For CI/CD

## 🛠️ Environment Setup

### Prerequisites

- Node.js 18.x or later
- MongoDB Atlas account
- GitHub OAuth app
- Google OAuth credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/devflow.git
   cd devflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   MONGODB_URI=your_mongodb_uri
   AUTH_SECRET=your_auth_secret
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   BCRYPT_HASH_NUMBER=10
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📚 Project Structure

```
devflow/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── (root)/            # Main application routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── configs/              # Configuration files
├── lib/                  # Utility functions
├── models/              # Database models
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## 🎨 Features in Detail

### User Authentication

- OAuth integration with GitHub and Google
- Secure session management
- Protected routes
- Profile customization

### Profile Management

- AI-powered profile optimization
- Skills and experience tracking
- Portfolio project showcase
- Social media integration

### Job Search & Matching

- Advanced search filters
- AI-powered job recommendations
- Application tracking
- Interview scheduling

### Community Features

- Developer forums
- Code sharing
- Project collaboration
- Knowledge base

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- The open-source community for their contributions
- All our users for their feedback and support

## 📞 Contact

For any questions or support, please reach out to:

- Email: bangtoken123@gmail.com
- GitHub: https://github.com/phibang123

![My avatar](public/images/5ba1c72c-e0fa-42e3-b226-6367457193ef.png)
Thanks for read

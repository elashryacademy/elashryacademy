# El Ashry Academy

This is a [Next.js](https://nextjs.org) project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment on Render

This project is configured for easy deployment on [Render](https://render.com).

### 1. Database Setup
The `render.yaml` file will automatically create a PostgreSQL database for you.

### 2. Environment Variables
You need to set the following environment variables in your Render Dashboard:
- `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.onrender.com`)
- `NEXTAUTH_SECRET`: A random string for security (Render can generate this for you)
- `DATABASE_URL`: Automatically linked if using the provided `render.yaml`

### 3. Deploy
1. Connect your GitHub repository to Render.
2. Render will detect the `render.yaml` file and set up the Web Service and Database automatically.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

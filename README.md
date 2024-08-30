# 🚀 SvelteKit Starter

SvelteKit Starter is a template for building and shipping fast, secure, and scalable full stack SaaS applications with SvelteKit and TypeScript.

## Features

- **Seamless Authentication:** Implement sign-up, login, and OTP verification with a fully integrated authentication flow.
- **Integrated Stripe Payments:** Effortlessly manage SaaS subscriptions with built-in Stripe support. Let users cancel or update plans via Stripe's Customer Portal.
- **Pre-Built UI Components:** Kickstart your UI with [shadcn-svelte](https://www.shadcn-svelte.com/) and [bits-ui](https://www.bits-ui.com/docs/introduction) components. Customize everything with TailwindCSS to match your vision.
- **Supabase-Ready:** Seamlessly connect with Supabase for hassle-free database management.
- **Built-in API Routes:** No backend? No problem. Full API routes run on edge servers, so you can focus on building features, not infrastructure.
- **Collaborative Team Features:** Empower users to manage their teams directly within the app—adding, removing, and assigning roles with ease.
- **Secure API Keys:** Enable users to securely generate and manage API keys, giving them full control over their integrations.
- **Support & Feedback Tools:** Integrated support ticket and feedback forms for direct user communication.
- **Dark Theme:** Quick and easy theme switching, including dark mode.
- **Deploy in minutes:** Deploy your SvelteKit app to Vercel in minutes.

## Prerequisites

Before using this starter kit, ensure you have accounts and API access set up for the following services:

#### Services:

- **[Supabase](https://supabase.com):** For database management and authentication.
- **[Vercel](https://vercel.com):** For deployment and hosting.
- **[Stripe](https://stripe.com):** For managing SaaS subscriptions and payments.
- **[Resend](https://resend.com):** For handling transactional emails.

#### Tools:

- **[Supabase CLI](https://supabase.com/docs/guides/cli):** For managing your Supabase projects from the command line.
- **[Vercel CLI](https://vercel.com/docs/cli):** For deploying and managing your Vercel projects locally.
- **[Docker](https://www.docker.com):** Required for containerization and local development.

## Getting Started

1. **Start Supabase**

   In one terminal, start the Supabase local development environment:

   ```bash
   supabase start
   ```

2. **Install Dependencies**

   In a second terminal install the necessary dependencies:

   ```bash
   pnpm install
   ```

3. **Run the Development Server**

   After installing the dependencies, start the development server:

   ```bash
   pnpm run dev
   ```

4. **Access Your Application**

   Open your browser and navigate to `http://localhost:5173`. Your application should now be live and ready for development!

## Deployment

### Supabase

Before deploying your application, ensure your Supabase cloud database is live and configured.

1. **Create and Configure Supabase Database**

   Go to the [Supabase dashboard](https://app.supabase.com/) and set up a new project if you haven't already.

2. **Install Supabase CLI**

   To install the Supabase CLI, refer to the [Supabase CLI Getting Started guide](https://supabase.com/docs/guides/cli/getting-started). Follow the instructions for your preferred installation method.

3. **Link to Supabase Database:**

   Associate your project with your remote project using `supabase link`.

   ```bash
    supabase link --project-ref <project-id>
   ```

4. **Manage Your Supabase Database:**

   For operations such as running migrations, pushing changes, and resetting your database, refer to the [Supabase CLI Local Development guide](https://supabase.com/docs/guides/cli/local-development) for detailed instructions and commands.

#### Supabase CLI Quick Tips

- **Reset Database**

  Local database:

  ```bash
  supabase db reset
  ```

  Linked (cloud) database:

  ```bash
  supabase db reset --linked
  ```

- **Run Migrations**

  Create a new local migration file:

  ```bash
  supabase migration new <migration-name>
  ```

  Apply local migration:

  ```bash
  supabase migration up
  ```

  Deploy local migrations to linked (cloud) database:

  ```
  supabase db push
  ```

- **Database Lifecycle**

  Start local database:

  ```bash
  supabase db start
  ```

  Stop local database:

  ```bash
  supabase db stop
  ```

- **Check Database Status**

  Verify the status of your local database:

  ```bash
  supabase status
  ```

### Vercel

1. **Install the Vercel CLI**

   If you haven't already, install the Vercel CLI:

   ```bash
   pnpm i -g vercel
   ```

2. **Login to Vercel**

   Authenticate with your Vercel account:

   ```bash
   vercel login
   ```

3. **Initialize Deployment**

   Inside your project directory, run the following command to deploy your application:

   ```bash
   vercel
   ```

   The CLI will guide you through the deployment process. You may be prompted to provide configuration details like project name, framework, and environment variables.

4. **Set Up Environment Variables**

   If your project uses environment variables, make sure to set them up in Vercel. You can do this through the Vercel dashboard or by using the CLI:

   ```bash
   vercel env add <key> <value>
   ```

5. **Trigger Subsequent Deployments**

   After the initial deployment, you can trigger new deployments with:

   ```bash
   vercel deploy --prod
   ```

   This will deploy your changes to the production environment.

6. **Access Your Live Application**

   Once the deployment is complete, Vercel will provide you with a live URL where your application is hosted. Your application is now live and ready to be used!

## License

Published under the [MIT](https://github.com/bfnsga/sveltekit_starter/blob/main/LICENSE) license. Built by [@bfnsga](https://github.com/bfnsga)

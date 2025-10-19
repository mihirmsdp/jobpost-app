# JobPost: AI-Powered Recruitment Platform

JobPost is a modern, AI-driven application designed to streamline the hiring process for companies of all sizes. It replaces cumbersome spreadsheets and endless email chains with an intelligent, centralized dashboard, helping recruiters find and hire top talent faster.

## ✨ Core Features

  * **Instant Job Posting**: Create and publish beautiful, detailed job listings in minutes.
  * **AI-Powered Screening**: Automatically screen and score candidates based on job requirements to instantly identify top applicants.
  * **Centralized Dashboard**: Track all jobs, applications, and interviews from a single, intuitive interface.
  * **Applicant Management**: View candidate details, manage their status (shortlisted, rejected, hired), and schedule interviews.
  * **Public Job Pages**: Each job posting gets a clean, public-facing URL that's easy to share. (e.g., `/apply/your-company/job-slug`)
  * **Interview Scheduling**: Keep track of upcoming interviews with an integrated calendar widget.
  * **Responsive Design**: A seamless experience whether you're on a desktop or a mobile device.

-----

## 🛠️ Tech Stack

This project is built with a modern, scalable tech stack:

  * **Frontend**: [React](https://reactjs.org/)
  * **UI Framework**: [Material-UI (MUI)](https://mui.com/)
  * **Backend & Database**: [Supabase](https://supabase.io/) (PostgreSQL, Authentication, Storage)
  * **Routing**: [React Router](https://reactrouter.com/)

-----

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

  * Node.js (v16 or later)
  * npm or yarn
  * A free [Supabase](https://supabase.io/) account

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/mihirmsdp/jobpost-app.git
    cd jobpost-app
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

3.  **Set up your environment variables:**

      * Create a file named `.env` in the root of your project.
      * Log in to your Supabase dashboard and find your Project URL and `anon` Public Key in **Project Settings \> API**.
      * Add them to your `.env` file like this:

    <!-- end list -->

    ```env
    REACT_APP_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **Set up Supabase Database Tables:**
    You will need to create the necessary tables in your Supabase database. You can use the SQL editor in the Supabase dashboard to run scripts for creating `jobs`, `applications`, and `interview_schedules` tables. *Make sure to enable Row Level Security (RLS) for your tables.*

5.  **Run the development server:**

    ```sh
    npm start
    ```

    The application should now be running on [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

-----

## 📁 Project Structure

The project follows a standard React application structure:

```
/src
|-- /components   # Reusable UI components (JobsTable, CalendarWidget, etc.)
|-- /lib          # Supabase client configuration
|-- /pages        # Top-level page components (Dashboard, Login, LandingPage, etc.)
|-- App.js        # Main application component with routing logic
|-- index.js      # Application entry point
```

-----

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
# ResumeBuilder Frontend

![Stack](https://img.shields.io/badge/stack-MERN-blue)
![UI](https://img.shields.io/badge/ui-React%20%2B%20TailwindCSS-06b6d4)
![Auth](https://img.shields.io/badge/auth-JWT-orange)
![Build](https://img.shields.io/badge/bundler-Vite-646CFF)
![Version](https://img.shields.io/badge/version-1.0.1-blue)

## Project Overview

The ResumeBuilder Frontend is a React (Vite) web application for creating and managing professional resumes.  
It connects to the [**ResumeBuilder Backend**](https://github.com/Yashasvi-Y/ResumBuilder-Backend) to handle authentication, resume CRUD, AI suggestions, and exporting resumes.

## Tech Stack

- React 19
- Vite (build tool)
- React Router v7 (navigation)
- Axios (HTTP client)
- Tailwind CSS v4 (styling)
- React Hot Toast (notifications)
- html2pdf + html2canvas (PDF generation)
- React-to-Print (print support)
- Moment.js (date handling)
- Lucide React (icons)

## Frontend Features

- **Responsive UI** - Desktop, tablet, mobile
- **Theme Selector** - Choose color themes
- **Form Validation** - Real-time input checks with error messages
- **Toast Notifications** - User feedback for actions
- **Step-by-Step Builder** - Progress tracking through resume creation

## Resume Design

- **3 Professional Templates** with different layouts
- **Customizable Sections:**
  - Personal Info (name, summary, profile photo)
  - Contact Details (email, phone, location, LinkedIn, GitHub, website)
  - Work Experience (company, role, dates, description)
  - Education (degree, institution, dates)
  - Skills (name + proficiency level)
  - Projects (title, description, links)
  - Certifications (title, issuer, year)
  - Languages (name + proficiency)
  - Interests/Hobbies
 
## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Yashasvi-Y/ResumBuilder-Frontend.git
   cd ResumBuilder-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
## Running Locally

```bash
npm run dev
```
 
## Deployment
- **Frontend:** [Netlify](https://buildingresumelive.netlify.app)
- **Backend:** [Render](https://resumbuilder-backend.onrender.com)

## License

ISC

---

**Made by Yashasvi Yadav**

# HS Japan Academy — Web Platform

Official web application for **HS Japan Academy**, supporting Japanese language education, visa guidance, and student services. The platform combines a public marketing site with a role-based operations dashboard for day-to-day academy management.

## Overview

HS Japan Academy helps students pursue opportunities in Japan through language training, admissions support, and immigration-related services. This repository contains the frontend that powers:

- **Public website** — course discovery, events, activities, online enquiry, visa information, and academy content
- **Admin & staff dashboard** — student lifecycle, courses, finances, employees, assets, announcements, and more
- **Student portal** — enrolled students can access assigned courses, finances, and profile settings

Access to the dashboard is **invitation-only**. Accounts are created by administrators with notifications via invitation emails; there is no open self-registration for staff or students.

## Tech stack

- UI : React 19, React Router 7 
- Build : Vite 7 
- Components : Ant Design, React Bootstrap 
- Server state : TanStack React Query 
- Forms : Formik, Yup 
- PDF / documents : `@react-pdf/renderer`, jsPDF utilities 


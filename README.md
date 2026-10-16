# EventHub – Event Management System

A React-based event management app where users can explore events from the
Ticketmaster Discovery API, register for them, and manage their registrations.

Built for **Web Programming – Assignment 2**.

## Features

- **Authentication (frontend simulation):** register, login, logout, with the session saved in Local Storage so it survives a page refresh
- **Event exploration:** browse events, keyword search, city search, category chips, date filter, sorting, an "Upcoming (next 30 days)" view, and pagination
- **Event details:** name, date and time, venue, location, category, image, price range, performers, extra info, and a link to Ticketmaster
- **Registration:** register for an event, duplicate prevention, success/error feedback, and cancellation
- **My Events:** registered events split into Upcoming and Completed, with cancellation for upcoming ones
- **Protected routes:** My Events requires login
- **Loading and error states**, form validation, and a responsive layout

## Tech Stack

- React (Vite)
- Redux Toolkit and React Redux
- React Router
- Ticketmaster Discovery API

## Getting Started

### Prerequisites

- Node.js (LTS) and npm
- A free Ticketmaster API key

### 1. Get an API key

1. Sign up at https://developer.ticketmaster.com/
2. Open **My Apps** and copy the **Consumer Key**

### 2. Install and configure

```bash
git clone https://github.com/abubakar9405/event-management-system.git
cd event-management-system
npm install
```

Create a `.env` file in the project root (see `.env.example`):

```
VITE_TICKETMASTER_API_KEY=your_ticketmaster_consumer_key_here
```

> `.env` is listed in `.gitignore` and must never be committed.

### 3. Run

```bash
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).
Restart the dev server after changing `.env`.

### Other scripts

```bash
npm run build     # production build
npm run preview   # preview the production build
```

## Project Structure

```
src/
├── app/
│   └── store.js                  # configureStore + localStorage persistence
├── features/
│   ├── auth/authSlice.js         # users, current user, login/register/logout
│   ├── events/eventsSlice.js     # async thunks, filters, selected event, categories
│   └── registrations/registrationsSlice.js
├── services/ticketmaster.js      # API calls
├── utils/eventHelpers.js         # data normalisation and formatting
├── components/                   # Navbar, ProtectedRoute, EventCard, SearchBar,
│                                 # FilterBar, CategoryChips, Loader, ErrorMessage
└── pages/                        # Login, Register, Events, EventDetails, MyEvents
```

## Redux Overview

| Slice | State | Main actions |
|---|---|---|
| `auth` | `users`, `user`, `error`, `success` | `register`, `login`, `logout`, `clearMessages` |
| `events` | `events`, `filters`, `categories`, `selectedEvent`, loading/error flags | `setFilters`, `resetFilters`, thunks: `loadEvents`, `loadEventById`, `loadCategories` |
| `registrations` | `items` (one entry per user + event) | `registerForEvent`, `cancelRegistration` |

Components use `useSelector` to read state and `useDispatch` to dispatch actions.

## Routes

| Path | Page | Access |
|---|---|---|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/events` | Event list | Public |
| `/events/:id` | Event details | Public (login needed to register) |
| `/my-events` | My Events | Logged-in users only |

## Notes

- Authentication and registrations are a frontend simulation stored in the
  browser's Local Storage. No backend is used, and passwords are stored in
  plain text for demonstration only.
- The Ticketmaster API allows 2 requests/second and 5,000 requests/day.

## Author

Abubakar Siddique – FAST-NUCES Lahore
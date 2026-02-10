# Earth Carbon Registry - Frontend

## Project Overview

**Earth Carbon Registry** is a public registry designed to verify low-carbon actions and prepare for carbon credit issuance. Unlike platforms that promise instant carbon credits, this registry focuses on tracking emissions reduction, readiness, and impact. It provides a transparent and verificable way to log various sustainability efforts.

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication & Backend Integration**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Functions)
- **Maps Integration**: [Google Maps API](https://developers.google.com/maps)
- **State Management**: React Context (`AuthContext`)
- **Form Handling**: Formik & Yup
- **Icons**: Lucide React

## Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Node Package Manager

## Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd registry-frontend
    ```

2.  **Install Dependencies**

    ```bash
    npm install or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add the following environment variables (get these values from your Firebase Console and Google Cloud Console):

    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    # Google Maps API Key
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    ```

4.  **Run the Development Server**

    ```bash
    npm run dev

    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Firebase CLI Integration

To connect this project to your Firebase project, and set up secrets useing the firebase CLI:

1.  **firebase installation**
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase**
    ```bash
    firebase login
    ```
3.  **List Projects**
    View all your Firebase projects:
    ```bash
    firebase projects:list
    ```
4.  **Select Project**
    Link the local environment to your specific Firebase project:

    ```bash
    firebase use <your-project-id>
    ```

5.  **Set the Secret Key**

    Run the following command for each environment variable and provide the corresponding value when prompted:

    ```bash
    firebase apphosting:secrets:set FIREBASE_API_KEY
    firebase apphosting:secrets:set FIREBASE_AUTH_DOMAIN
    firebase apphosting:secrets:set FIREBASE_PROJECT_ID
    firebase apphosting:secrets:set FIREBASE_STORAGE_BUCKET
    firebase apphosting:secrets:set FIREBASE_MESSAGING_SENDER_ID
    firebase apphosting:secrets:set FIREBASE_APP_ID
    firebase apphosting:secrets:set GOOGLE_MAPS_API_KEY
    ```

    In your `apphosting.yaml`, map these secrets to environment variables. The `value` field must match the secret name (key) you used in the command above, and Firebase will automatically map them together:

    ```yaml
    env:
      - variable: NEXT_PUBLIC_FIREBASE_API_KEY
        value: FIREBASE_API_KEY
      - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        value: FIREBASE_AUTH_DOMAIN
      - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
        value: FIREBASE_PROJECT_ID
      - variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        value: FIREBASE_STORAGE_BUCKET
      - variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        value: FIREBASE_MESSAGING_SENDER_ID
      - variable: NEXT_PUBLIC_FIREBASE_APP_ID
        value: FIREBASE_APP_ID
      - variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        value: GOOGLE_MAPS_API_KEY
    ```

## Deployment on Firebase App Hosting

This project is configured for **Firebase App Hosting**, a serverless hosting service for full-stack web apps.

### `apphosting.yaml` Configuration

The `apphosting.yaml` file in the root directory manages the build and runtime environment configuration. It serves two main purposes.

**Why use it?**
It allows you to keep sensitive keys (like API keys and Service Account credentials) out of your codebase while still making them accessible to your deployed application securely.

**How to use:**
Auto deployment is already set up for this project. To configure secrets, follow the steps outlined in the **Firebase CLI Integration** section above using the `firebase apphosting:secrets:set` command or Google Cloud Secret Manager. Once the secrets are configured, push your changes to the `feat/dev` branch, which will automatically deploy to the server.

## Folder Structure

The project follows a standard Next.js App Router structure within the `src` directory:

```
src/
├── app/                  # App Router pages and layouts
│   ├── about/            # About page
│   ├── api/              # API routes
│   ├── how-it-works/     # How It Works page
│   ├── impact/           # Impact page
│   ├── pricing/          # Pricing page
│   ├── profile/          # User Profile page
│   ├── signin/           # Sign In page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Shared components
│     └── svg/            # SVG Icons
├── context/              # React Context
│
├── hooks/                # Custom React Hooks
│
├── lib/                  # Utility functions and constants
│
└── scripts/              # Helper scripts

```

## Key Constants

The application uses centralized constants for consistency. These can be found in `src/lib/constants.ts`.

Key definitions include `ACTION_TYPES` for various sustainability actions:

- Solar Rooftop (kW)
- Solar Water Heater (liters)
- Rainwater Harvesting (m³)
- Waterless Urinal (No.)
- Wastewater Recycling (m³)
- Biogas (kg)
- LED Replacement (No.)
- Tree Plantation (No. of Trees)

### How to Update

To add, remove, or modify these action types:

1. Open `src/lib/constants.ts`.
2. Locate the `ACTION_TYPES` array.
3. Add a new object `{ value: "new_value", label: "New Label", unit: "unit" }` or modify existing ones.
4. The application will automatically update dropdowns and labels referencing this constant.

## Important Notes

- **Firebase Rules**: Ensure your Firestore and Storage rules are configured to allow appropriate read/write access for authenticated users. Check `firestore.rules` and `storage.rules`.
- **Google Maps**: The Google Maps API key must have the necessary APIs enabled (Maps JavaScript API, Places API, Geocoding API) for location services to work correctly.
- **Authentication**: The project uses Firebase Authentication. Make sure you have enabled the required sign-in methods (Google) in your Firebase Console.

Fitness App Development Plan
Project Overview This document outlines a step-by-step development plan for a fitness app that doubles as a game where users care for a digital pet. The app aims to motivate users to exercise by linking their fitness activities to the well-being of their pet.

Milestone 1: Foundation and Initial Setup
This milestone focuses on establishing the core development environment and project structure.
• 1.1 Project Scaffolding: Create a monorepo using PNPM workspaces and Turborepo for build orchestration.
• 1.2 Technology Integration: Set up the "golden path" tech stack , including TypeScript , React with Vite for the frontend , and Firebase for backend services.
• 1.3 Code Quality & Formatting: Configure ESLint with typescript-eslint , Prettier for formatting , and the eslint-plugin-perfectionist for import and object key sorting. Use Husky to run
lint-staged on pre-commit.
• 1.4 Environment Setup: Configure environment variables using T3 Env for typesafe validation , and set up the local development environment to use Firebase emulators.
Milestone 2: Core Data Models and User Flow
This milestone is about implementing the fundamental data structures and the user's initial interaction with the app.
• 2.1 User Data: Implement the User data model in Firestore, including fields like uid, first name, last name, email, role, age, weight, and fitness goal. The data will be used to tailor a workout regimen for the user.git remote add origin https://github.com/your-username/your-repo-name.git
• 2.2 Authentication: Set up user authentication using Firebase Auth.
• 2.3 Pet Creation: Create the functionality for a user to create a digital pet, such as a cat, dog, fish, or bird.
• 2.4 Pet Health System: Implement the data model and logic for the pet's health bars (hungry, hygiene, happiness) which deplete daily.
Milestone 3: Fitness Engine & Gamification Loop
This milestone links the fitness aspect of the app to the pet's well-being.
• 3.1 Personalized Workout Engine: Use a user's biodata (age, BMI, body fat index, fitness goals) to tailor-make an exercise regimen. The app should suggest the number of weekly sessions and the duration of each session.
• 3.2 Credit System: Implement a rewards tracking system where credits are earned based on a user's exercise frequency and session completion.
• 3.3 Pet Maintenance: Implement the system for using credits to replenish the pet's health bars and buy resources for the pet to eat, bathe, clothe, and be entertained. A lack of credits could lead to the loss of life for the pet.
• 3.4 API Implementation: Define and implement the tRPC API layer with endpoints for
user and other procedures to handle the data fetching and mutation between the client and the backend services.
Milestone 4: Advanced Features and Polish
This milestone focuses on adding more complex features and improving the user experience.
• 4.1 Progressive Difficulty: Implement the logic for the socialite to grow in fame and eventually it's demands increase, which in turn increases the depletion in the needs bars, and causes exercises to progress steadily in intensity.
• 4.2 In-App Exercise Interface: Design and build the in-app exercise pages , including workout descriptions and images. The page should include a timer and breaks between sets and reps.
• 4.3 Visual Testing: Use Storybook to develop and test UI components in isolation , including visual and interaction testing with
@storybook/testing-library.
• 4.4 Accessibility: Ensure accessibility by using the Storybook a11y addon for quick audits and following the WCAG 2.1 AA checklist.
Milestone 5: Deployment and Production
This final milestone prepares the app for launch and ongoing maintenance.
• 5.1 CI/CD Pipeline: Configure the GitHub Actions CI/CD pipeline to automate tasks like linting, type-checking, running tests, and deploying .
• 5.2 Deployment Strategy: Implement a deployment strategy using Firebase Hosting channels for auto-creating previews per pull request and promoting releases to production on merge to
main.
• 5.3 Monitoring & Logging: Set up Firebase Crashlytics or Sentry for frontend runtime error capture , and Google Cloud Logging for structured backend server logs.
• 5.4 Performance Tuning: Apply performance optimizations such as denormalizing Firestore data to avoid "hot document" writes and tuning TanStack Query caching.

# Milestone 2.1: User Data Model Implementation

## Overview
This milestone implements the User data model in Firestore as specified in the development plan. The implementation includes comprehensive data structures, validation, and CRUD operations for user management.

## Implementation Details

### 1. User Data Model (`apps/web/src/types/user.ts`)

#### Core Fields (Required)
- **uid**: Unique user identifier (string)
- **email**: User's email address (string, validated)
- **role**: User role enum (USER/ADMIN)
- **age**: User's age (number, 13-120 range)
- **weight**: Weight in kg (number, 30-300 range)
- **fitnessGoal**: Primary fitness objective enum
- **createdAt**: Account creation timestamp
- **updatedAt**: Last update timestamp

#### Optional Fields
- **height**: Height in cm (100-250 range)
- **gender**: User's gender (male/female/other)
- **activityLevel**: Daily activity level enum

#### Fitness Goals
- WEIGHT_LOSS
- MUSCLE_GAIN
- ENDURANCE
- FLEXIBILITY
- GENERAL_FITNESS

#### Activity Levels
- sedentary
- lightly_active
- moderately_active
- very_active
- extremely_active

### 2. Firestore Utilities (`apps/web/src/lib/firestore/users.ts`)

#### CRUD Operations
- `createUser(userData)`: Create new user
- `getUserById(uid)`: Retrieve user by UID
- `getUserByEmail(email)`: Retrieve user by email
- `updateUser(uid, updates)`: Update user data
- `deleteUser(uid)`: Delete user
- `getAllUsers(limit?)`: Get all users with optional pagination
- `getUsersByRole(role)`: Get users by role
- `validateUser(data)`: Validate user data against schema

#### Helper Functions
- `userToFirestore()`: Convert user object for Firestore storage
- `firestoreToUser()`: Convert Firestore document to user object
- `convertTimestamp()`: Convert Firestore timestamps to Date objects

### 3. React Hooks (`apps/web/src/hooks/useUser.ts`)

#### Query Hooks
- `useUser(uid)`: Get user by ID with caching
- `useUserByEmail(email)`: Get user by email with caching
- `useAllUsers(limit?)`: Get all users with caching
- `useUsersByRole(role)`: Get users by role with caching

#### Mutation Hooks
- `useCreateUser()`: Create new user with cache updates
- `useUpdateUser()`: Update user with cache updates
- `useDeleteUser()`: Delete user with cache updates

#### Cache Management
- Uses TanStack Query for intelligent caching
- Automatic cache invalidation on mutations
- Optimistic updates for better UX

### 4. UI Components

#### UserProfile Component (`apps/web/src/components/UserProfile.tsx`)
- Displays user information in read-only mode
- Edit mode with form validation
- Real-time updates with optimistic UI
- Error handling and loading states

#### CreateUserForm Component (`apps/web/src/components/CreateUserForm.tsx`)
- Comprehensive form for creating new users
- Field validation and error handling
- Dropdown selections for enums
- Success/cancel callbacks

### 5. Demo Page (`apps/web/src/app/user-demo/page.tsx`)
- Interactive demonstration of the user data model
- User list with selection
- Create new users
- View and edit user profiles
- Documentation of data model structure

## Data Validation

### Zod Schema Validation
All user data is validated using Zod schemas:
- `UserSchema`: Complete user validation
- `CreateUserSchema`: User creation validation
- `UpdateUserSchema`: User update validation

### Field Validation Rules
- **uid**: Required string
- **email**: Required valid email format
- **age**: Number between 13-120
- **weight**: Number between 30-300 kg
- **height**: Optional number between 100-250 cm
- **role**: Must be valid UserRole enum
- **fitnessGoal**: Must be valid FitnessGoal enum

## Error Handling

### Firestore Operations
- Try-catch blocks for all database operations
- Detailed error logging
- User-friendly error messages
- Graceful fallbacks for failed operations

### React Query Integration
- Automatic retry on network failures
- Loading states for better UX
- Error boundaries for component-level error handling

## Performance Optimizations

### Caching Strategy
- 5-minute stale time for user details
- 2-minute stale time for user lists
- Automatic background refetching
- Optimistic updates for mutations

### Firestore Optimizations
- Efficient queries with proper indexing
- Pagination support for large datasets
- Denormalized data structure for fast reads

## Security Considerations

### Data Validation
- Server-side validation with Zod schemas
- Input sanitization and type checking
- Range validation for numeric fields

### Firestore Rules (Future)
- User can only read/write their own data
- Admin users can access all user data
- Email uniqueness enforcement

## Testing Strategy

### Unit Tests (Future)
- Schema validation tests
- Firestore utility function tests
- Hook behavior tests

### Integration Tests (Future)
- End-to-end user creation flow
- User profile editing workflow
- Error handling scenarios

## Next Steps

This implementation provides a solid foundation for milestone 2.2 (Authentication) and subsequent milestones. The user data model is ready to be integrated with Firebase Auth and will support the pet creation and health system features planned for milestones 2.3 and 2.4.

### Integration Points
- **Milestone 2.2**: Connect with Firebase Auth for user authentication
- **Milestone 2.3**: Link users to their digital pets
- **Milestone 3.1**: Use user data for personalized workout recommendations

## Usage Examples

### Creating a User
```typescript
const createUserMutation = useCreateUser();
await createUserMutation.mutateAsync({
  uid: "user123",
  email: "user@example.com",
  age: 25,
  weight: 70,
  fitnessGoal: FitnessGoal.WEIGHT_LOSS
});
```

### Updating a User
```typescript
const updateUserMutation = useUpdateUser();
await updateUserMutation.mutateAsync({
  uid: "user123",
  updates: { weight: 68, fitnessGoal: FitnessGoal.MUSCLE_GAIN }
});
```

### Fetching User Data
```typescript
const { data: user, isLoading, error } = useUser("user123");
```

## File Structure
```
apps/web/src/
├── types/
│   └── user.ts                 # User data model and schemas
├── lib/
│   └── firestore/
│       └── users.ts            # Firestore CRUD operations
├── hooks/
│   └── useUser.ts              # React Query hooks
├── components/
│   ├── UserProfile.tsx         # User profile display/edit
│   └── CreateUserForm.tsx      # User creation form
└── app/
    └── user-demo/
        └── page.tsx            # Demo page
``` 
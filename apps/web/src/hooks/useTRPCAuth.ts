import { useTRPCContext } from '../components/TRPCProvider';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../lib/firebase';

export const useSignUp = () => {
  const auth = getAuth(app);
  
  return {
    mutateAsync: async (input: { email: string; password: string }) => {
      const userCredential = await createUserWithEmailAndPassword(auth, input.email, input.password);
      return { user: { uid: userCredential.user.uid, email: input.email } };
    },
    isLoading: false,
    error: null,
  };
};

export const useSignIn = () => {
  const auth = getAuth(app);
  
  return {
    mutateAsync: async (input: { email: string; password: string }) => {
      const userCredential = await signInWithEmailAndPassword(auth, input.email, input.password);
      return { user: { uid: userCredential.user.uid, email: input.email } };
    },
    isLoading: false,
    error: null,
  };
};

export const useSignOut = () => {
  const auth = getAuth(app);
  
  return {
    mutateAsync: async () => {
      await signOut(auth);
      return { success: true };
    },
    isLoading: false,
    error: null,
  };
};

export const useGetCurrentUser = () => {
  const auth = getAuth(app);
  
  return {
    data: auth.currentUser ? { 
      uid: auth.currentUser.uid, 
      email: auth.currentUser.email || '' 
    } : null,
    isLoading: false,
    error: null,
  };
}; 
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";
import { toast } from "sonner";

const Auth = () => {
  const handleSignInWithEmail = useCallback(async (email: string) => {
    // Generate a secure random password for the user
    const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
    
    try {
      // Create new account
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: `${email}@example.com`,
        password,
        options: {
          data: {
            username: email,
          },
        },
      });

      if (signUpError) throw signUpError;

      // If user already exists (signUpData.user is null), try to sign in
      if (!signUpData.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: `${email}@example.com`,
          password,
        });

        if (signInError) throw signInError;
      }
      
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const email = formData.get("email") as string;
          await handleSignInWithEmail(email);
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="email"
            name="email"
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter your username"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Auth;
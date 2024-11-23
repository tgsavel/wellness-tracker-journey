import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MIN_DELAY_MS = 30000; // 30 seconds to be extra safe with Supabase's rate limit

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const lastAttemptTime = useRef<number>(0);
  const navigate = useNavigate();

  const handleSignInWithEmail = useCallback(async (email: string) => {
    if (isLoading) return;
    
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime.current;
    
    if (timeSinceLastAttempt < MIN_DELAY_MS) {
      const waitTime = Math.ceil((MIN_DELAY_MS - timeSinceLastAttempt) / 1000);
      toast.error(`Please wait ${waitTime} seconds before trying again`);
      return;
    }
    
    setIsLoading(true);
    lastAttemptTime.current = now;
    
    try {
      const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      
      // First try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${email}@example.com`,
        password,
      });

      // If sign in fails, try to sign up
      if (signInError && !signInError.message.includes('Invalid login credentials')) {
        if (signInError.message.includes('rate_limit') || signInError.message.includes('429')) {
          toast.error("Too many attempts. Please wait a few minutes before trying again.");
          return;
        }
        throw signInError;
      }

      // If sign in failed due to invalid credentials, try to sign up
      if (signInError?.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: `${email}@example.com`,
          password,
          options: {
            data: {
              username: email,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message.includes('rate_limit') || signUpError.message.includes('429')) {
            toast.error("Too many attempts. Please wait a few minutes before trying again.");
            return;
          }
          throw signUpError;
        }
      }
      
      toast.success("Successfully logged in!");
      navigate("/", { replace: true });
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, navigate]);

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
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter your username"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Please wait..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
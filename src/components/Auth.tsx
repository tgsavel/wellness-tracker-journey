import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignInWithEmail = useCallback(async (username: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const password = "shared-testing-password-123"; // Simple shared password for testing
      
      // Try to sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`,
        password,
      });

      // If sign in fails, create a new account
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: `${username}@example.com`,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (signUpError) throw signUpError;
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
          const username = formData.get("email") as string;
          await handleSignInWithEmail(username);
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
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MIN_DELAY_MS = 5000;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignInWithEmail = useCallback(async (email: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: `${email}@example.com`,
        password,
        options: {
          data: {
            username: email,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('rate_limit')) {
          toast.error("Please wait a few seconds before trying again");
        } else {
          throw signUpError;
        }
        return;
      }

      if (!signUpData.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: `${email}@example.com`,
          password,
        });

        if (signInError) throw signInError;
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
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!username || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a valid email from the username for Supabase auth
      const email = `${username}@healthtracker.local`;
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Account created successfully!"
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === "Invalid login credentials") {
            throw new Error("Invalid username or password. Please try again.");
          }
          throw error;
        }
        toast({
          title: "Success",
          description: "Successfully signed in!"
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, username, password, isSignUp]);

  return (
    <div className="max-w-md w-full mx-auto p-6 space-y-6 bg-card rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h2>
        <p className="text-muted-foreground">
          {isSignUp 
            ? "Choose a username to create your account" 
            : "Enter your credentials to sign in"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading 
            ? "Please wait..." 
            : isSignUp 
              ? "Create account" 
              : "Sign in"}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          disabled={isLoading}
        >
          {isSignUp 
            ? "Already have an account? Sign in" 
            : "Don't have an account? Sign up"}
        </Button>
      </div>
    </div>
  );
};

export default Auth;
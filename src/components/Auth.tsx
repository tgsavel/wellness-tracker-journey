import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Auth = () => {
  return (
    <div className="max-w-md w-full mx-auto p-4">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        view="sign_in"
        showLinks={false}
        redirectTo={window.location.origin}
      />
    </div>
  );
};

export default Auth;
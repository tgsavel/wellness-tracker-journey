import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Auth = () => {
  return (
    <div className="max-w-md w-full mx-auto p-4">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'rgb(34 197 94)', // green-500
                brandAccent: 'rgb(22 163 74)', // green-600
              }
            }
          }
        }}
        providers={[]}
        view="sign_in"
        showLinks={false}
        redirectTo={window.location.origin}
        localization={{
          variables: {
            sign_in: {
              email_label: "Username",
              email_input_placeholder: "Enter your username",
              password_label: "",
              password_input_placeholder: "",
            },
            sign_up: {
              email_label: "Username",
              email_input_placeholder: "Choose a username",
              password_label: "",
              password_input_placeholder: "",
            }
          }
        }}
      />
    </div>
  );
};

export default Auth;
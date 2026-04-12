import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMeta, setUserMeta] = useState(null);

  // Supabase automatically stores the session token in localStorage.
  // On every page refresh, getSession() finds it and restores the session.
  // We don't need to do anything extra for that.

  useEffect(() => {
    // Check active session on load
    const getSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      // setLoading(false);

      // Check user metadata
      if (session) {
        const { data: userMetaData, error: userMetaError } = await supabase
          .from("users_meta")
          .select("*")
          .eq("uid", session.user.id)
          .single();

        // console.log("user_meta: ", userMetaData);

        if (userMetaError) {
          console.error("Error fetching user metadata:", userMetaError);
          setUserMeta(null);
        } else {
          setUserMeta(userMetaData);
        }
      }

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setUser(null);
        setUserMeta(null);
        setLoading(false);
        return;
      }
      setLoading(false);
    };

    getSession();

    // Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        supabase
          .from("users_meta")
          .select("*")
          .eq("uid", session.user.id)
          .single()
          .then(({ data }) => setUserMeta(data ?? null));
      } else {
        setUserMeta(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setUserMeta,
        setLoading,
        userMeta,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// How persistent login works in this app:

// User logs in → Supabase stores the JWT + refresh token in localStorage
// User refreshes the page → getSession() reads from localStorage, restores the session
// Token expires → Supabase auto-refreshes it silently in the background
// User logs out → supabase.auth.signOut() clears localStorage → onAuthStateChange fires with null session → user and userMeta reset to null

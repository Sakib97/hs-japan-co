import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../config/supabaseClient";
import { USER_ROLES } from "../config/statusAndRoleConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMeta, setUserMeta] = useState(null);
  const [userMetaLoading, setUserMetaLoading] = useState(true);
  const [studentStatus, setStudentStatus] = useState(null);
  const fetchedUid = useRef(null);

  const fetchStudentStatus = async (email) => {
    const { data } = await supabase
      .from("student")
      .select("status")
      .eq("email", email)
      .single();
    setStudentStatus(data?.status ?? null);
  };

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
        fetchedUid.current = session.user.id;
        const { data: userMetaData, error: userMetaError } = await supabase
          .from("users_meta")
          .select("*")
          .eq("uid", session.user.id)
          .single();

        // console.log("user_meta: ", userMetaData);

        if (userMetaError) {
          console.error("Error fetching user metadata:", userMetaError);
          setUserMeta(null);
        } else if (userMetaData?.is_active === false) {
          // Account deactivated — kill the session
          await supabase.auth.signOut();
          setUser(null);
          setUserMeta(null);
          fetchedUid.current = null;
        } else {
          setUserMeta(userMetaData);
          if (userMetaData?.role === USER_ROLES.STUDENT) {
            await fetchStudentStatus(session.user.email);
          }
        }
      }
      setUserMetaLoading(false);

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
      // TOKEN_REFRESHED fires silently in the background — skip re-fetching userMeta
      if (_event === "TOKEN_REFRESHED") return;

      setUser(session?.user ?? null);

      if (session?.user) {
        // Prevent redundant fetching if user is already loaded (like on window refocus)
        if (fetchedUid.current === session.user.id) {
          setUserMetaLoading(false);
          return;
        }

        fetchedUid.current = session.user.id;
        setUserMetaLoading(true);
        supabase
          .from("users_meta")
          .select("*")
          .eq("uid", session.user.id)
          .single()
          .then(async ({ data }) => {
            if (data?.is_active === false) {
              // Account deactivated — kill the session
              supabase.auth.signOut().then(() => {
                setUser(null);
                setUserMeta(null);
                setStudentStatus(null);
                fetchedUid.current = null;
              });
            } else {
              setUserMeta(data ?? null);
              if (data?.role === USER_ROLES.STUDENT) {
                await fetchStudentStatus(session.user.email);
              }
            }
            setUserMetaLoading(false);
          });
      } else {
        setUserMeta(null);
        setStudentStatus(null);
        setUserMetaLoading(false);
        fetchedUid.current = null;
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
        userMetaLoading,
        studentStatus,
        setStudentStatus,
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

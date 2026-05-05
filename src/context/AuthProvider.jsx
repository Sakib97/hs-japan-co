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
  const [employeeStatus, setEmployeeStatus] = useState(null);
  const fetchedUid = useRef(null);

  // NEW: store realtime channel
  const studentChannelRef = useRef(null);
  const employeeChannelRef = useRef(null);

  const fetchStudentStatus = async (email) => {
    const { data } = await supabase
      .from("student")
      .select("status")
      .eq("email", email)
      .single();
    setStudentStatus(data?.status ?? null);
  };

  const fetchEmployeeStatus = async (email) => {
    const { data } = await supabase
      .from("employees")
      .select("activity_status")
      .eq("email", email)
      .single();
    setEmployeeStatus(data?.activity_status ?? null);
  };

  // NEW: subscribe to realtime updates
  const subscribeToStudentStatus = (email) => {
    // Remove old channel if exists
    if (studentChannelRef.current) {
      supabase.removeChannel(studentChannelRef.current);
      studentChannelRef.current = null;
    }

    const channel = supabase
      .channel(`student-status-${email}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "student",
          filter: `email=eq.${email}`,
        },
        (payload) => {
          // console.log("Realtime update:", payload);
          setStudentStatus(payload.new.status);
        },
      )
      .subscribe();

    studentChannelRef.current = channel;
  };

  const subscribeToEmployeeStatus = (email) => {
    if (employeeChannelRef.current) {
      supabase.removeChannel(employeeChannelRef.current);
      employeeChannelRef.current = null;
    }

    const channel = supabase
      .channel(`employee-status-${email}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "employees",
          filter: `email=eq.${email}`,
        },
        (payload) => {
          setEmployeeStatus(payload.new.activity_status);
        },
      )
      .subscribe();

    employeeChannelRef.current = channel;
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
          setStudentStatus(null);
          setEmployeeStatus(null);
          fetchedUid.current = null;
        } else {
          setUserMeta(userMetaData);
          if (userMetaData?.role === USER_ROLES.STUDENT) {
            await fetchStudentStatus(session.user.email);

            // Subscribe to realtime updates for this student's status
            subscribeToStudentStatus(session.user.email);
          }
          if (userMetaData?.role === USER_ROLES.EMPLOYEE) {
            await fetchEmployeeStatus(session.user.email);
            subscribeToEmployeeStatus(session.user.email);
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
                setEmployeeStatus(null);
                fetchedUid.current = null;
                //  CLEANUP realtime
                if (studentChannelRef.current) {
                  supabase.removeChannel(studentChannelRef.current);
                  studentChannelRef.current = null;
                }
                if (employeeChannelRef.current) {
                  supabase.removeChannel(employeeChannelRef.current);
                  employeeChannelRef.current = null;
                }
              });
            } else {
              setUserMeta(data ?? null);
              if (data?.role === USER_ROLES.STUDENT) {
                await fetchStudentStatus(session.user.email);
                // Subscribe to realtime updates for this student's status
                subscribeToStudentStatus(session.user.email);
              }
              if (data?.role === USER_ROLES.EMPLOYEE) {
                await fetchEmployeeStatus(session.user.email);
                subscribeToEmployeeStatus(session.user.email);
              }
            }
            setUserMetaLoading(false);
          });
      } else {
        setUserMeta(null);
        setStudentStatus(null);
        setEmployeeStatus(null);
        setUserMetaLoading(false);
        fetchedUid.current = null;
        //  CLEANUP realtime on logout
        if (studentChannelRef.current) {
          supabase.removeChannel(studentChannelRef.current);
          studentChannelRef.current = null;
        }
        if (employeeChannelRef.current) {
          supabase.removeChannel(employeeChannelRef.current);
          employeeChannelRef.current = null;
        }
      }
    });

    return () => {
      if (studentChannelRef.current) {
        supabase.removeChannel(studentChannelRef.current);
        studentChannelRef.current = null;
      }
      if (employeeChannelRef.current) {
        supabase.removeChannel(employeeChannelRef.current);
        employeeChannelRef.current = null;
      }
      subscription.unsubscribe();
    };
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
        employeeStatus,
        setEmployeeStatus,
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

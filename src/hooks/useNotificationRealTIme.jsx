import { useEffect, useRef } from "react";
import { supabase } from "../config/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { QK_NOTIFICATIONS } from "../config/queryKeyConfig";

const useNotificationRealTime = (email) => {
  const queryClient = useQueryClient();
  const channelRef = useRef(null);

  useEffect(() => {
    if (!email) return;

    channelRef.current = supabase
      .channel(`notifications:${email}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `recipient_email=eq.${email}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: [QK_NOTIFICATIONS, email],
          });
        },
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [email, queryClient]);
};

export default useNotificationRealTime;

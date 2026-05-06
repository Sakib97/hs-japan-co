import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import { QK_NOTIFICATIONS } from "../config/queryKeyConfig";

const useNotification = (email, { limit, page, pageSize } = {}) => {
  const queryClient = useQueryClient();

  // Resolve RPC params
  const isPaginated = page != null && pageSize != null;
  const rpcLimit = isPaginated ? pageSize : (limit ?? null);
  const rpcOffset = isPaginated ? (page - 1) * pageSize : 0;

  const queryKey = isPaginated
    ? [QK_NOTIFICATIONS, email, "page", page, pageSize]
    : limit
      ? [QK_NOTIFICATIONS, email, limit]
      : [QK_NOTIFICATIONS, email];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_notifications_with_unread_count",
        { p_email: email, p_limit: rpcLimit, p_offset: rpcOffset },
      );
      if (error) throw new Error(error.message);
      return data; // { notifications: [...], unread_count: N, total_count: N }
    },
    enabled: !!email,
  });

  const markAsRead = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QK_NOTIFICATIONS, email] }),
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("recipient_email", email)
        .eq("is_read", false);
      if (error) throw new Error(error.message);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QK_NOTIFICATIONS, email] }),
  });

  const unreadCount = query.data?.unread_count ?? 0;
  const totalCount = query.data?.total_count ?? 0;

  return {
    notifications: query.data?.notifications ?? [],
    isLoading: query.isLoading,
    unreadCount,
    totalCount,
    markAsRead: (id) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate(),
  };
};

export default useNotification;

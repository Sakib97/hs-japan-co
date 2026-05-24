import { Button, Card, Tag, Tooltip, Popconfirm, Empty, Skeleton } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_VISA_PAGES,
  QK_VISA_PAGE_BY_SLUG,
  QK_PUBLISHED_VISA_PAGES,
} from "../../../../config/queryKeyConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import { getFormattedDate } from "../../../../utils/dateUtil";
import {
  VISA_PAGE_STATUS_COLOR,
  VISA_PAGE_STATUS_OPTIONS,
} from "../../../../config/statusAndRoleConfig";
import styles from "./VisaPageDirectoryComp.module.css";
import { deleteImage } from "../../../../utils/handleImage";

const VisaPageDirectoryComp = ({ onEdit }) => {
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: [QK_VISA_PAGES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_page")
        .select(
          `id, slug, publication_status, created_at, created_by,
           visa_page_hero ( title, subtitle, image_url ),
           visa_page_section ( image_url )`,
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const {
    mutate: deletePage,
    isPending: isDeleting,
    variables: deletingPageId,
  } = useMutation({
    mutationFn: async (pageId) => {
      // Read image URLs from already-cached pages data (no extra API calls)
      const page = pages.find((p) => p.id === pageId);
      const toArr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
      const imageUrls = [
        ...toArr(page?.visa_page_hero).map((r) => r.image_url),
        ...toArr(page?.visa_page_section).map((r) => r.image_url),
      ].filter(Boolean);

      // Delete storage images best-effort (don't block page deletion on failure)
      await Promise.allSettled(
        imageUrls.map((url) => deleteImage(url, "combined_page_images")),
      );

      // Delete the page record (cascades to all related rows)
      const { error } = await supabase
        .from("visa_page")
        .delete()
        .eq("id", pageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGES] });
      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGE_BY_SLUG] });
      queryClient.invalidateQueries({ queryKey: [QK_PUBLISHED_VISA_PAGES] });
      showToast("Visa page deleted successfully.", "success");
    },
    onError: (err) => {
      showToast(err.message || "Failed to delete visa page.", "error");
    },
  });

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} active />
        ))}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <Empty
        description='No visa pages created yet. Click "Create New Visa Page" to get started.'
        className={styles.empty}
      />
    );
  }

  return (
    <div className={styles.grid}>
      {pages.map((page) => {
        const heroRaw = page.visa_page_hero;
        const hero = (Array.isArray(heroRaw) ? heroRaw[0] : heroRaw) ?? {};
        const subtitle =
          hero.subtitle && hero.subtitle.length > 100
            ? hero.subtitle.slice(0, 100) + "..."
            : hero.subtitle || "—";
        const status = page.publication_status ?? "draft";

        return (
          <Card
            key={page.id}
            className={styles.card}
            cover={
              hero.image_url ? (
                <img
                  src={hero.image_url}
                  alt={hero.title}
                  className={styles.coverImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>No Image</div>
              )
            }
            actions={[
              <Tooltip title="Edit" key="edit">
                <EditOutlined
                  className={styles.actionEdit}
                  onClick={() => onEdit?.(page)}
                />
              </Tooltip>,
              <Tooltip title="Delete" key="delete">
                <Popconfirm
                  title="Delete this visa page?"
                  description="This action cannot be undone."
                  onConfirm={() => deletePage(page.id)}
                  okText="Delete"
                  okButtonProps={{
                    danger: true,
                    loading: isDeleting && deletingPageId === page.id,
                  }}
                  cancelText="Cancel"
                  disabled={isDeleting}
                >
                  {isDeleting && deletingPageId === page.id ? (
                    <LoadingOutlined className={styles.actionDelete} />
                  ) : (
                    <DeleteOutlined className={styles.actionDelete} />
                  )}
                </Popconfirm>
              </Tooltip>,
            ]}
          >
            <div className={styles.cardBody}>
              <div className={styles.titleRow}>
                <span className={styles.titleIcon}>
                  <GlobalOutlined />
                </span>
                <span className={styles.title}>{hero.title || "Untitled"}</span>
                <Tag
                  color={VISA_PAGE_STATUS_COLOR[status] ?? "default"}
                  className={styles.statusTag}
                >
                  {VISA_PAGE_STATUS_OPTIONS.find((o) => o.value === status)
                    ?.label ?? status}
                </Tag>
              </div>

              <p className={styles.subtitle}>{subtitle}</p>

              <div className={styles.meta}>
                <span className={styles.metaSlug}>/visa/{page.slug}</span>
                <span className={styles.metaDate}>
                  {getFormattedDate(page.created_at)}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default VisaPageDirectoryComp;

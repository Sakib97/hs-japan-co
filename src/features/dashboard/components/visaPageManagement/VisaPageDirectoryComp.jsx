import { Button, Card, Tag, Tooltip, Popconfirm, Empty, Skeleton } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import { QK_VISA_PAGES } from "../../../../config/queryKeyConfig";
import { showToast } from "../../../../components/layout/CustomToast";
import { getFormattedDate } from "../../../../utils/dateUtil";
import {
  VISA_PAGE_STATUS_COLOR,
  VISA_PAGE_STATUS_OPTIONS,
} from "../../../../config/statusAndRoleConfig";
import styles from "./VisaPageDirectoryComp.module.css";

const VisaPageDirectoryComp = ({ onEdit }) => {
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: [QK_VISA_PAGES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_page")
        .select(
          `id, slug, publication_status, created_at, created_by,
           visa_page_hero ( title, subtitle, image_url )`,
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { mutate: deletePage } = useMutation({
    mutationFn: async (pageId) => {
      const { error } = await supabase
        .from("visa_page")
        .delete()
        .eq("id", pageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QK_VISA_PAGES] });
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
        const hero = page.visa_page_hero?.[0] ?? {};
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
                {/* <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEdit?.(page)}
                /> */}
              </Tooltip>,
              <Tooltip title="Delete" key="delete">
                <Popconfirm
                  title="Delete this visa page?"
                  description="This action cannot be undone."
                  onConfirm={() => deletePage(page.id)}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  cancelText="Cancel"
                >
                  {/* <Button size="small" danger icon={<DeleteOutlined />} /> */}
                  <DeleteOutlined className={styles.actionDelete} />
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
                <span className={styles.metaSlug}>/{page.slug}</span>
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

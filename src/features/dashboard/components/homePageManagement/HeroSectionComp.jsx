import { useRef, useState } from "react";
import { Button, Popconfirm, Spin } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../config/supabaseClient";
import {
  QK_HOMEPAGE_HERO,
  QK_HOME_HERO,
} from "../../../../config/queryKeyConfig";
import { IMAGE_SIZES } from "../../../../config/imageSizeConfig";
import { uploadImage, replaceImage, deleteImage } from "../../../../utils/handleImage";
import { showToast } from "../../../../components/layout/CustomToast";
import panelStyles from "./SuccessStoriesComp.module.css";
import styles from "./HeroSectionComp.module.css";

const BUCKET = "home_page_images";
const FOLDER = "hero";
const SECTION = "homepage_hero";
const MAX_SIZE = IMAGE_SIZES.HOMEPAGE_HERO.maxBytes;
const MAX_LABEL = IMAGE_SIZES.HOMEPAGE_HERO.label;

const fetchHero = async () => {
  const { data, error } = await supabase
    .from("home_page")
    .select("id, image_link, image_size")
    .eq("image_section", SECTION)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
};

const HeroSectionComp = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: hero, isLoading } = useQuery({
    queryKey: [QK_HOMEPAGE_HERO],
    queryFn: fetchHero,
  });

  const invalidateHero = async () => {
    await queryClient.invalidateQueries({ queryKey: [QK_HOMEPAGE_HERO] });
    await queryClient.invalidateQueries({ queryKey: [QK_HOME_HERO] });
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Invalid file type. Please upload an image.", "error");
      return;
    }

    if (file.size > MAX_SIZE) {
      showToast(`Image too large. Max allowed: ${MAX_LABEL}.`, "error");
      return;
    }

    setUploading(true);
    try {
      if (hero?.image_link) {
        const publicUrl = await replaceImage(
          file,
          BUCKET,
          FOLDER,
          hero.image_link,
        );
        const { error } = await supabase
          .from("home_page")
          .update({
            image_link: publicUrl,
            image_size: file.size,
          })
          .eq("id", hero.id);
        if (error) throw error;
        showToast("Hero background updated.", "success");
      } else {
        const publicUrl = await uploadImage(file, BUCKET, FOLDER);
        const { error } = await supabase.from("home_page").insert({
          image_link: publicUrl,
          image_section: SECTION,
          image_size: file.size,
          image_order: 0,
        });
        if (error) throw error;
        showToast("Hero background uploaded.", "success");
      }

      await invalidateHero();
    } catch {
      showToast("Failed to upload hero background.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!hero?.image_link) return;

    setDeleting(true);
    try {
      await deleteImage(hero.image_link, BUCKET, {
        table: "home_page",
        column: "id",
        value: hero.id,
      });
      showToast("Hero background deleted.", "success");
      await invalidateHero();
    } catch {
      showToast("Failed to delete hero background.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={panelStyles.section}>
      <div className={panelStyles.header}>
        <div>
          <h2 className={panelStyles.title}>Hero Section</h2>
          <p className={panelStyles.subtitle}>
            Upload the homepage hero background image shown behind the main
            heading.
          </p>
        </div>
      </div>

      <Spin spinning={isLoading || uploading || deleting}>
        <div className={styles.previewWrap}>
          {hero?.image_link ? (
            <img
              src={hero.image_link}
              alt="Hero background preview"
              className={styles.previewImg}
            />
          ) : (
            <div className={styles.previewEmpty}>No hero background uploaded</div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            icon={uploading ? <LoadingOutlined spin /> : <UploadOutlined />}
            className={styles.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || deleting}
          >
            {hero?.image_link ? "Replace Image" : "Upload Image"}
          </Button>

          {hero?.image_link && (
            <Popconfirm
              title="Delete hero background?"
              description="The live homepage will fall back to the default image."
              onConfirm={handleDelete}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
            >
              <Button
                danger
                icon={deleting ? <LoadingOutlined spin /> : <DeleteOutlined />}
                disabled={uploading || deleting}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>

        <p className={styles.hint}>
          Images only · Max {MAX_LABEL} · Recommended: 1920 × 1080 px · JPG,
          PNG, JPEG
        </p>
      </Spin>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />
    </div>
  );
};

export default HeroSectionComp;

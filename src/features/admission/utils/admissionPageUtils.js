export const ADMISSION_SECTION_KEYS = {
  BANNER: "banner",
  PAGE_HEADING: "page_heading",
  ABOUT_ACADEMIC: "about_academic",
  LANGUAGE_SCHOOL: "language_school",
  SSW: "ssw",
};

export const getSidebarList = (sidebarItems, fallback = []) => {
  if (!sidebarItems) return fallback;
  if (Array.isArray(sidebarItems)) return sidebarItems;
  return sidebarItems.items ?? fallback;
};

export const getYoutubeVideoId = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace(/^\//, "").split("/")[0] || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
};

export const getYoutubeThumbnail = (url, quality = "hqdefault") => {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
};

export const getSidebarMeta = (sidebarItems) => {
  if (!sidebarItems || Array.isArray(sidebarItems)) {
    return {
      videoUrl: null,
      sidebarImage: null,
    };
  }
  return {
    videoUrl: sidebarItems.videoUrl ?? null,
    sidebarImage: sidebarItems.sidebarImage ?? null,
  };
};

export const buildSidebarPayload = (items, meta = {}) => {
  const hasMeta = meta.videoUrl || meta.sidebarImage;
  if (!hasMeta) return items;
  return {
    items,
    videoUrl: meta.videoUrl ?? null,
    sidebarImage: meta.sidebarImage ?? null,
  };
};

export const findAdmissionSection = (sections, key) =>
  sections?.find((s) => s.section_key === key) ?? null;

export const saveAdmissionSection = async (supabase, sectionKey, fields) => {
  const { data: existing, error: fetchError } = await supabase
    .from("admission_page")
    .select("id")
    .eq("section_key", sectionKey)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await supabase
      .from("admission_page")
      .update(fields)
      .eq("section_key", sectionKey);
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from("admission_page")
    .insert({ section_key: sectionKey, ...fields });
  if (error) throw error;
};

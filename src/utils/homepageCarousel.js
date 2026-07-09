import { supabase } from "../config/supabaseClient";

export const HOMEPAGE_CAROUSEL_SECTION = "homepage_carousel";

export const fetchHomepageCarouselSlides = async () => {
  const { data, error } = await supabase
    .from("home_page")
    .select("id, image_link, image_order")
    .eq("image_section", HOMEPAGE_CAROUSEL_SECTION)
    .order("image_order", { ascending: true, nullsFirst: false })
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    url: row.image_link,
    order: row.image_order,
  }));
};

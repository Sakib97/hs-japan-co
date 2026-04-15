import { supabase } from "../config/supabaseClient";

export const uploadImage = async (file, bucket, folder) => {
  const fileName = `${folder}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket) // your bucket name e.g. "homepage"
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false, // true = overwrite if exists
    });

  if (error) throw error;

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return publicUrl; // store this in Supabase DB
};

export const deleteImage = async (url, bucket, dbOptions = null) => {
  // Extract the file path from the public URL
  // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const path = url.split(`/storage/v1/object/public/${bucket}/`)[1];

  if (!path) throw new Error("Could not extract file path from URL");

  const { error: storageError } = await supabase.storage
    .from(bucket)
    .remove([path]);
  if (storageError) throw storageError;

  // Optionally delete the matching row from a DB table
  if (dbOptions) {
    const { table, column, value } = dbOptions;
    const { error: dbError, count } = await supabase
      .from(table)
      .delete({ count: "exact" })
      .eq(column, value);
    if (dbError) throw dbError;
    if (count === 0)
      throw new Error(
        `No matching row found in "${table}" where ${column} = ${value}`,
      );
  }
};

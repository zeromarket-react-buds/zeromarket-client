import supabase from "./supabaseClient";

export async function uploadToSupabase(file) {
  const safeName = `${Date.now()}-${file.name.replace(/[^\w\-\.]/g, "_")}`;
  const filePath = `products/${safeName}`;
  // const fileName = `${Date.now()}-${file.name}`;
  // const filePath = `products/${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("product-images") // 버킷 이름
    .upload(filePath, file);

  if (error) {
    console.error("Supabase 업로드 실패:", error);
    throw error;
  }

  return supabase.storage.from("product-images").getPublicUrl(filePath).data
    .publicUrl;
}

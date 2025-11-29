import supabase from "./supabaseClient";
//수정중
export async function uploadToSupabase(file, productTitle) {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `products/${productTitle}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("zeromarket-images") // 버킷 이름-테스트용으로 우선 제 버킷입니다
    .upload(filePath, file);

  if (error) {
    console.error("Supabase 업로드 실패:", error);
    throw error;
  }

  // public URL 만들기
  const { publicUrl } = supabase.storage
    .from("zeromarket-images")
    .getPublicUrl(filePath).data;

  return publicUrl;
}

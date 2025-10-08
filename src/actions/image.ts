// src/actions/image.ts (client side karena sudah ada action upload di server side)

export async function uploadImage(formData: FormData) {
  try {
    const image = formData.get("image") as File;

    if (!image) {
      return { success: false, error: "Gambar tidak ditemukan" };
    }

    const res = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error upload gambar", errorData);
      return { success: false, error: "Gagal upload gambar" };
    }
    const data = (await res.json()) as {
      key?: string;
      url?: string;
      error?: string;
    };
    if (data.key) {
      return { success: true, result: data.key };
    }
    return { success: false, error: data.error };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal upload gambar" };
  }
}

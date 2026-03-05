const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const FREEIMAGE_API_KEY = import.meta.env.VITE_FREEIMAGE_API_KEY;

async function uploadToImgBB(base64Image: string): Promise<string> {
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64Image);

    const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error("ImgBB upload failed");
    }

    return data.data.url;
}

async function uploadToFreeImage(base64Image: string): Promise<string> {
    const formData = new FormData();
    formData.append("key", FREEIMAGE_API_KEY);
    formData.append("source", base64Image);
    formData.append("format", "json");

    const response = await fetch("https://freeimage.host/api/1/upload", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok || data.status_code !== 200) {
        throw new Error("Freeimage upload failed");
    }

    return data.image.url;
}

export async function uploadImage(
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> {
    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        throw new Error("حجم الصورة كبير أوي! الحد الأقصى 10MB");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
        throw new Error("الملف ده مش صورة!");
    }

    onProgress?.(10);

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
            const base64Image = (reader.result as string).split(",")[1];
            onProgress?.(30);

            try {
                const url = await uploadToImgBB(base64Image);
                onProgress?.(100);
                resolve(url);
            } catch (err) {
                onProgress?.(50);
                console.warn("ImgBB failed. Trying Freeimage...", err);
                try {
                    const fallbackUrl = await uploadToFreeImage(base64Image);
                    onProgress?.(100);
                    resolve(fallbackUrl);
                } catch (fallbackErr) {
                    reject(new Error("فشل رفع الصورة. حاول تاني!"));
                }
            }
        };

        reader.onerror = () => reject(new Error("فشل قراءة الملف"));
        reader.readAsDataURL(file);
    });
}

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();

    // Ensure response includes both URL and publicId
    if (!data.secure_url || !data.public_id) {
      throw new Error("Missing secure_url or public_id in Cloudinary response");
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
};

const generateSignature = async (publicId, timestamp) => {
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;
  const message = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

export { uploadToCloudinary, generateSignature };

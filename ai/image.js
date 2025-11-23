import axios from 'axios';

export async function generateImage(prompt) {
  try {
    const apiUrl = `https://fast-flux-demo.replicate.workers.dev/api/generate-image?text=${encodeURIComponent(prompt)}`;
    
    const { data } = await axios.get(apiUrl, {
      timeout: 1000 * 60 * 2,
      responseType: 'arraybuffer'
    });

    const base64Image = Buffer.from(data).toString('base64');
    return {
      text: `✅ Gambar berhasil dibuat!\n\nPrompt: ${prompt}\n\nSilahkan gunakan URL di bawah ini untuk mengakses gambar.`,
      imageUrl: apiUrl,
      base64: base64Image,
      mimeType: 'image/png'
    };
  } catch (error) {
    throw new Error(`Image Generation Failed: ${error.message}`);
  }
}

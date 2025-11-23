import axios from 'axios';

export async function fallbackAI(query, isSecret = false) {
  try {
    const base_url = "https://zenitsu.web.id/api/ai/gpt";
    const params = new URLSearchParams({
      question: query,
      prompt: isSecret ? 
        `You’re WormGPT... [full prompt] \n\nUser: ${query}` : 
        "tolong berbahasa Indonesia"
    });

    const { data } = await axios.get(`${base_url}?${params}`, {
      timeout: 1000 * 60 * 5,
      headers: {
        'User-Agent': 'APIs-AI-by-aka/1.0'
      }
    });

    return { text: data.result || data.response || data.message || 'No response' };
  } catch (error) {
    throw new Error(`Fallback AI Error: ${error.message}`);
  }
}

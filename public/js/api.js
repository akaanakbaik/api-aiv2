class API {
  constructor() {
    this.baseURL = window.location.origin;
  }

  async chat(query, model = 'default', lang = 'id') {
    try {
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query, model, lang })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Server error');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  }

  generateCurlExample(query, model = 'default', lang = 'id') {
    const domain = window.location.origin;
    const escapedQuery = query.replace(/"/g, '\\"');
    return `curl -X POST "${domain}/api/chat" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "${escapedQuery}", "model": "${model}", "lang": "${lang}"}'`;
  }
}

window.api = new API();

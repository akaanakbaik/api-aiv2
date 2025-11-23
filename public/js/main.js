class App {
  constructor() {
    this.elements = {
      queryInput: document.getElementById('queryInput'),
      execBtn: document.getElementById('execBtn'),
      clearBtn: document.getElementById('clearBtn'),
      langSelect: document.getElementById('langSelect'),
      loadingSection: document.getElementById('loadingSection'),
      resultSection: document.getElementById('resultSection'),
      resultBox: document.getElementById('resultBox'),
      metadataPre: document.getElementById('metadataPre'),
      responsePre: document.getElementById('responsePre'),
      curlPre: document.getElementById('curlPre'),
      copyResultBtn: document.getElementById('copyResultBtn'),
      copyCurlBtn: document.getElementById('copyCurlBtn')
    };

    this.currentResult = null;
    this.init();
  }

  init() {
    this.elements.execBtn.addEventListener('click', () => this.execute());
    this.elements.clearBtn.addEventListener('click', () => this.clear());
    this.elements.queryInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) this.execute();
    });
    
    this.elements.copyResultBtn.addEventListener('click', () => this.copyResult());
    this.elements.copyCurlBtn.addEventListener('click', () => this.copyCurl());

    // Auto-generate curl example
    this.elements.queryInput.addEventListener('input', () => this.updateCurlExample());
    this.updateCurlExample();
  }

  async execute() {
    const query = this.elements.queryInput.value.trim();
    if (!query) {
      notification.error('Query tidak boleh kosong!');
      return;
    }

    const model = 'default';
    const lang = this.elements.langSelect.value;

    this.showLoading(true);
    this.elements.resultSection.classList.remove('active');

    try {
      const result = await api.chat(query, model, lang);
      this.currentResult = result;
      this.displayResult(result);
      notification.success('✅ Berhasil diproses!');
    } catch (error) {
      console.error('Execution error:', error);
      notification.error(`❌ Gagal: ${error.message}`);
      
      // Show error in result box
      this.displayError(error.message);
    } finally {
      this.showLoading(false);
    }
  }

  displayResult(result) {
    const metadata = JSON.stringify(result.metadata, null, 2);
    const response = typeof result.data === 'string' ? result.data : 
                    result.data.text || JSON.stringify(result.data, null, 2);

    this.elements.metadataPre.textContent = metadata;
    this.elements.responsePre.textContent = response;
    
    this.elements.resultSection.classList.add('active');
    
    // Smooth scroll
    this.elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  displayError(message) {
    this.elements.metadataPre.textContent = JSON.stringify({
      timestamp: new Date().toISOString(),
      error: true,
      fallback: 'Automatic fallback activated'
    }, null, 2);
    this.elements.responsePre.textContent = `Error: ${message}\n\nSilakan coba lagi atau gunakan model lain.`;
    this.elements.resultSection.classList.add('active');
  }

  clear() {
    this.elements.queryInput.value = '';
    this.elements.resultSection.classList.remove('active');
    this.currentResult = null;
    notification.success('🗑️ Berhasil dibersihkan!');
    this.updateCurlExample();
  }

  copyResult() {
    if (!this.currentResult) return;
    
    const textToCopy = `METADATA:\n${JSON.stringify(this.currentResult.metadata, null, 2)}\n\nRESPONSE:\n${this.currentResult.data.text || this.currentResult.data}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      notification.success('📋 Hasil disalin!');
    }).catch(() => {
      notification.error('Gagal menyalin');
    });
  }

  copyCurl() {
    const curl = this.elements.curlPre.textContent;
    navigator.clipboard.writeText(curl).then(() => {
      notification.success('📋 cURL disalin!');
    }).catch(() => {
      notification.error('Gagal menyalin');
    });
  }

  updateCurlExample() {
    const query = this.elements.queryInput.value || 'halo AI';
    const lang = this.elements.langSelect.value;
    const curl = api.generateCurlExample(query, 'default', lang);
    this.elements.curlPre.textContent = curl;
  }

  showLoading(show) {
    this.elements.loadingSection.style.display = show ? 'block' : 'none';
    this.elements.execBtn.disabled = show;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});

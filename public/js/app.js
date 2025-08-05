// The Krant - News Website JavaScript

class NewsApp {
  constructor() {
    this.googleDocId = '14rLBJRSTqLEH2twnbMiieLuTG6G9DLQNZL_8eHO5z40';
    this.newsGrid = document.getElementById('news-grid');
    this.loading = document.getElementById('loading');
    this.pagination = document.getElementById('pagination');
    this.allSections = [];
    this.currentPage = 1;
    this.sectionsPerPage = 6;
    this.init();
  }

  init() {
    this.setupNavigation();
    this.loadNews();
  }

  setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  async loadNews() {
    try {
      const docUrl = `https://docs.google.com/document/d/${this.googleDocId}/export?format=html`;
      
      const methods = [
        () => fetch(docUrl),
        () => fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(docUrl)}`).then(r => r.json()).then(data => new Response(data.contents))
      ];
      
      for (let method of methods) {
        try {
          const response = await method();
          const html = await response.text();
          if (html && html.trim()) {
            this.parseAndDisplayNewsFromHTML(html);
            return;
          }
        } catch (err) {
          console.log('Method failed, trying next...', err);
        }
      }
      
      throw new Error('All fetch methods failed');
      
    } catch (error) {
      console.error('Error loading news:', error);
      this.showFallbackContent();
    }
  }

  parseAndDisplayNewsFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    let content = doc.body.innerHTML;
    let sections = [];
    
    const patterns = [/---+/g, /===/g, /###/g];
    
    for (let pattern of patterns) {
      if (pattern.test(content)) {
        sections = content.split(pattern).filter(s => s.trim());
        break;
      }
    }
    
    if (sections.length === 0) {
      sections = [content];
    }
    
    this.allSections = sections;
    this.loading.style.display = 'none';
    this.displayPage(1);
    this.createPagination();
  }

  displayPage(page) {
    this.currentPage = page;
    this.newsGrid.innerHTML = '';
    
    const start = (page - 1) * this.sectionsPerPage;
    const end = start + this.sectionsPerPage;
    const sectionsToShow = this.allSections.slice(start, end);
    
    sectionsToShow.forEach((section, index) => {
      const div = document.createElement('div');
      div.innerHTML = section.trim();
      this.createNewsSectionFromHTML(div, start + index + 1);
    });
  }

  createNewsSectionFromHTML(pageElement, pageNumber) {
    const section = document.createElement('article');
    section.className = 'news-article';
    
    const firstHeading = pageElement.querySelector('h1, h2, h3, h4, h5, h6');
    const firstParagraph = pageElement.querySelector('p');
    const title = firstHeading ? firstHeading.textContent.trim() : 
                 (firstParagraph ? firstParagraph.textContent.trim() : `Section ${pageNumber}`);
    
    if (firstHeading) {
      firstHeading.remove();
    } else if (firstParagraph && firstParagraph.textContent.trim() === title) {
      firstParagraph.remove();
    }
    
    const contentId = `content-${pageNumber}`;
    const expandBtnId = `expand-${pageNumber}`;
    
    section.innerHTML = `
      <h3>${this.escapeHtml(title)}</h3>
      <div class="content expandable-content" id="${contentId}">
        ${pageElement.innerHTML}
      </div>
      <button class="expand-btn" id="${expandBtnId}" onclick="newsApp.toggleExpand('${contentId}', '${expandBtnId}')" style="display: none;">Read Full Article</button>
      <div class="news-meta">
        Section ${pageNumber} • From Google Doc
      </div>
    `;
    
    this.newsGrid.appendChild(section);
    setTimeout(() => this.checkContentHeight(contentId, expandBtnId), 100);
  }

  checkContentHeight(contentId, expandBtnId) {
    const content = document.getElementById(contentId);
    const expandBtn = document.getElementById(expandBtnId);
    
    if (content && content.scrollHeight > 300) {
      content.classList.add('collapsed');
      expandBtn.style.display = 'block';
    }
  }

  toggleExpand(contentId, expandBtnId) {
    const content = document.getElementById(contentId);
    const article = content.closest('.news-article');
    const title = article.querySelector('h3').textContent;
    const fullContent = content.innerHTML;
    
    this.showPopup(title, fullContent);
  }

  showPopup(title, content) {
    let popup = document.getElementById('article-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'article-popup';
      popup.className = 'popup-overlay';
      popup.innerHTML = `
        <div class="popup-content">
          <button class="popup-close" onclick="newsApp.closePopup()">&times;</button>
          <div class="popup-header">
            <h2 id="popup-title"></h2>
          </div>
          <div class="popup-body" id="popup-body"></div>
        </div>
      `;
      
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          this.closePopup();
        }
      });
      document.body.appendChild(popup);
    }
    
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-body').innerHTML = content;
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  closePopup() {
    const popup = document.getElementById('article-popup');
    if (popup) {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  createPagination() {
    const totalPages = Math.ceil(this.allSections.length / this.sectionsPerPage);
    
    if (totalPages <= 1) {
      this.pagination.style.display = 'none';
      return;
    }
    
    let paginationHTML = '<div class="pagination-controls">';
    
    if (this.currentPage > 1) {
      paginationHTML += `<button onclick="newsApp.displayPage(${this.currentPage - 1}); newsApp.createPagination();">Previous</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === this.currentPage ? ' active' : '';
      paginationHTML += `<button class="page-btn${activeClass}" onclick="newsApp.displayPage(${i}); newsApp.createPagination();">${i}</button>`;
    }
    
    if (this.currentPage < totalPages) {
      paginationHTML += `<button onclick="newsApp.displayPage(${this.currentPage + 1}); newsApp.createPagination();">Next</button>`;
    }
    
    paginationHTML += '</div>';
    this.pagination.innerHTML = paginationHTML;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showFallbackContent() {
    this.loading.style.display = 'none';
    
    const fallbackElement = document.createElement('div');
    fallbackElement.className = 'news-article';
    fallbackElement.innerHTML = `
      <h3>Unable to Load Content</h3>
      <div class="content">
        <p>We're having trouble loading content from the Google Doc. Please ensure:</p>
        <ul>
          <li>The document is publicly accessible</li>
          <li>Each page in the document represents a news section</li>
          <li>Your browser allows cross-origin requests</li>
        </ul>
        <p>Document ID: ${this.googleDocId}</p>
      </div>
      <div class="news-meta">
        Error • Check document permissions
      </div>
    `;
    this.newsGrid.appendChild(fallbackElement);
  }
}

let newsApp;
document.addEventListener('DOMContentLoaded', () => {
  newsApp = new NewsApp();
  
  // Loading animation
  const loading = document.getElementById('loading');
  if (loading) {
    let dots = 0;
    const loadingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      loading.textContent = 'Loading news' + '.'.repeat(dots);
    }, 500);
    setTimeout(() => clearInterval(loadingInterval), 5000);
  }
  
  // Header shadow on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
  });
});
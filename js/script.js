/**
 * Road of Goodness Charity Website
 * Main JavaScript functionality
 */

// ====================
// Language Toggle
// ====================
const LanguageManager = {
  currentLang: localStorage.getItem('language') || 'ar',

  init() {
    this.applyLanguage(this.currentLang);
    this.bindEvents();
  },

  bindEvents() {
    const langToggle = document.getElementById('langToggle');
    const mobileLangToggle = document.getElementById('mobileLangToggle');

    if (langToggle) {
      langToggle.addEventListener('click', () => this.toggleLanguage());
    }
    if (mobileLangToggle) {
      mobileLangToggle.addEventListener('click', () => this.toggleLanguage());
    }
  },

  toggleLanguage() {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', this.currentLang);
    this.applyLanguage(this.currentLang);
  },

  applyLanguage(lang) {
    const root = document.documentElement;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.lang = lang;

    // Update all text with data attributes
    document.querySelectorAll('[data-ar]').forEach(el => {
      const arText = el.dataset.ar;
      const enText = el.dataset.en;
      if (arText && enText) {
        el.textContent = lang === 'ar' ? arText : enText;
      }
    });

    // Update language toggle buttons
    const langText = document.getElementById('langText');
    const mobileLangText = document.getElementById('mobileLangText');

    if (langText) langText.textContent = lang === 'ar' ? 'EN' : 'AR';
    if (mobileLangText) mobileLangText.textContent = lang === 'ar' ? 'English' : 'العربية';
  }
};

// ====================
// Mobile Menu
// ====================
const MobileMenu = {
  init() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const isOpen = mobileMenu.classList.contains('active');
        menuBtn.setAttribute('aria-expanded', isOpen);
      });
    }
  }
};

// ====================
// Animated Counters
// ====================
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(animate);
  }
};

// ====================
// Donation Form
// ====================
const DonationForm = {
  selectedAmount: 100,
  customAmount: '',
  useCustom: false,
  isRecurring: false,

  init() {
    if (!document.querySelector('.amount-btn')) return;

    this.bindEvents();
    this.updateDisplay();
  },

  bindEvents() {
    // Amount buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedAmount = parseInt(btn.dataset.amount, 10);
        this.useCustom = false;
        this.updateAmountButtons();
        this.updateDisplay();
      });
    });

    // Custom amount input
    const customInput = document.getElementById('customAmount');
    if (customInput) {
      customInput.addEventListener('input', (e) => {
        this.customAmount = e.target.value;
        this.useCustom = true;
        this.updateAmountButtons();
        this.updateDisplay();
      });
    }

    // Recurring toggle
    const recurringToggle = document.getElementById('recurringToggle');
    if (recurringToggle) {
      recurringToggle.addEventListener('click', () => {
        this.isRecurring = !this.isRecurring;
        recurringToggle.classList.toggle('active', this.isRecurring);
        this.updateDisplay();
      });
    }

    // Payment button
    const donateBtn = document.getElementById('donateBtn');
    if (donateBtn) {
      donateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.processDonation();
      });
    }
  },

  updateAmountButtons() {
    document.querySelectorAll('.amount-btn').forEach(btn => {
      const amount = parseInt(btn.dataset.amount, 10);
      btn.classList.toggle('active', !this.useCustom && this.selectedAmount === amount);
    });
  },

  updateDisplay() {
    const amount = this.useCustom ? (parseFloat(this.customAmount) || 0) : this.selectedAmount;

    const displayElements = document.querySelectorAll('.display-amount');
    displayElements.forEach(el => {
      el.textContent = '$' + amount.toLocaleString();
    });

    const typeElements = document.querySelectorAll('.display-type');
    typeElements.forEach(el => {
      el.textContent = this.isRecurring
        ? (document.documentElement.lang === 'ar' ? 'شهري' : 'Monthly')
        : (document.documentElement.lang === 'ar' ? 'مرة واحدة' : 'One-time');
    });

    const recurringText = document.getElementById('recurringText');
    if (recurringText) {
      recurringText.textContent = this.isRecurring
        ? (document.documentElement.lang === 'ar' ? '/ شهرياً' : '/ monthly')
        : '';
    }
  },

  processDonation() {
    const amount = this.useCustom ? (parseFloat(this.customAmount) || 0) : this.selectedAmount;
    if (amount <= 0) return;

    const donorName = document.getElementById('donorName')?.value || 'Anonymous';
    const projectSelect = document.getElementById('projectSelect');
    const projectName = projectSelect
      ? projectSelect.options[projectSelect.selectedIndex].text
      : (document.documentElement.lang === 'ar' ? 'صندوق التبرعات العام' : 'General Donation Fund');

    // Generate receipt
    const receiptNumber = 'RD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const date = new Date().toLocaleDateString(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US');

    // Update modal
    document.getElementById('receiptNumber').textContent = receiptNumber;
    document.getElementById('receiptDonor').textContent = donorName;
    document.getElementById('receiptAmount').textContent = '$' + amount.toLocaleString();
    document.getElementById('receiptProject').textContent = projectName;
    document.getElementById('receiptDate').textContent = date;

    // Show modal
    const modal = document.getElementById('receiptModal');
    if (modal) {
      modal.classList.add('active');
    }
  }
};

// ====================
// Modal Handler
// ====================
const ModalHandler = {
  init() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
  }
};

// ====================
// Projects Filter
// ====================
const ProjectsFilter = {
  currentFilter: 'all',
  searchTerm: '',

  init() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('projectSearch');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.toggle('active', b === btn));
        this.filterProjects();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.filterProjects();
      });
    }
  },

  filterProjects() {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
      const status = project.dataset.status || '';
      const title = project.querySelector('h3')?.textContent.toLowerCase() || '';
      const location = project.querySelector('.project-location')?.textContent.toLowerCase() || '';

      const matchesFilter = this.currentFilter === 'all' || status === this.currentFilter;
      const matchesSearch = !this.searchTerm || title.includes(this.searchTerm) || location.includes(this.searchTerm);

      project.style.display = matchesFilter && matchesSearch ? '' : 'none';
    });

    // Update count
    const visibleCount = document.querySelectorAll('.project-card[style=""], .project-card:not([style])').length;
    const countEl = document.getElementById('projectCount');
    if (countEl) {
      countEl.textContent = visibleCount;
    }
  }
};

// ====================
// Contact Form
// ====================
const ContactForm = {
  init() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitForm(form);
    });
  },

  async submitForm(form) {
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> ' + (document.documentElement.lang === 'ar' ? 'جاري الإرسال...' : 'Sending...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success
    form.style.display = 'none';
    const successMsg = document.getElementById('contactSuccess');
    if (successMsg) {
      successMsg.style.display = 'block';
    }

    btn.disabled = false;
    btn.innerHTML = document.documentElement.lang === 'ar' ? 'إرسال' : 'Send';
  }
};

// ====================
// Smooth Progress Bars
// ====================
const ProgressBars = {
  init() {
    const bars = document.querySelectorAll('.progress-fill');
    if (bars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.1 });

    bars.forEach(bar => observer.observe(bar));
  }
};

// ====================
// Receipt Download
// ====================
const ReceiptDownload = {
  init() {
    const downloadBtn = document.getElementById('downloadReceipt');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
      alert('PDF download would be triggered here. For production, integrate a PDF generation library.');
    });
  }
};

// ====================
// Initialize
// ====================
document.addEventListener('DOMContentLoaded', () => {
  LanguageManager.init();
  MobileMenu.init();
  CounterAnimation.init();
  DonationForm.init();
  ModalHandler.init();
  ProjectsFilter.init();
  ContactForm.init();
  ProgressBars.init();
  ReceiptDownload.init();
});

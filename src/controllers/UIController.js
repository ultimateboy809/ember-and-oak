export class UIController {
  constructor() {
    this.cursorDot = document.getElementById('cursor-dot');
    this.cursorRing = document.getElementById('cursor-ring');
    this.cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.menuData = {
      espresso: [
        {
          name: 'The Ember Double',
          price: '$4.50',
          desc: 'Double shot extracted at 9 bars over oak-filtered spring water. Clean, dense crema.',
          tags: ['House Blend', 'Double Ristretto']
        },
        {
          name: 'Cortado Velvet',
          price: '$5.25',
          desc: '1:1 ratio with steamed micro-foam oat milk in a tempered glass glass.',
          tags: ['Oat Milk', 'Warm Praline']
        },
        {
          name: 'Oat Flat White',
          price: '$5.75',
          desc: 'Silky micro-foam poured with two ristretto pulls for rich body and gentle sweetness.',
          tags: ['Guest Favorite', 'Single Origin']
        },
        {
          name: 'Macchiato Rustico',
          price: '$4.75',
          desc: 'Stained with a single cloud of warm crema foam. Intense, unhurried, pure.',
          tags: ['Short Pour', 'Smoked Cedar']
        }
      ],
      pourover: [
        {
          name: 'Huila Pink Bourbon',
          price: '$7.50',
          desc: '1,920 MASL, anaerobic oak barrel ferment. Radiant acidity with deep cacao notes.',
          tags: ['Colombia', 'Micro-Lot', 'Anaerobic']
        },
        {
          name: 'Yirgacheffe Reserve',
          price: '$8.00',
          desc: 'Heirloom varietals naturally sun-dried on raised African beds. Effervescent florals.',
          tags: ['Ethiopia', 'Natural', 'Jasmine']
        },
        {
          name: 'Panama Geisha Lot #12',
          price: '$12.00',
          desc: 'Exceptional high-elevation harvest. Silky tea-like delicacy with elderflower fragrance.',
          tags: ['Rare Lot', 'Washed', 'Elderflower']
        },
        {
          name: 'Nariño Washed Caturra',
          price: '$6.50',
          desc: 'Crisp green apple brightness tempered by panela sugar finish. Hand-filtered through paper.',
          tags: ['Colombia', 'Direct Trade']
        }
      ],
      seasonal: [
        {
          name: 'Smoked Maple Latte',
          price: '$6.75',
          desc: 'Pure Vermont maple syrup cold-smoked over seasoned white oak chips with fresh espresso.',
          tags: ['House Specialty', 'Winter Warmth']
        },
        {
          name: 'Cardamom Cold Foam Brew',
          price: '$6.50',
          desc: '18-hour cold water extraction crowned with velvety freshly crushed cardamom cream.',
          tags: ['Cold Extract', 'Spiced']
        },
        {
          name: 'Spiced Cascara Tonic',
          price: '$6.00',
          desc: 'Sun-dried coffee cherry infusion, botanical tonic, blood orange twist, fresh rosemary.',
          tags: ['Refreshing', 'Low Caffeine']
        },
        {
          name: 'Toasted Hazelnut Affogato',
          price: '$7.00',
          desc: 'House-churned fior di latte gelato drowned in a scorching double ristretto pull.',
          tags: ['Dessert Pour', 'Artisanal Gelato']
        }
      ],
      pastries: [
        {
          name: 'Swedish Cardamom Bun',
          price: '$5.00',
          desc: 'Twisted slow-ferment sourdough brioche with freshly crushed green cardamom and pearl sugar.',
          tags: ['Baked Daily', 'Organic']
        },
        {
          name: 'Brown Butter Financier',
          price: '$4.25',
          desc: 'Almond flour pastry browned to hazelnut aroma, touched with hand-harvested sea salt.',
          tags: ['Cultured Butter', 'Gluten Conscious']
        },
        {
          name: 'Valrhona Dark Chocolate Croissant',
          price: '$5.50',
          desc: 'Laminated French butter pastry folded around dual batons of 70% bittersweet chocolate.',
          tags: ['French Butter', 'Artisan Laminated']
        },
        {
          name: 'Sourdough Toast & Whipped Goat Butter',
          price: '$6.50',
          desc: 'Thick slice of 36-hour heritage grain country loaf with wildflower smoked honey.',
          tags: ['Local Farmstead', 'Smoked Honey']
        }
      ]
    };

    this.initCursor();
    this.initMenu();
    this.initRoastMeter();
    this.initNewsletter();
  }

  /* ------------------------------------------------------------------------
     PRELOADER ANIMATION
     ------------------------------------------------------------------------ */
  simulatePreload(onComplete) {
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloader-bar');
    const counter = document.getElementById('preloader-counter');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 14) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        if (bar) bar.style.width = '100%';
        if (counter) counter.textContent = '100%';

        setTimeout(() => {
          if (preloader) {
            preloader.classList.add('fade-out');
          }
          if (onComplete) onComplete();
        }, 400);
      } else {
        if (bar) bar.style.width = `${progress}%`;
        if (counter) counter.textContent = `${progress}%`;
      }
    }, 45);
  }

  /* ------------------------------------------------------------------------
     CUSTOM CURSOR
     ------------------------------------------------------------------------ */
  initCursor() {
    if (!this.cursorDot || !this.cursorRing) return;

    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
      this.cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });

    // Smooth lerp for outer ring
    const renderCursor = () => {
      this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.18;
      this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.18;
      this.cursorRing.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements
    const interactiveElements = 'a, button, input, .menu-item-card, .roast-segment';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* ------------------------------------------------------------------------
     MENU CATEGORIES & GRID
     ------------------------------------------------------------------------ */
  initMenu() {
    const grid = document.getElementById('menu-grid');
    const tabs = document.querySelectorAll('.menu-tab');
    if (!grid || tabs.length === 0) return;

    // Render initial category
    this.renderMenuItems('espresso');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const category = tab.dataset.category;
        this.renderMenuItems(category);
      });
    });
  }

  renderMenuItems(category) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    const items = this.menuData[category] || [];

    // Smooth transition
    grid.style.opacity = '0';
    setTimeout(() => {
      grid.innerHTML = items.map((item) => `
        <article class="menu-item-card" tabindex="0">
          <div class="menu-item-top">
            <h3 class="menu-item-name">${item.name}</h3>
            <span class="menu-item-price">${item.price}</span>
          </div>
          <p class="menu-item-desc">${item.desc}</p>
          <div class="menu-item-tags">
            ${item.tags.map((t) => `<span class="tag-badge">${t}</span>`).join('')}
          </div>
        </article>
      `).join('');
      grid.style.opacity = '1';
    }, 180);
  }

  /* ------------------------------------------------------------------------
     ROAST LEVEL METER
     ------------------------------------------------------------------------ */
  initRoastMeter() {
    const segments = document.querySelectorAll('.roast-segment');
    segments.forEach((seg) => {
      seg.addEventListener('click', () => {
        const level = seg.dataset.level;
        this.animateRoastLevel(level);
      });
    });
  }

  animateRoastLevel(level) {
    const segments = document.querySelectorAll('.roast-segment');
    const fillBar = document.getElementById('roast-fill-bar');
    const roastLabel = document.getElementById('roast-label');

    segments.forEach((s) => s.classList.remove('active'));

    const activeSeg = document.querySelector(`.roast-segment[data-level="${level}"]`);
    if (activeSeg) activeSeg.classList.add('active');

    if (!fillBar || !roastLabel) return;

    if (level === 'light') {
      fillBar.style.width = '20%';
      roastLabel.textContent = 'Light-Cinnamon (Bright & Floral)';
    } else if (level === 'medium') {
      fillBar.style.width = '55%';
      roastLabel.textContent = 'Medium-City (Craft Oak Roast)';
    } else if (level === 'dark') {
      fillBar.style.width = '95%';
      roastLabel.textContent = 'Dark-French (Smoky & Velvety)';
    }
  }

  /* ------------------------------------------------------------------------
     NEWSLETTER FORM & SUBMISSION MICRO-ANIMATION
     ------------------------------------------------------------------------ */
  initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const input = document.getElementById('newsletter-email');
    const btn = document.getElementById('btn-submit');
    const feedback = document.getElementById('form-feedback');

    if (!form || !btn || !input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();

      // Basic email regex validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailPattern.test(email)) {
        if (feedback) {
          feedback.textContent = 'Please provide a valid email address.';
          feedback.className = 'form-feedback error';
        }
        input.focus();
        return;
      }

      // Start submission micro-animation
      btn.disabled = true;
      const originalText = btn.innerHTML;
      btn.innerHTML = `
        <svg class="submit-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10"/>
        </svg>
        <span>Brewing Dispatch...</span>
      `;

      setTimeout(() => {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>Subscribed</span>
        `;
        btn.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';

        if (feedback) {
          feedback.textContent = 'Welcome to the Hearth. First batch note arrives on Friday morning.';
          feedback.className = 'form-feedback success';
        }
        input.value = '';
      }, 1100);
    });
  }
}

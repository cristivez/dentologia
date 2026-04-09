document.addEventListener('DOMContentLoaded', function () {
  // --- Header hide/show on scroll ---
  var header = document.getElementById('header');
  var lastScrollY = 0;

  if (header) {
    window.addEventListener('scroll', function () {
      var currentY = window.pageYOffset;
      if (currentY > lastScrollY && currentY > 80) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollY = currentY;
    }, { passive: true });
  }

  // --- Price tabs ---
  var tabs = document.querySelectorAll('.price-tab');
  var panels = document.querySelectorAll('.price-category');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');

      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      panels.forEach(function (p) {
        p.classList.remove('active');
      });
      var panel = document.getElementById('price-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Price search ---
  var priceSearch = document.getElementById('priceSearch');
  var searchResults = document.getElementById('priceSearchResults');
  var searchTable = document.getElementById('priceSearchTable');
  var noResults = document.getElementById('priceNoResults');
  var tabsWrap = document.getElementById('priceTabsWrap');

  if (priceSearch && searchResults && tabsWrap) {
    // Build index of all prices from all category tables
    var priceIndex = [];
    var categoryNames = {
      'price-general': 'Consultații',
      'price-profilaxie': 'Profilaxie',
      'price-odontoterapie': 'Odontoterapie',
      'price-endodontie': 'Endodontie',
      'price-chirurgie': 'Chirurgie',
      'price-ortodontie': 'Ortodonție',
      'price-protetica': 'Protetică'
    };

    document.querySelectorAll('.price-category').forEach(function (cat) {
      var catName = categoryNames[cat.id] || '';
      cat.querySelectorAll('.price-table tr').forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          priceIndex.push({
            service: cells[0].textContent.trim(),
            price: cells[1].textContent.trim(),
            category: catName
          });
        }
      });
    });

    // Normalize Romanian diacritics for search (works with or without diacritics)
    function normalize(str) {
      return str.toLowerCase()
        .replace(/[ăâã]/g, 'a')
        .replace(/[î]/g, 'i')
        .replace(/[șş]/g, 's')
        .replace(/[țţ]/g, 't');
    }

    // Diacritic-aware highlight: walks through the original string
    // and marks the substring that matches the normalized query
    function highlightMatch(original, normalizedQuery) {
      var norm = normalize(original);
      var idx = norm.indexOf(normalizedQuery);
      if (idx === -1) return original;
      var before = original.substring(0, idx);
      var match = original.substring(idx, idx + normalizedQuery.length);
      var after = original.substring(idx + normalizedQuery.length);
      return before + '<mark>' + match + '</mark>' + after;
    }

    var debounceTimer;
    priceSearch.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var query = priceSearch.value.trim().toLowerCase();

        if (query.length < 2) {
          searchResults.classList.remove('active');
          tabsWrap.style.display = '';
          noResults.style.display = 'none';
          return;
        }

        var normalizedQuery = normalize(query);
        var matches = priceIndex.filter(function (item) {
          return normalize(item.service).indexOf(normalizedQuery) !== -1 ||
                 normalize(item.category).indexOf(normalizedQuery) !== -1;
        });

        // Build results table
        searchTable.innerHTML = '';
        if (matches.length > 0) {
          var currentCat = '';
          matches.forEach(function (item) {
            if (item.category !== currentCat) {
              currentCat = item.category;
              var catRow = document.createElement('tr');
              catRow.innerHTML = '<td colspan="2" class="price-result-category">' + currentCat + '</td>';
              searchTable.appendChild(catRow);
            }
            var row = document.createElement('tr');
            // Highlight matching text (diacritic-aware)
            var highlighted = highlightMatch(item.service, normalizedQuery);
            row.innerHTML = '<td>' + highlighted + '</td><td>' + item.price + '</td>';
            searchTable.appendChild(row);
          });
          noResults.style.display = 'none';
        } else {
          noResults.style.display = 'block';
        }

        searchResults.classList.add('active');
        tabsWrap.style.display = 'none';
      }, 200);
    });
  }

  // --- Scroll fade-in animations ---
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    fadeEls.forEach(function (el) { observer.observe(el); });
  }

  // --- Active nav link highlight on scroll ---
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset + 100;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  // --- Reviews Carousel (native scroll-snap) ---
  var carousel = document.getElementById('reviewsCarousel');
  var progressFill = document.getElementById('carouselProgress');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');

  if (carousel && progressFill) {
    // Update progress bar on scroll
    function updateProgress() {
      var maxScroll = carousel.scrollWidth - carousel.clientWidth;
      var pct = maxScroll > 0 ? (carousel.scrollLeft / maxScroll) * 100 : 0;
      progressFill.style.width = Math.max(10, pct) + '%';
    }

    carousel.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Arrow buttons
    function getScrollAmount() {
      var card = carousel.querySelector('.review-card');
      return card ? card.offsetWidth + 20 : 300; // card width + gap
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        resetAutoScroll();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        resetAutoScroll();
      });
    }

    // Desktop drag-to-scroll
    var isDragging = false;
    var startX = 0;
    var scrollStart = 0;

    carousel.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX;
      scrollStart = carousel.scrollLeft;
      carousel.style.scrollBehavior = 'auto';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      carousel.scrollLeft = scrollStart - (e.pageX - startX);
    });

    document.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        carousel.style.scrollBehavior = 'smooth';
      }
    });

    // Auto-scroll
    var autoInterval;
    var isPaused = false;

    function autoScroll() {
      if (isPaused) return;
      var maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - 5) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }

    function startAutoScroll() {
      autoInterval = setInterval(autoScroll, 5000);
    }

    function resetAutoScroll() {
      clearInterval(autoInterval);
      startAutoScroll();
    }

    // Pause on hover / touch
    carousel.addEventListener('mouseenter', function () { isPaused = true; });
    carousel.addEventListener('mouseleave', function () { isPaused = false; });
    carousel.addEventListener('touchstart', function () { isPaused = true; }, { passive: true });
    carousel.addEventListener('touchend', function () {
      setTimeout(function () { isPaused = false; }, 3000);
    }, { passive: true });

    startAutoScroll();
  }

  // --- FAQ accordion (close others when opening one) ---
  var faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (item.open) {
          faqItems.forEach(function (other) {
            if (other !== item && other.open) {
              other.open = false;
            }
          });
        }
      });
    });
  }

  // --- Floating contact button ---
  var floatContact = document.getElementById('floatContact');
  var floatBtn = document.getElementById('floatContactBtn');

  if (floatContact && floatBtn) {
    floatBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      floatContact.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
      if (!floatContact.contains(e.target)) {
        floatContact.classList.remove('active');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        floatContact.classList.remove('active');
      }
    });
  }
});

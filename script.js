document.addEventListener('DOMContentLoaded', function () {
  // --- Mobile menu ---
  var menuBtn = document.getElementById('mobileMenuBtn');
  var navMenu = document.getElementById('navMenu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('active');
      menuBtn.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

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
      'price-general': 'Consultatii',
      'price-profilaxie': 'Profilaxie',
      'price-odontoterapie': 'Odontoterapie',
      'price-endodontie': 'Endodontie',
      'price-chirurgie': 'Chirurgie',
      'price-ortodontie': 'Ortodontie',
      'price-protetica': 'Protetica'
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

        // Normalize Romanian characters for search
        var normalize = function (str) {
          return str.toLowerCase()
            .replace(/[ăâ]/g, 'a')
            .replace(/[îi]/g, 'i')
            .replace(/[ș]/g, 's')
            .replace(/[ț]/g, 't');
        };

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
            // Highlight matching text
            var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            var highlighted = item.service.replace(regex, '<mark>$1</mark>');
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
});

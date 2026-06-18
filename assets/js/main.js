(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Customer journey progress indicator.
   */
  const scrollProgress = document.querySelector('[data-scroll-progress]');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('load', updateScrollProgress);
  document.addEventListener('scroll', updateScrollProgress, { passive: true });

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Order form WhatsApp action.
   */
  const orderForm = document.querySelector('[data-order-form]');

  if (orderForm) {
    const businessWhatsAppNumber = '9779855061374';
    const serviceQueryMap = {
      rent: 'Rent dead body freezer',
      rental: 'Rent dead body freezer',
      purchase: 'Purchase dead body freezer',
      buy: 'Purchase dead body freezer',
      urgent: 'Urgent availability check',
      delivery: 'Delivery coordination'
    };
    const servicePrices = {
      'Rent dead body freezer': 'NPR 5,000 per day',
      'Purchase dead body freezer': 'NPR 375,000',
      'Urgent availability check': 'Price to be confirmed',
      'Delivery coordination': 'Price to be confirmed'
    };
    const serviceSelect = orderForm.querySelector('[name="product"]');
    const urgencySelect = orderForm.querySelector('[name="urgency"]');
    const rentalStartInput = orderForm.querySelector('[name="rental_start"]');
    const rentalDetailFields = orderForm.querySelectorAll('[data-rental-detail]');
    const errorMessage = orderForm.querySelector('.error-message');
    const sentMessage = orderForm.querySelector('.sent-message');

    const isRentalService = () => serviceSelect && serviceSelect.value === 'Rent dead body freezer';

    const getTodayDateValue = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const buildGoogleMapsUrl = (location) => {
      const cleanLocation = (location || '').trim();

      if (cleanLocation === '') {
        return 'https://www.google.com/maps';
      }

      if (/^https?:\/\//i.test(cleanLocation)) {
        return cleanLocation;
      }

      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanLocation)}`;
    };

    const updateRentalDetails = () => {
      const showRentalDetails = isRentalService();

      rentalDetailFields.forEach((fieldWrap) => {
        fieldWrap.hidden = !showRentalDetails;

        fieldWrap.querySelectorAll('input, select, textarea').forEach((field) => {
          field.disabled = !showRentalDetails;

          if (!showRentalDetails) {
            field.value = '';
          }
        });
      });

      if (showRentalDetails) {
        if (urgencySelect) {
          urgencySelect.value = 'Urgent - today';
        }

        if (rentalStartInput) {
          rentalStartInput.value = getTodayDateValue();
        }
      }
    };

    const getFieldValue = (name) => {
      const field = orderForm.querySelector(`[name="${name}"]`);
      return field ? field.value.trim() : '';
    };

    const getSelectedText = (name) => {
      const field = orderForm.querySelector(`[name="${name}"]`);
      if (!field || field.selectedIndex < 0) return '';
      return field.options[field.selectedIndex].text.trim();
    };

    const displayOrderMessage = (type, message) => {
      if (!errorMessage || !sentMessage) return;
      errorMessage.classList.remove('d-block');
      sentMessage.classList.remove('d-block');

      const messageTarget = type === 'error' ? errorMessage : sentMessage;
      messageTarget.textContent = message;
      messageTarget.classList.add('d-block');
    };

    const validateOrder = () => {
      if (!orderForm.reportValidity()) {
        return false;
      }
      return true;
    };

    const buildOrderText = () => {
      const service = getFieldValue('product');
      const serviceText = getSelectedText('product') || service || 'Not selected';
      const price = servicePrices[service] || 'To be confirmed';
      const rentalStart = getFieldValue('rental_start');
      const rentalDays = getFieldValue('rental_days');
      const location = getFieldValue('location');
      const email = getFieldValue('email');
      const extraDetails = getFieldValue('message');
      const serviceDetails = [
        'SERVICE DETAILS',
        `Service        : ${serviceText}`,
        `Expected price : ${price}`
      ];
      const customerDetails = [
        'CUSTOMER DETAILS',
        `Name           : ${getFieldValue('name')}`,
        `Phone/WhatsApp : ${getFieldValue('phone')}`
      ];
      const deliveryDetails = [
        'DELIVERY DETAILS',
        `Location       : ${location} - ${buildGoogleMapsUrl(location)}`,
        `Urgency        : ${getFieldValue('urgency')}`
      ];

      if (email !== '') {
        customerDetails.push(`Email          : ${email}`);
      }

      if (service === 'Rent dead body freezer') {
        if (rentalStart !== '') {
          deliveryDetails.push(`Rental start  : ${rentalStart}`);
        }

        if (rentalDays !== '') {
          deliveryDetails.push(`Rental days   : ${rentalDays}`);
        }
      }

      const orderDetails = [
        'NEW FREEZER ORDER REQUEST',
        '',
        ...serviceDetails,
        '',
        ...customerDetails,
        '',
        ...deliveryDetails
      ];

      if (extraDetails !== '') {
        orderDetails.push('', 'EXTRA DETAILS', extraDetails);
      }

      return orderDetails.join('\n');
    };

    const applyServiceFromUrl = () => {
      if (!serviceSelect) return;
      const params = new URLSearchParams(window.location.search);
      const requestedService = params.get('service') || params.get('product');

      if (!requestedService) return;

      const normalizedService = requestedService.toLowerCase();
      const serviceValue = serviceQueryMap[normalizedService] || requestedService;
      const matchingOption = Array.from(serviceSelect.options).find((option) => {
        return option.value === serviceValue || option.value.toLowerCase() === serviceValue.toLowerCase();
      });

      if (matchingOption) {
        serviceSelect.value = matchingOption.value;
      }
    };

    const openWhatsAppOrder = () => {
      const orderText = encodeURIComponent(buildOrderText());
      const url = `https://wa.me/${businessWhatsAppNumber}?text=${orderText}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      displayOrderMessage('success', 'WhatsApp opened with your order details. Please press send in WhatsApp to complete the request.');
    };

    document.querySelectorAll('[data-service-choice]').forEach((choiceLink) => {
      choiceLink.addEventListener('click', () => {
        const service = choiceLink.getAttribute('data-service-choice');
        if (serviceSelect && service) {
          serviceSelect.value = service;
          updateRentalDetails();
        }
      });
    });

    if (serviceSelect) {
      serviceSelect.addEventListener('change', updateRentalDetails);
    }

    applyServiceFromUrl();
    updateRentalDetails();

    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (validateOrder()) {
        openWhatsAppOrder();
      }
    });
  }

})();

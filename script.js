(function(){
  "use strict";

  /* ---------- Dynamic Year in Footer ---------- */
  var yearEl = document.getElementById('footYear');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  /* ---------- Header scroll shadow ---------- */
  var head = document.getElementById('siteHead');
  function updateHead(){
    if(window.scrollY > 10){ head.classList.add('scrolled'); }
    else{ head.classList.remove('scrolled'); }
  }
  updateHead();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  burger.addEventListener('click', function(){
    var open = head.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.querySelector('.ic-menu').style.display = open ? 'none' : 'block';
    burger.querySelector('.ic-x').style.display = open ? 'block' : 'none';
  });
  document.querySelectorAll('.main-nav a').forEach(function(a){
    a.addEventListener('click', function(){
      head.classList.remove('nav-open');
      burger.setAttribute('aria-expanded','false');
      burger.querySelector('.ic-menu').style.display = 'block';
      burger.querySelector('.ic-x').style.display = 'none';
    });
  });

  /* ---------- Reading progress bar ---------- */
  var bar = document.getElementById('scrollbar');
  var ticking = false;
  function updateBar(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) : 0;
    bar.style.transform = 'scaleX(' + p + ')';
    updateHead();
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ window.requestAnimationFrame(updateBar); ticking = true; }
  }, {passive:true});

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Stats counter animation ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var countStarted = new WeakSet();
  if('IntersectionObserver' in window && counters.length){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && !countStarted.has(e.target)){
          countStarted.add(e.target);
          var el = e.target;
          var target = parseInt(el.getAttribute('data-count'),10);
          el.textContent = "0"; // Sets to 0 visually right before animating
          var duration = 1600;
          var start = null;
          function step(ts){
            if(!start) start = ts;
            var elapsed = ts - start;
            var progress = Math.min(elapsed/duration, 1);
            var eased = 1 - Math.pow(1-progress, 3);
            el.textContent = Math.floor(eased * target);
            if(progress < 1){ requestAnimationFrame(step); }
            else { el.textContent = target; }
          }
          requestAnimationFrame(step);
        }
      });
    }, {threshold:.4});
    counters.forEach(function(c){ cio.observe(c); });
  }

  /* ---------- Floating call button ---------- */
  var floatBtn = document.getElementById('floatCall');
  var heroCta = document.getElementById('heroCta');
  var contactSec = document.getElementById('contact');

  if (floatBtn) {
    var heroGone = false;
    var contactVisible = false;

    function isMobile() {
      return window.matchMedia('(max-width: 768px)').matches;
    }

    function updateFloatBtn() {
      // Desktop: show after hero, keep visible even on form
      if (!isMobile()) {
        if (heroGone) floatBtn.classList.add('show');
        else floatBtn.classList.remove('show');
        return;
      }

      // Mobile: show after hero, but hide while form/contact is on screen
      if (heroGone && !contactVisible) floatBtn.classList.add('show');
      else floatBtn.classList.remove('show');
    }

    if ('IntersectionObserver' in window) {
      if (heroCta) {
        var heroObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            heroGone = !e.isIntersecting;
            updateFloatBtn();
          });
        }, { threshold: 0 });
        heroObs.observe(heroCta);
      } else {
        heroGone = true;
        updateFloatBtn();
      }

      if (contactSec) {
        var contactObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            contactVisible = e.isIntersecting;
            updateFloatBtn();
          });
        }, { threshold: 0.15 });
        contactObs.observe(contactSec);
      }
    } else {
      floatBtn.classList.add('show');
    }

    window.addEventListener('resize', updateFloatBtn);
  }

  /* ---------- FAQ: close others on open (optional single-open behavior) ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    item.addEventListener('toggle', function(){
      if(item.open){
        faqItems.forEach(function(other){
          if(other !== item && other.open){ other.open = false; }
        });
      }
    });
  });

 

    /* ---------- Lead form ---------- */
  var form = document.getElementById('leadForm');
  var phone = document.getElementById('fPhone');

  function formatPhone(v){
    var d = (v || '').replace(/\D/g,'').slice(0,10);
    if(!d.length) return '';
    if(d.length < 4) return '(' + d;
    if(d.length < 7) return '(' + d.slice(0,3) + ') ' + d.slice(3);
    return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
  }

  function fieldWrap(el){
    return el ? el.closest('.field') : null;
  }
  function setInvalid(el){
    var w = fieldWrap(el);
    if(w) w.classList.add('invalid');
  }
  function clearInvalid(el){
    var w = fieldWrap(el);
    if(w) w.classList.remove('invalid');
  }

  if(phone){
    phone.addEventListener('input', function(){
      phone.value = formatPhone(phone.value);
      clearInvalid(phone);
    });
  }

  var nameEl = document.getElementById('fName');
  var emailEl = document.getElementById('fEmail');
  var addressEl = document.getElementById('fAddress');

  function isNameOk(){ return !!(nameEl && nameEl.value.trim().length >= 2); }
  function isPhoneOk(){ return !!(phone && phone.value.replace(/\D/g,'').length === 10); }
  function isEmailOk(){ return !!(emailEl && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailEl.value.trim())); }
  function isAddressOk(){ return !!(addressEl && addressEl.value.trim().length >= 5); }

  [nameEl, phone, emailEl, addressEl].forEach(function(el){
    if(!el) return;
    el.addEventListener('input', function(){ clearInvalid(el); });
    el.addEventListener('change', function(){ clearInvalid(el); });
  });

  if(form){
    form.addEventListener('submit', function(e){
      // Bot honeypot: if filled, block quietly
      var trap = document.getElementById('fCompany');
      if(trap && trap.value.trim() !== ''){
        e.preventDefault();
        return;
      }

      var firstBad = null;

      // Required only
      if(!isNameOk()){ setInvalid(nameEl); if(!firstBad) firstBad = nameEl; }
      else clearInvalid(nameEl);

      if(!isPhoneOk()){ setInvalid(phone); if(!firstBad) firstBad = phone; }
      else clearInvalid(phone);

      if(!isEmailOk()){ setInvalid(emailEl); if(!firstBad) firstBad = emailEl; }
      else clearInvalid(emailEl);

      if(!isAddressOk()){ setInvalid(addressEl); if(!firstBad) firstBad = addressEl; }
      else clearInvalid(addressEl);

      // Optional fields are ignored on purpose:
      // fPtype, fJtype, fMsg can be empty or filled

      if(firstBad){
        e.preventDefault(); // only block when required fields fail
        firstBad.focus();
        try{ firstBad.scrollIntoView({behavior:'smooth', block:'center'}); }
        catch(err){ firstBad.scrollIntoView(); }
        return;
      }

      // IMPORTANT:
      // Do not call e.preventDefault() here
      // Do not show local success card here
      // Browser will submit to form action URL
    });
  }


    /* ---------- Reviews Slider ---------- */
  var track = document.getElementById('revTrack');
  var btnPrev = document.getElementById('revPrev');
  var btnNext = document.getElementById('revNext');
  
  if(track && btnPrev && btnNext){
    var autoPlayInterval;

    function getScrollAmount() {
      // Scroll by exactly one card width + the gap
      var firstCard = track.querySelector('.rev');
      return firstCard ? firstCard.offsetWidth + 20 : 300; 
    }

    function scrollNext() {
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        // If at the end, rewind smoothly to the start
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }

    function scrollPrev() {
      if (track.scrollLeft <= 10) {
        // If at the start, jump to the end
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      }
    }

    // Auto-advance every 4 seconds
    function startAutoPlay() {
      autoPlayInterval = setInterval(scrollNext, 4000);
    }
    
    // Stop if user interacts
    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    btnNext.addEventListener('click', function(){ stopAutoPlay(); scrollNext(); });
    btnPrev.addEventListener('click', function(){ stopAutoPlay(); scrollPrev(); });
    
    // Pause if they hover/touch the reviews to read them
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('touchstart', stopAutoPlay, {passive: true});

    // Start it up
    startAutoPlay();
  }


})();

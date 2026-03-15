/* ============================================================
   NOTHING WILL COME OF NOTHING — script.js
   Handles: audio, Formspark form submission, subtle FX
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     AUDIO
  ---------------------------------------------------------- */
  const audio       = document.getElementById('ambient-audio');
  const audioToggle = document.getElementById('audio-toggle');
  const iconOn      = document.getElementById('audio-icon-on');
  const iconOff     = document.getElementById('audio-icon-off');

  let audioEnabled = false;

  // Browsers block autoplay until a user gesture — we wait for
  // first interaction anywhere on the page, then try to play.
  function tryAutoplay () {
    if (audioEnabled) return;
    audio.volume = 0;
    audio.play().then(() => {
      audioEnabled = true;
      fadeInAudio();
      updateAudioUI();
      document.removeEventListener('click',      tryAutoplay);
      document.removeEventListener('touchstart', tryAutoplay);
      document.removeEventListener('keydown',    tryAutoplay);
    }).catch(() => {
      // Autoplay still blocked — that's fine, user can toggle manually
    });
  }

  function fadeInAudio () {
    const target   = 0.38;
    const duration = 6000; // ms
    const steps    = 60;
    const increment = target / steps;
    let   current  = 0;
    const interval = setInterval(() => {
      current = Math.min(current + increment, target);
      audio.volume = current;
      if (current >= target) clearInterval(interval);
    }, duration / steps);
  }

  function updateAudioUI () {
    if (audioEnabled && !audio.paused) {
      iconOn.style.display  = '';
      iconOff.style.display = 'none';
    } else {
      iconOn.style.display  = 'none';
      iconOff.style.display = '';
    }
  }

  audioToggle.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        audioEnabled = true;
        if (audio.volume === 0) audio.volume = 0.38;
        updateAudioUI();
      }).catch(console.warn);
    } else {
      audio.pause();
      audioEnabled = false;
      updateAudioUI();
    }
  });

  // Trigger autoplay on first interaction
  document.addEventListener('click',      tryAutoplay, { once: false });
  document.addEventListener('touchstart', tryAutoplay, { once: false });
  document.addEventListener('keydown',    tryAutoplay, { once: false });

  /* ----------------------------------------------------------
     FORMSPARK FORM SUBMISSION (AJAX)
     Formspark supports fetch-based submission via JSON.
     Replace YOUR_FORMSPARK_ID in index.html with your real ID.
  ---------------------------------------------------------- */
  const form        = document.getElementById('signup-form');
  const msgEl       = document.getElementById('form-message');
  const signupBlock = form ? form.closest('.signup-block') : null;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn  = form.querySelector('.submit-btn');
      const email      = emailInput ? emailInput.value.trim() : '';

      if (!email) return;

      // Loading state
      submitBtn.disabled  = true;
      submitBtn.style.opacity = '0.5';
      showMessage('', false);

      try {
        const formAction = form.getAttribute('action');

        // Validate that the placeholder has been replaced
        if (formAction.includes('YOUR_FORMSPARK_ID')) {
          // Dev mode — simulate success so you can test the UI
          await fakeDelay(900);
          onSuccess();
          return;
        }

        const res = await fetch(formAction, {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept':        'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          onSuccess();
        } else {
          const data = await res.json().catch(() => ({}));
          onError(data.error || 'Something went wrong. Please try again.');
        }
      } catch (err) {
        onError('Could not connect. Please try again.');
      } finally {
        submitBtn.disabled      = false;
        submitBtn.style.opacity = '';
      }
    });
  }

  function onSuccess () {
    if (signupBlock) signupBlock.classList.add('submitted');
    showMessage('You will be the first to know.', false);

    // Subtly dim the form after success
    const inputRow = form.querySelector('.input-row');
    if (inputRow) {
      inputRow.style.transition = 'opacity 1s ease';
      inputRow.style.opacity    = '0.3';
      inputRow.style.pointerEvents = 'none';
    }
  }

  function onError (message) {
    showMessage(message, true);
  }

  function showMessage (text, isError) {
    msgEl.textContent = text;
    msgEl.classList.toggle('error',   isError);
    msgEl.classList.toggle('visible', text.length > 0);
  }

  function fakeDelay (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ----------------------------------------------------------
     SUBTLE CURSOR GLOW (desktop only)
     A faint light that follows the cursor — adds to atmosphere
  ---------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.setAttribute('aria-hidden', 'true');
    Object.assign(glow.style, {
      position:     'fixed',
      width:        '320px',
      height:       '320px',
      borderRadius: '50%',
      pointerEvents:'none',
      zIndex:       '10',
      background:   'radial-gradient(circle, rgba(212,201,176,0.028) 0%, transparent 70%)',
      transform:    'translate(-50%, -50%)',
      transition:   'opacity 0.6s ease',
      opacity:      '0',
      top:          '0',
      left:         '0',
    });
    document.body.appendChild(glow);

    let raf;
    document.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.left    = e.clientX + 'px';
        glow.style.top     = e.clientY + 'px';
        glow.style.opacity = '1';
      });
    });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
  }

  /* ----------------------------------------------------------
     TITLE LETTER FLICKER
     After the title finishes revealing, randomly flicker
     individual characters very subtly — like dying candlelight.
  ---------------------------------------------------------- */
  function initTitleFlicker () {
    const titleEl = document.querySelector('.title-main');
    if (!titleEl) return;

    // Wrap each char in a span
    const words = titleEl.querySelectorAll('.word');
    words.forEach(wordEl => {
      const text = wordEl.textContent;
      wordEl.innerHTML = text.split('').map(ch =>
        `<span class="flicker-char">${ch}</span>`
      ).join('');
    });

    // Randomly flicker one character at a time
    function flicker () {
      const chars = titleEl.querySelectorAll('.flicker-char');
      if (!chars.length) return;

      const idx  = Math.floor(Math.random() * chars.length);
      const char = chars[idx];

      const originalOpacity = '1';
      char.style.transition = 'opacity 0.05s';
      char.style.opacity    = String(0.3 + Math.random() * 0.4);

      setTimeout(() => {
        char.style.opacity = originalOpacity;
      }, 60 + Math.random() * 80);

      // Next flicker at irregular interval
      setTimeout(flicker, 2500 + Math.random() * 5000);
    }

    // Start flickering after reveal animation completes
    setTimeout(flicker, 6500);
  }

  // Wait for fonts + initial animations
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initTitleFlicker, 100);
  });

  /* ----------------------------------------------------------
     VISIBILITY CHANGE — pause audio when tab is hidden
  ---------------------------------------------------------- */
  document.addEventListener('visibilitychange', () => {
    if (!audio) return;
    if (document.hidden) {
      audio.pause();
    } else if (audioEnabled) {
      audio.play().catch(() => {});
    }
  });

})();

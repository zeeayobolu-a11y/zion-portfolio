/* ================================================================
   MAIN.JS , Ayobolu Zion Single-Page Portfolio
   All JavaScript for the entire site lives here.
   No libraries. Pure vanilla JS throughout.

   TABLE OF CONTENTS:
   1.  Navbar: scroll background + active link tracking
   2.  Mobile nav toggle
   3.  Hero name: letter split animation
   4.  Hero name: periodic glitch effect
   5.  Typewriter cycling effect
   6.  Background ring SVG injection
   7.  Skills strip: duplicate for seamless loop
   8.  Transition spacers: activate on scroll
   9.  Section reveal: Intersection Observer with stagger
   10. Project rows: data + staggered render
   11. Skill bars: animate on scroll
   12. Academic planner: add, complete, delete, filter
   13. Contact form: validation
   14. Audio player
================================================================ */


/* ================================================================
   1. NAVBAR , SCROLL BACKGROUND + ACTIVE LINK TRACKING
   Two jobs:
   a) Add .scrolled when user scrolls past 50px (CSS adds glass bg)
   b) Highlight the nav link whose section is currently in view
      by watching which section crosses the top of the viewport
================================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

// a) Scroll background
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// b) Active link: watch each section and highlight its nav link
// IntersectionObserver fires when a section crosses the viewport centre
const sectionObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Find the nav link whose data-section matches this section's id
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'active',
            link.dataset.section === entry.target.id
          );
        });
      }
    });
  },
  // rootMargin: trigger when the section is roughly centred in the viewport
  { threshold: 0, rootMargin: '-40% 0px -55% 0px' }
);

// Observe every section that has an id matching a nav link
document.querySelectorAll('section[id]').forEach(function (sec) {
  sectionObserver.observe(sec);
});


/* ================================================================
   2. MOBILE NAV TOGGLE
   Hamburger button toggles .open on the nav list and the button.
   CSS uses .open to slide the menu into view.
================================================================ */
const navToggle = document.getElementById('navToggle');
const navList   = document.getElementById('navLinks');

navToggle.addEventListener('click', function () {
  navList.classList.toggle('open');
  navToggle.classList.toggle('open');
});

// Close menu on any link click (user navigated, no need to keep it open)
navList.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    navList.classList.remove('open');
    navToggle.classList.remove('open');
  });
});


/* ================================================================
   3. HERO NAME , LETTER SPLIT ANIMATION
   Reads "Ayobolu Zion" from the h1, wraps every character in two
   spans (outer = clip mask, inner = animated element), then injects
   them back. The double-span approach prevents the per-letter clip
   from cutting off neighbouring letters.
================================================================ */
function splitTextIntoLetters() {
  const nameEl = document.querySelector('.split-text');
  if (!nameEl) return;

  const text = nameEl.textContent;
  nameEl.innerHTML = '';
  let i = 0;

  Array.from(text).forEach(function (char) {
    if (char === ' ') {
      // Space: non-animated spacer span
      const space = document.createElement('span');
      space.classList.add('char-space');
      space.innerHTML = '&nbsp;';
      nameEl.appendChild(space);
    } else {
      // OUTER span: acts as a per-letter clip mask (overflow:hidden in CSS)
      const outer = document.createElement('span');
      outer.classList.add('char');

      // INNER span: this actually animates (translateY via CSS keyframes)
      // --i drives the stagger delay: animation-delay = 0.04s * i
      const inner = document.createElement('span');
      inner.classList.add('char-inner');
      inner.textContent = char;
      inner.style.setProperty('--i', i);

      outer.appendChild(inner);
      nameEl.appendChild(outer);
      i++;
    }
  });
}

splitTextIntoLetters();


/* ================================================================
   4. HERO NAME , PERIODIC GLITCH
   Every 6 seconds, add .glitch to the name element for 500ms.
   The CSS @keyframes glitch shifts text-shadow and clip-path to
   create a pixel-corruption flicker effect.
================================================================ */
function initGlitch() {
  const nameEl = document.querySelector('.hero-name');
  if (!nameEl) return;

  // Wait 4s after load before first glitch so the reveal finishes first
  setTimeout(function () {
    setInterval(function () {
      nameEl.classList.add('glitch');
      setTimeout(function () {
        nameEl.classList.remove('glitch');
      }, 500);
    }, 6000);
  }, 4000);
}

initGlitch();


/* ================================================================
   5. TYPEWRITER CYCLING EFFECT
   Every 2.5s, fade the word out, swap the text, fade back in.
   Uses an array and modulo arithmetic to cycle indefinitely.
================================================================ */
function initTypewriter() {
  const wordEl = document.getElementById('typewriterWord');
  if (!wordEl) return;

  // ARRAY: words to cycle through
  const words = ['websites', 'automations', 'solutions', 'digital tools', 'experiences'];
  let index = 0;

  function cycleWord() {
    // Fade out
    wordEl.style.transition = 'opacity 0.3s ease';
    wordEl.style.opacity = '0';

    setTimeout(function () {
      // Advance index, wrap back to 0 after the last item
      index = (index + 1) % words.length;
      wordEl.textContent = words[index];
      // Fade in
      wordEl.style.opacity = '1';
    }, 300);
  }

  // Start cycling after 2s, then every 2.5s
  setTimeout(function () {
    setInterval(cycleWord, 2500);
  }, 2000);
}

initTypewriter();


/* Hero ring is now inline SVG inside .hero-orbital in index.html */


/* ================================================================
   7. SKILLS STRIP , DUPLICATE FOR SEAMLESS LOOP
   Clones the skills list and appends it so the CSS scrollLeft
   animation loops without a visible gap at the halfway point.
================================================================ */
function duplicateSkillsStrip() {
  const track = document.getElementById('skillsTrack');
  if (!track) return;
  const list = track.querySelector('.skills-list');
  if (!list) return;
  const clone = list.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
}

duplicateSkillsStrip();


/* ================================================================
   8. TRANSITION SPACERS , ACTIVATE ON SCROLL
   Each .transition-spacer between sections gets .active added
   when it enters the viewport. CSS then:
   - Expands a horizontal line across the full width
   - Fades in the "About Me / Projects / ..." label
================================================================ */
function initTransitionSpacers() {
  const spacers = document.querySelectorAll('.transition-spacer');
  if (!spacers.length) return;

  const obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target); // Fire once only
        }
      });
    },
    { threshold: 0.4 }
  );

  spacers.forEach(function (s) { obs.observe(s); });
}

initTransitionSpacers();


/* ================================================================
   9. SECTION REVEAL , INTERSECTION OBSERVER
   Watches every .section-reveal element. When it enters the viewport,
   adds .revealed which triggers the CSS entry animation
   (slide-up, slide-left, slide-right, or scale-in depending on class).
================================================================ */
function initSectionReveal() {
  const revealEls = document.querySelectorAll('.section-reveal');
  if (!revealEls.length) return;

  const obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { obs.observe(el); });
}

initSectionReveal();


/* ================================================================
   10. PROJECT ROWS , DATA + STAGGERED RENDER
   Project data lives in an array of objects.
   buildProjectRow() converts one object to an HTML string.
   renderProjects() maps the array, injects all rows, then uses
   a second IntersectionObserver to stagger each row's slide-in.

   Demonstrates: arrays, functions, DOM manipulation, dynamic content.
================================================================ */

// PROJECTS ARRAY: each object is one project
const projects = [
  {
    id: 1,
    title:       'LD Global Realtors',
    category:    'Real Estate',
    description: 'Full property showcase site for a Lagos-based real estate firm. ' +
                 'Features listings, enquiry forms, and a professional brand presence.',
    url:         'https://stupendous-peony-bab76a.netlify.app/',
    image:       'images/ld-global.png',
  },
  {
    id: 2,
    title:       'Mart Build Construction',
    category:    'Construction',
    description: 'Corporate site for a Nigerian construction company. Showcases ' +
                 'services, past projects, and a direct channel for client enquiries.',
    url:         'https://clinquant-melba-bc3fef.netlify.app/',
    image:       'images/mart-build.png',
  },
  {
    id: 3,
    title:       'Miraculous Housing Expert',
    category:    'Real Estate',
    description: 'Property marketing site for a Sagamu realtor specialising in ' +
                 'residential and commercial listings across Nigeria.',
    url:         'https://comfy-yeot-dabbf2.netlify.app/',
    image:       'images/miraculous-housing.png',
  },
];

// buildProjectRow: returns one HTML string for a project row
function buildProjectRow(project, index) {
  // Pad index: 0 -> "01", 1 -> "02" etc.
  const num = String(index + 1).padStart(2, '0');

  return `
    <article
      class="project-row"
      role="article"
      tabindex="0"
      aria-label="View ${project.title}"
      onclick="window.open('${project.url}', '_blank', 'noopener,noreferrer')"
      onkeydown="if(event.key==='Enter') window.open('${project.url}','_blank','noopener,noreferrer')"
    >
      <span class="project-index">${num}</span>
      <div class="project-thumb">
        <img src="${project.image}" alt="${project.title} screenshot" loading="lazy" />
      </div>
      <div class="project-info">
        <p class="project-tag">${project.category}</p>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
      </div>
      <span class="project-arrow" aria-hidden="true">&#8599;</span>
    </article>
  `;
}

// renderProjects: injects all rows then stagger-animates them
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  // .map() transforms each project object into an HTML string
  grid.innerHTML = projects.map(buildProjectRow).join('');

  // STAGGER: watch each row and add .row-visible with an increasing delay
  const rows = grid.querySelectorAll('.project-row');

  const rowObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Get this row's position in the list for a stagger offset
          const idx = Array.from(rows).indexOf(entry.target);
          // Delay each row by 120ms more than the previous
          setTimeout(function () {
            entry.target.classList.add('row-visible');
          }, idx * 120);
          rowObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  rows.forEach(function (row) { rowObs.observe(row); });
}

renderProjects();


/* ================================================================
   11. SKILL BARS , ANIMATE ON SCROLL
   Bars start at width:0. When the table enters the viewport,
   each bar transitions to its target width (stored in --level).
   Bars stagger 120ms apart so they fill one after another.
================================================================ */
function initSkillBars() {
  const bars  = document.querySelectorAll('.skill-bar');
  const table = document.querySelector('.skills-table');
  if (!bars.length || !table) return;

  const obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          bars.forEach(function (bar, i) {
            setTimeout(function () {
              // Read --level from the element's inline style, set as width
              const level = bar.style.getPropertyValue('--level') || '0%';
              bar.style.width = level;
            }, i * 120);
          });
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  obs.observe(table);
}

initSkillBars();


/* ================================================================
   12. ACADEMIC PLANNER
   Full task management system:
   - Add tasks with a priority level
   - Mark tasks complete (custom circular checkbox)
   - Delete tasks (X button)
   - Filter: All / Active / Completed
   - Live counter showing remaining tasks

   Data is stored in a tasks array of objects.
   Every state change re-renders the visible list (DOM manipulation).

   Satisfies JS requirements:
   arrays, functions, event handling, DOM manipulation,
   dynamic content updates, interactive task management.
================================================================ */

// TASKS ARRAY: holds all task objects
// Each object: { id, text, priority, completed }
let tasks       = [];
let taskIdCounter = 1;  // Increments with each new task for unique IDs
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

// DOM references for the planner
const taskInput    = document.getElementById('taskInput');
const taskPriority = document.getElementById('taskPriority');
const addTaskBtn   = document.getElementById('addTaskBtn');
const taskList     = document.getElementById('taskList');
const taskEmpty    = document.getElementById('taskEmpty');
const taskCounter  = document.getElementById('taskCounter');
const filterBtns   = document.querySelectorAll('.filter-btn');

// ADD TASK: runs when "Add Task" button is clicked or Enter is pressed
function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    // If empty, briefly flash the input border red
    taskInput.style.borderColor = '#ff6b6b';
    setTimeout(function () {
      taskInput.style.borderColor = '';
    }, 800);
    return;
  }

  // Create a new task object and push it onto the array
  const newTask = {
    id:        taskIdCounter++,
    text:      text,
    priority:  taskPriority.value,  // 'low' | 'medium' | 'high'
    completed: false,
  };

  tasks.push(newTask);

  // Clear the input field so the user can type the next task
  taskInput.value = '';

  renderTasks();
}

// TOGGLE COMPLETE: flips the completed property of one task
function toggleTask(id) {
  // .find() locates the task with the matching id
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

// DELETE TASK: removes one task from the array by id
function deleteTask(id) {
  // .filter() returns a new array without the deleted task
  tasks = tasks.filter(function (t) { return t.id !== id; });
  renderTasks();
}

// BUILD TASK ITEM HTML: returns one <li> string for a task
function buildTaskItem(task) {
  // CSS classes for checked state and priority colour
  const checkedClass  = task.completed ? 'checked' : '';
  const completedClass = task.completed ? 'completed' : '';
  const priorityClass = 'priority-' + task.priority;

  return `
    <li class="task-item ${completedClass}" data-id="${task.id}">

      <!-- CHECKBOX: clicking calls toggleTask with this task's id -->
      <button
        class="task-check ${checkedClass}"
        onclick="toggleTask(${task.id})"
        aria-label="${task.completed ? 'Mark incomplete' : 'Mark complete'}"
      ></button>

      <!-- TASK TEXT -->
      <span class="task-text">${escapeHTML(task.text)}</span>

      <!-- PRIORITY BADGE -->
      <span class="task-priority-badge ${priorityClass}">${task.priority}</span>

      <!-- DELETE BUTTON -->
      <button
        class="task-delete"
        onclick="deleteTask(${task.id})"
        aria-label="Delete task"
      >&#10005;</button>

    </li>
  `;
}

// escapeHTML: prevents XSS by replacing dangerous characters in task text
// This is important whenever user input is injected into innerHTML
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// RENDER TASKS: filters the array, builds HTML, updates the DOM
function renderTasks() {
  // Apply the current filter
  const visible = tasks.filter(function (t) {
    if (currentFilter === 'active')    return !t.completed;
    if (currentFilter === 'completed') return  t.completed;
    return true; // 'all'
  });

  // Build and inject the list
  if (visible.length === 0) {
    taskList.innerHTML = '';
    taskEmpty.classList.add('visible');
  } else {
    taskEmpty.classList.remove('visible');
    taskList.innerHTML = visible.map(buildTaskItem).join('');
  }

  // Update counter: "X task(s) remaining"
  const remaining = tasks.filter(function (t) { return !t.completed; }).length;
  taskCounter.textContent = remaining + ' task' + (remaining !== 1 ? 's' : '') + ' remaining';
}

// EVENT LISTENERS for the planner
if (addTaskBtn) {
  addTaskBtn.addEventListener('click', addTask);
}

// Allow pressing Enter in the input to add a task
if (taskInput) {
  taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });
}

// FILTER BUTTONS: clicking a filter button updates currentFilter and re-renders
filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = btn.dataset.filter; // 'all', 'active', or 'completed'

    // Move the .active class to the clicked button
    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    renderTasks();
  });
});

// Add a starter task so the planner doesn't look empty on first load
tasks.push({
  id: taskIdCounter++,
  text: 'Complete COS 106 semester project',
  priority: 'high',
  completed: false,
});

renderTasks(); // Initial render


/* ================================================================
   13. CONTACT FORM , VALIDATION
   Runs when the form is submitted. Checks:
   - No field is empty
   - Email matches a standard format (regex test)
   - Phone contains only digits (regex test)
   If all pass, shows the success message.

   Satisfies: form validation JS requirement.
================================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    // preventDefault stops the browser from reloading the page on submit
    e.preventDefault();

    // Grab field values
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const phone   = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Grab error spans
    const nameErr    = document.getElementById('nameError');
    const emailErr   = document.getElementById('emailError');
    const phoneErr   = document.getElementById('phoneError');
    const messageErr = document.getElementById('messageError');
    const successBox = document.getElementById('formSuccess');

    // Clear previous errors
    [nameErr, emailErr, phoneErr, messageErr].forEach(function (el) {
      el.textContent = '';
    });
    ['contactName','contactEmail','contactPhone','contactMessage'].forEach(function (id) {
      document.getElementById(id).classList.remove('error');
    });
    successBox.classList.remove('visible');

    // VALIDATION: track whether all fields pass
    let valid = true;

    // Name: must not be empty
    if (!name) {
      nameErr.textContent = 'Please enter your name.';
      document.getElementById('contactName').classList.add('error');
      valid = false;
    }

    // Email: must match standard email format
    // The regex checks for: something@something.something
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailErr.textContent = 'Please enter your email address.';
      document.getElementById('contactEmail').classList.add('error');
      valid = false;
    } else if (!emailRegex.test(email)) {
      emailErr.textContent = 'Please enter a valid email address.';
      document.getElementById('contactEmail').classList.add('error');
      valid = false;
    }

    // Phone: must contain only digits (no spaces, dashes, or letters)
    // \d matches a single digit. + means one or more. ^ and $ anchor the whole string.
    const phoneRegex = /^\d+$/;
    if (!phone) {
      phoneErr.textContent = 'Please enter your phone number.';
      document.getElementById('contactPhone').classList.add('error');
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      phoneErr.textContent = 'Phone number must contain only digits.';
      document.getElementById('contactPhone').classList.add('error');
      valid = false;
    }

    // Message: must not be empty
    if (!message) {
      messageErr.textContent = 'Please enter a message.';
      document.getElementById('contactMessage').classList.add('error');
      valid = false;
    }

    // If all checks passed, show success and reset the form
    if (valid) {
      successBox.classList.add('visible');
      contactForm.reset();
      // Scroll the success message into view
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}


/* ================================================================
   14. AUDIO PLAYER
   Controls the custom play/pause button in the navbar.
   The native <audio> element stays hidden (no controls attribute).
   This JS calls .play() and .pause() on it and updates the UI.
================================================================ */
function initAudioPlayer() {
  const audio     = document.getElementById('bgAudio');
  const toggleBtn = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  const audioWave = document.getElementById('audioWave');

  if (!audio || !toggleBtn) return;

  let isPlaying = false;

  toggleBtn.addEventListener('click', function () {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      audioIcon.innerHTML = '&#9654;'; // Triangle = play
      if (audioWave) audioWave.classList.remove('playing');
      toggleBtn.setAttribute('aria-label', 'Play background music');
    } else {
      // .play() returns a Promise, catch errors if autoplay is blocked
      audio.play().then(function () {
        isPlaying = true;
        audioIcon.innerHTML = '&#9646;&#9646;'; // Two bars = pause
        if (audioWave) audioWave.classList.add('playing');
        toggleBtn.setAttribute('aria-label', 'Pause background music');
      }).catch(function (err) {
        console.warn('Audio play blocked by browser:', err);
      });
    }
  });
}

initAudioPlayer();


/* ================================================================
   MUSIC PROMPT OVERLAY + AUTOPLAY
   Shows a prompt 1.5s after page load.
   "Turn On" triggers the user interaction needed for autoplay,
   starts the music, dismisses the overlay, then 3s later
   pulses the navbar audio button to show where to pause.
   "Maybe Later" just dismisses the overlay.
================================================================ */
function initMusicPrompt() {
  const prompt    = document.getElementById('musicPrompt');
  const yesBtn    = document.getElementById('musicYes');
  const noBtn     = document.getElementById('musicNo');
  const audio     = document.getElementById('bgAudio');
  const toggleBtn = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  const audioWave = document.getElementById('audioWave');
  const navAudio  = document.getElementById('navAudio');

  if (!prompt || !yesBtn || !noBtn || !audio) return;

  // Show the prompt after 1.5 seconds
  setTimeout(function () {
    prompt.classList.add('visible');
  }, 1500);

  // Helper: dismiss the overlay with a slide-down animation
  function dismissPrompt() {
    prompt.classList.add('hiding');
    // Remove from DOM after transition completes (500ms)
    setTimeout(function () {
      prompt.style.display = 'none';
    }, 500);
  }

  // Helper: update the navbar button to show "playing" state
  function setPlayingState() {
    if (audioIcon) audioIcon.innerHTML = '&#9646;&#9646;'; // Pause bars
    if (audioWave) audioWave.classList.add('playing');
    if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Pause background music');
  }

  // "TURN ON" BUTTON: user interaction satisfies browser autoplay policy
  yesBtn.addEventListener('click', function () {
    dismissPrompt();

    // Play the audio. .play() returns a Promise.
    audio.play().then(function () {
      setPlayingState();

      // 3 seconds later, pulse the navbar audio button to show where to pause
      setTimeout(function () {
        if (navAudio) {
          navAudio.classList.add('highlight');
          // Remove highlight class after the 3-pulse animation finishes (3s)
          setTimeout(function () {
            navAudio.classList.remove('highlight');
          }, 3000);
        }
      }, 3000);

    }).catch(function (err) {
      // Should not happen since user just clicked, but catch just in case
      console.warn('Audio play failed:', err);
    });
  });

  // "MAYBE LATER" BUTTON: dismiss only, no music
  noBtn.addEventListener('click', function () {
    dismissPrompt();
  });
}

initMusicPrompt();


/* ================================================================
   PROCESS TIMELINE ANIMATION
   When the projects section scrolls into view, stagger each step
   card in one by one with a 150ms delay between them.
   The connecting line fill grows progressively as each card activates.
================================================================ */
function initProcessTimeline() {
  const steps    = document.querySelectorAll('.process-step');
  const lineFill = document.getElementById('processLineFill');

  if (!steps.length) return;

  // Watch the first step to trigger the whole sequence
  const obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {

          steps.forEach(function (step, i) {
            // Stagger: each step activates 180ms after the previous
            setTimeout(function () {
              step.classList.add('step-active');

              // Grow the line fill proportionally as each step activates.
              // After step i (0-indexed), fill = (i+1) / total * 100%
              if (lineFill) {
                const pct = ((i + 1) / steps.length * 100) + '%';
                lineFill.style.width = pct;
              }

            }, i * 180);
          });

          obs.disconnect(); // Fire once only
        }
      });
    },
    { threshold: 0.15 }
  );

  obs.observe(steps[0]);
}

initProcessTimeline();

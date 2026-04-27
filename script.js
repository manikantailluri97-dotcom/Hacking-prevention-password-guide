/* ============================================================
   CyberShield — script.js
   Covers:
     1. Single-Page Navigation
     2. Password Strength Checker
     3. Login System with Dashboard
     4. Cybersecurity Quiz
   ============================================================ */

/* ===========================================================
   1. NAVIGATION — SPA (Single Page Application) style
   Hides/shows sections without reloading the page
   =========================================================== */

/**
 * showSection(id)
 * Hides all .section elements, then makes the target visible.
 * Also updates the active state on nav links.
 */
function showSection(id) {
  // Hide every section
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show the requested section
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Highlight the correct nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === id);
  });

  // Close mobile menu if open
  const menu = document.getElementById('navLinks');
  const ham  = document.getElementById('hamburger');
  menu.classList.remove('open');
  ham.classList.remove('open');

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // If the quiz section is opened, initialise the quiz
  if (id === 'quiz') initQuiz();
}

/* Wire up nav-link clicks */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showSection(link.dataset.section);
  });
});

/* Hamburger toggle (mobile) */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
});

/* Show home section on first load */
showSection('home');


/* ===========================================================
   2. PASSWORD STRENGTH CHECKER
   Rules checked:
     - Length ≥ 8
     - Uppercase letter
     - Lowercase letter
     - Number (digit)
     - Special character
   Score 0–5 → Weak / Medium / Strong
   =========================================================== */

const passwordInput = document.getElementById('passwordInput');
const meterFill     = document.getElementById('meterFill');
const strengthLabel = document.getElementById('strengthLabel');
const pwAdvice      = document.getElementById('pwAdvice');

/* Individual checklist DOM nodes */
const chkLen   = document.getElementById('chkLen');
const chkUpper = document.getElementById('chkUpper');
const chkLower = document.getElementById('chkLower');
const chkNum   = document.getElementById('chkNum');
const chkSpec  = document.getElementById('chkSpec');

/* Listen for every keystroke in the password field */
passwordInput.addEventListener('input', checkPasswordStrength);

/**
 * checkPasswordStrength()
 * Reads the current value, applies 5 rules, and updates the UI.
 */
function checkPasswordStrength() {
  const pw = passwordInput.value;   // the current password text
  let score = 0;                    // starts at 0, max 5

  /* ---------- Apply each rule ---------- */

  // Rule 1: at least 8 characters
  const hasLen   = pw.length >= 8;
  // Rule 2: at least one uppercase letter  (regex A-Z)
  const hasUpper = /[A-Z]/.test(pw);
  // Rule 3: at least one lowercase letter  (regex a-z)
  const hasLower = /[a-z]/.test(pw);
  // Rule 4: at least one digit              (regex 0-9)
  const hasNum   = /[0-9]/.test(pw);
  // Rule 5: at least one special character  (!@#$%^&*…)
  const hasSpec  = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw);

  /* ---------- Update each checklist item ---------- */
  updateCheck(chkLen,   hasLen,   '✔ At least 8 characters',      '✗ At least 8 characters');
  updateCheck(chkUpper, hasUpper, '✔ Contains uppercase letter',  '✗ Contains uppercase letter (A–Z)');
  updateCheck(chkLower, hasLower, '✔ Contains lowercase letter',  '✗ Contains lowercase letter (a–z)');
  updateCheck(chkNum,   hasNum,   '✔ Contains a number',          '✗ Contains a number (0–9)');
  updateCheck(chkSpec,  hasSpec,  '✔ Contains special character', '✗ Contains special character (!@#$…)');

  /* ---------- Tally the score ---------- */
  [hasLen, hasUpper, hasLower, hasNum, hasSpec].forEach(r => { if (r) score++; });

  /* ---------- Update the strength bar & label ---------- */
  if (pw.length === 0) {
    // Empty input — reset everything
    resetMeter();
    return;
  }

  if (score <= 2) {
    // WEAK — red, 33%
    setMeter('33%', 'var(--danger)', 'WEAK', 'danger');
    pwAdvice.className = 'pw-advice danger';
    pwAdvice.textContent = '⚠ Your password is weak. Try adding numbers, symbols, and uppercase letters.';

  } else if (score <= 4) {
    // MEDIUM — amber, 66%
    setMeter('66%', 'var(--warn)', 'MEDIUM', 'warn');
    pwAdvice.className = 'pw-advice warn';
    pwAdvice.textContent = '⚡ Your password is medium strength. Add a special character or make it longer.';

  } else {
    // STRONG — green, 100%
    setMeter('100%', 'var(--good)', 'STRONG', 'good');
    pwAdvice.className = 'pw-advice good';
    pwAdvice.textContent = '✔ Great! Your password is strong. Remember not to reuse it on other sites.';
  }
}

/**
 * updateCheck(el, passed, passText, failText)
 * Toggles a checklist item between pass (green) and fail (red) state.
 */
function updateCheck(el, passed, passText, failText) {
  el.textContent = passed ? passText : failText;
  el.classList.toggle('pass', passed);
  el.classList.toggle('fail', !passed);
}

/**
 * setMeter(width, color, label, adviceClass)
 * Updates the visual fill bar and strength label.
 */
function setMeter(width, color, label, adviceClass) {
  meterFill.style.width      = width;
  meterFill.style.background = color;
  strengthLabel.textContent  = label;
  strengthLabel.style.color  = color;
}

/** resetMeter() — clears the meter when the input is empty */
function resetMeter() {
  meterFill.style.width      = '0%';
  strengthLabel.textContent  = '—';
  strengthLabel.style.color  = 'var(--text-muted)';
  pwAdvice.className         = 'pw-advice';
  pwAdvice.textContent       = 'Start typing to see your password strength.';
  // Reset all checklist items
  [chkLen, chkUpper, chkLower, chkNum, chkSpec].forEach(el => {
    el.classList.remove('pass', 'fail');
  });
}

/* Toggle password visibility (show/hide button) */
document.getElementById('toggleEye').addEventListener('click', () => {
  const input = document.getElementById('passwordInput');
  input.type  = input.type === 'password' ? 'text' : 'password';
});


/* ===========================================================
   3. LOGIN SYSTEM
   Hardcoded credentials (no backend needed for this demo).
   Correct login → shows the Dashboard view.
   Wrong login → shows an error message.
   =========================================================== */

/* Hardcoded demo credentials — shown in the UI hint */
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'Secure@123';

/**
 * doLogin()
 * Called when the Login button is clicked.
 * Validates username and password against hardcoded values.
 */
function doLogin() {
  const username  = document.getElementById('loginUser').value.trim();
  const password  = document.getElementById('loginPass').value;
  const errorDiv  = document.getElementById('loginError');

  // Clear previous error
  errorDiv.classList.remove('visible');

  /* Check credentials */
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    // Correct — hide login form, show dashboard
    document.getElementById('loginView').classList.add('hidden');
    document.getElementById('dashboardView').classList.remove('hidden');
  } else {
    // Wrong — show error message
    errorDiv.classList.add('visible');
    // Shake animation for feedback
    document.querySelector('.login-card').style.animation = 'none';
    setTimeout(() => {
      document.querySelector('.login-card').style.animation = '';
    }, 10);
  }
}

/**
 * doLogout()
 * Hides dashboard, shows login form again, clears fields.
 */
function doLogout() {
  document.getElementById('loginView').classList.remove('hidden');
  document.getElementById('dashboardView').classList.add('hidden');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').classList.remove('visible');
}

/* Allow pressing Enter in the password field to trigger login */
document.getElementById('loginPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});
document.getElementById('loginUser').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});


/* ===========================================================
   4. CYBERSECURITY QUIZ
   10 multiple-choice questions on hacking & prevention.
   Shows one question at a time.
   Tracks score and shows result at the end.
   =========================================================== */

/* ---------- Question bank ---------- */
const questions = [
  {
    q: "What is 'phishing'?",
    options: [
      "A type of computer virus that deletes files",
      "A fraudulent attempt to steal sensitive information by impersonating a trusted source",
      "A technique to speed up internet connections",
      "A method of encrypting data"
    ],
    answer: 1,  // index of the correct option (0-based)
    explanation: "Phishing uses fake emails or websites to trick victims into revealing passwords or payment details."
  },
  {
    q: "Which of the following is the strongest password?",
    options: [
      "password123",
      "John1990",
      "qwerty",
      "G7!mK#92xL@p"
    ],
    answer: 3,
    explanation: "A strong password mixes uppercase, lowercase, numbers, and special characters — and is hard to guess."
  },
  {
    q: "What does '2FA' stand for?",
    options: [
      "Two-Factor Authentication",
      "Two-File Access",
      "Twice-Fast Authorisation",
      "Trusted File Approach"
    ],
    answer: 0,
    explanation: "2FA adds a second verification step (e.g., a code sent to your phone) on top of your password."
  },
  {
    q: "What is a 'brute force attack'?",
    options: [
      "Physically breaking into a server room",
      "Sending millions of spam emails",
      "Systematically trying all possible passwords until the correct one is found",
      "Overloading a server with traffic"
    ],
    answer: 2,
    explanation: "Brute force attacks use automated tools to try huge numbers of password combinations rapidly."
  },
  {
    q: "Which type of malware encrypts your files and demands payment?",
    options: [
      "Spyware",
      "Adware",
      "Ransomware",
      "Trojan"
    ],
    answer: 2,
    explanation: "Ransomware locks victims out of their data and demands a ransom — often in cryptocurrency."
  },
  {
    q: "What is 'social engineering' in cybersecurity?",
    options: [
      "Building social media websites",
      "Psychologically manipulating people to reveal confidential information",
      "Engineering better social networks",
      "Studying online user behaviour"
    ],
    answer: 1,
    explanation: "Social engineering exploits human trust rather than technical vulnerabilities — e.g., pretending to be IT support."
  },
  {
    q: "What does a VPN primarily protect you from?",
    options: [
      "Computer viruses",
      "Hardware failures",
      "Surveillance and interception on public networks",
      "Phishing emails"
    ],
    answer: 2,
    explanation: "A VPN encrypts your traffic and hides your IP, making it much harder to intercept data on public Wi-Fi."
  },
  {
    q: "Which of the following is NOT a good cybersecurity practice?",
    options: [
      "Using the same strong password for all accounts",
      "Enabling two-factor authentication",
      "Keeping software up to date",
      "Using a password manager"
    ],
    answer: 0,
    explanation: "Reusing passwords is dangerous — if one account is breached, all others using the same password are at risk."
  },
  {
    q: "What is a 'DDoS attack'?",
    options: [
      "A method to decrypt stolen data",
      "Delivering disguised malware via email",
      "Flooding a server with traffic to make it unavailable",
      "Intercepting network packets"
    ],
    answer: 2,
    explanation: "Distributed Denial of Service (DDoS) attacks overwhelm a server so it can't respond to legitimate users."
  },
  {
    q: "What should you do if you receive an unexpected email asking you to click a link and 'verify' your account?",
    options: [
      "Click the link immediately to protect your account",
      "Forward it to your friends so they can check it",
      "Ignore it completely and delete without reading",
      "Verify by going directly to the official website — do not click the link"
    ],
    answer: 3,
    explanation: "Always navigate directly to official sites. Clicking phishing links can compromise your credentials."
  }
];

/* ---------- Quiz state variables ---------- */
let currentQuestion = 0;  // index of the current question
let score           = 0;  // number of correct answers
let answered        = false; // has the current question been answered?

/**
 * initQuiz()
 * Resets state and shows the first question.
 * Called whenever the quiz section is opened.
 */
function initQuiz() {
  currentQuestion = 0;
  score           = 0;
  answered        = false;

  // Hide result, show quiz card
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizCard').classList.remove('hidden');

  renderQuestion();
}

/**
 * renderQuestion()
 * Displays the current question and its answer options.
 */
function renderQuestion() {
  const q = questions[currentQuestion];

  // Update progress bar (percentage through questions)
  const progress = (currentQuestion / questions.length) * 100;
  document.getElementById('quizProgressBar').style.width = progress + '%';

  // Update counter label
  document.getElementById('quizCounter').textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // Set question text
  document.getElementById('quizQuestion').textContent = q.q;

  // Clear and rebuild option buttons
  const optionsDiv = document.getElementById('quizOptions');
  optionsDiv.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className    = 'quiz-option';
    btn.textContent  = opt;
    btn.dataset.idx  = idx;  // store index for checking answer
    btn.addEventListener('click', () => selectAnswer(idx));
    optionsDiv.appendChild(btn);
  });

  // Clear feedback and hide Next button
  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('nextBtn').style.display = 'none';
  answered = false;
}

/**
 * selectAnswer(selectedIdx)
 * Handles clicking an answer option.
 * Locks the quiz, highlights correct/wrong, shows explanation.
 */
function selectAnswer(selectedIdx) {
  if (answered) return;  // prevent double-clicking
  answered = true;

  const q       = questions[currentQuestion];
  const buttons = document.querySelectorAll('.quiz-option');

  // Disable all buttons now that an answer was chosen
  buttons.forEach(btn => btn.disabled = true);

  if (selectedIdx === q.answer) {
    // Correct answer
    score++;
    buttons[selectedIdx].classList.add('correct');
    document.getElementById('quizFeedback').textContent =
      '✔ Correct! ' + q.explanation;
    document.getElementById('quizFeedback').style.color = 'var(--accent)';
  } else {
    // Wrong answer — highlight the user's wrong choice and show correct
    buttons[selectedIdx].classList.add('wrong');
    buttons[q.answer].classList.add('correct');
    document.getElementById('quizFeedback').textContent =
      '✗ Incorrect. ' + q.explanation;
    document.getElementById('quizFeedback').style.color = 'var(--danger)';
  }

  // Show Next / Finish button
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.style.display  = 'inline-block';
  // Change label on the last question
  nextBtn.textContent = (currentQuestion === questions.length - 1) ? 'See Results' : 'Next →';
}

/**
 * nextQuestion()
 * Moves to the next question, or shows results if quiz is complete.
 */
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

/**
 * showResults()
 * Hides quiz card, shows final score and a motivational message.
 */
function showResults() {
  // Full progress bar
  document.getElementById('quizProgressBar').style.width = '100%';
  document.getElementById('quizCounter').textContent = 'Quiz Complete!';

  // Hide card, show result panel
  document.getElementById('quizCard').classList.add('hidden');
  document.getElementById('quizResult').classList.remove('hidden');

  // Display score
  document.getElementById('resultScore').textContent =
    `${score} / ${questions.length}`;

  // Personalised message based on score
  const pct = (score / questions.length) * 100;
  let msg = '';
  if (pct === 100) {
    msg = '🏆 Perfect score! You\'re a cybersecurity expert. Keep spreading awareness!';
  } else if (pct >= 70) {
    msg = '👏 Good job! You have solid cybersecurity knowledge. Review the questions you missed to improve further.';
  } else if (pct >= 40) {
    msg = '📚 Not bad, but there\'s room to grow. Review the topics and try again to boost your awareness.';
  } else {
    msg = '🔄 Cybersecurity is important — don\'t give up! Re-read the threat glossary on the Home page and try again.';
  }
  document.getElementById('resultMsg').textContent = msg;
}

/**
 * restartQuiz()
 * Resets and restarts the quiz from the beginning.
 */
function restartQuiz() {
  initQuiz();
}

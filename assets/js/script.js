// TYPED JS FOR LOGO BLINKER
document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('.typed');
    if (el) {
        const items = el.getAttribute('data-typed-items').split(',');
        new Typed('.typed', {
            strings: items,
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 1500,
            loop: true,
            smartBackspace: true,
            showCursor: true,
            cursorChar: '_',
        });
    }
});

// THEME CHANGE LOGIC
const themeToggleBtn = document.getElementById('themeToggleBtn');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('theme', theme);

  themeToggleBtn.innerHTML =
    theme === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
}

applyTheme(initialTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});

// EXAMPLE PROMPT'S LOGIC
const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];

const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input");

promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
});
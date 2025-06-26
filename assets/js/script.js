// DOM ELEMENTS 
const promptForm = document.querySelector(".prompt-form");
const promptModelSelect = document.querySelector("#model-select");
const imageCountSelect = document.querySelector("#image-count");
const frameSelect = document.querySelector("#frame-select");
const themeToggleBtn = document.getElementById('themeToggleBtn');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input");
const galleryGrid = document.querySelector(".gallery-grid");
const generateBtn = document.querySelector(".generateBtn");

const API_KEY = "";

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

promptBtn.addEventListener("click", () => {
  const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  promptInput.value = prompt;
  promptInput.focus();
});

// FORM SUBMISSION

const getImageDimensions = (aspectRatio, baseSize = 512) => {
    const [width, height] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize / Math.sqrt(width * height);

    let calculatedWidth = Math.round(width * scaleFactor);
    let calculatedHeight = Math.round(height * scaleFactor);

    // Ensure dimensions are multiples of 16

    calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
    calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

    return { width: calculatedWidth, height: calculatedHeight };
}

const updateImageCards = (imgIndex, imgURL) =>{
  const imgCard = document.getElementById(`img-card-${imgIndex}`);
  if (!imgCard) return;
  imgCard.classList.remove("loading");
  imgCard.innerHTML = `
                      <img src="${imgURL}" alt="" class="result-img">
                        <div class="img-overlay">
                            <a href="${imgURL}" class="img-download-btn" download="${Date.now()}.png">
                              <i class="fa-solid fa-download"></i>
                            </a>
                        </div>`;
}

const generateImages = async(selectModel, imageCount, aspectRatio, promptText) => {
    const MODEL_URL = `https://api-inference.huggingface.co/models/${selectModel}`;
    const {width, height} = getImageDimensions(aspectRatio);

    generateBtn.setAttribute("disabled", "true");

    const imagePromises = Array.from({ length: imageCount }, async(_, i) => {
      try {
        const response = await fetch(MODEL_URL, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "x-use-cache": "false",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: promptText,
            parameters: { width, height },
          }),
        });

        if(!response.ok){
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const result = await response.blob();
        updateImageCards(i, URL.createObjectURL(result));
      } catch (error) {
        console.log(error);
        const imgCard = document.getElementById(`img-card-${i}`);
        imgCard.classList.replace("loading", "error");
        imgCard.querySelector(".status-text").textContent = "Generation failed . Check console for more details..."
      }
    })

    await Promise.allSettled(imagePromises);
    generateBtn.removeAttribute("disabled");
};


const createImageCards = (selectModel, imageCount, aspectRatio, promptText) => {

  galleryGrid.innerHTML = "";

  for (let i = 0; i < imageCount; i++) {
    galleryGrid.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
                    <div class="status-container">
                        <div class="spinner"></div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p class="status-text">Generating...</p>
                        </div>
                    </div>`
  }
  generateImages(selectModel, imageCount, aspectRatio, promptText);
}



const handleFormSubmit = (e) => {
  e.preventDefault();  

  const selectModel = promptModelSelect.value;
  const imageCount = parseInt(imageCountSelect.value) || 1;
  const aspectRatio = frameSelect.value || "1/1";
  const promptText = promptInput.value.trim();

  createImageCards(selectModel, imageCount, aspectRatio, promptText);
};

promptForm.addEventListener("submit", handleFormSubmit);
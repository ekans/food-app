let allFoods = [];
let currentLanguage = 'fr';

const translations = {
  fr: {
    title: 'Liste des Aliments - Charge Glycémique',
    headerTitle: 'Liste des Aliments',
    headerSubtitle: 'Découvrez la charge glycémique de vos aliments préférés',
    searchPlaceholder: 'Rechercher un aliment...',
    loading: 'Chargement des données...',
    glycemicLoadLabel: 'Charge glycémique:',
    noResults: 'Aucun aliment trouvé.',
    foodCount: (count, total) => {
      const s = count > 1 ? 's' : '';
      return count === total
        ? `${count} aliment${s} au total`
        : `${count} aliment${s} trouvé${s} sur ${total}`;
    },
    switchLanguage: '🇺🇸'
  },
  en: {
    title: 'Food List - Glycemic Load',
    headerTitle: 'Food List', 
    headerSubtitle: 'Discover the glycemic load of your favorite foods',
    searchPlaceholder: 'Search for a food...',
    loading: 'Loading data...',
    glycemicLoadLabel: 'Glycemic load:',
    noResults: 'No food found.',
    foodCount: (count, total) => {
      const s = count > 1 ? 's' : '';
      return count === total
        ? `${count} food${s} total`
        : `${count} food${s} found out of ${total}`;
    },
    switchLanguage: '🇫🇷'
  }
};

function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith('en') ? 'en' : 'fr';
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  updateUI();
}

function getCurrentLanguage() {
  return localStorage.getItem('language') || detectBrowserLanguage();
}

function t(key, ...args) {
  const value = translations[currentLanguage][key];
  return typeof value === 'function' ? value(...args) : value;
}

async function loadFoodData() {
  try {
    const response = await fetch("aliments.md");
    const markdown = await response.text();
    return parseMarkdown(markdown);
  } catch (error) {
    console.error("Error loading data:", error);
    return [];
  }
}

function parseMarkdown(markdown) {
  const foods = [];
  let currentFood = null;

  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      if (currentFood) foods.push(currentFood);
      currentFood = {
        name: trimmed.substring(3).trim(),
        chargeGlycemique: null,
      }; // Extract food name
    } else if (trimmed.startsWith("Charge glycémique:") && currentFood) {
      // Parse glycemic load
      currentFood.chargeGlycemique = parseInt(
        trimmed.replace("Charge glycémique:", "").trim(),
      );
    }
  }

  if (currentFood) foods.push(currentFood);
  return foods.filter((food) => food.chargeGlycemique !== null); // Only include foods with valid glycemic values
}

function filterFoods(searchTerm) {
  const search = searchTerm.trim().toLowerCase();
  return search
    ? allFoods.filter((food) => food.name.toLowerCase().includes(search))
    : allFoods;
}

function updateFoodCount(count) {
  const text = t('foodCount', count, allFoods.length);
  document.getElementById("food-count").textContent = text;
}

function getGlycemicClass(value) {
  if (value <= 10) return "low";
  if (value <= 19) return "medium";
  return "high";
}

function createFoodElement(food) {
  const item = document.createElement("div");
  item.className = "food-item";

  const name = document.createElement("h3");
  name.className = "food-name";
  name.textContent = food.name; // Safe text insertion to prevent XSS

  const glycemic = document.createElement("div");
  glycemic.className = "food-glycemic";

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = t('glycemicLoadLabel');

  const value = document.createElement("span");
  value.className = `value ${getGlycemicClass(food.chargeGlycemique)}`;
  value.textContent = food.chargeGlycemique; // Safe text insertion

  glycemic.append(label, value);
  item.append(name, glycemic);
  return item;
}

function renderFoodList(foods) {
  const foodList = document.getElementById("food-list");
  foodList.textContent = ""; // Clear existing content

  if (foods.length === 0) {
    const noResults = document.createElement("p");
    noResults.className = "no-results";
    noResults.textContent = t('noResults');
    foodList.appendChild(noResults);
  } else {
    foods.forEach((food) => foodList.appendChild(createFoodElement(food)));
  }

  updateFoodCount(foods.length);
  // Show the interface after rendering
  document.getElementById("loading").style.display = "none";
  document.querySelector(".search-container").style.display = "block";
  foodList.style.display = "block";
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    renderFoodList(filterFoods(e.target.value));
  });
  searchInput.focus(); // Auto-focus search field
}

function updateUI() {
  document.title = t('title');
  document.querySelector('header h1').textContent = t('headerTitle');
  document.querySelector('header p').textContent = t('headerSubtitle');
  document.getElementById('search-input').placeholder = t('searchPlaceholder');
  document.getElementById('loading').textContent = t('loading');
  document.getElementById('language-switcher').textContent = t('switchLanguage');
  
  if (allFoods.length > 0) {
    const searchValue = document.getElementById('search-input').value;
    renderFoodList(filterFoods(searchValue));
  }
}

function setupLanguageSwitcher() {
  const switcher = document.getElementById('language-switcher');
  switcher.addEventListener('click', () => {
    setLanguage(currentLanguage === 'fr' ? 'en' : 'fr');
  });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  currentLanguage = getCurrentLanguage();
  updateUI();
  setupLanguageSwitcher();
  allFoods = await loadFoodData();
  renderFoodList(allFoods);
  setupSearch();
});

let allFoods = [];
let filteredFoods = [];

async function loadFoodData() {
  try {
    const response = await fetch("aliments.md");
    const markdown = await response.text();
    return parseMarkdown(markdown);
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    return [];
  }
}

function parseMarkdown(markdown) {
  const foods = [];
  const lines = markdown.split("\n");

  let currentFood = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Détection d'un nouvel aliment (titre de niveau 2)
    if (trimmedLine.startsWith("## ")) {
      if (currentFood) {
        foods.push(currentFood);
      }
      currentFood = {
        name: trimmedLine.substring(3).trim(),
        chargeGlycemique: null,
      };
    }

    // Détection de la charge glycémique
    if (trimmedLine.startsWith("Charge glycémique:") && currentFood) {
      const value = trimmedLine.replace("Charge glycémique:", "").trim();
      currentFood.chargeGlycemique = parseInt(value);
    }
  }

  // Ajouter le dernier aliment
  if (currentFood) {
    foods.push(currentFood);
  }

  return foods.filter((food) => food.chargeGlycemique !== null);
}

function filterFoods(searchTerm) {
  if (!searchTerm.trim()) {
    return allFoods;
  }

  const search = searchTerm.toLowerCase();
  return allFoods.filter((food) => food.name.toLowerCase().includes(search));
}

function updateFoodCount(count) {
  const foodCountElement = document.getElementById("food-count");
  if (count === allFoods.length) {
    foodCountElement.textContent = `${count} aliment${count > 1 ? "s" : ""} au total`;
  } else {
    foodCountElement.textContent = `${count} aliment${count > 1 ? "s" : ""} trouvé${count > 1 ? "s" : ""} sur ${allFoods.length}`;
  }
}

function getGlycemicClass(value) {
  if (value <= 10) return "low";
  if (value <= 19) return "medium";
  return "high";
}

function renderFoodList(foods) {
  const foodListElement = document.getElementById("food-list");
  const loadingElement = document.getElementById("loading");
  const searchContainer = document.querySelector(".search-container");

  // Clear existing content safely
  foodListElement.textContent = '';

  if (foods.length === 0) {
    const noResultsElement = document.createElement('p');
    noResultsElement.className = 'no-results';
    noResultsElement.textContent = 'Aucun aliment trouvé.';
    foodListElement.appendChild(noResultsElement);
  } else {
    // Create DOM elements safely to prevent XSS
    foods.forEach(food => {
      const foodItem = document.createElement('div');
      foodItem.className = 'food-item';

      const foodName = document.createElement('h3');
      foodName.className = 'food-name';
      foodName.textContent = food.name; // Safe text content

      const foodGlycemic = document.createElement('div');
      foodGlycemic.className = 'food-glycemic';

      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = 'Charge glycémique:';

      const value = document.createElement('span');
      value.className = `value ${getGlycemicClass(food.chargeGlycemique)}`;
      value.textContent = food.chargeGlycemique; // Safe text content

      foodGlycemic.appendChild(label);
      foodGlycemic.appendChild(value);
      foodItem.appendChild(foodName);
      foodItem.appendChild(foodGlycemic);
      foodListElement.appendChild(foodItem);
    });
  }

  updateFoodCount(foods.length);

  loadingElement.style.display = "none";
  searchContainer.style.display = "block";
  foodListElement.style.display = "block";
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    filteredFoods = filterFoods(searchTerm);
    renderFoodList(filteredFoods);
  });

  // Optionnel: focus automatique sur le champ de recherche
  searchInput.focus();
}

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", async () => {
  allFoods = await loadFoodData();
  filteredFoods = allFoods;
  renderFoodList(filteredFoods);
  setupSearch();
});

async function loadFoodData() {
    try {
        const response = await fetch('aliments.md');
        const markdown = await response.text();
        return parseMarkdown(markdown);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return [];
    }
}

function parseMarkdown(markdown) {
    const foods = [];
    const lines = markdown.split('\n');
    
    let currentFood = null;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Détection d'un nouvel aliment (titre de niveau 2)
        if (trimmedLine.startsWith('## ')) {
            if (currentFood) {
                foods.push(currentFood);
            }
            currentFood = {
                name: trimmedLine.substring(3).trim(),
                chargeGlycemique: null
            };
        }
        
        // Détection de la charge glycémique
        if (trimmedLine.startsWith('Charge glycémique:') && currentFood) {
            const value = trimmedLine.replace('Charge glycémique:', '').trim();
            currentFood.chargeGlycemique = parseInt(value);
        }
    }
    
    // Ajouter le dernier aliment
    if (currentFood) {
        foods.push(currentFood);
    }
    
    return foods.filter(food => food.chargeGlycemique !== null);
}

function renderFoodList(foods) {
    const foodListElement = document.getElementById('food-list');
    const loadingElement = document.getElementById('loading');
    
    if (foods.length === 0) {
        foodListElement.innerHTML = '<p>Aucun aliment trouvé.</p>';
    } else {
        const foodItems = foods.map(food => `
            <div class="food-item">
                <h3 class="food-name">${food.name}</h3>
                <div class="food-glycemic">
                    <span class="label">Charge glycémique:</span>
                    <span class="value">${food.chargeGlycemique}</span>
                </div>
            </div>
        `).join('');
        
        foodListElement.innerHTML = foodItems;
    }
    
    loadingElement.style.display = 'none';
    foodListElement.style.display = 'block';
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async () => {
    const foods = await loadFoodData();
    renderFoodList(foods);
});
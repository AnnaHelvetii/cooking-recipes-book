import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecipeStep {
	stepNumber: number;
	description: string;
	image?: string;
}

interface Recipe {
	id: number;
	name: string;
	ingredients: string[];
	isFavorite: boolean;
	isVegan: boolean;
	steps: RecipeStep[];
}

interface RecipesState {
	allRecipes: Recipe[];
	favoriteRecipes: Recipe[];
}

const saveToLocalStorage = (state: RecipesState) => {
	try {
		localStorage.setItem('allRecipes', JSON.stringify(state.allRecipes));
		localStorage.setItem('favoriteRecipes', JSON.stringify(state.favoriteRecipes));
		console.log('Saved to localStorage:', state.allRecipes);
	} catch (error) {
		console.error('Error saving to localStorage:', error);
	}
};

const initialState: RecipesState = {
	allRecipes: [],
	favoriteRecipes: [],
};

const recipesSlice = createSlice({
	name: 'recipes',
	initialState,
	reducers: {
		setRecipes: (state, action: PayloadAction<Recipe[]>) => {
			state.allRecipes = action.payload;
			saveToLocalStorage(state);
		},
		addRecipe: (state, action: PayloadAction<Omit<Recipe, 'id'>>) => {
			const newRecipe = { ...action.payload, id: Date.now(), isFavorite: false };
			state.allRecipes.push(newRecipe);
			saveToLocalStorage(state);
		},
		toggleFavorite: (state, action: PayloadAction<number>) => {
			const recipe = state.allRecipes.find(r => r.id === action.payload);
			if (recipe) {
				recipe.isFavorite = !recipe.isFavorite;
				if (recipe.isFavorite) {
					const alreadyFavorite = state.favoriteRecipes.some(rec => rec.id === action.payload);
					if (!alreadyFavorite) {
						state.favoriteRecipes.push(recipe);
					}
				} else {
					state.favoriteRecipes = state.favoriteRecipes.filter(r => r.id !== action.payload);
				}
				saveToLocalStorage(state);
			}
		},
		loadRecipesFromStorage: (state, action: PayloadAction<RecipesState>) => {
			state.allRecipes = action.payload.allRecipes;
			state.favoriteRecipes = action.payload.favoriteRecipes;
		},
		updateRecipe: (state, action: PayloadAction<Omit<Recipe, 'isFavorite'>>) => {
			const { id, name, ingredients, isVegan, steps } = action.payload;
			const recipe = state.allRecipes.find(rec => rec.id === id)
			if (recipe) {
				recipe.name = name;
				recipe.ingredients = ingredients;
				recipe.isVegan = isVegan;
				recipe.steps = steps;
				saveToLocalStorage(state);
			}
		},
		addRecipeStep: (state, action: PayloadAction<{ recipeId: number; step: RecipeStep }>) => {
			const { recipeId, step } = action.payload;
			const recipe = state.allRecipes.find(rec => rec.id === recipeId);
			if (recipe) {
				recipe.steps.push(step);
				saveToLocalStorage(state);
			}
		},
		removeRecipeStep: (state, action: PayloadAction<{ recipeId: number; stepNumber: number }>) => {
			const { recipeId, stepNumber } = action.payload;
			const recipe = state.allRecipes.find(rec => rec.id === recipeId);
			if (recipe) {
				recipe.steps = recipe.steps.filter(step => step.stepNumber !== stepNumber);
				saveToLocalStorage(state);
			}
		},
	},
});

export const { 
	setRecipes, addRecipe, toggleFavorite, loadRecipesFromStorage, updateRecipe, addRecipeStep, removeRecipeStep 
} = recipesSlice.actions;
export default recipesSlice.reducer;

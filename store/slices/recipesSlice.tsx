import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Recipe {
	id: number;
	name: string;
	ingredients: string[];
	isFavorite: boolean;
}

interface RecipesState {
	allRecipes: Recipe[];
	favoriteRecipes: Recipe[];
}

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
		},
		toggleFavorite: (state, action: PayloadAction<number>) => {
			const recipe = state.allRecipes.find(r => r.id === action.payload);
			if (recipe) {
				recipe.isFavorite = !recipe.isFavorite;
				if (recipe.isFavorite) {
					state.favoriteRecipes.push(recipe);
				} else {
					state.favoriteRecipes = state.favoriteRecipes.filter(r => r.id !== action.payload);
				}
			}
		},
	},
});

export const { setRecipes, toggleFavorite } = recipesSlice.actions;
export default recipesSlice.reducer;



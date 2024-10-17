'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setRecipes, toggleFavorite } from '../store/slices/recipesSlice';

export default function Home() {
	const dispatch = useAppDispatch();
	const recipes = useAppSelector(state => state.recipes.allRecipes);
	const favoriteRecipes = useAppSelector(state => state.recipes.favoriteRecipes);

	return (
		<div className="container">
			<h1>Recipe Catalog</h1>
			<h2>All Recipes</h2>
			<ul>
			</ul>

			<h2>Favorite Recipes</h2>
			<ul>
			</ul>
		</div>
	);
}

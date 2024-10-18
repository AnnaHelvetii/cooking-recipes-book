'use client';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { loadRecipesFromStorage, toggleFavorite } from "@/store/slices/recipesSlice";
import Link from "next/link";

export default function ClientRecipes() {
	const dispatch = useAppDispatch();
	const recipes = useAppSelector(state => state.recipes.allRecipes);
	const favoriteRecipes = useAppSelector(state => state.recipes.favoriteRecipes);

	useEffect(() => {
		const allRecipes = localStorage.getItem('allRecipes');
		const favoriteRecipes = localStorage.getItem('favoriteRecipes');

		if (allRecipes || favoriteRecipes) {
			const loadedState = {
				allRecipes: allRecipes ? JSON.parse(allRecipes) : [],
				favoriteRecipes: favoriteRecipes ? JSON.parse(favoriteRecipes) : []
			};

			dispatch(loadRecipesFromStorage(loadedState));
		}
	}, [dispatch]);

	const handleFavoriteToggle = (id: number) => {
		dispatch(toggleFavorite(id));
	};

	return (
		<div className="container">
			<h2>All Recipes</h2>
			<ul>
				{recipes.map(rec => (
					<li key={rec.id}>
						<Link href={`/recipes/${rec.id}`}>
							<h3>{rec.name}</h3>
						</Link>
						<button onClick={() => handleFavoriteToggle(rec.id)}>
							{rec.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
						</button>
					</li>
				))}
			</ul>

			<h2>Favorite Recipes</h2>
			<ul>
				{favoriteRecipes.map(rec => (
					<li key={rec.id}>
						<h3>{rec.name}</h3>
					</li>
				))}
			</ul>
		</div>
	)
}
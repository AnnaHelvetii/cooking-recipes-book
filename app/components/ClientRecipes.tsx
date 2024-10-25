'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { loadRecipesFromStorage, toggleFavorite } from "@/store/slices/recipesSlice";
import Link from "next/link";
import styles from './../styles/ClientRecipes.module.scss';

export default function ClientRecipes() {
	const dispatch = useAppDispatch();
	const recipes = useAppSelector(state => state.recipes.allRecipes);
	const favoriteRecipes = useAppSelector(state => state.recipes.favoriteRecipes);
	const [searchTerm, setSearchTerm] = useState('');
	const [isVeganOnly, setIsVeganOnly] = useState(false);

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

	const filtredRecipes = recipes.filter((recipe) => {
		const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			recipe.ingredients.some((ingredient) => 
				ingredient.toLowerCase().includes(searchTerm.toLowerCase())
			);
		
		const matchesVegan = isVeganOnly ? recipe.isVegan : true;

		return matchesSearch && matchesVegan
	});

	const handleFavoriteToggle = (id: number) => {
		dispatch(toggleFavorite(id));
	};

	return (
		<div className={styles['recipes-container']}>
			<h2>Все рецепты</h2>
			<div className={styles['search-bar']}>
				<input
					type="text"
					placeholder="Найти по названию или ингредиенту"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className={styles['filter']}>
				<label>
					<input
						type="checkbox"
						checked={isVeganOnly}
						onChange={(e) => setIsVeganOnly(e.target.checked)}
					/>
					Только веганские
				</label>
			</div>
			<ul className={styles['recipe-list']}>
				{filtredRecipes.length > 0 ? (
					filtredRecipes.map((rec) => (
						<li key={rec.id}>
							<Link href={`/recipes/${rec.id}`}>
								<h3>{rec.name}</h3>
							</Link>
							<button onClick={() => handleFavoriteToggle(rec.id)}>
								{rec.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
							</button>
							<p className={styles['ingredients']}>{rec.ingredients.join(', ')}</p>
							<p className={styles['isVegan']}>{rec.isVegan ? 'Vegan' : 'Non-vegan'}</p>
						</li>
					))
				) : (
					<p>Рецепты не найдены</p>
				)}
			</ul>
			
			<div>
				<h2>Любимые рецепты</h2>
				<ul>
					{favoriteRecipes.map(rec => (
						<li key={rec.id}>
							<h3>{rec.name}</h3>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
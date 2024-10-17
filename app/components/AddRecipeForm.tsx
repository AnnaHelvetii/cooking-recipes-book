'use client';

import { useAppDispatch } from "@/store/store";
import { useState } from "react";
import { addRecipe } from "@/store/slices/recipesSlice";

export default function AddRecipeForm() {
	const dispatch = useAppDispatch();

	const [name, setName] = useState('');
	const [ingredients, setIngredients] = useState('');
	
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const ingredientsArray = ingredients.split(',').map(ing => ing.trim());

		dispatch(addRecipe({name, ingredients: ingredientsArray, isFavorite: false}));

		setName('');
		setIngredients('');
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>Добавь свой рецепт!</h2>
			<div>
				<label htmlFor="name">Название рецепта:</label>
				<input 
					type="text"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>
			<div>
				<label htmlFor="ingredients">Ингредиенты (через запятую): </label>
				<input 
					type="text"
					id="ingredients"
					value={ingredients}
					onChange={(e) => setIngredients(e.target.value)}
					required
				/>
			</div>
			<button type="submit">Добавить рецепт</button>
		</form>
	)
}
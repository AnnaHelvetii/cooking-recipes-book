'use client';

import { useAppDispatch } from "@/store/store";
import { useState } from "react";
import { addRecipe } from "@/store/slices/recipesSlice";
import styles from './../styles/AddRecipePage.module.scss';

export default function AddRecipeForm() {
	const dispatch = useAppDispatch();

	const [name, setName] = useState('');
	const [ingredients, setIngredients] = useState('');
	const [isVegan, setIsVegan] = useState(false);
	
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const ingredientsArray = ingredients.split(',').map(ing => ing.trim());

		dispatch(addRecipe({
			name, 
			ingredients: ingredientsArray, 
			isFavorite: false, 
			isVegan, 
			steps: []
		}));

		setName('');
		setIngredients('');
		setIsVegan(false);
	};

	return (
		<form onSubmit={handleSubmit} className={styles['form-container']}>
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
			<div>
				<label>
					<input 
						type="checkbox"
						checked={isVegan}
						onChange={(e) => setIsVegan(e.target.checked)}
					/>
					Для веганов
				</label>
			</div>
			<button type="submit">Добавить рецепт</button>
		</form>
	);
}
'use client';

import { ReactHTMLElement, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { loadRecipesFromStorage, updateRecipe } from "@/store/slices/recipesSlice";

export default function RecipePage() {
	const { id } = useParams();
	const recipeId = Number(id);
	const dispatch = useAppDispatch();

	const recipe = useAppSelector(state =>
		state.recipes.allRecipes.find(rec => rec.id === recipeId)
	);

	const [isLoading, setIsLoading] = useState(true);
	const [editedName, setEditedName] = useState('');
	const [ingredients, setIngredients] = useState<string[]>([]);
	const [newIngredient, setNewIngredient] = useState('');
	const [isVegan, setIsVegan] = useState(false);

	useEffect(() => {
		const allRecipes = localStorage.getItem('allRecipes');
		const favoriteRecipes = localStorage.getItem('favoriteRecipes');

		if (allRecipes || favoriteRecipes) {
			const loadedState = {
				allRecipes: allRecipes ? JSON.parse(allRecipes) : [],
				favoriteRecipes: favoriteRecipes ? JSON.parse(favoriteRecipes) : [],
			};
			dispatch(loadRecipesFromStorage(loadedState));	
		};
		setIsLoading(false);	
	}, [dispatch]);

	useEffect(() => {
		if (recipe) {
			setEditedName(recipe.name);
			setIngredients(recipe.ingredients);
			setIsVegan(recipe.isVegan);
		}
	}, [recipe]);

	const updateRecipeInStore = (updatedName: string, updatedIngredients: string[], updatedIsVegan: boolean) => {
		if (recipe) {
			dispatch(
				updateRecipe({
					id: recipe.id,
					name: updatedName,
					ingredients: updatedIngredients,
					isVegan: updatedIsVegan,
				})
			);
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		setEditedName(newName);
		updateRecipeInStore(newName, ingredients, isVegan);
	};
	
	const handleDeleteIngredient = (index: number) => {
		const updatedIngredients = ingredients.filter((_, i) => i !== index);
		setIngredients(updatedIngredients);
		updateRecipeInStore(editedName, updatedIngredients, isVegan);
	};

	const handleAddIngredient = () => {
		if (newIngredient.trim()) {
			const updatedIngredients = ([...ingredients, newIngredient.trim()]);
			setIngredients(updatedIngredients);
			setNewIngredient('');
			updateRecipeInStore(editedName, updatedIngredients, isVegan);
		}
	};

	const handleVeganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newIsVegan = e.target.checked;
		setIsVegan(newIsVegan);
		updateRecipeInStore(editedName, ingredients, newIsVegan);
	};

	if (isLoading) {
		return <div>Загружаю рецепт...</div>
	}

	if (!recipe) {
		return <div>Рецепт не найден</div>
	}

	return (
		<div>
			<h1>Редактировать рецепт:</h1>
			<div>
				<label htmlFor="recipeName">Название рецепта:</label>
				<input 
					type="text"
					id="recipeName"
					value={editedName}
					onChange={handleNameChange}
				/>
			</div>
			<div>
				<p>Ингредиенты:</p>
				<ul>
					{recipe.ingredients.map((ing, index) => (
						<li key={index}>
							{ing}
							<button onClick={() => handleDeleteIngredient(index)}>
								Удалить
							</button>
						</li>
					))}
				</ul>
			</div>
			<div>
				<input 
					type="text"
					value={newIngredient}
					onChange={(e) => setNewIngredient(e.target.value)}
					placeholder="Новый ингредиент"
				/>
				<button
					onClick={handleAddIngredient}
				>Добавить ингредиент</button>
			</div>
			<div>
				<label>
					<input
						type="checkbox"
						checked={isVegan}
						onChange={handleVeganChange}
					/>
					Подходит для веганов?
				</label>
			</div>
			<div>
				<p>
				{recipe.isFavorite ? 'Это Ваш любимый рецепт!' : ''}
				</p>
			</div>
			<div>
				<Link href="/">
					<button>Вернуться ко всем рецептам</button>
				</Link>
			</div>
		</div>
	)
}
'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { loadRecipesFromStorage, updateRecipe, addRecipeStep, removeRecipeStep } from "@/store/slices/recipesSlice";
import Link from "next/link";
import styles from "./../../styles/RecipePage.module.scss";

interface RecipeStep {
	stepNumber: number;
	description: string;
	image?: string;
}

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
	const [steps, setSteps] = useState<RecipeStep[]>([]);
	const [newStepDescription, setNewStepDescription] = useState('');
	const [newStepImage, setNewStepImage] = useState<string | null>(null);
	const [editingStep, setEditingStep] = useState<RecipeStep | null>(null);

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
			setIngredients(recipe.ingredients ?? []);
			setIsVegan(recipe.isVegan);
			setSteps(recipe.steps ?? []);
		}
	}, [recipe]);

	const updateRecipeInStore = (
		updatedName: string, 
		updatedIngredients: string[], 
		updatedIsVegan: boolean,
		updatedSteps: RecipeStep[]
	) => {
		if (recipe) {
			dispatch(
				updateRecipe({
					id: recipe.id,
					name: updatedName,
					ingredients: updatedIngredients,
					isVegan: updatedIsVegan,
					steps: updatedSteps
				})
			);
		}
	};

	const handleAddStep = () => {
		const newStep: RecipeStep = {
			stepNumber: steps.length + 1,
			description: newStepDescription,
			image: newStepImage || undefined
		};
		const updatedSteps = [...steps, newStep];
		setSteps(updatedSteps);
		updateRecipeInStore(editedName, ingredients, isVegan, updatedSteps);
		setNewStepDescription('');
		setNewStepImage(null);
	};

	const handleDeleteStep = (stepNumber: number) => {
		const updatedSteps = steps
			.filter(step => step.stepNumber !== stepNumber)
			.map((step, index) => ({ ...step, stepNumber: index + 1 }));
		setSteps(updatedSteps);
		updateRecipeInStore(editedName, ingredients, isVegan, updatedSteps);
	};

	const handleEditStep = (step: RecipeStep) => {
		setEditingStep(step);
		setNewStepDescription(step.description);
		setNewStepImage(step.image || null);
	};

	const handleSaveEditedStep = () => {
		const updatedSteps = steps.map(step => {
			if (step.stepNumber === editingStep?.stepNumber) {
				return { ...step, description: newStepDescription, image: newStepImage || undefined };
			}
			return step;
		});
		setSteps(updatedSteps);
		updateRecipeInStore(editedName, ingredients, isVegan, updatedSteps);
		setEditingStep(null);
		setNewStepDescription('');
		setNewStepImage(null);
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		setEditedName(newName);
		updateRecipeInStore(newName, ingredients, isVegan, steps);
	};
	
	const handleDeleteIngredient = (index: number) => {
		const updatedIngredients = ingredients.filter((_, i) => i !== index);
		setIngredients(updatedIngredients);
		updateRecipeInStore(editedName, updatedIngredients, isVegan, steps);
	};

	const handleAddIngredient = () => {
		if (newIngredient.trim()) {
			const updatedIngredients = ([...ingredients, newIngredient.trim()]);
			setIngredients(updatedIngredients);
			setNewIngredient('');
			updateRecipeInStore(editedName, updatedIngredients, isVegan, steps);
		}
	};

	const handleVeganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newIsVegan = e.target.checked;
		setIsVegan(newIsVegan);
		updateRecipeInStore(editedName, ingredients, newIsVegan, steps);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				setNewStepImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setNewStepImage(null);
	}

	if (isLoading) {
		return <div>Загружаю рецепт...</div>
	}

	if (!recipe) {
		return <div>Рецепт не найден</div>
	}

	return (
		<div className={styles['recipe-container']}>
			<h1>Редактировать рецепт:</h1>
			<div>
				<label htmlFor="recipeName">Название рецепта:</label>
				<input 
					type="text"
					id="recipeName"
					value={editedName}
					onChange={handleNameChange}
					className={styles['input']}
				/>
			</div>
			<div className={styles['ingredients-list']}>
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
				<h2>Приготовление:</h2>
				{steps.length > 0 ? (steps.map((step) => (
					<div key={step.stepNumber} className={styles['step-item']}>
						<h3>Шаг {step.stepNumber}</h3>
						<p>{step.description}</p>
						{step.image && <img src={step.image} alt={`Step ${step.stepNumber}`} width='100' />}
						<button
							className={styles['delete-button']}
							onClick={() => handleDeleteStep(step.stepNumber)}>Удалить шаг</button>
						<button
							className={styles['edit-button']}
							onClick={() => handleEditStep(step)}>Редактировать шаг</button>
					</div>
					))
				) : (
					<p>Шаги еще не добавлены</p>
				)}
			</div>
			<div>
				<h3>{editingStep ? 'Редактировать' : 'Добавить еще один шаг'}</h3>
				<textarea
					value={newStepDescription}
					onChange={(e) => setNewStepDescription(e.target.value)}
					placeholder="Что нужно сделать?"
				/>
				<input 
					type="file"
					onChange={handleImageUpload}
				/>
				{newStepImage && (
					<div>
						<img src={newStepImage} alt="Фото шага приготовления" width='100' />
						<button onClick={handleRemoveImage}>Удалить фото</button>
					</div>
				)}
				<button onClick={editingStep ? handleSaveEditedStep : handleAddStep}>
					{editingStep ? 'Редактировать шаг' : 'Добавить шаг?'}
				</button>
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
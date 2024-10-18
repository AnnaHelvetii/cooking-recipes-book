'use client';

import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/store";

export default function RecipePage() {
	const { id } = useParams();
	const recipeId = Number(id);

	const recipe = useAppSelector(state =>
		state.recipes.allRecipes.find(rec => rec.id === recipeId)
	);

	if (!recipe) {
		return <div>Рецепт не найден</div>
	}

	return (
		<div>
			<h1>{recipe.name}</h1>
			<p>Ингредиенты:</p>
			<ul>
				{recipe.ingredients.map((ing, index) => (
					<li key={index}>
						{ing}
					</li>
				))}
			</ul>
			<p>
				{recipe.isFavorite ? 'Это Ваш любимый рецепт!' : ''}
			</p>
		</div>
	)
}
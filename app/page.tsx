'use client';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setRecipes, toggleFavorite } from "@/store/slices/recipesSlice";

export default function Home() {
	return (
		<div className="container">
			<h1>Cooking Recipes Book</h1>
			<h2>All Recipes</h2>
			<ul>

			</ul>

			<h2>Favorite Recipes</h2>
			<ul>

			</ul>
		</div>
	);
}

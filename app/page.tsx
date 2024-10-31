'use client';

import AddRecipeForm from './components/AddRecipeForm';
import ClientRecipes from './components/ClientRecipes';

export default function Home() {
	return (
		<div className="container">
			<h1 className='main-title'>Recipe Catalog</h1>
			<AddRecipeForm />
			<ClientRecipes />
		</div>
	);
}

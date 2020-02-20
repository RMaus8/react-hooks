import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
	const [ ingredients, setIngredients ] = useState([]);

	useEffect(() => {
		fetch('https://react-hooks-e54e1.firebaseio.com/ingredients.json')
			.then(res => res.json())
			.then(resData => {
				const loadedIngredients = [];
				for (const key in resData) {
					loadedIngredients.push({
						id: key,
						title: resData[key].title,
						amount: resData[key].amount
					});
				}
				setIngredients(loadedIngredients);
			});
	}, []);

	const filteredIngredients = useCallback(filteredIngs => {
		setIngredients(filteredIngs);
	}, []);

	const addIngredientHandler = ingredient => {
		fetch('https://react-hooks-e54e1.firebaseio.com/ingredients.json', {
			method: 'POST',
			body: JSON.stringify(ingredient),
			headers: { 'Content-Type': 'application/json' }
		}).then( response => {
			return response.json();
		}).then( resData => {
			setIngredients(prevIngredients => [...prevIngredients, {id: resData.name, ...ingredient}]);
		});
	}

	const removeIngredientHandler = ingId => {
		setIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== ingId));
	}

	return (
		<div className="App">
			<IngredientForm addIngredient={addIngredientHandler}/>

			<section>
				<Search onLoadIngredients={filteredIngredients}/>
				<IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
			</section>
		</div>
	);
}

export default Ingredients;

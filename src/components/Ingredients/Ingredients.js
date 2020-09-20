import React, { useState, useReducer, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import axios from "axios";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredientsState, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredientsState, action.ingredients];
    case "DELETE":
      return action.ingredients;
    default:
      throw new Error("should not be reached");
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { errorMessage: null, spinner: true };
    case "AFTER_RESPONSE":
      return { ...currentHttpState, spinner: false };
    case "ERROR":
      return { ...currentHttpState, errorMessage: action.errorMessage };
    default:
      throw new Error("should not be reached");
  }
};

const Ingredients = () => {
  // const [ingredientsState, setIngredientsState] = useState([]);
  const [ingredientsState, dispatch] = useReducer(ingredientReducer, []);
  // const [spinner, setSpinner] = useState(false);
  // const [errorMessage, setErrorMessage] = useState();
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    spinner: false,
    errorMessage: null,
  });

  // Add ingredient to DB and state when add button is pressed
  const addIngredientHandler = (ingredients) => {
    dispatchHttp({ type: "SEND" });
    // setSpinner(true);
    axios
      .post(
        "https://learn-react-hooks-a3646.firebaseio.com/ingredients.json",
        ingredients
      )
      .then((response) => {
        dispatchHttp({ type: "AFTER_RESPONSE" });
        // setSpinner(false);
        dispatch({
          type: "ADD",
          ingredients: { id: response.data.name, ...ingredients },
        });
        // setIngredientsState((prevIngredientsState) => {
        //   return [
        //     ...prevIngredientsState,
        //     {
        //       id: response.data.name,
        //       title: ingredients.title,
        //       amount: ingredients.amount,
        //     },
        //   ];
        // });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong" });
        // setErrorMessage("Something went wrong");
      });
  };

  const removeIngredientHandler = (id) => {
    dispatchHttp({ type: "SEND" });
    // setSpinner(true);
    axios
      .delete(
        `https://learn-react-hooks-a3646.firebaseio.com/ingredients/${id}.json`
      )
      .then((response) => {
        dispatchHttp({ type: "AFTER_RESPONSE" });
        // setSpinner(false);
        const updatedIngredientState = ingredientsState.filter((ingredient) => {
          return ingredient.id !== id;
        });
        dispatch({ type: "DELETE", ingredients: updatedIngredientState });
        // setIngredientsState(updatedIngredientState);
      })
      .catch((error) => console.log(error));
  };

  //to search a specific ingredient and to show complete ingredient while loading
  const showSearchResults = (searchResults) => {
    dispatch({ type: "SET", ingredients: searchResults });
    // setIngredientsState(searchResults);
    dispatchHttp({ type: "AFTER_RESPONSE" });
    // setSpinner(false);
  };

  const closeErrorHandler = () => {
    dispatchHttp({ type: "ERROR", errorMessage: null });
    // setErrorMessage(null);
    dispatchHttp({ type: "AFTER_RESPONSE" });
    // setSpinner(false);
  };

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        isLoading={httpState.spinner}
      />
      {httpState.errorMessage ? (
        <ErrorModal onClose={closeErrorHandler}>
          {httpState.errorMessage}
        </ErrorModal>
      ) : null}
      <section>
        <Search onShowResults={showSearchResults} />
      </section>
      <IngredientList
        ingredients={ingredientsState}
        onRemoveItem={removeIngredientHandler}
      />
    </div>
  );
};

export default Ingredients;

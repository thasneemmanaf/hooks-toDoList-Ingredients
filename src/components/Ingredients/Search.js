import React, { useState, useEffect, useRef } from "react";
import Card from "../UI/Card";
import "./Search.css";
import axios from "axios";

const Search = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();
  const initialIngredients = [];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const queryParams =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        axios
          .get(
            "https://learn-react-hooks-a3646.firebaseio.com/ingredients.json" +
              queryParams
          )
          .then((response) => {
            for (let key in response.data) {
              initialIngredients.push({
                id: key,
                title: response.data[key].title,
                amount: response.data[key].amount,
              });
            }

            props.onShowResults(initialIngredients);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 1000);
    // to do clean up - clear the timer
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;

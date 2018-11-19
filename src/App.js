import React, { useReducer, useEffect } from "react";

const apiKey = process.env.REACT_APP_GIPHY_API_KEY;

const SearchBar = ({ query, dispatch }) => {
  return (
    <input
      name="search"
      value={query}
      placeholder="your search term"
      style={{ marginBottom: "20px" }}
      onChange={event =>
        dispatch({ type: "CHANGE_QUERY", query: event.target.value })
      }
    />
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_QUERY":
      return { ...state, ...{ query: action.query } };
    case "START_LOADING":
      return { ...state, ...{ loading: true } };
    case "GIFS_LOADED":
      return { ...state, ...{ gifUrls: action.gifUrls, loading: false } };
    default:
      return state;
  }
};

const fetchGifs = async (query, dispatch) => {
  dispatch({ type: "START_LOADING" });
  const result = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}`
  );
  const giphyJson = await result.json();

  const gifUrls = giphyJson.data.map(gif => gif.images.fixed_width.url);

  dispatch({ type: "GIFS_LOADED", gifUrls });
};

const Giphs = ({ gifUrls }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {gifUrls.map((url, index) => (
        <img
          src={url}
          key={index}
          style={{ minWidth: "200px", flex: 1, display: "block" }}
          alt="a gif"
        />
      ))}
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    query: "",
    gifUrls: [],
    loading: false
  });

  useEffect(
    () => {
      if (state.query.length > 2) {
        fetchGifs(state.query, dispatch);
      }
    },
    [state.query]
  );

  return (
    <div style={{ padding: "20px" }}>
      <SearchBar query={state.query} dispatch={dispatch} />

      {state.loading ? "Loading..." : <Giphs gifUrls={state.gifUrls} />}
    </div>
  );
};

export default App;

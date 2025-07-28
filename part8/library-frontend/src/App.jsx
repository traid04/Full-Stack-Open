import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Notification from "./components/Notification";
import Recommend from "./components/Recommend";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const [error, setError] = useState(null);

  const client = useApolloClient();

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("user-token");
      setPage("authors");
      client.resetStore();
    }
  }, [token]);

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={() => setToken(null)}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {error ? <Notification errorMsg={error} /> : <></>}

      <Login
        show={page === "login"}
        setPage={setPage}
        setToken={setToken}
        setError={setError}
      />

      <Recommend show={page === "recommend"} />

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;

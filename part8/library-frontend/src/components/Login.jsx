import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "./queries.js";
import { useApolloClient } from "@apollo/client";

const Login = ({ show, setToken, setError, setPage }) => {
  const client = useApolloClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
      setPage("authors");
      client.resetStore();
    }
  }, [result.data]);

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "./queries";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [allGenres, setAllGenres] = useState([]);
  const result = useQuery(ALL_BOOKS, {
    variables: selectedGenre != "" ? { genre: selectedGenre } : {},
  });

  const allBooksResult = useQuery(ALL_BOOKS);
  useEffect(() => {
    if (allBooksResult.data) {
      let g = [];
      allBooksResult.data.allBooks.forEach((book) => {
        book.genres.forEach((genre) => {
          g = g.concat(genre);
        });
      });
      const newSet = new Set(g);
      setAllGenres([...newSet]);
    }
  }, [allBooksResult.data]);
  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allGenres.map((genre) => (
        <button
          key={genre}
          onClick={(e) => setSelectedGenre(e.target.textContent)}
        >
          {genre}
        </button>
      ))}
      <button onClick={() => setSelectedGenre("")}>all genres</button>
    </div>
  );
};

export default Books;

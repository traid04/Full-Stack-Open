import { useQuery, useLazyQuery } from "@apollo/client";
import { ME, ALL_BOOKS } from "./queries.js";
import { useEffect } from "react";

const Recommend = ({ show }) => {
  const result = useQuery(ME);
  const [getBooks, res] = useLazyQuery(ALL_BOOKS);
  let filteredBooks = [];
  const user = result.data?.me;
  useEffect(() => {
    if (user?.favoriteGenre) {
      getBooks({ variables: { genre: user.favoriteGenre } });
    }
  }, [user, getBooks]);

  if (!show) {
    return null;
  }

  if (result.loading || res.loading) {
    return <div>loading...</div>;
  }

  if (!user || !res.data) {
    return <div>not available</div>;
  }

  filteredBooks = res.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{user.favoriteGenre}</strong>
      </p>
      <div>
        <table>
          <tbody>
            <tr>
              <td></td>
              <td>
                <strong>author</strong>
              </td>
              <td>
                <strong>published</strong>
              </td>
            </tr>
            {filteredBooks.map((book) => {
              return (
                <tr key={book.title}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recommend;

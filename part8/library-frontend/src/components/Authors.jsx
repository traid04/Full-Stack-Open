import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_BORN } from "./queries";
import Select from "react-select";

const Authors = (props) => {
  const [selectedName, setSelectedName] = useState(null);
  const [born, setBorn] = useState("");
  const result = useQuery(ALL_AUTHORS);
  const [editBorn] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  if (!result.data) {
    return <div>loading data...</div>;
  }

  const authors = result.data.allAuthors;

  const handleSubmit = (e) => {
    e.preventDefault();
    editBorn({ variables: { name: selectedName, setBornTo: Number(born) } });
    setSelectedName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Select
            defaultValue={selectedName}
            options={authors.map((a) => {
              return { value: a.name, label: a.name };
            })}
            onChange={(e) => setSelectedName(e.value)}
          />
        </div>
        <div>
          born <input value={born} onChange={(e) => setBorn(e.target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;

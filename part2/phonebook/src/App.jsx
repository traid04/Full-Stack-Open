import { useState } from 'react'

const Filter = ({newFilter, handleChangeFilter}) => {
  return (
    <div>
      filter shown with <input value={newFilter} onChange={handleChangeFilter} />
    </div>
  )
}

const PersonForm = ({newName, newNumber, handleSubmit, handleChangeName, handleChangeNumber}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleChangeName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons}) => {
  return (
    <>
      {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const addName = {
      name: newName,
      number: newNumber
    };
    const newList = persons.concat(addName);
    setPersons(newList);
    setNewName('');
    setNewNumber('');
  }

  const handleChangeName = e => {
    setNewName(e.target.value);
  }

  const handleChangeNumber = e => {
    setNewNumber(e.target.value);
  }

  const handleChangeFilter = e => {
    setNewFilter(e.target.value);
  }

  const filterPersons = () => {
    if (newFilter !== '') {
      const newList = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()));
      return newList;
    }
    return persons;
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleChangeFilter={handleChangeFilter} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleSubmit={handleSubmit} handleChangeName={handleChangeName} handleChangeNumber={handleChangeNumber} />
      <h2>Numbers</h2>
      <Persons persons={filterPersons()} />
    </div>
  )
}

export default App

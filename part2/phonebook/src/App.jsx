import { useState, useEffect } from 'react';
import personsServices from './services/persons.js';
import './index.css';

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

const Persons = ({persons, handleDelete}) => {
  return (
    <>
      {persons.map(person => <p key={person.id}>{person.name} {person.number} <button onClick={() => {
        const confirm = window.confirm(`Delete ${person.name}?`);
        if (confirm) {
          handleDelete(person.id);
        }}}
        >delete</button></p>)}
    </>
  )
}

const Notification = ({message, typeAlert}) => {
  if (message === null) {
    return null;
  }
  return(
    <div className={typeAlert === 'error' ? 'error' : 'success'}>{message}</div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [typeAlert, setTypeAlert] = useState('');

  useEffect(() => {
    const data = personsServices.getAll();
    data.then(result => setPersons(result));
  }, []);


  const handleSubmit = e => {
    e.preventDefault();
    if (persons.some(person => person.name === newName)) {
      const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
      if (confirm) {
        const person = persons.find(person => person.name === newName);
        const updatedPerson = {...person, number: newNumber};
        const data = personsServices.update(updatedPerson);
        data.then(result => {
          const newList = persons.map(person => person.id !== result.id ? person : result);
          setPersons(newList);
          setNewName('');
          setNewNumber('');
          setMessage(`Updated ${result.name}`);
          setTypeAlert('success');
          setTimeout(() => {
            setMessage(null);
            setTypeAlert('');
          }, 3000);
       })
       .catch(() => {
        setMessage(`Information of ${newName} has already been removed from server`);
        setTypeAlert('error');
        setTimeout(() => {
          setMessage(null);
          setTypeAlert('');
        }, 5000);
      });
       return;
    }
    }
    const addPerson = {
      name: newName,
      number: newNumber
    };
    const data = personsServices.create(addPerson);
    data.then(result => {
      const newList = persons.concat(result);
      setPersons(newList);
      setNewName('');
      setNewNumber('');
      setMessage(`Added ${result.name}`);
      setTypeAlert('success');
      setTimeout(() => {
        setMessage(null);
        setTypeAlert('');
      }, 3000)
    })
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

  const handleDelete = id => {
    const data = personsServices.remove(id);
    data.then(() => {
      const newList = persons.filter(person => person.id !== id);
      setPersons(newList);
    })
    .catch(() => {
        setMessage(`This user has already been removed from server`);
        setTypeAlert('error');
        setTimeout(() => {
          setMessage(null);
          setTypeAlert('');
        }, 5000);
      });
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
      <Notification message={message} typeAlert={typeAlert}></Notification>
      <Filter newFilter={newFilter} handleChangeFilter={handleChangeFilter} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleSubmit={handleSubmit} handleChangeName={handleChangeName} handleChangeNumber={handleChangeNumber} />
      <h2>Numbers</h2>
      <Persons persons={filterPersons()} handleDelete={handleDelete} />
    </div>
  )
}

export default App

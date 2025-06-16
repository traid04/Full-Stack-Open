import axios from 'axios';

const baseURL = 'http://localhost:3001/persons';

const getAll = () => {
    const request = axios.get(baseURL);
    return request.then(result => result.data);
}

const create = newPerson => {
    const request = axios.post(baseURL, newPerson);
    return request.then(result => result.data);
}

const update = updatedPerson => {
    const request = axios.put(`${baseURL}/${updatedPerson.id}`, updatedPerson);
    return request.then(result => result.data);
}

const remove = id => {
    const request = axios.delete(`${baseURL}/${id}`);
    return request.then(result => result.data);
}

export default {getAll, create, remove, update};
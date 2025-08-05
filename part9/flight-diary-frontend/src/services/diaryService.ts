import axios from 'axios';
import type { Diary, NewDiaryEntry } from '../types'

const baseUrl = 'http://localhost:3000/api/diaries'

export const getAll = () => {
    return axios
        .get<Diary[]>(baseUrl)
        .then(response => response.data);
};

export const addDiary = (diary : NewDiaryEntry) => {
    return axios
        .post<Diary>(baseUrl, diary)
        .then(response => response.data)
}
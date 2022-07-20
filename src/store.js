import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import logger from 'redux-logger';

const moviesReducer = (state = [], action)=> {
    if(action.type === 'SET_MOVIES'){
        return action.movies;
    }
    if(action.type === 'CREATE_MOVIE'){
        return [...state, action.movie];
    }
    if(action.type === 'DELETE_MOVIE'){
        return state.filter(movie => movie.id !== action.movie.id )
      }
    if(action.type === 'UPDATE_RATING'){
        return state.map(movie => movie.id !== action.movie.id ? movie : action.movie);
      }

    return state;
};


const reducer = combineReducers({
    movies: moviesReducer
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export const fetchMovies = ()=> {
    return async(dispatch)=> {
const movies = (await axios.get('/api/movies')).data;
dispatch({type: 'SET_MOVIES', movies})
    }
}
//thunk getting info(movies) from axios

export const createMovie = () => {
    return async(dispatch) => { 
        let movie = {name: Math.random()}
        movie = (await axios.post('/api/movies', movie)).data
        dispatch({type: 'CREATE_MOVIE', movie})
    }
} 

export const deleteMovie = (movie) => {
    return async(dispatch) => {
      await axios.delete(`/api/movies/${movie.id}`);
      dispatch({type: 'DELETE_MOVIE', movie});
    };
  };

  export const updateRating = (movie)=> {
    return async(dispatch)=> {
        movie = (await axios.put(`/api/movies/${movie.id}`, movie)).data;
      dispatch({ type: 'UPDATE_RATING', movie });
    };
  };


export default store
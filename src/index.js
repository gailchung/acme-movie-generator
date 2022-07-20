import { createRoot } from 'react-dom/client';
import React, {Component} from 'react';
import { Provider, connect } from 'react-redux';
import axios from 'axios';
import store, {fetchMovies, createMovie, deleteMovie} from './store';

const App = connect(
    state => state, //mapStateToProps
    dispatch => {
        return {
            loadData: ()=> {
                dispatch(fetchMovies());
            },
            createMovie: ()=> {
                dispatch(createMovie());
            },
            deleteMovie: (movie)=> {
                dispatch(deleteMovie(movie));
            },
            increment: async(movie, dir)=> {
                movie = {...movie, rating: movie.rating + dir};
                await axios.put(`/api/movies/${movie.id}`, movie);
                dispatch({type: 'UPDATE_RATING', movie});
              },
              decrement: async(movie, dir)=> {
                movie = {...movie, rating: movie.rating + dir};
                await axios.put(`/api/movies/${movie.id}`, movie);
                dispatch({type: 'UPDATE_RATING', movie});
              }
        };
    }

    )(class App extends Component{ //mapDispatchToProps
        componentDidMount() {
            this.props.loadData();
        }
        // componentDidUpdate(previousState) {
        //     if (this.props.state.movies.length !== previousState.movies.length) {
        //         this.props.state.loadMovies()
        //     }
        // }
        

    render () {
        const  {movies, createMovie, deleteMovie, increment, decrement} = this.props;
        return (
            <div>
                <h1>Movies</h1>
                <main>
                <button onClick={ createMovie }>Add a movie</button>

                    <ul>
                        {
                            movies.map(movie => {
                                return (
                                    <li key={movie.id}>
                                        <h2>{movie.name}</h2>
                                        Rating:{movie.rating}
                                        <button onClick={ ()=> deleteMovie(movie)}>Delete Movie</button>
                                        <button onClick={()=> increment(movie, 1)}>Increase Rating</button>
                                        <button onClick={()=> decrement(movie, -1)}>Decrease Rating</button>

                                    </li>
                                )
                            })
                        }
                    </ul>
                </main>
            </div>
        )
    }
})

const root = createRoot(document.querySelector('#root'))
root.render(<Provider store = { store }> <App /></Provider>)
import React, { Component} from 'react';
import axios from 'axios';
import './Search.css'

import Movie from './Movie'

class Search extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      searchList: [],
      displayAddedDatabaseClassName: "classname-message"
    }
  }

  onChangeTitle = (event) => {
    this.setState({displayAddedDatabaseClassName: "classname-message"})
    let title = this.state.title;
    const value = event.target.value;
    title = value;
    this.setState({title})

  }

  onFormSubmit = (event) => {
    event.preventDefault();
    axios.get('http://localhost:3090/movies?query=' + this.state.title.toString())
    .then((response) => {
      const searchList = response.data.map((movie) => {
          return movie
      })
      this.setState({searchList})
    })
  }
  
  onMovieSelect = (movie) => {
    return () => {
    axios.post('http://localhost:3090/movies', 
    {
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      image_url: movie.image_url.slice(31, movie.image_url.length),
      external_id: movie.external_id,
    }
    )
    .then((response) => {
      console.log(response)
    })
      let newState = this.state
      newState.searchList = [];
      this.setState({newState});
      this.setState({title: "", displayAddedDatabaseClassName: "classname-message-display"})
    }
  }

  callback = () => {}

  searchDisplay = () => {
    return this.state.searchList.map((movie) => {
      return (
        <tbody>
          <td><button className="select-link" onClick={this.onMovieSelect(movie)}>Select!</button></td>
          <Movie 
            key={movie.id}
            id={movie.id}
            title={movie.title}
            release_date={movie.release_date}
            overview={movie.overview}
            image_url={movie.image_url}
            addMovieToRentCallback = {this.callback}
          />          
        </tbody>
      )
    })
  }

  render () {
    return (
      <div>
        <form 
        className="form-inline mr-auto"
        onSubmit={this.onFormSubmit}
        >
          <div className="form-group">
          <input className="form-control mr-sm-2" name="title" type="text" value={this.state.title} onChange={this.onChangeTitle} placeholder="Movie title" aria-label="Search"/>
          <input className="btn btn-info btn-rounded btn-sm my-0" type="submit" value="Search" />
          </div>
        </form>
        <p className={this.state.displayAddedDatabaseClassName}>You've added the movie to the database!</p>
        <h4>{this.searchDisplay()}</h4>
      </div>
    );
  }
}

export default Search;
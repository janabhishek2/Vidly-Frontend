import React, { Component } from "react";
class ListGroup extends Component {
  render() {
    const genres = this.props.genres;
    return (
      <div className="list-group ">
        <button
          style={{ cursor: "pointer" }}
          className={
            this.props.selectedGenre == ""
              ? "list-group-item list-group-item-action active"
              : "list-group-item list-group-item-action "
          }
          onClick={() => this.props.onGenreChange("")}
        >
          All Movies
        </button>
        {genres.map((genre) => {
          return (
            <button
              style={{ cursor: "pointer" }}
              className={
                this.props.selectedGenre == genre.name
                  ? "list-group-item list-group-item-action active"
                  : "list-group-item list-group-item-action "
              }
              key={genre._id}
              onClick={() => this.props.onGenreChange(genre)}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    );
  }
}

export default ListGroup;

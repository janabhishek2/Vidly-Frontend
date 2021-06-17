import React, { Component } from "react";
class SearchMovies extends Component {
  state = {};
  render() {
    return (
      <form>
        <div className="form-group">
          <input
            type="text"
            placeholder="Search Movies"
            className="form-control"
            value={this.props.searchString}
            onChange={this.props.onSearch}
          />
        </div>
      </form>
    );
  }
}

export default SearchMovies;

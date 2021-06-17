import React, { Component } from "react";
import { getGenres } from "../services/genreService";

class Test extends Component {
  state = {
    genres: [],
  };
  async componentDidMount() {
    const { data: res } = await getGenres();
    this.setState({ genres: res });
  }
  render() {
    return (
      <ul>
        <li>Hello</li>
      </ul>
    );
  }
}

export default Test;

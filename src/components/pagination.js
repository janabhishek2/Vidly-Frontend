import React, { Component } from "react";
import _ from "lodash";

class Pagination extends Component {
  render() {
    const { count, pageSize, currPage } = this.props;
    const pagesCount = Math.ceil(count / pageSize);
    const pages = _.range(1, pagesCount + 1);
    if (pagesCount == 1) {
      return null;
    }
    return (
      <nav>
        <ul className="pagination">
          {pages.map((page) => {
            return (
              <li
                style={{ cursor: "pointer" }}
                key={page}
                className={page == currPage ? "page-item active" : "page-item"}
              >
                <a
                  onClick={() => this.props.onPageChange(page)}
                  className="page-link"
                >
                  {page}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default Pagination;

import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar(props) {
  const [term, setTerm] = useState('');

  return (
    <div className="SearchBar">
      <input
        onChange={(event) => setTerm(event.target.value)}
        onKeyPress={(event) => event.key === 'Enter' ? props.onSearch(term) : null}
        placeholder="Enter A Song, Album, or Artist" />
      <a onClick={() => props.onSearch(term)}>SEARCH</a>
    </div>
  );
}

export default SearchBar;
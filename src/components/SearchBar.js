import SearchResults from "../components/SearchResults";
import ClearIcon from "../icons/ClearIcon";
import SearchIcon from "../icons/SearchIcon";
import SmallLoadingIcon from "../icons/SmallLoadingIcon";
import db from "../lib/firebase";
import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchBar() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    setResults([]);
  }, [location.pathname]);

  useEffect(() => {
    const searchUsers = debounce(async () => {
      try {
        setLoading(true);
        let usersRef = db.collection("users");

        if (query) {
          usersRef = usersRef
            .where("username", ">=", `@${query}`)
            .where("username", "<", `@${query}\uf8ff`)
            .limit(4);

          const result = await usersRef.orderBy("username").get();
          const results = result.docs.map((doc) => doc.data());
          setResults(results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    if (query.trim().length > 0) {
      searchUsers();
    }
  }, [query]);

  function clearInput() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="searchbar-container">
      <form className="searchbar-form">
        <input
          ref={inputRef}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          autoComplete="off"
          placeholder="Search accounts"
          type="text"
          className="searchbar-input"
        />
        <div>
          {query && !isLoading && <ClearIcon onClick={clearInput} />}
          {isLoading && <SmallLoadingIcon />}
        </div>
        <span className="searchbar-border"></span>
        <button className="searchbar-icon">
          <SearchIcon></SearchIcon>
        </button>
      </form>
      <SearchResults results={results} query={query} />
    </div>
  );
}

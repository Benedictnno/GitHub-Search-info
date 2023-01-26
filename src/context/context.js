import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubuser, setGithubuser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollwers] = useState(mockFollowers);

  return (
    <GithubContext.Provider value={{githubuser,repos,followers}}>
        {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };

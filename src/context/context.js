import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

export const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubuser, setGithubuser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollwers] = useState(mockFollowers);
  //request loading
  const [request, setRequest] = useState(0);
  const [isLoading, setLoading] = useState(false);
  // error
  const [error, setError] = useState({ show: false, msg: "" });
  // check rate
  async function checkRequest() {
    try {
      const { data } = await axios(`${rootUrl}/rate_limit`);
      let {
        rate: { remaining },
      } = data;
      setRequest(remaining);
      if (remaining === 0) {
        toggleError(true, "sorry, You have exceeded your hourly rate limit!");
      }
    } catch (error) {
      console.log(error.response);
    }
  }
  // console.log(githubuser);

  async function getUser(user) {
    toggleError();
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>
      console.log(error.response)
    );

    if (response) {
      setGithubuser(response.data);
      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        ,
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, _, followers] = results;
          console.log(repos);
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollwers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));

    } else {
      toggleError(true, "there is no user with that name");
    }
    checkRequest();
    setLoading(false);
  }


  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "1aa3c1fb9emsh65f383b40941aa3p10245ajsnb76f0cf4f289",
      "X-RapidAPI-Host": "geography2.p.rapidapi.com",
    },
  };

  fetch("https://geography2.p.rapidapi.com/continents/1", options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }
  // error
  useEffect(() => {
    checkRequest();
  }, [checkRequest]);
  return (
    <GithubContext.Provider
      value={{
        githubuser,
        isLoading,
        repos,
        followers,
        request,
        error,
        getUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };

import React, { useContext } from "react";
import { Info, Repos, User, Search, Navbar } from "../components";
import loadingImage from "../images/preloader.gif";
import { GithubContext } from "../context/context";
const Dashboard = () => {
  const {isLoading} = useContext(GithubContext)
  return (
    <>
      {isLoading ? (
        <main>
          <Navbar />
          <Search />
          <img src={loadingImage} alt="" style={{maxWidth:'20rem', margin:'auto'}}/>
        </main>
      ) : (
        <main>
          <Navbar />
          <Search />
          <Info />
          <User />
          <Repos />
        </main>
      )}
    </>
  );
};

export default Dashboard;

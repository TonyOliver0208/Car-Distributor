import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Category from "./components/Category";
import MostSearchedCar from "./components/MostSearchedCar";
import InforSection from "./components/InforSection";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Category />
      <MostSearchedCar />
      <InforSection />
      <Footer />
    </div>
  );
};

export default Home;

import Head from "next/head";
import { Divider } from "@mui/material";
import { MainLayout } from "../components/main-layout";
import { HomeClients } from "../components/home/home-clients";
import { HomeHero } from "../components/home/home-hero";
import { HomeDevelopers } from "../components/home/home-developers";
import { HomeDesigners } from "../components/home/home-designers";
import { HomeFeatures } from "../components/home/home-features";
import { HomeTestimonials } from "../components/home/home-testimonials";
import path from "path";
path.resolve("./next.config.js");

const Home = () => {
  return (
    <>
      <Head>
        <title>Material Kit Pro</title>
      </Head>
      <main>
        <HomeHero />
        <Divider />
        <HomeDevelopers />
        <Divider />
        <HomeDesigners />
        <HomeTestimonials />
        <HomeFeatures />
        <Divider />
        <HomeClients />
      </main>
    </>
  );
};

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Home;

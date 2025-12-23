"use client";
import Head from "next/head";
import HeaderSection from "./Humancapital/header";
import RecruitmentCard from "./Humancapital/recriutmCard";
import TrainingCard from "./Humancapital/trainingCard";
import SkillsTags from "./Humancapital/skillsTag";
import EventsSection from "./Humancapital/hcdEvents";

export default function HumanCapitalDevelopment() {
  return (
    <>
      <Head>
        <title>Human Capital Development | Lamid Consulting</title>
        <meta
          name="description"
          content="Lamid Consulting empowers organizations through strategic recruitment, leadership training, and skill development to build world-class teams."
        />
        <link rel="canonical" href="https://lamidconsulting.com/hcd" />
      </Head>

      <div className="bg-gradient-to-br from-black via-gray-900/90 to-black text-white min-h-screen w-full">
        {/* Header */}
        <HeaderSection />

        {/* Recruitment + Training */}
        <div className="container mx-auto px-4 py-10 space-y-10">
          <RecruitmentCard />
          <TrainingCard />
        </div>

        {/* Skills */}
        <div className="container mx-auto px-4 py-10">
          <SkillsTags />
        </div>

        {/* Events */}
        <EventsSection />
      </div>
    </>
  );
}

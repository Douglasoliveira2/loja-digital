import { Benefits } from "@/components/home/Benefits";
import { Categories } from "@/components/home/Categories";
import { Featured } from "@/components/home/Featured";
import { Hero } from "@/components/home/Hero";
import { Shelf } from "@/components/home/Shelf";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Shelf />
      <Featured />
      <Benefits />
    </>
  );
}

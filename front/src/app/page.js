import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ComoFunciona from "@/components/ComoFunciona";
import Voluntarios from "@/components/Voluntarios";
import CadastroVoluntario from "@/components/CadastroVoluntario";
import CadastroLar from "@/components/CadastroLar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ComoFunciona />
      <Voluntarios />
      <CadastroVoluntario />
      <CadastroLar />
      <Footer />
    </>
  );
}

import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import Footer from '../components/Footer.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

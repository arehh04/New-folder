import { useState, useCallback, FC, MouseEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import CreateProductModal from '../components/CreateProductModal';
import { useAuth } from '../context/AuthContext';

export const Home: FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Callback function to handle smooth navigation to curations section
  const handleExploreCallback = useCallback((e?: MouseEvent<HTMLButtonElement>): void => {
    if (e) e.preventDefault();
    const section = document.getElementById('collection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="home-page min-h-screen bg-royalty-nude flex flex-col font-sans selection:bg-royalty-yellow/30 selection:text-royalty-purple relative">
      <Header />
      
      <main className="flex-grow">
        
        {/* Majestic Haute Hero Banner */}
        <section className="relative bg-gradient-to-b from-royalty-purple-dark via-royalty-purple to-royalty-purple-dark text-white overflow-hidden py-24 sm:py-32 border-b border-royalty-yellow/20">
          
          {/* Subtle Ambient Gold Mesh & Particles */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-royalty-wine/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-royalty-yellow/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            
            {/* Monogram Crest Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-royalty-yellow/40 backdrop-blur-md mb-8 shadow-sm">
              <span className="text-sm">⚜️</span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-royalty-yellow">
                Haute E-Commerce Maison
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-[1.1] mb-6">
              The Sovereign Sanctuary of <br />
              <span className="text-gold-gradient font-serif italic font-normal">
                Curated Luxury
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-royalty-nude/90 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
              Enter the realm of <span className="text-royalty-yellow font-semibold">Id10T</span>. Discover handpicked treasures, bespoke apparel, and timeless artifacts curated exclusively for sovereign taste.
            </p>

            {/* Action Buttons using Callback Function */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                type="button"
                onClick={handleExploreCallback}
                className="bg-gradient-to-r from-royalty-wine to-royalty-wine-hover hover:brightness-110 text-white font-extrabold py-4 px-9 rounded-full shadow-xl hover:shadow-royalty-wine/40 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest text-xs border border-royalty-yellow/30 cursor-pointer"
              >
                👑 Explore The Vault
              </button>
              <button 
                type="button"
                onClick={handleExploreCallback}
                className="bg-white/10 hover:bg-white/15 text-royalty-yellow border border-royalty-yellow/40 font-bold py-4 px-8 rounded-full backdrop-blur-md transition-all duration-300 uppercase tracking-widest text-xs cursor-pointer"
              >
                View Curations
              </button>
            </div>

          </div>
        </section>

        {/* Value Propositions Ribbon */}
        <section className="bg-white border-b border-royalty-nude-dark py-8 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">⚜️</span>
                <h4 className="font-bold text-xs uppercase tracking-widest text-royalty-purple">
                  Insured Authenticity
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">100% Certified Sovereign Goods</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">👑</span>
                <h4 className="font-bold text-xs uppercase tracking-widest text-royalty-purple">
                  Bespoke Packaging
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Royal Gold Wax Sealed Boxes</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">🛡️</span>
                <h4 className="font-bold text-xs uppercase tracking-widest text-royalty-purple">
                  30-Day Guarantee
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Hassle-Free Vault Returns</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">⚡</span>
                <h4 className="font-bold text-xs uppercase tracking-widest text-royalty-purple">
                  Express Dispatch
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Complimentary Over $150</p>
              </div>

            </div>
          </div>
        </section>

        {/* Product Catalog Section */}
        <div id="collection">
          <ProductList _onOpenCreateModal={() => setIsCreateModalOpen(true)} />
        </div>

      </main>

      {/* Floating Admin Add Artifact Action */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-royalty-purple hover:bg-royalty-purple-dark text-royalty-yellow border-2 border-royalty-yellow/60 font-bold py-3 px-5 rounded-full shadow-2xl hover:scale-105 transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          title="Publish New Artifact (Admin Portal)"
        >
          <span>⚜️</span>
          <span>+ Enshrine Artifact</span>
        </button>
      </div>

      {/* Admin Add Artifact Modal */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProductCreated={() => {
          window.location.reload();
        }}
      />

      <Footer />
    </div>
  );
};

export default Home;

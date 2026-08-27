import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="bg-royalty-purple-dark text-white/80 py-12 border-t border-royalty-yellow/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="flex justify-center items-center gap-2">
          <span className="text-xl">⚜️</span>
          <span className="font-extrabold tracking-widest text-royalty-yellow uppercase text-sm">
            Id10T Maison de Luxe
          </span>
        </div>
        <p className="text-xs text-royalty-nude/60 max-w-md mx-auto">
          Purveyors of fine haute curations and sovereign accoutrements. Crafted with timeless distinction.
        </p>
        <div className="text-[11px] text-royalty-nude/40 pt-4 border-t border-white/5">
          © {new Date().getFullYear()} Id10T Maison de Luxe. All Royal Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

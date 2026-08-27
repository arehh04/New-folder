import { APP_CONFIG } from '../config/constants';

export default function Footer() {
  return (
    <footer className="bg-royalty-purple-dark text-royalty-nude border-t border-royalty-purple py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚜️</span>
          <div>
            <span className="text-lg font-black text-gold-gradient uppercase tracking-widest block">
              {APP_CONFIG.NAME}
            </span>
            <span className="text-[10px] text-royalty-nude/60 uppercase tracking-widest">
              {APP_CONFIG.FULL_NAME}
            </span>
          </div>
        </div>
        
        <p className="text-xs text-royalty-nude/60 font-light">
          © {new Date().getFullYear()} {APP_CONFIG.NAME} Inc. Crafted for Royalty. All Sovereign Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

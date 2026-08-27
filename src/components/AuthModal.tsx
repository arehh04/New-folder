import { useState, FC, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: FC = () => {
  const { 
    isAuthModalOpen, 
    authMode, 
    setAuthMode, 
    closeAuthModal, 
    login, 
    register 
  } = useAuth();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const fillDemoAccount = (demoUser: string, demoPass: string): void => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        await login({ username, password });
      } else {
        await register({ firstName, lastName, username, email, password });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-royalty-yellow/40 animate-in zoom-in-95 duration-200">
          
          {/* Royal Header */}
          <div className="bg-gradient-to-r from-royalty-purple-dark via-royalty-purple to-royalty-wine p-6 text-white text-center relative">
            <button 
              type="button"
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
            <span className="text-3xl block mb-1">👑</span>
            <h3 className="text-xl font-extrabold uppercase tracking-widest text-gold-gradient">
              {authMode === 'login' ? 'Patron Sanctuary Access' : 'Inscribe Royal House'}
            </h3>
            <p className="text-xs text-royalty-nude/80 mt-1">
              {authMode === 'login' 
                ? 'Authenticate your sovereign credentials' 
                : 'Create your noble patron profile'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-royalty-nude-dark bg-royalty-nude/30">
            <button 
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'border-b-2 border-royalty-wine text-royalty-wine bg-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🔑 Vault Login
            </button>
            <button 
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'border-b-2 border-royalty-wine text-royalty-wine bg-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ✍️ New Enrollment
            </button>
          </div>

          {/* Quick Demo Credentials */}
          <div className="p-4 bg-royalty-nude/50 border-b border-royalty-nude-dark">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              ⚜️ Royal Demo Credentials (1-Click Fill):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('emilys', 'emilyspass')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-royalty-yellow-light border border-royalty-nude-dark rounded-lg text-[11px] font-bold text-royalty-purple transition-all shadow-xs cursor-pointer text-left"
              >
                👑 Emily (Admin)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('michaelw', 'michaelwpass')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-royalty-yellow-light border border-royalty-nude-dark rounded-lg text-[11px] font-bold text-royalty-purple transition-all shadow-xs cursor-pointer text-left"
              >
                🎩 Michael (Patron)
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {authMode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    First Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Lady Guinevere"
                    className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm outline-none focus:border-royalty-yellow"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Last Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pendleton"
                    className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm outline-none focus:border-royalty-yellow"
                  />
                </div>
              </div>
            )}

            {authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Royal Dispatch Email
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@royalvault.com"
                  className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm outline-none focus:border-royalty-yellow"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Sovereign Username
              </label>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. emilys"
                className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm outline-none focus:border-royalty-yellow"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Vault Passkey
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm outline-none focus:border-royalty-yellow"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl uppercase tracking-widest text-xs border border-royalty-yellow/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>👑 {authMode === 'login' ? 'Enter Sovereign Vault' : 'Enroll House'}</span>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;

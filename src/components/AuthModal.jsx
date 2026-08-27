import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    authMode, 
    setAuthMode, 
    closeAuthModal, 
    login, 
    register 
  } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isAuthModalOpen) return null;

  // Preset demo account filler for easy testing with DummyJSON
  const fillDemoAccount = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        // Promise API invocation
        await login({ username, password });
      } else {
        // Promise API invocation
        await register({ firstName, lastName, username, email, password });
      }
    } catch (err) {
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
          
          {/* Header with Royal Banner */}
          <div className="bg-gradient-to-r from-royalty-purple-dark via-royalty-purple to-royalty-wine p-6 text-center text-white relative">
            <button 
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-royalty-nude/70 hover:text-white text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
            <span className="text-3xl block mb-2">⚜️</span>
            <h3 className="text-xl font-extrabold uppercase tracking-widest text-gold-gradient">
              {authMode === 'login' ? 'Sovereign Access' : 'Royal Registry'}
            </h3>
            <p className="text-xs text-royalty-nude/80 mt-1 font-medium">
              {authMode === 'login' 
                ? 'Authenticate your royal identity to unlock member privileges' 
                : 'Enlist your house in the sovereign archives'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-royalty-nude-dark bg-royalty-nude/30">
            <button
              onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                authMode === 'login'
                  ? 'border-b-2 border-royalty-wine text-royalty-wine bg-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                authMode === 'register'
                  ? 'border-b-2 border-royalty-wine text-royalty-wine bg-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register House
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            
            {/* Quick Demo Preset Buttons */}
            {authMode === 'login' && (
              <div className="bg-royalty-nude/60 border border-royalty-nude-dark p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-royalty-purple uppercase tracking-wider block mb-2">
                  👑 Quick Test Presets (DummyJSON):
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('emilys', 'emilyspass')}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-royalty-yellow-light border border-royalty-nude-dark rounded-lg text-[11px] font-semibold text-slate-700 hover:text-royalty-purple transition-colors cursor-pointer"
                  >
                    👑 Emily S. (Admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('michaelw', 'michaelwpass')}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-royalty-yellow-light border border-royalty-nude-dark rounded-lg text-[11px] font-semibold text-slate-700 hover:text-royalty-purple transition-colors cursor-pointer"
                  >
                    ⚜️ Michael W.
                  </button>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
                ⚠️ {errorMessage}
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
                    placeholder="Lord / Lady"
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
                    placeholder="Surname"
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
}

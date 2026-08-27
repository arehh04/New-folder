import { useState } from 'react';
import { productBusiness } from '../business/productBusiness';
import { useCart } from '../context/CartContext';

export default function CreateProductModal({ isOpen, onClose, onProductCreated }) {
  const { showToast } = useCart();

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState('beauty');
  const [thumbnail, setThumbnail] = useState('https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        brand: brand || 'Id10T Maison',
        price: Number(price),
        stock: Number(stock),
        category,
        thumbnail,
        description: description || 'Exclusive sovereign curation.'
      };

      const newProduct = await productBusiness.addNewProductToVault(payload);
      if (onProductCreated) {
        onProductCreated(newProduct);
      }
      showToast(`👑 Published "${newProduct.displayName}" to the Royal Vault`);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add artifact to the vault');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-royalty-yellow/50 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-royalty-purple-dark via-royalty-purple to-royalty-wine p-6 text-white text-center relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
            >
              ✕
            </button>
            <span className="text-3xl block mb-1">⚜️</span>
            <h3 className="text-xl font-extrabold uppercase tracking-widest text-gold-gradient">
              Enshrine New Artifact
            </h3>
            <p className="text-xs text-royalty-nude/80 mt-1">
              Add a new treasure into the Id10T sovereign catalog.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Artifact Title
              </label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Imperial Silk Kimono Robe"
                className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Brand / Maison
                </label>
                <input 
                  type="text" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Id10T Couture"
                  className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-royalty-purple outline-none focus:border-royalty-yellow cursor-pointer"
                >
                  <option value="beauty">Beauty & Cosmetics</option>
                  <option value="fragrances">Fragrances & Elixirs</option>
                  <option value="furniture">Royal Furniture</option>
                  <option value="groceries">Imperial Provisions</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Vault Price ($)
                </label>
                <input 
                  type="number"
                  step="0.01" 
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="249.99"
                  className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Initial Stock Units
                </label>
                <input 
                  type="number" 
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="15"
                  className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Thumbnail Image URL
              </label>
              <input 
                type="url" 
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Artifact Description
              </label>
              <textarea 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the provenance and qualities of this sovereign treasure..."
                className="w-full px-3.5 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg uppercase tracking-widest text-xs border border-royalty-yellow/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Enshrining in Vault...' : '👑 Enshrine in Royal Vault'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

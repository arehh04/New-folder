import { useState, FC, FormEvent } from 'react';
import { productBusiness } from '../business/productBusiness';
import { useCart } from '../context/CartContext';
import { UIProduct } from '../types';

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: (product: UIProduct) => void;
}

export const CreateProductModal: FC<CreateProductModalProps> = ({ isOpen, onClose, onProductCreated }) => {
  const { showToast } = useCart();

  const [title, setTitle] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('10');
  const [category, setCategory] = useState<string>('beauty');
  const [thumbnail, setThumbnail] = useState<string>('https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
    } catch (err: any) {
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
              type="button"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Artifact Title
              </label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Royal Diamond Velvet Extrait"
                className="w-full px-4 py-2.5 bg-royalty-nude/30 border border-royalty-nude-dark rounded-xl text-sm font-medium focus:border-royalty-yellow outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Maison Brand
                </label>
                <input 
                  type="text" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Dior / Chanel"
                  className="w-full px-4 py-2.5 bg-royalty-nude/30 border border-royalty-nude-dark rounded-xl text-sm font-medium focus:border-royalty-yellow outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Category
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-royalty-nude/30 border border-royalty-nude-dark rounded-xl text-sm font-medium focus:border-royalty-yellow outline-none"
                >
                  <option value="beauty">Beauty & Cosmetics</option>
                  <option value="fragrances">Haute Fragrances</option>
                  <option value="groceries">Culinary Treasures</option>
                  <option value="furniture">Palatial Accoutrements</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Price ($ USD)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="149.99"
                  className="w-full px-4 py-2.5 bg-royalty-nude/30 border border-royalty-nude-dark rounded-xl text-sm font-medium focus:border-royalty-yellow outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Vault Stock Units
                </label>
                <input 
                  type="number" 
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-2.5 bg-royalty-nude/30 border border-royalty-nude-dark rounded-xl text-sm font-medium focus:border-royalty-yellow outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Artifact Image URL
              </label>
              <input 
                type="url" 
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-4 py-2.5 bg-royalty-nude/30 border border-royalty-nude-dark rounded-xl text-sm font-medium focus:border-royalty-yellow outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Curator Description
              </label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A timeless fragrance with notes of rare amber and damask rose..."
                className="w-full px-4 py-2.5 bg-royalty-nude/30 border border-royalty-nude-dark rounded-xl text-sm font-medium focus:border-royalty-yellow outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-royalty-nude-dark text-slate-600 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer border border-royalty-yellow/40 disabled:opacity-50"
              >
                {isSubmitting ? 'Enshrining...' : '⚜️ Enshrine Artifact'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;

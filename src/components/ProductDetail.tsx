import { useState, useEffect, useCallback, FC, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productBusiness } from '../business/productBusiness';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';
import Accordion from './Accordion';
import ProductReviews from './ProductReviews';
import { UIProduct } from '../types';

export const ProductDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();
  
  const [product, setProduct] = useState<UIProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Inventory Management State
  const [editPrice, setEditPrice] = useState<string | number>('');
  const [editStock, setEditStock] = useState<string | number>('');
  const [isUpdatingInventory, setIsUpdatingInventory] = useState<boolean>(false);
  const [isDeletingArtifact, setIsDeletingArtifact] = useState<boolean>(false);
  const [inventoryMessage, setInventoryMessage] = useState<string | null>(null);

  /**
   * fetchProduct callback function to fetch and format product data
   */
  const fetchProduct = useCallback(async (productId?: string) => {
    if (!productId) return;

    if (productId === 'error') {
      throw new Error('This is a simulated render error for testing the Error Boundary.');
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productBusiness.getFormattedProductById(productId);
      setProduct(data);
      setEditPrice(data?.price || '');
      setEditStock(data?.stock || '');
      if (data?.thumbnail) {
        setSelectedImage(data.thumbnail);
      }
    } catch (err: any) {
      console.error("Error in fetchProduct callback:", err);
      setError(err.message || 'Artifact not found in the Royal Vault');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  /**
   * updateInventoryCallback: Promise API invocation to update product details
   */
  const handleUpdateInventory = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !product) return;

    setIsUpdatingInventory(true);
    setInventoryMessage(null);

    try {
      const updated = await productBusiness.updateProductInventory(id, {
        price: Number(editPrice),
        stock: Number(editStock)
      });
      setProduct(prev => (prev ? { ...prev, ...updated } : updated));
      setInventoryMessage('✨ Vault records successfully updated in royal archives!');
      showToast(`👑 Updated inventory for ${product.displayName}`);
    } catch (err: any) {
      setInventoryMessage(`⚠️ Update failed: ${err.message}`);
    } finally {
      setIsUpdatingInventory(false);
    }
  }, [id, editPrice, editStock, product, showToast]);

  /**
   * deleteArtifactCallback: Promise API invocation to delete / retire a product
   */
  const handleDeleteArtifact = useCallback(async () => {
    if (!id || !product) return;

    if (!window.confirm(`Are you certain you wish to retire "${product.displayName}" from the Royal Vault?`)) {
      return;
    }

    setIsDeletingArtifact(true);
    try {
      await productBusiness.deleteProductFromVault(id);
      showToast(`🗑️ Retired ${product.displayName} from the Vault`);
      alert(`⚜️ Artifact #${id} has been permanently retired from the Royal Vault.`);
      navigate('/');
    } catch (err: any) {
      alert(`⚠️ Deletion failed: ${err.message}`);
      setIsDeletingArtifact(false);
    }
  }, [id, product, navigate, showToast]);

  const handleAddToCart = (): void => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-royalty-nude-dark border-t-royalty-wine rounded-full animate-spin mb-6"></div>
        <p className="text-royalty-purple font-extrabold text-sm tracking-widest uppercase">
          ⚜️ Unveiling Sovereign Artifact...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page max-w-xl mx-auto my-20 p-8 bg-white border border-red-200 rounded-3xl text-center shadow-lg">
        <span className="text-6xl mb-4 block">⚜️</span>
        <h2 className="text-2xl font-bold text-royalty-wine mb-2">Artifact Not In Vault</h2>
        <p className="text-slate-600 text-sm mb-6">{error}</p>
        <Link
          to="/"
          className="inline-block bg-royalty-purple text-royalty-yellow font-bold text-xs uppercase tracking-widest py-3 px-8 rounded-full"
        >
          Return to Curations
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const currentImage = selectedImage || product.thumbnail;

  return (
    <div className="product-detail-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fadeIn">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10">
        <Link to="/" className="hover:text-royalty-wine transition-colors">
          Vault Catalog
        </Link>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
        <span>/</span>
        <span className="text-royalty-purple font-bold truncate max-w-xs">{product.displayName}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left: Gallery Column */}
        <div className="space-y-6">
          
          {/* Main Selected Image Showcase */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-royalty-nude-dark shadow-sm flex items-center justify-center relative overflow-hidden group">
            <img 
              src={currentImage} 
              alt={product.displayName} 
              className="max-h-[420px] w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            {product.hasDiscount && (
              <div className="absolute top-6 left-6 bg-royalty-wine text-white px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
                {product.formattedDiscount}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-white border transition-all duration-200 shrink-0 overflow-hidden cursor-pointer ${
                    currentImage === img 
                      ? 'border-2 border-royalty-yellow shadow-md scale-105' 
                      : 'border-royalty-nude-dark hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right: Artifact Details Column */}
        <div className="flex flex-col justify-between">
          <div>
            
            {/* Category / Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-royalty-purple text-royalty-yellow border border-royalty-yellow/30 text-xs font-bold uppercase tracking-widest mb-4 shadow-xs">
              <span>⚜️</span> {product.displayBrand}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-royalty-purple mb-4 leading-tight">
              {product.displayName}
            </h1>
            
            {/* Rating & Stock Badges */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1.5 bg-royalty-nude px-3 py-1 rounded-full font-bold text-slate-800 border border-royalty-nude-dark">
                <span className="text-royalty-yellow text-base">★</span>
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal ml-1">Rating</span>
              </div>
              
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{product.stockStatus} ({product.stock} units available)</span>
              </div>
            </div>
            
            {/* Price Box */}
            <div className="bg-royalty-nude/40 border border-royalty-nude-dark p-6 rounded-2xl mb-8 flex items-baseline gap-4">
              <span className="text-4xl sm:text-5xl font-black text-royalty-wine">
                {product.formattedPrice}
              </span>
              {product.hasDiscount && (
                <div className="flex flex-col text-xs">
                  <span className="text-slate-400 line-through font-semibold">
                    ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                  </span>
                  <span className="text-royalty-wine font-extrabold uppercase">
                    Includes Sovereign Discount
                  </span>
                </div>
              )}
            </div>
            
            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-8 font-normal">
              {product.description}
            </p>

            {/* Accordions */}
            <div className="space-y-3 mb-8">
              <Accordion title="White-Glove Royal Dispatch">
                <p className="mb-2"><strong>Complimentary Express Delivery</strong> on orders over $150. Packaged in a velvet-lined box with sovereign gold wax seal.</p>
                <p className="text-xs text-slate-500">Estimated transit: 2–3 business days via Royal Courier.</p>
              </Accordion>
              
              <Accordion title="Authenticity & 30-Day Vault Return">
                <p className="mb-2">Every artifact is authenticated by certified curators. If you are not thoroughly enchanted, return in original pristine condition within 30 days for a full refund.</p>
              </Accordion>

              {/* Inventory Management / Service CRUD Demonstration */}
              <Accordion title="Royal Vault Custodian (Inventory & Services)">
                <form onSubmit={handleUpdateInventory} className="space-y-4 pt-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Perform direct inventory adjustments utilizing <code className="bg-slate-100 px-1 py-0.5 rounded text-royalty-purple font-mono">productService.updateProduct</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-royalty-purple font-mono">deleteProduct</code> Promise APIs.
                  </p>

                  {inventoryMessage && (
                    <div className="p-3 bg-royalty-nude rounded-xl text-xs font-semibold text-royalty-purple border border-royalty-nude-dark">
                      {inventoryMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Vault Price ($)
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-xs font-bold text-royalty-purple"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Vault Stock Units
                      </label>
                      <input 
                        type="number" 
                        required
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full px-3 py-2 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-xs font-bold text-royalty-purple"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isUpdatingInventory}
                      className="flex-1 bg-royalty-purple hover:bg-royalty-purple-dark text-royalty-yellow py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      {isUpdatingInventory ? 'Updating Vault...' : '💾 Update Inventory'}
                    </button>
                    <button
                      type="button"
                      disabled={isDeletingArtifact}
                      onClick={handleDeleteArtifact}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isDeletingArtifact ? 'Retiring...' : '🗑️ Retire Artifact'}
                    </button>
                  </div>
                </form>
              </Accordion>
            </div>

          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-royalty-nude flex flex-col sm:flex-row items-center gap-4">
            
            {/* Quantity Selector with label */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Quantity:
              </span>
              <QuantitySelector 
                initialValue={quantity} 
                max={product.stock || 99} 
                onChange={(newVal) => setQuantity(newVal)} 
              />
            </div>

            {/* Primary Add to Vault CTA */}
            <button 
              type="button"
              onClick={handleAddToCart}
              className="flex-1 w-full bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest text-xs border border-royalty-yellow/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>👑 Add to Royal Vault</span>
            </button>

          </div>

        </div>
      </div>

      {/* Feature 4: Verified Patron Reviews & Testimonials */}
      <ProductReviews 
        productId={product.id} 
        initialReviews={product.reviews} 
        initialRating={product.rating}
        onReviewsUpdated={(result) => {
          if (result.updatedRating) {
            setProduct(prev => prev ? ({ ...prev, rating: result.updatedRating }) : null);
          }
        }}
      />

    </div>
  );
};

export default ProductDetail;

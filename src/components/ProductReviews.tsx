import { useState, FC, FormEvent } from 'react';
import { productBusiness } from '../business/productBusiness';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ReviewModel } from '../types';

export interface ProductReviewsProps {
  productId: number | string;
  initialReviews?: ReviewModel[];
  initialRating?: number;
  onReviewsUpdated?: (result: any) => void;
}

export const ProductReviews: FC<ProductReviewsProps> = ({ 
  productId, 
  initialReviews = [], 
  initialRating = 5, 
  onReviewsUpdated 
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useCart();

  const [reviews, setReviews] = useState<ReviewModel[]>(initialReviews);
  const [ratingScore, setRatingScore] = useState<number>(initialRating);
  
  // Review Form State
  const [newRating, setNewRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>(currentUser?.fullName || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmitReview = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setFormSuccess(null);

    try {
      const reviewPayload = {
        rating: Number(newRating),
        comment,
        reviewerName: reviewerName.trim() || currentUser?.fullName || 'Sovereign Patron',
        reviewerEmail: currentUser?.email || 'patron@royalvault.com'
      };

      const result = await productBusiness.postProductReview(productId, reviewPayload);
      setReviews(result.reviews || [result.review, ...reviews]);
      if (result.updatedRating) {
        setRatingScore(result.updatedRating);
      }
      if (onReviewsUpdated) {
        onReviewsUpdated(result);
      }

      setComment('');
      setFormSuccess('✨ Your sovereign testimonial has been immortalized in the vault records!');
      showToast('👑 Review submitted successfully');
    } catch (err: any) {
      alert(`⚠️ Review submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-royalty-nude-dark shadow-sm mt-12 space-y-10">
      
      {/* Title & Rating Summary Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-royalty-nude pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-royalty-wine/10 text-royalty-wine text-xs font-bold uppercase tracking-widest mb-2">
            <span>📜</span> Patron Chronicles & Testimonials
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-royalty-purple">
            Verified Vault Reviews
          </h3>
        </div>

        <div className="flex items-center gap-4 bg-royalty-nude/60 px-6 py-3 rounded-2xl border border-royalty-nude-dark">
          <div className="text-3xl font-black text-royalty-wine">
            {ratingScore}
          </div>
          <div className="flex flex-col">
            <div className="flex text-royalty-yellow text-sm tracking-wider">
              {'★'.repeat(Math.round(ratingScore))}{'☆'.repeat(Math.max(0, 5 - Math.round(ratingScore)))}
            </div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Based on {reviews.length} testimonials
            </span>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleSubmitReview} className="bg-royalty-nude/30 border border-royalty-nude-dark rounded-2xl p-6 sm:p-8 space-y-5">
        <h4 className="font-extrabold text-royalty-purple text-base uppercase tracking-wider flex items-center gap-2">
          <span>✍️</span> Inscribe a Sovereign Testimonial
        </h4>

        {formSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl animate-fadeIn">
            {formSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Patron Honorific / Name
            </label>
            <input 
              type="text" 
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="e.g. Lady Genevieve of Kent"
              className="w-full px-4 py-3 bg-white border border-royalty-nude-dark rounded-xl text-sm font-medium focus:outline-none focus:border-royalty-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Royal Accolade (Rating)
            </label>
            <div className="flex items-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                    star <= newRating ? 'text-royalty-yellow' : 'text-slate-300'
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs font-bold text-royalty-wine ml-2">
                {newRating} / 5 Stars
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Testimonial & Observations
          </label>
          <textarea
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe the aroma, texture, aura, or craftsmanship..."
            className="w-full px-4 py-3 bg-white border border-royalty-nude-dark rounded-xl text-sm font-medium focus:outline-none focus:border-royalty-yellow"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-royalty-wine hover:bg-royalty-wine-hover text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Inscribing...' : '⚜️ Submit Testimonial'}
        </button>
      </form>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm italic">
            No testimonials recorded yet. Be the first patron to immortalize your thoughts.
          </div>
        ) : (
          reviews.map((rev, idx) => (
            <div key={idx} className="p-5 sm:p-6 bg-royalty-nude/20 rounded-2xl border border-royalty-nude-dark flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-royalty-purple text-sm">
                    {rev.reviewerName}
                  </span>
                  <span className="text-royalty-yellow text-xs">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(Math.max(0, 5 - rev.rating))}
                  </span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="text-[11px] text-slate-400 font-mono shrink-0">
                {rev.date ? new Date(rev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Patron'}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ProductReviews;

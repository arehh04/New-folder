import { useState } from 'react';
import { productBusiness } from '../business/productBusiness';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductReviews({ productId, initialReviews = [], initialRating = 5, onReviewsUpdated }) {
  const { currentUser } = useAuth();
  const { showToast } = useCart();

  const [reviews, setReviews] = useState(initialReviews);
  const [ratingScore, setRatingScore] = useState(initialRating);
  
  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.fullName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);

  const handleSubmitReview = async (e) => {
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
    } catch (err) {
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
            <span>⚜️</span> Verified Testimony
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-royalty-purple tracking-tight">
            Patron Reviews & Accolades
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Read certified reflections from verified sovereign collectors.
          </p>
        </div>

        {/* Big Star Badge */}
        <div className="flex items-center gap-4 bg-royalty-nude/60 border border-royalty-nude-dark px-6 py-3 rounded-2xl">
          <span className="text-4xl text-royalty-yellow font-black">★</span>
          <div>
            <span className="text-2xl font-black text-royalty-purple block leading-tight">
              {Number(ratingScore).toFixed(1)} / 5.0
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {reviews.length} {reviews.length === 1 ? 'Endorsement' : 'Endorsements'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Post a Review Form */}
        <div className="lg:col-span-5 bg-royalty-nude/40 border border-royalty-nude-dark p-6 rounded-2xl space-y-4 h-fit">
          <h4 className="font-extrabold uppercase tracking-wider text-xs text-royalty-purple">
            👑 Bestow Your Testimonial
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Share your experience with this royal acquisition.
          </p>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Royal Rating
              </label>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      newRating === star
                        ? 'bg-royalty-purple text-royalty-yellow border-royalty-yellow shadow-xs'
                        : 'bg-white text-slate-600 border-royalty-nude-dark hover:border-slate-400'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Patron Title / Name
              </label>
              <input 
                type="text" 
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Duke Sterling"
                className="w-full px-3.5 py-2.5 bg-white border border-royalty-nude-dark rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Testimonial Reflection
              </label>
              <textarea 
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the craftsmanship, presence, and aura of this piece..."
                className="w-full px-3.5 py-2.5 bg-white border border-royalty-nude-dark rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-royalty-yellow resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-royalty-wine hover:bg-royalty-wine-hover text-white font-extrabold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isSubmitting ? 'Inscribing...' : '👑 Submit Sovereign Review'}
            </button>
          </form>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="text-4xl block mb-2">⚜️</span>
              <p className="text-sm font-semibold">Be the first sovereign patron to bestow a review on this curation.</p>
            </div>
          ) : (
            reviews.map((rev, idx) => (
              <div 
                key={idx}
                className="p-5 bg-white border border-royalty-nude-dark rounded-2xl shadow-xs space-y-2 hover:border-royalty-yellow/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-royalty-purple">
                        {rev.reviewerName || 'Anonymous Sovereign Patron'}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        ✓ Verified Patron
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(rev.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex text-royalty-yellow text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < rev.rating ? 'text-royalty-yellow' : 'text-slate-200'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed pt-1 font-normal">
                  "{rev.comment}"
                </p>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';
import { Star, MessageSquare, CornerDownRight, Check, Send, Sparkles, ShieldCheck } from 'lucide-react';

interface ProReviewsProps {
  salonId: string;
}

export const ProReviews: React.FC<ProReviewsProps> = ({ salonId }) => {
  const { salons = [], reviews = [], replyToReview, addToastNotification } = useApp();
  const salon = (salons || []).find(s => s.id === salonId) || (salons && salons[0]);
  const salonReviews = (reviews || []).filter(r => r.salonId === salonId);

  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    replyToReview(reviewId, replyText);
    setReplyingId(null);
    setReplyText('');
    addToastNotification('Réponse publiée ! 💬', 'Votre réponse est visible sur la page publique du salon.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Rating Overview */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-black text-lg text-stone-950 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Gestion des Avis & Réputation ({salonReviews.length})</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Répondez aux avis pour fidéliser vos clients et booster votre visibilité sur Kuzuri.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 p-4 rounded-2xl shrink-0">
          <div className="text-center">
            <span className="text-3xl font-black text-amber-950">{salon.rating.toFixed(1)}</span>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 text-amber-500 fill-amber-500" />
              ))}
            </div>
          </div>
          <div className="text-xs text-amber-900 border-l border-amber-200 pl-3">
            <p className="font-bold">{salon.reviewCount} avis certifiés</p>
            <p className="text-[11px] text-amber-700">100% clients réels</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
        {salonReviews.map(review => (
          <div key={review.id} className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-950 font-bold text-xs flex items-center justify-center">
                  {review.clientName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{review.clientName}</h4>
                  <p className="text-xs text-stone-500">
                    Prestation : {review.serviceName} {review.staffName ? `avec ${review.staffName}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-12">
              "{review.comment}"
            </p>

            {/* Existing Salon Response */}
            {review.salonResponse ? (
              <div className="ml-12 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                <span className="font-bold text-stone-900 block mb-1">Votre réponse :</span>
                <p className="text-stone-600">{review.salonResponse.text}</p>
              </div>
            ) : replyingId === review.id ? (
              <div className="ml-12 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <label className="block text-xs font-bold text-amber-950">Votre réponse publique :</label>
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Merci pour votre visite..."
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs outline-none bg-white"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setReplyingId(null)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSendReply(review.id)}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
                  >
                    Publier la réponse
                  </button>
                </div>
              </div>
            ) : (
              <div className="pl-12 pt-1">
                <button
                  onClick={() => {
                    setReplyingId(review.id);
                    setReplyText(`Merci beaucoup ${review.clientName} pour votre confiance et au plaisir de vous revoir chez ${salon.name} !`);
                  }}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Répondre à cet avis</span>
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};

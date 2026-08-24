import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, Product, StaffMember, PaymentMethodType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Check, 
  Smartphone, 
  CreditCard, 
  Banknote, 
  Percent, 
  Heart, 
  User, 
  Receipt,
  Sparkles,
  ShoppingBag,
  Scissors
} from 'lucide-react';

interface ProPosProps {
  salonId: string;
}

interface CartItem {
  id: string;
  type: 'service' | 'product';
  name: string;
  price: number;
  quantity: number;
}

export const ProPos: React.FC<ProPosProps> = ({ salonId }) => {
  const { 
    salons, 
    services, 
    products, 
    staff, 
    currentCurrency, 
    addToastNotification 
  } = useApp();

  const salon = (salons || []).find(s => s.id === salonId) || (salons && salons[0]);
  const salonServices = (services || []).filter(s => s.salonId === salonId);
  const salonProducts = (products || []).filter(p => p.salonId === salonId);
  const salonStaff = (staff || []).filter(st => st.salonId === salonId);

  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(salonStaff[0]?.id || '');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash');
  const [clientName, setClientName] = useState<string>('Client au comptoir');
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  const addToCart = (item: Service | Product, type: 'service' | 'product') => {
    const itemPrice = type === 'service' ? (item as Service).price : (item as Product).sellingPrice;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: item.id,
        type,
        name: item.name,
        price: itemPrice,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const nextQty = i.quantity + delta;
        return nextQty > 0 ? { ...i, quantity: nextQty } : i;
      }
      return i;
    }));
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalDue = Math.max(0, subtotal - discountAmount + tipAmount);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const receipt = {
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      salonName: salon.name,
      staffName: salonStaff.find(st => st.id === selectedStaffId)?.name || 'Équipe',
      clientName,
      items: [...cart],
      subtotal,
      discountAmount,
      tipAmount,
      totalDue,
      paymentMethod
    };

    setLastReceipt(receipt);
    setCart([]);
    setDiscountPercent(0);
    setTipAmount(0);
    addToastNotification('Encaissement réussi ! 🧾', `Ticket ${receipt.receiptNumber} généré avec succès.`);
  };

  return (
    <div className="space-y-6">
      
      {/* 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Product & Service Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'services'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Prestations ({salonServices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'products'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Produits & Soins ({salonProducts.length})</span>
              </button>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activeTab === 'services' ? (
              salonServices.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => addToCart(srv, 'service')}
                  className="bg-white p-3.5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-95"
                >
                  <div>
                    <h5 className="font-bold text-xs text-stone-900 line-clamp-2 group-hover:text-amber-600">
                      {srv.name}
                    </h5>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      {srv.durationMinutes} min
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-black text-xs text-stone-900">
                      {formatCurrency(srv.price, currentCurrency)}
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center text-stone-600 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              salonProducts.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => addToCart(prod, 'product')}
                  className="bg-white p-3.5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-95"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full aspect-square object-cover rounded-xl mb-2"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-amber-600">
                      {prod.name}
                    </h5>
                    <span className="text-[10px] text-stone-400">{prod.category} • Stock: {prod.stock}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-black text-xs text-stone-900">
                      {formatCurrency(prod.sellingPrice, currentCurrency)}
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center text-stone-600 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Column: Active Cart & Cash Register Drawer (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-500" />
                <h4 className="font-black text-sm text-stone-900">Caisse / Panier ({cart.length})</h4>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[11px] text-rose-600 hover:underline font-bold"
                >
                  Vider
                </button>
              )}
            </div>

            {/* Client & Staff Assignment */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Collaborateur</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 font-bold outline-none"
                >
                  {salonStaff.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Nom du client</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 font-bold outline-none"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                    <div className="flex-1 pr-2">
                      <span className="font-bold text-stone-900 block truncate">{item.name}</span>
                      <span className="text-[10px] text-stone-500">
                        {formatCurrency(item.price, currentCurrency)} × {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-1.5 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 rounded-r"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 text-center py-6">Panier vide. Cliquez sur une prestation pour l’ajouter.</p>
              )}
            </div>

            {/* Discounts and Tips Controls */}
            {cart.length > 0 && (
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 flex items-center gap-1 font-medium">
                    <Percent className="w-3.5 h-3.5" />
                    Remise commerciale :
                  </span>
                  <div className="flex items-center gap-1">
                    {[0, 10, 20].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDiscountPercent(pct)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          discountPercent === pct ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 flex items-center gap-1 font-medium">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    Pourboire :
                  </span>
                  <div className="flex items-center gap-1">
                    {[0, 500, 1000].map(tip => (
                      <button
                        key={tip}
                        type="button"
                        onClick={() => setTipAmount(tip)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          tipAmount === tip ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {tip === 0 ? '0' : `+${tip}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            {cart.length > 0 && (
              <div className="pt-3 border-t border-stone-100">
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">Mode d’encaissement</label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-1 rounded-xl border font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'cash' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-stone-200'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Espèces</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`py-2 px-1 rounded-xl border font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'mtn_momo' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-stone-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>MTN MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`py-2 px-1 rounded-xl border font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'airtel_money' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-stone-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-red-600" />
                    <span>Airtel Money</span>
                  </button>
                </div>
              </div>
            )}

            {/* Grand Total & Checkout Button */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between text-base font-black text-stone-950">
                <span>Total à payer :</span>
                <span className="text-amber-600 text-lg">{formatCurrency(totalDue, currentCurrency)}</span>
              </div>

              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:opacity-40 text-white font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Encaisser {formatCurrency(totalDue, currentCurrency)}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Generated Receipt Modal */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>

            <h4 className="font-black text-stone-950 text-lg">Paiement validé</h4>
            <p className="text-xs text-stone-500">{lastReceipt.salonName} • {lastReceipt.date} à {lastReceipt.time}</p>

            <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5">
              <p><strong>N° Ticket :</strong> {lastReceipt.receiptNumber}</p>
              <p><strong>Client :</strong> {lastReceipt.clientName}</p>
              <p><strong>Collaborateur :</strong> {lastReceipt.staffName}</p>
              <div className="pt-2 border-t border-stone-200">
                {(lastReceipt?.items || []).map((it: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.name} (×{it.quantity})</span>
                    <span>{formatCurrency(it.price * it.quantity, currentCurrency)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-stone-950">
                <span>Total Payé ({lastReceipt.paymentMethod.toUpperCase()}) :</span>
                <span className="text-emerald-700">{formatCurrency(lastReceipt.totalDue, currentCurrency)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setLastReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs"
              >
                Imprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

"use client";

import { useCartStore } from "@/store/cart";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { initiateRazorpayOrder, verifyAndCompleteOrder } from "./actions";

// Add a simple debounce utility
function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function CheckoutContent() {
  const { items, clearCart, appliedCoupon, setAppliedCoupon, addToCart, affiliateId, setAffiliateId } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [billingAddress, setBillingAddress] = useState("same");
  const router = useRouter();
  const searchParams = useSearchParams();
  const recoveryToken = searchParams.get("token");

  // Form states for real-time syncing
  const [formDataState, setFormDataState] = useState({
    email: "", phone: "", firstName: "", lastName: "",
    address: "", apartment: "", city: "", state: "", pincode: "",
    lastStep: "contact"
  });

  const debouncedData = useDebounce(formDataState, 2000);
  const lastSyncedRef = useRef("");

  useEffect(() => {
    setMounted(true);
    // Load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    // If recovery token exists, load data
    if (recoveryToken) {
      fetch(`/api/checkout/recover?token=${recoveryToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.checkout) {
            const ch = data.checkout;
            // Restore items
            if (ch.cartItems && (ch.cartItems as any[]).length > 0) {
              clearCart();
              (ch.cartItems as any[]).forEach(it => addToCart(it));
            }
            // Restore form fields
            setFormDataState({
              email: ch.email || "", phone: ch.phone || "",
              firstName: ch.firstName || "", lastName: ch.lastName || "",
              address: ch.address || "", apartment: ch.apartment || "",
              city: ch.city || "", state: ch.state || "", pincode: ch.pincode || "",
              lastStep: ch.lastStep || "contact"
            });
          }
        });
    }
  }, [recoveryToken]);

  // Sync abandoned checkout whenever form changes
  useEffect(() => {
    if (!mounted || items.length === 0) return;
    const { email, phone } = debouncedData;
    if (!email && !phone) return;

    const serialize = JSON.stringify({ ...debouncedData, items });
    if (serialize === lastSyncedRef.current) return;
    lastSyncedRef.current = serialize;

    fetch("/api/checkout/abandoned", {
      method: "POST",
      body: JSON.stringify({
        ...debouncedData,
        cartItems: items,
        total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        discountAmount: appliedCoupon ? (appliedCoupon.discountType === 'PERCENTAGE' ? (items.reduce((acc, i) => acc + i.price * i.quantity, 0) * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue) : 0,
        couponCode: appliedCoupon?.code
      }),
      headers: { "Content-Type": "application/json" }
    }).catch(console.error);
  }, [debouncedData, items, appliedCoupon, mounted]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const discountAmount = appliedCoupon ? (
    appliedCoupon.discountType === 'PERCENTAGE' 
      ? (subtotal * appliedCoupon.discountValue) / 100 
      : appliedCoupon.discountValue
  ) : 0;

  const totalAmount = subtotal - discountAmount;

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Cart is empty</h2>
        <Link href="/" className="text-amber-600 font-semibold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/discounts/apply", {
        method: "POST",
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data.coupon);
        if (data.isAffiliate) {
          setAffiliateId(data.affiliateId);
        } else {
          setAffiliateId(null);
        }
        setCouponCode("");
      } else {
        setCouponError(data.error || "Failed to apply coupon");
      }
    } catch (err) {
      setCouponError("Something went wrong");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      const cartData = items.map(i => ({ id: i.id, price: i.price, quantity: i.quantity, title: i.title }));
      const isCOD = paymentMethod === "cod";
      
      // Step 1: Initiate Razorpay or process COD
      const { orderId, keyId, isCashOnDelivery, error } = await initiateRazorpayOrder(totalAmount, isCOD);

      if (isCashOnDelivery || isCOD) {
        // Fallback or intentionally COD
        const finalId = await verifyAndCompleteOrder(null, formData, cartData, affiliateId);
        if (finalId) {
          clearCart();
          router.push("/checkout/success");
        }
        return;
      }

      if (error || !orderId) {
        alert(error || "Payment failed to initiate");
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay window
      const options = {
        key: keyId,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Deeksha Candles",
        description: "Candles Order",
        order_id: orderId,
        handler: async function (response: any) {
           // Step 3: Verify and capture order server side
           try {
             const finalId = await verifyAndCompleteOrder(
               {
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_signature: response.razorpay_signature
               },
               formData,
               cartData,
               affiliateId
             );
             if (finalId) {
               clearCart();
               router.push("/checkout/success");
             }
           } catch (err) {
             console.error("Verification failed", err);
             alert("Payment verification failed. Please contact support.");
             setLoading(false);
           }
        },
        prefill: {
          name: `${formData.get("firstName")} ${formData.get("lastName")}`,
          email: formData.get("email"),
          contact: formData.get("phone"),
        },
        theme: { color: "#E11D48" } // Rose 600
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function(response: any) {
         console.error(response.error);
         alert("Payment failed.");
         setLoading(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <nav className="bg-white border-b border-gray-100 px-4 py-6 flex items-center justify-between sticky top-0 z-50">
        <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors ml-4">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <span className="font-bold text-xl tracking-tight text-gray-900 uppercase">
          Deeksha Candles
        </span>
        <div className="w-14" />
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 flex flex-col-reverse md:flex-row gap-16">
        <div className="flex-1">
          <form id="checkoutForm" onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Contact Section */}
            <section onFocus={() => setFormDataState(s => ({...s, lastStep: 'contact'}))}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
                <Link href="/login" className="text-rose-600 text-sm underline font-medium">Sign in</Link>
              </div>
              <div className="flex flex-col gap-3">
                <input required name="email" type="email" placeholder="Email" value={formDataState.email} onChange={(e) => setFormDataState(s => ({...s, email: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all" />
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Email me with news and offers</span>
                </label>
              </div>
            </section>

            {/* Delivery Section */}
            <section onFocus={() => setFormDataState(s => ({...s, lastStep: 'delivery'}))}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery</h2>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <label className="absolute left-4 top-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Country/Region</label>
                  <select name="country" className="w-full border border-gray-300 rounded-lg px-4 pt-6 pb-2 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all appearance-none bg-white">
                    <option value="India">India</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required name="firstName" type="text" placeholder="First name" value={formDataState.firstName} onChange={(e) => setFormDataState(s => ({...s, firstName: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all" />
                  <input required name="lastName" type="text" placeholder="Last name" value={formDataState.lastName} onChange={(e) => setFormDataState(s => ({...s, lastName: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all" />
                </div>

                <div className="relative">
                  <input required name="address" type="text" placeholder="Address" value={formDataState.address} onChange={(e) => setFormDataState(s => ({...s, address: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all pr-10" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>

                <input name="apartment" type="text" placeholder="Apartment, suite, etc. (optional)" value={formDataState.apartment} onChange={(e) => setFormDataState(s => ({...s, apartment: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input required name="city" type="text" placeholder="City" value={formDataState.city} onChange={(e) => setFormDataState(s => ({...s, city: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all" />
                  <div className="relative">
                    <label className="absolute left-4 top-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">State</label>
                    <select required name="state" value={formDataState.state} onChange={(e) => setFormDataState(s => ({...s, state: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 pt-6 pb-2 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all appearance-none bg-white">
                      <option value="">Select State</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                    </select>
                  </div>
                  <input required name="pincode" type="text" placeholder="PIN code" value={formDataState.pincode} onChange={(e) => setFormDataState(s => ({...s, pincode: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all" />
                </div>

                <div className="relative">
                  <input required name="phone" type="tel" placeholder="Phone" value={formDataState.phone} onChange={(e) => setFormDataState(s => ({...s, phone: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all pr-10" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 group cursor-help">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Save this information for next time</span>
                </label>
              </div>
            </section>

            {/* Shipping Method Section */}
            <section onFocus={() => setFormDataState(s => ({...s, lastStep: 'delivery'}))}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping method</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-500">Enter your shipping address to view available shipping methods.</p>
              </div>
            </section>

            {/* Payment Section */}
            <section onFocus={() => setFormDataState(s => ({...s, lastStep: 'payment'}))}>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Payment</h2>
              <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <label className={`flex flex-col p-4 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'bg-rose-50/50 border-b border-rose-200' : 'border-b border-gray-200'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-rose-600' : 'border-gray-300'}`}>
                        {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
                      </div>
                      <input type="radio" name="payment" value="razorpay" className="hidden" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                      <span className="font-medium text-gray-900">Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)</span>
                    </div>
                    <div className="flex gap-1.5">
                      <img src="/payment-icons/upi.svg" alt="UPI" className="h-4" />
                      <img src="/payment-icons/visa.svg" alt="Visa" className="h-4" />
                      <img src="/payment-icons/mastercard.svg" alt="Mastercard" className="h-4" />
                      <div className="h-4 px-1.5 border border-gray-200 rounded text-[8px] flex items-center text-gray-400 font-bold bg-white">+7</div>
                    </div>
                  </div>
                  {paymentMethod === 'razorpay' && (
                    <div className="mt-4 pt-4 border-t border-rose-100 flex flex-col items-center text-center px-8 pb-4">
                      <div className="w-12 h-12 bg-rose-600/10 rounded-full flex items-center justify-center mb-3">
                         <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      </div>
                      <p className="text-sm text-gray-600">You'll be redirected to Razorpay Secure to complete your purchase.</p>
                    </div>
                  )}
                </label>

                <label className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-rose-50/50' : ''}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-rose-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
                  </div>
                  <input type="radio" name="payment" value="cod" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                </label>
              </div>
            </section>

            {/* Billing Address Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing address</h2>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <label className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-gray-200 ${billingAddress === 'same' ? 'bg-rose-50/50' : ''}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingAddress === 'same' ? 'border-rose-600' : 'border-gray-300'}`}>
                    {billingAddress === 'same' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
                  </div>
                  <input type="radio" name="billing" value="same" className="hidden" checked={billingAddress === 'same'} onChange={() => setBillingAddress('same')} />
                  <span className="font-medium text-gray-900 text-sm">Same as shipping address</span>
                </label>

                <label className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${billingAddress === 'different' ? 'bg-rose-50/50' : ''}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingAddress === 'different' ? 'border-rose-600' : 'border-gray-300'}`}>
                    {billingAddress === 'different' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
                  </div>
                  <input type="radio" name="billing" value="different" className="hidden" checked={billingAddress === 'different'} onChange={() => setBillingAddress('different')} />
                  <span className="font-medium text-gray-900 text-sm">Use a different billing address</span>
                </label>
              </div>
            </section>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white rounded-lg py-5 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all"
              >
                {loading ? "Processing..." : "Pay now"}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full md:w-96 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
          <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 hide-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                  <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                disabled={couponLoading}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponCode}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>
            {couponError && <p className="text-red-500 text-xs mt-2 ml-1">{couponError}</p>}
            {appliedCoupon && (
              <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider">{appliedCoupon.code}</span>
                  <span className="text-emerald-600 text-[10px]">Coupon applied successfully</span>
                </div>
                <button onClick={() => setAppliedCoupon(null)} className="text-emerald-800 hover:text-red-600 transition-colors text-xs font-bold px-2 py-1">Remove</button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Discount ({appliedCoupon.code})</span>
                <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
              <span className="ml-auto text-[10px] text-gray-400 font-normal mr-2">INR</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

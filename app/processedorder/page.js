'use client';

import { useState } from 'react';

export default function ProcessedOrderPage() {
  // Shudhu 2-ti auto method: 'instant' ebong 'crypto'
  const [selectedMethod, setSelectedMethod] = useState('instant');
  const [loading, setLoading] = useState(false);

  // Example / State theke asha order data
  const [orderData, setOrderData] = useState({
    id: `HC-${Date.now().toString().slice(-6)}`,
    price: 1550, // BDT te total amount
    customerName: 'Customer Name',
    whatsappNumber: '017XXXXXXXX',
  });

  const bdtAmount = Number(orderData.price) || 0;
  const cryptoAmountUSD = (bdtAmount / 120).toFixed(2); // 1 USD = 120 BDT

  const handleProceed = async () => {
    setLoading(true);

    try {
      // ১. Instant Auto Pay (bKash/Nagad/Rocket via UddoktaPay)
      if (selectedMethod === 'instant') {
        const res = await fetch('/api/create-bdt-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.id,
            amount: bdtAmount,
            customerName: orderData.customerName,
            phone: orderData.whatsappNumber,
          }),
        });

        const data = await res.json();

        if (res.ok && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert(data.error || 'BDT payment shuru kora jayni');
        }
        return;
      }

      // ২. Crypto Auto Pay (USDT TRC-20 via NOWPayments)
      if (selectedMethod === 'crypto') {
        const res = await fetch('/api/create-crypto-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.id,
            amountUSD: cryptoAmountUSD,
            customerName: orderData.customerName,
            phone: orderData.whatsappNumber,
          }),
        });

        const data = await res.json();

        if (res.ok && data.invoiceUrl) {
          window.location.href = data.invoiceUrl;
        } else {
          alert(data.error || 'Crypto invoice toiri kora jayni');
        }
        return;
      }
    } catch (err) {
      alert('Server error: Payment gateway-te connect kora jacche na.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Payment Method Select Korun
        </h2>

        {/* Order Summary */}
        <div className="bg-gray-100 p-4 rounded-xl space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Order ID:</span>
            <span className="font-semibold text-gray-800">{orderData.id}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Payable Amount:</span>
            <span className="font-bold text-lg text-emerald-600">৳{bdtAmount}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Crypto Equivalent:</span>
            <span>${cryptoAmountUSD} USDT (Rate: ৳120 = $1)</span>
          </div>
        </div>

        {/* 2-Way Payment Options */}
        <div className="space-y-3">
          {/* Instant Auto Pay */}
          <div
            onClick={() => setSelectedMethod('instant')}
            className={`p-4 border-2 rounded-xl cursor-pointer transition flex items-center justify-between ${
              selectedMethod === 'instant'
                ? 'border-emerald-500 bg-emerald-50/40'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div>
              <p className="font-bold text-gray-800">Instant Pay (Auto)</p>
              <p className="text-xs text-gray-500">bKash, Nagad, Rocket</p>
            </div>
            <span className="text-sm font-bold text-emerald-600">৳{bdtAmount}</span>
          </div>

          {/* Crypto Auto Pay */}
          <div
            onClick={() => setSelectedMethod('crypto')}
            className={`p-4 border-2 rounded-xl cursor-pointer transition flex items-center justify-between ${
              selectedMethod === 'crypto'
                ? 'border-emerald-500 bg-emerald-50/40'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div>
              <p className="font-bold text-gray-800">Crypto Pay (Instant)</p>
              <p className="text-xs text-gray-500">USDT (TRC-20)</p>
            </div>
            <span className="text-sm font-bold text-emerald-600">${cryptoAmountUSD} USDT</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleProceed}
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
}

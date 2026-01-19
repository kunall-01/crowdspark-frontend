import React from "react";
import axios from "axios";

const RazorpayCheckout = ({ amount, campaignId, message, onSuccess }) => {
  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const orderRes = await axios.post(
        `${import.meta.env.VITE_BACKEND}/create-order`,
        { amount },
        { withCredentials: true }
      );

      const { orderId, currency } = orderRes.data;

      const options = {
        key: "rzp_test_Iw2FOWsIxTLOU4",
        amount: amount * 100,
        currency,
        name: "CrowdSpark",
        description: "Support this campaign",
        order_id: orderId,
        handler: async function (response) {
          // 3. After payment, send to /transactions
          const result = await axios.post(
            `${import.meta.env.VITE_BACKEND}/transactions`,
            {
              campaignId,
              amount,
              message,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );

          alert("Payment successful!");
          onSuccess?.(result.data); // call parent function
        },
        theme: {
          color: "#00b386",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Error during payment:", err);
      alert("Payment failed.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayCheckout;

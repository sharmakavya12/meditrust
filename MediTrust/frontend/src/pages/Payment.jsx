import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
 
const PaymentModal = ({ visible, onClose, appointmentId, backendUrl, token, onSuccess }) => {
  const [step, setStep] = useState(1); // step 1: enter phone, step 2: enter OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleSendOtp = async () => {
    if (!phone) return toast.error("Enter phone number");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/send-otp`,
        { appointmentId, phone },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-otp`,
        { appointmentId, otp },
         { headers: { Authorization: `Bearer ${token}` }}
      );

      if (data.success) {
        toast.success(data.message);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-semibold mb-4">Payment via OTP</h2>

        {step === 1 && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="input w-full"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="input w-full"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Verifying..." : "Verify & Pay"}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 border rounded text-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;

import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePay = async () => {
    try {
      await axios.put(`http://localhost:8080/api/admin/events/pay/${id}`);
      alert("Payment Successful!");
      navigate("/my-events"); // redirect after payment
    } catch (err) {
      alert("Payment failed!");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Event Payment</h2>
      <p>Payment Amount: Rs. 5000</p>
      <button onClick={handlePay}>Pay Now</button>
    </div>
  );
};

export default EventPayment;

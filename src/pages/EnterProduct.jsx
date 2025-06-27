import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SubmitButton from "../components/SubmitButton";

const FASTAPI_URL = import.meta.env.VITE_BACKEND_API;

export default function ProductForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalyticsButtons, setShowAnalyticsButtons] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitted(false);
    setIsLoading(true);
    setShowAnalyticsButtons(false);
    
    try {
      const res = await axios.post(`${FASTAPI_URL}/submitForm`, {
        product_name: data.product,
      });
      console.log(res.data);
      setMessage("Data submitted successfully!");
      setSubmitted(true);
      setShowAnalyticsButtons(true);
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("Error submitting data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleYoutubeAnalytics = () => {
    window.open('/youtube', '_blank');
  };

  const handleRedditAnalytics = () => {
    window.open('/reddit', '_blank');
  };

  return (
    <>
      <h1 className="m-2 p-5 text-2xl text-center font-bold">Product Sentiment Analyzer</h1>
      
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4">
        {/* Left side - Project Description */}
        <div className="md:w-1/2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">About This Project</h2>
          <p className="mb-4">
            The Product Sentiment Analyzer is a tool that helps you understand customer sentiment 
            about your products. By analyzing reviews and feedback, it provides valuable insights 
            into how your products are perceived in the market.
          </p>
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Enter your product name in the form</li>
            <li>Our system collects and analyzes customer reviews</li>
            <li>You receive detailed sentiment analysis reports</li>
            <li>Identify strengths and areas for improvement</li>
          </ul>
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="font-medium">Note:</p>
            <p className="text-sm">
              This tool uses advanced natural language processing to provide accurate sentiment analysis.
              Results may take a few moments to generate.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="md:w-1/2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 bg-white shadow rounded">
            <div>
              <label htmlFor="product" className="block font-medium">Product Name</label>
              <input
                id="product"
                {...register("product", { required: "Product name is required" })}
                className="w-full mt-1 border border-gray-300 rounded p-2"
                placeholder="Enter product name"
                disabled={isLoading}  // Disable input during submission
              />
              {errors.product && <p className="text-red-500 text-sm">{errors.product.message}</p>}
            </div>

            <SubmitButton 
              text={isLoading ? "Analyzing..." : "Submit"} 
              type="submit"
              disabled={isLoading || isSubmitting}
            />
            
            {/* Preloader */}
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
            
            {/* Message display */}
            {message && (
              <p className={`text-center ${submitted ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
            
            {/* Analytics Buttons */}
            {showAnalyticsButtons && (
              <div className="flex flex-col space-y-3 mt-4">
                <button
                  type="button"
                  onClick={handleYoutubeAnalytics}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
                >
                  YouTube Analytics
                </button>
                <button
                  type="button"
                  onClick={handleRedditAnalytics}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition"
                >
                  Reddit Analytics
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
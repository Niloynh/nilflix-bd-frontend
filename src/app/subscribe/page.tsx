"use client";
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { IoCheckmarkCircle, IoDiamondOutline } from "react-icons/io5";

const plans = [
    { name: 'Monthly', price: 150, features: ['Access to all movies', 'HD Streaming', 'No Ads'] },
    { name: 'Yearly', price: 1200, features: ['All Monthly benefits', 'Save 33%', 'Priority Support'] },
];

export default function SubscribePage() {
    const { token } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(plans[0]);
    const [message, setMessage] = useState('');

    const handleSubscription = async () => {
        if (!token) {
            setMessage("Please log in to subscribe.");
            return;
        }
        setMessage("Processing your subscription request...");
        
        // এখানে আপনার requestSubscription API কল করার কোড লিখুন
        // আপাতত আমরা শুধু একটি মেসেজ দেখাব
        setMessage(`Request for ${selectedPlan.name} plan submitted. Please wait for admin approval.`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <IoDiamondOutline className="mx-auto text-red-500 text-5xl mb-2"/>
                <h1 className="text-4xl font-extrabold text-white">Upgrade Your Plan</h1>
                <p className="text-gray-400 mt-2">Get unlimited access to all our premium content.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {plans.map(plan => (
                    <div 
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan)}
                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedPlan.name === plan.name ? 'border-red-500 bg-gray-800/50' : 'border-gray-700 bg-gray-800/20'}`}
                    >
                        <h2 className="text-2xl font-bold text-white">{plan.name} Plan</h2>
                        <p className="text-4xl font-extrabold text-white my-4">${plan.price}<span className="text-lg text-gray-400">/{plan.name === 'Monthly' ? 'mo' : 'yr'}</span></p>
                        <ul className="space-y-2">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2 text-gray-300">
                                    <IoCheckmarkCircle className="text-green-400"/> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto mt-8">
                <p className="text-center text-gray-300 mb-4">You have selected the <span className="font-bold text-white">{selectedPlan.name} Plan</span>.</p>
                {/* এখানে পেমেন্টের জন্য ফর্ম যুক্ত করতে হবে */}
                <button onClick={handleSubscription} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-lg">
                    Proceed to Payment
                </button>
                {message && <p className="text-center text-yellow-400 mt-4">{message}</p>}
            </div>
        </div>
    );
}
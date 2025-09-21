"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext'; // <-- AuthContext ইমপোর্ট করুন

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { login } = useAuth(); // <-- login ফাংশনটি Context থেকে নিন

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('Logging in...');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        
        try {
            const res = await fetch(`${apiUrl}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                // localStorage.setItem('token', data.token); // <-- এই লাইনটির আর প্রয়োজন নেই
                login(data.token); // <-- টোকেনটি Context-এর মাধ্যমে সেট করুন
                
                setMessage('Login successful! Redirecting...');
                router.push('/profile'); // প্রোফাইল পেজে রিডাইরেক্ট করা হচ্ছে
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-white">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">Log In</button>
                </form>
                {message && <p className="text-center text-yellow-400">{message}</p>}
                 <p className="text-sm text-center text-gray-400">
                    Don't have an account? <Link href="/signup" className="font-medium text-red-500 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
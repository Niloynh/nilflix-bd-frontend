"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
    IoPersonCircleOutline, IoWalletOutline, IoArrowUpCircleOutline, 
    IoArrowDownCircleOutline, IoReceiptOutline, IoGiftOutline, 
    IoSettingsOutline, IoLogOutOutline 
} from 'react-icons/io5';

// Transaction ডেটার জন্য টাইপ
interface Transaction {
    _id: string;
    createdAt: string;
    type: 'TopUp' | 'Withdrawal' | 'Subscription' | 'Bet';
    amount: number;
    status: 'Completed' | 'Pending' | 'Cancelled';
}

// সেকশনগুলোর জন্য Helper কম্পোনেন্ট
const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            {icon} {title}
        </h2>
        {children}
    </div>
);

export default function MyNilflixPage() {
    const { user, token, loading, logout } = useAuth();
    const router = useRouter();
    
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [message, setMessage] = useState('');

    // --- Deposit States ---
    const [depositAmount, setDepositAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [userPaymentNumber, setUserPaymentNumber] = useState('');

    // --- Withdraw States ---
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawNumber, setWithdrawNumber] = useState('');

    useEffect(() => {
        // যদি ব্যবহারকারী লগইন করা না থাকে, তাকে লগইন পেজে পাঠিয়ে দিন
        if (!loading && !user) {
            router.push('/login');
        }

        // Transaction History Fetch করুন
        if (token) {
            const fetchTransactions = async () => {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                try {
                    const res = await fetch(`${apiUrl}/api/wallet/history`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setTransactions(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch transactions:", error);
                }
            };
            fetchTransactions();
        }
    }, [user, loading, token, router]);

    const handleDeposit = async () => {
        if (!depositAmount || !paymentMethod || !transactionId || !userPaymentNumber) {
            setMessage('All deposit fields are required.');
            return;
        }
        setMessage('Submitting deposit request...');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        try {
            const res = await fetch(`${apiUrl}/api/wallet/request-topup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseInt(depositAmount, 10),
                    method: paymentMethod,
                    transactionId,
                    userPaymentNumber,
                    screenshotUrl: 'http://example.com/screenshot.jpg' // আপাতত একটি ডামি লিঙ্ক
                })
            });
            const data = await res.json();
            setMessage(data.message);
            if (res.ok) {
                // ফর্ম রিসেট করুন
                setDepositAmount('');
                setPaymentMethod('');
                setTransactionId('');
                setUserPaymentNumber('');
            }
        } catch (error) {
            setMessage('Failed to submit deposit request.');
        }
    };
    
    const handleWithdraw = async () => {
        if (!withdrawAmount || !withdrawNumber) {
            setMessage('Please enter amount and account number.');
            return;
        }
        setMessage('Submitting withdrawal request...');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        try {
             const res = await fetch(`${apiUrl}/api/wallet/request-withdrawal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    pointsToWithdraw: parseInt(withdrawAmount, 10),
                    paymentMethod: 'bKash', // আপনি এটি ডাইনামিক করতে পারেন
                    paymentNumber: withdrawNumber
                })
            });
            const data = await res.json();
            setMessage(data.message);
             if (res.ok) {
                setWithdrawAmount('');
                setWithdrawNumber('');
            }
        } catch (error) {
            setMessage('Failed to submit withdrawal request.');
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (loading || !user) {
        return <p className="text-center text-gray-400 mt-20">Loading Profile...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24">
            <h1 className="text-3xl font-bold mb-8 text-white">🧑‍💻 Profile & Account</h1>

            {/* My Profile */}
            <Section title="My Profile" icon={<IoPersonCircleOutline size={24}/>}>
                <div className="space-y-2 text-gray-300">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </Section>

            {/* Financial Section */}
            <Section title="Financial Section" icon={<IoWalletOutline size={24}/>}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-400">Main Balance</p>
                        <p className="text-2xl font-bold text-green-400">{user.pointsBalance || 0}</p>
                    </div>
                    {/* Placeholder for other financial data */}
                </div>
            </Section>

            {/* Deposit */}
            <Section title="Deposit" icon={<IoArrowUpCircleOutline size={24}/>}>
                <div className="space-y-4">
                    <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Enter Amount (e.g., 500)" className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600"/>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600">
                        <option value="">Select Payment Method</option>
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                    </select>
                     <input type="text" value={userPaymentNumber} onChange={(e) => setUserPaymentNumber(e.target.value)} placeholder="Your Payment Number (e.g., 017...)" className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600"/>
                    <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Transaction ID (TrxID)" className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600"/>
                    <button onClick={handleDeposit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">Confirm Deposit</button>
                </div>
            </Section>

            {/* Withdraw */}
            <Section title="Withdraw" icon={<IoArrowDownCircleOutline size={24}/>}>
                 <div className="space-y-4">
                    <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Amount to Withdraw" className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600"/>
                    <input type="text" value={withdrawNumber} onChange={(e) => setWithdrawNumber(e.target.value)} placeholder="Your Account Number" className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600"/>
                    <button onClick={handleWithdraw} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">Send Withdrawal Request</button>
                </div>
            </Section>

            {/* Transaction History */}
            <Section title="Transaction History" icon={<IoReceiptOutline size={24}/>}>
                <div className="space-y-3">
                    {transactions.length > 0 ? transactions.map(tx => (
                        <div key={tx._id} className="bg-gray-900/50 p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{tx.type}</p>
                                <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{tx.type === 'Withdrawal' ? '-' : ''}{tx.amount} Pts</p>
                                <p className="text-xs text-yellow-400">{tx.status}</p>
                            </div>
                        </div>
                    )) : <p className="text-gray-400">No transactions yet.</p>}
                </div>
            </Section>

            {/* ... Other sections ... */}

            {/* Settings & Others */}
            <Section title="Settings & Others" icon={<IoSettingsOutline size={24}/>}>
                <div className="space-y-3">
                    <button onClick={handleLogout} className="w-full text-left p-3 bg-red-800 hover:bg-red-700 rounded-lg flex items-center gap-2 font-bold">
                        <IoLogOutOutline /> Log Out
                    </button>
                </div>
            </Section>

             {message && <p className="text-center mt-4 text-yellow-300">{message}</p>}
        </div>
    );
}
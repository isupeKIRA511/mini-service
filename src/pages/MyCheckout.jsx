import React, { useState } from 'react'
import api from '../api/axios'

export default function Checkout({ authCode }) {
    const [loading, setLoading] = useState(false)





    async function handlePayment() {
        const payload = { amount: 1, currency: 'IQD' }
        setLoading(true)

        try {
            const resp = await api.post('/payment', payload)
            const data = resp.data

            let paymentUrl = data.paymentUrl || data.redirectUrl || data.url || null
            if (!paymentUrl && data.orderId) {
                paymentUrl = `https://www.wallet.com/cashier?orderId=${encodeURIComponent(data.orderId)}`
            }

            if (!paymentUrl) {
                const message = typeof data === 'string' ? data : JSON.stringify(data)
                const errorText = 'Invalid payment response: ' + message

                if (typeof my !== 'undefined' && my.alert) {
                    my.alert({ content: errorText })
                } else {
                    alert(errorText)
                }
                setLoading(false)
                return
            }

            if (typeof my !== 'undefined' && typeof my.tradePay === 'function') {
                my.tradePay({
                    paymentUrl: paymentUrl,
                    success: (res) => {
                        my.alert({ content: JSON.stringify(res) })
                    },
                    fail: (res) => {
                        my.alert({ content: JSON.stringify(res) })
                    }
                })
            } else {
                window.location.href = paymentUrl
            }
        } catch (err) {
            console.error('handlePayment error', err)
            const status = err.response ? err.response.status : 'Network Error'
            const msg = `Payment request failed: ${status}`

            if (typeof my !== 'undefined' && my.alert) {
                my.alert({ content: msg })
            } else {
                alert(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500"></div>

                <div className="mb-6 inline-flex p-3 bg-gray-900 rounded-full text-yellow-500 border border-gray-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-white">Confirm Payment</h2>
                <p className="text-sm text-gray-400 mb-6">Secure payment for your parking session.</p>

                <div className="bg-gray-900 rounded-lg p-4 mb-6 text-left border border-gray-700">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Session ID</span>
                        <span className="text-gray-300 font-mono text-xs">{authCode ? authCode.slice(0, 8) + '...' : 'PENDING'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total Due</span>
                        <span className="text-xl font-bold text-yellow-500">$5.00</span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : 'Pay Now Securely'}
                </button>

                <p className="mt-4 text-[10px] text-gray-500">
                    Encrypted transaction. powered by ParkNow Secure.
                </p>
            </div>
        </div>
    )
}

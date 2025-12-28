import React from 'react'

function Nav() {
    return (
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-500 bg-gray-900 px-3 py-1 rounded">
                PARK<span className="text-white">NOW</span>
            </div>
            {/* Minimal nav for a clean look */}
            <div className="text-sm font-medium text-gray-400">
                Premium Parking
            </div>
        </nav>
    )
}

export default function Hero({ onAuthenticate, onSendApi, onPayment, isLoggedIn, authCode }) {
    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans">
            <header className="relative bg-gray-800 border-b border-gray-700">
                <Nav />

                <div className="max-w-4xl mx-auto text-center py-20 px-6">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-yellow-500 uppercase bg-gray-900 rounded-full border border-gray-700">
                        Smart Parking System
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                        {isLoggedIn ? 'Welcome Back, Driver' : 'Secure Your Spot in Seconds'}
                    </h1>

                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        {isLoggedIn
                            ? 'You are logged in. Manage your reservations and payments below.'
                            : 'Reserve premium parking spaces at the best rates in the city. Contactless entry and exit.'
                        }
                    </p>

                    <div className="mt-10 flex flex-col items-center gap-6">
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={onAuthenticate}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg border border-gray-600 transition-all"
                            >
                                1. Auth
                            </button>

                            <button
                                onClick={onSendApi}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg transition-all"
                            >
                                2. Login
                            </button>

                            <button
                                onClick={onPayment}
                                className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition-all"
                            >
                                3. Pay
                            </button>
                        </div>

                        {authCode && (
                            <div className="text-xs font-mono text-green-400 bg-green-900/30 px-3 py-1 rounded border border-green-800">
                                Auth Code: {authCode}
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative parking lines */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
            </header>


            <main className="">
                <section
                    id="features"
                    className="max-w-6xl mx-auto px-6 py-20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-gray-800 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors">
                            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 text-yellow-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Instant Booking</h3>
                            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                                No tickets needed. Book via the app and drive in instantly with license plate recognition.
                            </p>
                        </div>

                        <div className="p-8 bg-gray-800 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors">
                            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 text-yellow-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">24/7 Security</h3>
                            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                                Your vehicle is safe with our round-the-clock surveillance and patrolled lots.
                            </p>
                        </div>

                        <div className="p-8 bg-gray-800 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors">
                            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 text-yellow-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Best Rates</h3>
                            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                                Save up to 50% compared to drive-up rates when you book ahead online.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="ctas" className="max-w-4xl mx-auto px-6 py-16 text-center border-t border-gray-800">
                    <h2 className="text-3xl font-bold text-white">Need a monthly pass?</h2>
                    <p className="mt-4 text-gray-400">
                        Get unlimited access to all our garages starting at $99/mo.
                    </p>

                    <div className="mt-8">
                        <a className="inline-block px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors border border-gray-600">
                            View Monthly Plans
                        </a>
                    </div>
                </section>
            </main>

            <footer className="py-8 text-center text-sm text-gray-600 bg-gray-900 border-t border-gray-800">
                © {new Date().getFullYear()} ParkNow Services. Safe travels.
            </footer>
        </div>
    )
}

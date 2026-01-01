import React from 'react';
import { MapPin, Star, User, Phone, CheckCircle, XCircle, Clock, CreditCard, QrCode } from 'lucide-react';

const StudentDashboard = ({ userData, onPayment, authCode, onAuthenticate, onPay, onScan }) => {
    const handleCheckIn = () => {
        if (typeof my !== 'undefined') {
            my.showLoading({ content: 'جاري تحديد الموقع...' });

            my.getLocation({
                success(res) {
                    my.hideLoading();
                    console.log(res);
                    my.alert({
                        title: 'تم الوصول',
                        content: 'تم تحديد موقعك وإشعار ولي الأمر بصولك للمدرسة/الجامعة.'
                    });
                },
                fail() {
                    my.hideLoading();
                    my.alert({ title: 'فشل تحديد الموقع' });
                },
            });
        } else {
            alert('تم تحديد موقعك (محاكاة) وإشعار ولي الأمر.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 font-['Cairo']">

            <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-6 pt-12 pb-24 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BusIcon size={120} />
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white">
                        <User size={32} />
                    </div>
                    <div className="text-white">
                        <p className="text-blue-100 text-sm font-medium">صباح الخير،</p>
                        <h1 className="text-2xl font-bold">بارق</h1>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-16 relative z-20 space-y-6">

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="text-slate-400" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">سائق الخط</h3>
                                <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full mt-1 w-fit">
                                    <Clock size={12} />
                                    <span>يصل خلال 5 دقائق</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                            <Phone size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-sm border-t border-slate-50 pt-3">
                        <MapPin size={16} className="text-slate-400" />
                        <span>بغداد، العراق</span>
                    </div>
                </div>


                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={onScan}
                        className="flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg shadow-blue-200 border border-transparent hover:scale-105 transition-all"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                            <QrCode size={20} />
                        </div>
                        <span className="text-xs font-bold text-white">سجل حضورك بواسطة QR</span>
                    </button>

                    <button
                        onClick={handleCheckIn}
                        className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-red-500 hover:shadow-md transition-all"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">تسجيل دخول</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-green-500 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <MapPin size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">الرحلة</span>
                    </button>
                </div>


                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-slate-900">الاشتراك الشهري</h3>
                            <p className="text-xs text-slate-400 mt-1">يستحق في 1 شباط 2026</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-xl font-black text-blue-600">100,000</span>
                            <span className="text-xs text-slate-400 font-medium">دينار عراقي</span>
                        </div>
                    </div>

                    <button
                        onClick={onPayment}
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        <CreditCard size={18} />
                        <span>دفع الاشتراك</span>
                    </button>

                    {authCode && (
                        <div className="mt-2 text-center">
                            <span className="text-[10px] text-slate-300 font-mono">CODE: {authCode.slice(-6)}</span>
                        </div>
                    )}
                </div>


                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-sm">قيم رحلتك الأخيرة</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={18} className="text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BusIcon = ({ size = 24, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M8 6v6" />
        <path d="M15 6v6" />
        <path d="M2 12h19.6" />
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
        <circle cx="7" cy="18" r="2" />
        <path d="M9 18h5" />
        <circle cx="16" cy="18" r="2" />
    </svg>
);

export default StudentDashboard;

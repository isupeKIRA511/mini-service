import React from 'react';
import { User, Bus, ChevronLeft } from 'lucide-react';

const LandingScreen = ({ onSelectRole, loading }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Cairo']">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4">
                        <Bus className="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900">خطوطي</h1>
                    <p className="text-slate-600 text-lg font-medium">نظام النقل الذكي للجامعات والمدارس</p>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                        نوفر لك رحلة آمنة ومريحة مع ميزة التتبع المباشر لضمان وصولك بسلام أينما تذهب.
                    </p>
                </div>

                <div className="grid gap-4 mt-8">
                    <button
                        onClick={() => onSelectRole('student')}
                        disabled={loading}
                        className={`group relative flex items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 w-full text-right ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="mr-4 flex-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                أنا طالب
                            </h3>
                            <p className="text-sm text-slate-500">تابع رحلاتك واشتراكك بسهولة</p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </button>

                    <button
                        onClick={() => onSelectRole('driver')}
                        disabled={loading}
                        className={`group relative flex items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 w-full text-right ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                            <Bus className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="mr-4 flex-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                                أنا سائق
                            </h3>
                            <p className="text-sm text-slate-500">إدارة الركاب والرحلات</p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-green-500 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingScreen;

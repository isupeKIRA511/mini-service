import React, { useState } from 'react';
import { User, MapPin, CheckCircle, XCircle, MoreVertical, LogOut, Phone } from 'lucide-react';

const DriverDashboard = ({ onAuthenticate, onPay, onScan, garageName, parkingTime, scannedCode, showGarageDetails, onCloseGarageDetails }) => {
    const [students, setStudents] = useState([
        { id: 1, name: 'طالب 1', location: 'الكرادة، داخل', status: 'present', paid: true },
        { id: 2, name: 'طالب 2', location: 'المنصور، شارع 14', status: 'pending', paid: false },
        { id: 3, name: 'طالب 3', location: 'حي الجامعة', status: 'absent', paid: true },
        { id: 4, name: 'طالب 4', location: 'اليرموك، الأربع شوارع', status: 'present', paid: true },
    ]);

    const toggleStatus = (id) => {
        setStudents(students.map(s => {
            if (s.id === id) {
                return { ...s, status: s.status === 'present' ? 'absent' : 'present' };
            }
            return s;
        }));
    };

    const handleSubstituteRequest = () => {
        const content = "السائق الحالي لا يمكنه توصيل الطلاب حالياً ويريد إرسال سائق بديل.";

        if (typeof my !== 'undefined' && my.confirm) {
            my.confirm({
                title: 'تأكيد طلب سائق بديل',
                content: content,
                confirmButtonText: 'تأكيد الطلب',
                cancelButtonText: 'إلغاء',
                success: (res) => {
                    if (res.confirm) {
                        if (my.showToast) my.showToast({ content: 'تم رفع الطلب للإدارة', type: 'success' });
                        else my.alert({ content: 'تم رفع الطلب للإدارة' });
                    }
                }
            });
        } else {
            if (confirm(content)) {
                alert('تم رفع الطلب للإدارة');
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-['Cairo'] pb-24">

            <div className="bg-white p-6 pb-4 shadow-sm border-b border-slate-100 sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">مسار اليوم</h1>
                        <p className="text-slate-500 text-sm">4 طلاب في الانتظار</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <User className="text-slate-600" />
                    </div>
                </div>
            </div>


            <div className="p-4 space-y-4">
                {students.map((student) => (
                    <div key={student.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-50">
                            <User className="w-8 h-8 text-slate-400" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-900">{student.name}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${student.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {student.paid ? 'تم الدفع' : 'متأخر'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                                <MapPin size={12} />
                                <span className="truncate max-w-[120px]">{student.location}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleStatus(student.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${student.status === 'present'
                                ? 'bg-green-50 text-green-600 ring-2 ring-green-100'
                                : student.status === 'absent'
                                    ? 'bg-red-50 text-red-600 ring-2 ring-100'
                                    : 'bg-slate-50 text-slate-300'
                                }`}
                        >
                            {student.status === 'present' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        </button>
                    </div>
                ))}
            </div>


            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
                <button
                    onClick={handleSubstituteRequest}
                    className="w-full border-2 border-red-100 text-red-600 bg-red-50 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={18} />
                    <span>طلب سائق بديل</span>
                </button>
            </div>
        </div>
    );
};

export default DriverDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const SelectRolePage = () => {
    const { user, selectRole, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if user already has a role
    useEffect(() => {
        if (isAuthenticated && user?.role) {
            navigate('/');
        }
        if (!isAuthenticated) {
            // navigate('/login'); // Allow viewing if logic dictates, but usually should be logged in. 
            // For now, let's assume this page is protected by auth status in a way.
        }
    }, [isAuthenticated, user, navigate]);

    const handleSelectRole = async (role) => {
        setIsLoading(true);
        try {
            console.log("Selecting role:", role);
            const success = await selectRole(role);
            console.log("Select role success:", success);
            if (success) {
                // Determine redirect based on role
                const target = role === 'RECRUITER' ? '/hr/register-company' : '/';
                navigate(target);
            } else {
                toast.error("Không thể cập nhật vai trò. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Failed to select role:", error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra khi chọn vai trò.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Chào mừng bạn đến với JobHunter
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Vui lòng chọn vai trò để tiếp tục trải nghiệm
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl px-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Candidate Card */}
                    <div
                        onClick={() => !isLoading && handleSelectRole('CANDIDATE')}
                        className={`relative group bg-white overflow-hidden shadow-sm hover:shadow-xl rounded-2xl cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-indigo-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="px-6 py-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <User className="h-12 w-12 text-indigo-600" />
                                </div>
                            </div>
                            <h3 className="text-center text-xl font-bold text-gray-900 mb-2">
                                Ứng viên (Candidate)
                            </h3>
                            <p className="text-center text-gray-500 mb-6 h-12">
                                Tìm kiếm hàng ngàn công việc, tạo CV chuyên nghiệp.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-600 mb-8">
                                <li className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    Ứng tuyển nhanh chóng
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    Quản lý hồ sơ cá nhân
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    Nhận gợi ý việc làm
                                </li>
                            </ul>
                            <div className="flex justify-center">
                                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                    Chọn Ứng viên <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recruiter Card */}
                    <div
                        onClick={() => !isLoading && handleSelectRole('RECRUITER')}
                        className={`relative group bg-white overflow-hidden shadow-sm hover:shadow-xl rounded-2xl cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-pink-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="px-6 py-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-pink-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <Building2 className="h-12 w-12 text-pink-600" />
                                </div>
                            </div>
                            <h3 className="text-center text-xl font-bold text-gray-900 mb-2">
                                Nhà tuyển dụng (Recruiter)
                            </h3>
                            <p className="text-center text-gray-500 mb-6 h-12">
                                Đăng tin tuyển dụng, quản lý ứng viên hiệu quả.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-600 mb-8">
                                <li className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    Đăng tin tuyển dụng miễn phí
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    Tìm kiếm ứng viên tiềm năng
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    Xây dựng thương hiệu công ty
                                </li>
                            </ul>
                            <div className="flex justify-center">
                                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pink-700 bg-pink-100 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                                    Chọn Nhà tuyển dụng <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectRolePage;

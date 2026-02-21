import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';
import { MapPin, Globe, Users, ArrowLeft, Building } from 'lucide-react';
import JobCard from '../../components/JobCard';

const CompanyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch company info
    const { data: company, isLoading: isLoadingCompany } = useQuery({
        queryKey: ['company', id],
        queryFn: async () => {
            const res = await axiosClient.get(ENDPOINTS.COMPANIES.GET_ONE(id));
            return res.data.data ? res.data.data : res.data;
        }
    });

    // Fetch jobs of company
    const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
        queryKey: ['jobs', 'company', id],
        queryFn: async () => {
            const params = {
                page: 1,
                size: 10,
                filter: `company.id:${id}`
            };
            const res = await axiosClient.get(ENDPOINTS.JOBS.ALL, { params });
            return res.data.data ? res.data.data : res.data;
        },
        enabled: !!id // Only run if ID exists
    });

    if (isLoadingCompany) return <div className="p-12 text-center">Đang tải thông tin công ty...</div>;
    if (!company) return <div className="p-12 text-center text-red-500">Không tìm thấy công ty.</div>;

    return (
        <div>
            {/* Cover Image Placeholder */}
            <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-3xl -mx-4 sm:-mx-6 lg:-mx-8 mb-12 relative">
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition">
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="container mx-auto px-4 -mt-24 relative z-10">
                <div className="bg-white rounded-2xl shadow-lg border p-8 flex flex-col md:flex-row items-start gap-8">
                    <div className="w-32 h-32 bg-white rounded-xl shadow p-2 flex items-center justify-center -mt-16 md:mt-0">
                        {/* Logo */}
                        <Building className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                        <div className="flex flex-wrap gap-6 text-gray-600">
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                                {company.address}
                            </div>
                            <div className="flex items-center">
                                <Globe className="w-4 h-4 mr-2 text-blue-500" />
                                <a href="#" className="hover:underline">Website</a>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-green-500" />
                                100-500 nhân viên
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {/* Left: Description */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">Giới thiệu công ty</h2>
                            <div className="prose text-gray-700 whitespace-pre-line">
                                {company.description || 'Chưa có thông tin giới thiệu.'}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-orange-600 pl-4">Tuyển dụng ({jobsData?.meta?.total || 0})</h2>

                            <div className="space-y-4">
                                {isLoadingJobs ? (
                                    <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
                                ) : jobsData?.result?.length > 0 ? (
                                    jobsData.result.map(job => (
                                        <JobCard key={job.id} job={job} />
                                    ))
                                ) : (
                                    <p className="text-gray-500">Hiện tại công ty chưa có vị trí nào đang tuyển.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact or Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Vui lòng liên hệ qua email hoặc số điện thoại bên dưới.
                            </p>
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold">Email:</p>
                                <p className="text-blue-600">hr@{company.name.toLowerCase().replace(/\s/g, '')}.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailPage;


import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';
import { Users, Building, Briefcase, FileText } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Fetch stats (mock or real count)
    // We can use the pagination metadata from list endpoints to get totals.

    const { data: usersData } = useQuery({ queryKey: ['count-users'], queryFn: () => axiosClient.get(ENDPOINTS.USERS.BASE, { params: { size: 1 } }).then(res => res.data.data || res.data) });
    const { data: jobsData } = useQuery({ queryKey: ['count-jobs'], queryFn: () => axiosClient.get(ENDPOINTS.JOBS.ALL, { params: { size: 1 } }).then(res => res.data.data || res.data) });
    const { data: compsData } = useQuery({ queryKey: ['count-comps'], queryFn: () => axiosClient.get(ENDPOINTS.COMPANIES.PUBLIC, { params: { size: 1 } }).then(res => res.data.data || res.data) });

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{value !== undefined ? value : '...'}</p>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={Users}
                    label="Tổng Users"
                    value={usersData?.meta?.total}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Building}
                    label="Tổng Công Ty"
                    value={compsData?.meta?.total}
                    color="bg-orange-500"
                />
                <StatCard
                    icon={Briefcase}
                    label="Tổng Việc Làm"
                    value={jobsData?.meta?.total}
                    color="bg-green-500"
                />
                <StatCard
                    icon={FileText}
                    label="Hồ Sơ Ứng Tuyển"
                    value="--"
                    color="bg-purple-500"
                />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border text-center py-20">
                <p className="text-gray-500">Biểu đồ thống kê đang được phát triển...</p>
            </div>
        </div>
    );
};

export default AdminDashboard;

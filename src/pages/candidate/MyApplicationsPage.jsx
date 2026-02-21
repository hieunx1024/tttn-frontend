import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';
import Pagination from '../../components/Pagination';
import {
    FileText,
    Calendar,
    TrendingUp,
    MapPin,
    Building2,
    ExternalLink,
    Filter,
    Search
} from 'lucide-react';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        reviewing: 0,
        approved: 0,
        rejected: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [pagination.current, pagination.pageSize, filterStatus]);

    const fetchStats = async () => {
        try {
            const res = await axiosClient.get(ENDPOINTS.RESUMES.MY_STATS);
            const data = res.data?.data ? res.data.data : res.data;
            if (data) setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const queryParams = {
                page: pagination.current - 1,
                size: pagination.pageSize,
                sort: 'createdAt,desc'
            };

            if (filterStatus !== 'ALL') {
                queryParams.filter = `status:'${filterStatus}'`;
            }

            // Note: Search term implementation depends on backend support. 
            // For now, client-side search is removed because it conflicts with server-side pagination.
            // If search is needed, backend must support searching resumes by job name (requires join).

            const response = await axiosClient.get(ENDPOINTS.RESUMES.MY_HISTORY, {
                params: queryParams
            });

            const data = response.data?.data ? response.data.data : response.data;

            setApplications(data?.result || []);
            setPagination(prev => ({
                ...prev,
                total: data?.meta?.total || 0
            }));
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
            REVIEWING: { label: 'Đang xem xét', className: 'bg-purple-100 text-purple-700 border-purple-300' },
            APPROVED: { label: 'Đã chấp nhận', className: 'bg-green-100 text-green-700 border-green-300' },
            REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700 border-red-300' }
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Client-side search (optional, if list is small) or remove. 
    // Since we use server-side pagination, client-side filtering is weird. 
    // For now, let's keep search simple or rely on the API result. 
    // The previous code filtered 'applications' which was only current page.
    const filteredApplications = applications;

    const statusFilters = [
        { value: 'ALL', label: 'Tất cả', count: stats.total },
        { value: 'PENDING', label: 'Chờ xử lý', count: stats.pending },
        { value: 'REVIEWING', label: 'Đang xem xét', count: stats.reviewing },
        { value: 'APPROVED', label: 'Đã chấp nhận', count: stats.approved },
        { value: 'REJECTED', label: 'Bị từ chối', count: stats.rejected },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đơn ứng tuyển của tôi</h1>
                        <p className="text-gray-600">Theo dõi trạng thái các đơn ứng tuyển của bạn</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold text-blue-600">{applications.length}</p>
                        <p className="text-sm text-gray-500">Tổng số đơn</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên công việc hoặc công ty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Status Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">Lọc theo trạng thái</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setFilterStatus(filter.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filterStatus === filter.value
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-4">Không tìm thấy đơn ứng tuyển nào</p>
                        <Link
                            to="/jobs"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Khám phá việc làm
                        </Link>
                    </div>
                ) : (
                    filteredApplications.map((application) => (
                        <div
                            key={application.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                        >
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {application.job?.name || 'N/A'}
                                            </h2>
                                            {getStatusBadge(application.status)}
                                        </div>

                                        <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <Building2 className="w-4 h-4" />
                                                <span className="font-semibold">{application.job?.company?.name || 'N/A'}</span>
                                            </div>
                                            {application.job?.location && (
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{application.job.location}</span>
                                                </div>
                                            )}
                                            {application.job?.salary && (
                                                <div className="flex items-center space-x-2">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span className="font-semibold text-green-600">{application.job.salary}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>Nộp đơn ngày: {formatDate(application.createdAt)}</span>
                                            {application.updatedAt && application.updatedAt !== application.createdAt && (
                                                <>
                                                    <span>•</span>
                                                    <span>Cập nhật: {formatDate(application.updatedAt)}</span>
                                                </>
                                            )}
                                        </div>

                                        {application.note && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                                <p className="text-sm font-semibold text-gray-700 mb-1">Ghi chú từ nhà tuyển dụng:</p>
                                                <p className="text-sm text-gray-600">{application.note}</p>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        to={`/jobs/${application.job?.id}`}
                                        className="ml-4 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </Link>
                                </div>

                                {/* Application Timeline */}
                                <ApplicationTimeline status={application.status} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {filteredApplications.length > 0 && (
                <div className="flex justify-center">
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onChange={(page) => setPagination(prev => ({ ...prev, current: page }))}
                    />
                </div>
            )}
        </div>
    );
};

// Timeline Component
const ApplicationTimeline = ({ status }) => {
    const steps = [
        { key: 'PENDING', label: 'Nộp hồ sơ', description: 'Đơn đã được gửi' },
        { key: 'REVIEWING', label: 'Đang xem xét', description: 'HR đang xem xét' },
        { key: 'APPROVED', label: 'Chấp nhận', description: 'Chúc mừng!' },
    ];

    const getStepStatus = (stepKey) => {
        const statusOrder = ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'];
        const currentIndex = statusOrder.indexOf(status);
        const stepIndex = statusOrder.indexOf(stepKey);

        if (status === 'REJECTED') {
            return stepKey === 'PENDING' ? 'completed' : 'rejected';
        }

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Tiến trình ứng tuyển</h3>
            <div className="flex items-center justify-between relative">
                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(step.key);

                    return (
                        <div key={step.key} className="flex-1 relative">
                            <div className="flex flex-col items-center">
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${stepStatus === 'completed'
                                        ? 'bg-green-500 text-white shadow-lg'
                                        : stepStatus === 'current'
                                            ? 'bg-blue-500 text-white shadow-lg animate-pulse'
                                            : stepStatus === 'rejected'
                                                ? 'bg-red-500 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {stepStatus === 'completed' ? '✓' : index + 1}
                                </div>

                                {/* Label */}
                                <div className="mt-3 text-center">
                                    <p className={`text-sm font-semibold ${stepStatus === 'current' ? 'text-blue-600' :
                                        stepStatus === 'completed' ? 'text-green-600' :
                                            stepStatus === 'rejected' ? 'text-red-600' :
                                                'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300 ${getStepStatus(steps[index + 1].key) === 'completed' || getStepStatus(steps[index + 1].key) === 'current'
                                        ? 'bg-green-500'
                                        : 'bg-gray-200'
                                        }`}
                                    style={{ transform: 'translateY(-50%)' }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Rejected Status */}
            {status === 'REJECTED' && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-700">❌ Đơn ứng tuyển đã bị từ chối</p>
                    <p className="text-xs text-red-600 mt-1">Đừng nản lòng! Hãy tiếp tục tìm kiếm cơ hội mới.</p>
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;

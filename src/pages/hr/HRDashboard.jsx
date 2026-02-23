import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, Progress } from 'antd';
import { FileTextOutlined, AuditOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

const HRDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalResumes: 0,
        pendingResumes: 0,
        approvedResumes: 0,
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch jobs
            const jobsResponse = await axios.get(ENDPOINTS.JOBS.BASE, {
                params: { current: 1, pageSize: 1 }
            });

            // Fetch resumes
            const resumesResponse = await axios.get(ENDPOINTS.RESUMES.BASE, {
                params: { current: 1, pageSize: 100 }
            });

            const resumes = resumesResponse.data?.data?.result || [];
            const pendingCount = resumes.filter(r => r.status === 'PENDING' || r.status === 'REVIEWING').length;
            const approvedCount = resumes.filter(r => r.status === 'APPROVED').length;

            setStats({
                totalJobs: jobsResponse.data?.data?.meta?.total || 0,
                totalResumes: resumesResponse.data?.data?.meta?.total || 0,
                pendingResumes: pendingCount,
                approvedResumes: approvedCount,
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Không thể tải thống kê. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">HR Dashboard</h1>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng số tin tuyển dụng"
                            value={stats.totalJobs}
                            prefix={<AuditOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng số hồ sơ"
                            value={stats.totalResumes}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hồ sơ chờ xử lý"
                            value={stats.pendingResumes}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hồ sơ đã duyệt"
                            value={stats.approvedResumes}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} md={12}>
                    <Card title="Tỉ lệ xử lý hồ sơ" className="h-full">
                        <div className="flex flex-col items-center justify-center p-4">
                            <Progress
                                type="dashboard"
                                percent={stats.totalResumes > 0 ? Math.round((stats.approvedResumes / stats.totalResumes) * 100) : 0}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                width={200}
                            />
                            <div className="mt-4 text-center">
                                <p className="text-gray-500 mb-2">Tỉ lệ hồ sơ đã được duyệt</p>
                                <div className="flex justify-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#87d068]"></div>
                                        <span>Đã duyệt ({stats.approvedResumes})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#faad14]"></div>
                                        <span>Chờ xử lý ({stats.pendingResumes})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Trạng thái tuyển dụng" className="h-full">
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Hồ sơ chờ xử lý</span>
                                    <span className="font-medium text-[#faad14]">{stats.pendingResumes} / {stats.totalResumes}</span>
                                </div>
                                <Progress
                                    percent={stats.totalResumes > 0 ? Math.round((stats.pendingResumes / stats.totalResumes) * 100) : 0}
                                    status="active"
                                    strokeColor="#faad14"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Hồ sơ đã duyệt</span>
                                    <span className="font-medium text-[#52c41a]">{stats.approvedResumes} / {stats.totalResumes}</span>
                                </div>
                                <Progress
                                    percent={stats.totalResumes > 0 ? Math.round((stats.approvedResumes / stats.totalResumes) * 100) : 0}
                                    status="success"
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-medium text-gray-800 mb-2">Hướng dẫn chung</h3>
                                <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                                    <li>Sử dụng menu <strong>Tin tuyển dụng</strong> để quản lý các tin đăng.</li>
                                    <li>Mục <strong>Quản lý Ứng viên</strong> giúp bạn theo dõi các hồ sơ apply.</li>
                                    <li>Luôn cập nhật <strong>Thông tin Công ty</strong> để thu hút ứng viên.</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HRDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminTable from '../../components/AdminTable';
import axios from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';
import dayjs from 'dayjs';

const { TextArea } = Input;

const { Option } = Select;
const { RangePicker } = DatePicker;

const HRJobManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetchJobs();
        fetchCompanies();
        fetchSkills();
    }, [pagination.current, pagination.pageSize]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(ENDPOINTS.JOBS.BASE, {
                params: {
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                }
            });
            setData(response.data?.data?.result || []);
            setPagination(prev => ({
                ...prev,
                total: response.data?.data?.meta?.total || 0
            }));
        } catch (error) {
            message.error('Không thể tải danh sách công việc');
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(ENDPOINTS.COMPANIES.PUBLIC, {
                params: { current: 1, pageSize: 100 }
            });
            setCompanies(response.data?.data?.result || []);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchSkills = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/skills`, {
                params: { current: 1, pageSize: 100 }
            });
            setSkills(response.data?.data?.result || []);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const [jobCount, setJobCount] = useState(0);

    useEffect(() => {
        fetchJobs();
        fetchJobCount(); // Add fetchJobCount
        fetchCompanies();
        fetchSkills();
    }, [pagination.current, pagination.pageSize]);

    const fetchJobCount = async () => {
        try {
            const response = await axios.get(ENDPOINTS.JOBS.COUNT_BY_COMPANY);
            setJobCount(response.data?.data || 0);
        } catch (error) {
            console.error('Error fetching job count:', error);
        }
    };

    const handleCreate = () => {
        if (jobCount >= 2) {
            Modal.confirm({
                title: 'Nâng cấp gói dịch vụ',
                content: (
                    <div>
                        <p>Bạn đã sử dụng hết <strong>{jobCount}/2</strong> tin đăng miễn phí.</p>
                        <p>Vui lòng nâng cấp gói dịch vụ để tiếp tục đăng tin tuyển dụng không giới hạn và tiếp cận nhiều ứng viên hơn.</p>
                    </div>
                ),
                okText: 'Nâng cấp ngay',
                cancelText: 'Đóng',
                onOk: () => {
                    navigate('/hr/pricing');
                }
            });
            return;
        }
        setEditingJob(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingJob(record);
        form.setFieldsValue({
            name: record.name,
            location: record.location,
            salary: record.salary,
            quantity: record.quantity,
            level: record.level,
            company: record.company?.id,
            skills: record.skills?.map(s => s.id),
            dateRange: record.startDate && record.endDate ? [dayjs(record.startDate), dayjs(record.endDate)] : null,
            active: record.active !== undefined ? record.active : true,
            description: record.description || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${ENDPOINTS.JOBS.BASE}/${id}`);
            message.success('Xóa công việc thành công');
            fetchJobs();
            fetchJobCount(); // Update count after delete
        } catch (error) {
            message.error('Không thể xóa công việc');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                startDate: values.dateRange?.[0]?.toDate().toISOString(),
                endDate: values.dateRange?.[1]?.toDate().toISOString(),
                company: { id: values.company },
                skills: values.skills?.map(id => ({ id })) || [],
            };
            delete payload.dateRange;

            if (editingJob) {
                await axios.put(ENDPOINTS.JOBS.BASE, { ...payload, id: editingJob.id });
                message.success('Cập nhật công việc thành công');
            } else {
                await axios.post(ENDPOINTS.JOBS.BASE, payload);
                message.success('Tạo công việc thành công');
            }
            setIsModalOpen(false);
            fetchJobs();
            fetchJobCount(); // Update count after create
        } catch (error) {
            // Handle specific backend error for limit exceeded if UI check fails
            if (error.response?.status === 402) { // Assuming 402 for Payment Required
                Modal.confirm({
                    title: 'Nâng cấp gói dịch vụ',
                    content: error.response?.data?.message || 'Bạn đã hết lượt đăng tin miễn phí.',
                    okText: 'Nâng cấp ngay',
                    cancelText: 'Hủy',
                    onOk: () => {
                        navigate('/hr/pricing');
                    }
                });
            } else {
                message.error(error.response?.data?.message || 'Có lỗi xảy ra');
            }
        }
    };

    const columns = [
        { title: 'Tên công việc', dataIndex: 'name', key: 'name' },
        { title: 'Công ty', dataIndex: ['company', 'name'], key: 'company' },
        { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
        {
            title: 'Mức lương',
            dataIndex: 'salary',
            key: 'salary',
            render: (salary) => salary ? `${salary.toLocaleString()} VND` : 'Thỏa thuận'
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Cấp độ', dataIndex: 'level', key: 'level' },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                <span className={active ? 'text-green-600' : 'text-red-600'}>
                    {active ? 'Đang tuyển' : 'Đã đóng'}
                </span>
            )
        },
    ];

    const actions = [
        {
            icon: <EditOutlined />,
            onClick: handleEdit,
            tooltip: 'Chỉnh sửa',
        },
        {
            icon: <DeleteOutlined />,
            onClick: (record) => {
                Modal.confirm({
                    title: 'Xác nhận xóa',
                    content: 'Bạn có chắc chắn muốn xóa công việc này?',
                    onOk: () => handleDelete(record.id),
                });
            },
            tooltip: 'Xóa',
            danger: true,
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Quản lý Tin tuyển dụng</h1>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${jobCount >= 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        Đã dùng: {jobCount}/2 tin miễn phí
                    </div>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Đăng tin tuyển dụng
                </Button>
            </div>

            <AdminTable
                columns={columns}
                data={data}
                loading={loading}
                pagination={pagination}
                onPaginationChange={setPagination}
                actions={actions}
            />

            <Modal
                title={editingJob ? 'Chỉnh sửa công việc' : 'Đăng tin tuyển dụng mới'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={800}
                okText={editingJob ? 'Cập nhật' : 'Tạo mới'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Tên công việc" rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}>
                        <Input placeholder="Ví dụ: Senior Java Developer" />
                    </Form.Item>

                    <Form.Item name="company" label="Công ty" rules={[{ required: true, message: 'Vui lòng chọn công ty' }]}>
                        <Select placeholder="Chọn công ty">
                            {companies.map(c => (
                                <Option key={c.id} value={c.id}>{c.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}>
                        <Input placeholder="Ví dụ: Hà Nội, Hồ Chí Minh" />
                    </Form.Item>

                    <Form.Item name="salary" label="Mức lương (VND)">
                        <InputNumber min={0} className="w-full" placeholder="Ví dụ: 20000000" />
                    </Form.Item>

                    <Form.Item name="quantity" label="Số lượng tuyển" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>

                    <Form.Item name="level" label="Cấp độ" rules={[{ required: true, message: 'Vui lòng chọn cấp độ' }]}>
                        <Select placeholder="Chọn cấp độ">
                            <Option value="INTERN">Intern</Option>
                            <Option value="FRESHER">Fresher</Option>
                            <Option value="JUNIOR">Junior</Option>
                            <Option value="MIDDLE">Middle</Option>
                            <Option value="SENIOR">Senior</Option>
                            <Option value="LEADER">Leader</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="skills" label="Kỹ năng yêu cầu">
                        <Select mode="multiple" placeholder="Chọn kỹ năng">
                            {skills.map(s => (
                                <Option key={s.id} value={s.id}>{s.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="dateRange" label="Thời gian tuyển dụng">
                        <RangePicker className="w-full" format="YYYY-MM-DD" />
                    </Form.Item>

                    <Form.Item name="active" label="Trạng thái" valuePropName="checked" initialValue={true}>
                        <Switch checkedChildren="Đang tuyển" unCheckedChildren="Đã đóng" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả công việc"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc' }]}
                    >
                        <TextArea
                            rows={8}
                            placeholder="Nhập mô tả chi tiết về công việc..."
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HRJobManagement;

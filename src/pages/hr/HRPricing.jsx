import React, { useState } from 'react';
import { Card, Button, Typography, Row, Col, Tag, message } from 'antd';
import { CheckCircleOutlined, StarFilled } from '@ant-design/icons';
import axios from '../../api/axiosClient';

const { Title, Text } = Typography;

const HRPricing = () => {
    const [loading, setLoading] = useState(false);

    const plans = [
        {
            id: 1, // Matches DB
            name: 'Free',
            price: 0,
            features: [
                'Đăng 2 tin tuyển dụng miễn phí',
                'Hiển thị tiêu chuẩn',
                'Quản lý hồ sơ cơ bản'
            ],
            type: 'free'
        },
        {
            id: 2,
            name: 'Professional',
            price: 500000,
            recommended: true,
            features: [
                'Đăng tối đa 20 tin tuyển dụng',
                'Đẩy Top tin trong 7 ngày',
                'Lưu trữ hồ sơ không giới hạn',
                'Hỗ trợ qua Email/Chat'
            ],
            type: 'pro'
        },
        {
            id: 3,
            name: 'Enterprise',
            price: 2000000,
            features: [
                'Không giới hạn tin đăng',
                'Đẩy Top tin thường xuyên',
                'Quản lý đánh giá kỹ năng tự động',
                'Hỗ trợ chuyên gia 24/7',
                'Gợi ý CV bằng AI'
            ],
            type: 'ent'
        }
    ];

    const handleBuyNow = async (plan) => {
        if (plan.price === 0) {
            message.info('Gói Free chỉ dành cho công ty mới tạo.');
            return;
        }

        try {
            setLoading(true);
            const returnUrl = `${window.location.origin}/hr/payment/return`;
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
            const response = await axios.post(`${apiUrl}/payments/create`, null, {
                params: {
                    method: 'VNPAY',
                    subscriptionId: plan.id,
                    returnUrl: returnUrl
                }
            });

            if (response.data && response.data.data && response.data.data.paymentUrl) {
                window.location.href = response.data.data.paymentUrl;
            } else if (response.data && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                message.error('Không tìm thấy link thanh toán!');
            }
        } catch (error) {
            console.error('Lỗi khi tạo payment:', error);
            message.error('Có lỗi xảy ra khi tạo giao dịch. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Title level={2}>Bảng giá & Gói dịch vụ JobHunter</Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Chọn các gói dịch vụ linh hoạt phù hợp với nhu cầu tuyển dụng của doanh nghiệp bạn.
                </Text>
            </div>

            <Row gutter={[24, 24]} justify="center">
                {plans.map((plan) => (
                    <Col xs={24} md={8} key={plan.id}>
                        <Card
                            hoverable
                            style={{
                                height: '100%',
                                borderRadius: '12px',
                                borderColor: plan.recommended ? '#1890ff' : '#e8e8e8',
                                borderWidth: plan.recommended ? '2px' : '1px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
                        >
                            {plan.recommended && (
                                <Tag color="blue" style={{ position: 'absolute', top: '-12px', right: '40%', fontSize: '14px', padding: '4px 12px' }}>
                                    <StarFilled /> TỐT NHẤT
                                </Tag>
                            )}
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <Title level={3} style={{ margin: 0 }}>{plan.name}</Title>
                                <Title level={2} style={{ color: '#1890ff', margin: '16px 0' }}>
                                    {plan.price.toLocaleString()} đ
                                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}> / tháng</span>
                                </Title>
                            </div>

                            <div style={{ flex: 1, marginBottom: '24px' }}>
                                {plan.features.map((item, index) => (
                                    <div key={index} style={{ padding: '8px 0' }}>
                                        <Text>
                                            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '10px' }} />
                                            {item}
                                        </Text>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type={plan.recommended ? "primary" : "default"}
                                size="large"
                                block
                                loading={loading}
                                onClick={() => handleBuyNow(plan)}
                            >
                                Mua ngay
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HRPricing;

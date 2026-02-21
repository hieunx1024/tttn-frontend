import { Skeleton } from 'antd';

const JobCardSkeleton = () => {
    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 w-full">
                    {/* Logo Skeleton */}
                    <Skeleton.Node active style={{ width: 64, height: 64, borderRadius: 12 }} />

                    <div className="flex-1">
                        {/* Title Skeleton */}
                        <Skeleton.Input active size="small" style={{ width: '60%', marginBottom: 8 }} />
                        {/* Company Name Skeleton */}
                        <Skeleton.Input active size="small" style={{ width: '40%', display: 'block' }} />
                    </div>
                </div>
            </div>

            {/* Tags Skeleton */}
            <div className="flex gap-3 mb-4">
                <Skeleton.Button active size="small" shape="round" style={{ width: 80 }} />
                <Skeleton.Button active size="small" shape="round" style={{ width: 100 }} />
                <Skeleton.Button active size="small" shape="round" style={{ width: 60 }} />
            </div>

            {/* Footer Skeleton */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Skeleton.Input active size="small" style={{ width: 100 }} />
                <Skeleton.Button active size="small" style={{ width: 60 }} />
            </div>
        </div>
    );
};

export default JobCardSkeleton;

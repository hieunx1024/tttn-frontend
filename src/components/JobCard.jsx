import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building2, CalendarDays } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const JobCard = ({ job }) => {
    return (
        <div className="group relative bg-white rounded-xl border border-secondary-200 p-5 hover:shadow-lg hover:border-brand-300 transition-all duration-300 flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-brand-50 flex items-center justify-center border border-brand-100 flex-shrink-0">
                    {job.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain p-2" />
                    ) : (
                        <Building2 className="w-7 h-7 text-brand-500" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <Link to={`/jobs/${job.id}`} className="block">
                            <h3 className="text-lg font-bold text-secondary-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1" title={job.name}>
                                {job.name}
                            </h3>
                        </Link>
                        {job.hot && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 ml-2 animate-pulse">
                                HOT
                            </span>
                        )}
                    </div>
                    <Link to={`/companies/${job.company?.id}`} className="text-sm text-secondary-500 hover:text-brand-600 transition-colors line-clamp-1 flex items-center gap-1">
                        {job.company?.name || 'Company Name'}
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <DollarSign className="w-3.5 h-3.5 mr-1" />
                    {job.salary ? job.salary.toLocaleString() : 'Thỏa thuận'}
                </div>
                <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary-50 text-secondary-600 border border-secondary-100">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    <span className="truncate max-w-[120px]" title={job.location}>{job.location}</span>
                </div>
                <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {job.level}
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-secondary-100 flex items-center justify-between text-xs text-secondary-400">
                <div className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: vi }) : 'Mới đăng'}
                </div>
                <span className="px-2 py-1 rounded bg-secondary-100 text-secondary-600">
                    {job.type || 'Full-time'}
                </span>
            </div>

            {/* Hover Action */}
            <div className="hidden absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl group-hover:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <Link
                    to={`/jobs/${job.id}`}
                    className="bg-brand-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-brand-700 pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
};

export default JobCard;

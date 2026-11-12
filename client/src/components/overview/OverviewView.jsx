import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  ArrowUpRight, 
  RotateCw, 
  AlertCircle 
} from 'lucide-react';
import employeeService from '../../services/employeeService';

export const OverviewView = ({ onNavigateToEmployees }) => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    departmentCount: 0,
    departmentBreakdown: {},
    recentEmployees: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateStats = (data, totalCount) => {
    const list = data || [];
    const total = totalCount || list.length;
    const active = list.filter((e) => e.status === 'Active').length;
    const inactive = list.filter((e) => e.status === 'Inactive').length;

    const deptMap = {};
    list.forEach((e) => {
      const dept = e.department || 'Unassigned';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    return {
      total,
      active,
      inactive,
      departmentCount: Object.keys(deptMap).length,
      departmentBreakdown: deptMap,
      recentEmployees: list.slice(0, 5),
    };
  };

  useEffect(() => {
    let isMounted = true;
    employeeService.getEmployees({ limit: 1000, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((response) => {
        if (!isMounted) return;
        if (response && response.success) {
          setStats(calculateStats(response.data, response.pagination?.totalEmployees));
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Unable to retrieve statistics from server');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    employeeService.getEmployees({ limit: 1000, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((response) => {
        if (response && response.success) {
          setStats(calculateStats(response.data, response.pagination?.totalEmployees));
        }
      })
      .catch((err) => {
        setError(err.message || 'Unable to retrieve statistics from server');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const metricCards = [
    {
      label: 'Total Workforce',
      value: stats.total,
      context: 'Registered personnel in MongoDB Atlas',
      icon: Users,
    },
    {
      label: 'Active Personnel',
      value: stats.active,
      context: `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% active engagement rate`,
      icon: UserCheck,
    },
    {
      label: 'Inactive Records',
      value: stats.inactive,
      context: 'Suspended, departed or on-hold profiles',
      icon: UserX,
    },
    {
      label: 'Active Departments',
      value: stats.departmentCount,
      context: 'Functional operational units',
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h2 className="text-xl font-semibold text-[#191C1A] tracking-tight">
            Workforce Overview
          </h2>
          <p className="text-xs text-[#636B65] mt-0.5">
            Operational workforce indicators and live headcount calculated from MongoDB Atlas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1.5 self-start sm:self-auto text-[#5C625E] hover:text-[#191C1A] hover:bg-[#F2F3F0] rounded border border-[#D5D8D3] bg-white transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh metrics"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#54745D]' : ''}`} />
        </button>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-[#FCF2F2] border border-[#FAD4D4] rounded-md p-4 flex items-center justify-between text-xs text-[#BA3838]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Failed to load live statistics: {error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-2.5 py-1 text-xs font-medium text-white bg-[#BA3838] hover:bg-[#A32E2E] rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {metricCards.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E2E4DE] rounded-md p-4 shadow-2xs hover:border-[#D5D8D3] transition-colors"
            >
              <div className="flex items-center justify-between text-[#68706A] mb-2">
                <span className="text-xs font-medium">{metric.label}</span>
                <div className="p-1 rounded bg-[#F4F5F2] text-[#47634F]">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-[#191C1A] tracking-tight">
                {isLoading ? (
                  <div className="h-7 bg-[#EAECE8] rounded w-16 animate-pulse" />
                ) : (
                  metric.value
                )}
              </div>
              <div className="text-[11px] text-[#78807A] mt-1">
                {metric.context}
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Breakdown & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department Distribution */}
        <div className="lg:col-span-2 bg-white border border-[#E2E4DE] rounded-md p-5 shadow-2xs">
          <h3 className="text-sm font-semibold text-[#191C1A]">Department Allocation</h3>
          <p className="text-xs text-[#636B65] mt-0.5">
            Headcount breakdown across registered operational departments.
          </p>

          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="space-y-2 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 bg-[#EAECE8] rounded animate-pulse" />
                ))}
              </div>
            ) : Object.keys(stats.departmentBreakdown).length === 0 ? (
              <p className="text-xs text-[#8C938D] py-4 text-center">
                No department records registered yet.
              </p>
            ) : (
              Object.entries(stats.departmentBreakdown).map(([dept, count]) => {
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#2C322E]">{dept}</span>
                      <span className="text-[#636B65]">
                        <strong>{count}</strong> ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F0F2EE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#54745D] rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Directory Callout */}
        <div className="bg-[#FAFBF9] border border-[#E2E4DE] rounded-md p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded bg-[#EEF3EF] text-[#344E3B] flex items-center justify-center mb-3 border border-[#D5E2D8]">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#191C1A]">
              Personnel Directory
            </h3>
            <p className="text-xs text-[#636B65] mt-1.5 leading-relaxed">
              Access the complete staff catalog to search, filter, edit details, or update employment statuses.
            </p>
          </div>

          <div className="pt-5 mt-4 border-t border-[#E8E8E3]">
            <button
              onClick={onNavigateToEmployees}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#54745D] hover:bg-[#45614D] rounded-md transition-colors shadow-2xs cursor-pointer"
            >
              <span>Manage Directory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;

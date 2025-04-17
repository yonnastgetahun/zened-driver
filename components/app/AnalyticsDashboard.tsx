'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnalyticsProps {
  analyticsData: {
    variantA: {
      count: number;
      avgDuration: number;
      userCount: number;
    };
    variantB: {
      count: number;
      avgDuration: number;
      userCount: number;
    };
    rawEvents: Array<{
      id: number;
      alert_level: number;
      alert_variant: string;
      duration?: number;
      created_at: string;
      user_id: string;
    }>;
  };
}

/**
 * Advanced analytics dashboard for A/B testing
 * Shows visualizations and metrics comparing alert variants
 */
const AnalyticsDashboard = ({ analyticsData }: AnalyticsProps) => {
  const { variantA, variantB, rawEvents } = analyticsData;
  
  // Format data for charts
  const variantComparisonData = [
    {
      name: 'Total Alerts',
      'Variant A': variantA.count,
      'Variant B': variantB.count,
    },
    {
      name: 'Avg Duration (s)',
      'Variant A': parseFloat(variantA.avgDuration.toFixed(2)),
      'Variant B': parseFloat(variantB.avgDuration.toFixed(2)),
    },
    {
      name: 'Users',
      'Variant A': variantA.userCount,
      'Variant B': variantB.userCount,
    },
  ];
  
  const pieData = [
    { name: 'Variant A', value: variantA.count },
    { name: 'Variant B', value: variantB.count },
  ];
  
  const COLORS = ['#3b82f6', '#ef4444'];
  
  const getWinningVariant = () => {
    if (variantA.avgDuration === 0 || variantB.avgDuration === 0) {
      return "Insufficient data to determine a winner";
    }
    
    if (variantB.avgDuration < variantA.avgDuration) {
      const improvement = ((1 - variantB.avgDuration / variantA.avgDuration) * 100).toFixed(1);
      return `Variant B outperforms Variant A by ${improvement}% with shorter alert durations`;
    } else {
      const improvement = ((1 - variantA.avgDuration / variantB.avgDuration) * 100).toFixed(1);
      return `Variant A outperforms Variant B by ${improvement}% with shorter alert durations`;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">A/B Testing Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Alerts Card */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <AlertTriangle size={24} className="text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Total Alerts</h3>
              <p className="text-2xl font-semibold">{variantA.count + variantB.count}</p>
            </div>
          </div>
        </Card>
        
        {/* Average Duration Card */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <Clock size={24} className="text-amber-700" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Avg. Duration</h3>
              <p className="text-2xl font-semibold">
                {((variantA.avgDuration * variantA.count + variantB.avgDuration * variantB.count) / 
                  (variantA.count + variantB.count || 1)).toFixed(2)}s
              </p>
            </div>
          </div>
        </Card>
        
        {/* Total Users Card */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <Users size={24} className="text-green-700" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Unique Users</h3>
              <p className="text-2xl font-semibold">{variantA.userCount + variantB.userCount}</p>
            </div>
          </div>
        </Card>
        
        {/* Winning Variant Card */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100">
              <TrendingUp size={24} className="text-purple-700" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Better Performer</h3>
              <p className="text-lg font-semibold">
                {variantA.avgDuration < variantB.avgDuration ? 'Variant A' : 'Variant B'}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Bar Chart Comparison */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Variant Comparison</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={variantComparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Variant A" fill="#3b82f6" />
              <Bar dataKey="Variant B" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Distribution Pie Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Alert Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Insights */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">A/B Testing Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Test Winner</h3>
              <p>{getWinningVariant()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Variant A Response Time:</span>
                <span>{variantA.avgDuration.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Variant B Response Time:</span>
                <span>{variantB.avgDuration.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Sample Confidence:</span>
                <span>{((variantA.count + variantB.count) > 50 ? 'High' : 'Low')}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Events */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Alert Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rawEvents.slice(0, 10).map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.alert_variant === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Variant {event.alert_variant}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{event.alert_level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {event.duration ? `${event.duration.toFixed(2)}s` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard; 
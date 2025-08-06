import React, { useState, useEffect } from 'react';
import config from '../config';

const SampleReports = ({ onSelectReport }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);

  useEffect(() => {
    fetchSampleReports();
  }, []);

  const fetchSampleReports = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/sample-reports`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        setError('Failed to load sample reports');
      }
    } catch (err) {
      console.error('Error fetching sample reports:', err);
      setError('Failed to load sample reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = (report) => {
    if (onSelectReport) {
      onSelectReport(report.originalText);
    }
  };

  const toggleExpanded = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Blood Work':
        return '🩸';
      case 'Metabolic':
        return '🧪';
      case 'Endocrine':
        return '🦋';
      case 'Cardiac':
        return '❤️';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        📋 Sample Medical Reports
      </h3>
      <p className="text-gray-600 mb-6">
        Try these sample medical reports to see how the AI explains complex medical information in simple terms.
      </p>
      
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                <h4 className="font-medium text-gray-800">{report.title}</h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {report.category}
                </span>
              </div>
              <button
                onClick={() => toggleExpanded(report.id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {expandedReport === report.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>
            
            {expandedReport === report.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Raw Medical Data:</h5>
                <pre className="text-sm text-gray-600 bg-white p-3 rounded border whitespace-pre-wrap font-mono">
                  {report.originalText}
                </pre>
                
                <h5 className="font-medium text-gray-700 mb-2 mt-4">AI Simplified Explanation:</h5>
                <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                  <div dangerouslySetInnerHTML={{ 
                    __html: report.simplifiedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') 
                  }} />
                </div>
              </div>
            )}
            
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleSelectReport(report)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Use This Report
              </button>
              {expandedReport !== report.id && (
                <button
                  onClick={() => toggleExpanded(report.id)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Preview
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 How to Use:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click "Use This Report" to copy the medical data to the input field</li>
          <li>• Click "Simplify Medical Text" to see the AI explanation</li>
          <li>• Try asking follow-up questions in the chat</li>
          <li>• Compare different types of medical reports</li>
        </ul>
      </div>
    </div>
  );
};

export default SampleReports; 
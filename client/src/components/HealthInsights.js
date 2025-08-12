import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import config from '../config';

const HealthInsights = ({ medicalData, userProfile }) => {
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  // Demo health insights data
  const demoInsights = {
    overview: {
      riskScore: 72,
      riskLevel: 'moderate',
      trendsImproving: 3,
      trendsWorsening: 1,
      nextAppointment: '2024-03-15',
      keyMetrics: {
        cholesterol: { value: 195, trend: 'stable', target: '<200' },
        glucose: { value: 105, trend: 'improving', target: '<100' },
        bloodPressure: { value: '125/82', trend: 'worsening', target: '<120/80' },
        weight: { value: 75, trend: 'improving', target: '70-75' }
      }
    },
    riskFactors: [
      {
        category: 'Cardiovascular',
        level: 'moderate',
        score: 6.5,
        factors: ['Borderline cholesterol', 'Mild hypertension'],
        recommendations: [
          'Reduce sodium intake to <2300mg/day',
          'Increase aerobic exercise to 150 min/week',
          'Consider omega-3 supplements'
        ],
        timeframe: 'Monitor for 3 months'
      },
      {
        category: 'Diabetes',
        level: 'low',
        score: 3.2,
        factors: ['Slightly elevated fasting glucose'],
        recommendations: [
          'Maintain healthy weight',
          'Choose low glycemic foods',
          'Regular glucose monitoring'
        ],
        timeframe: 'Annual screening'
      }
    ],
    predictions: {
      cholesterol: {
        next3Months: { value: 188, confidence: 85 },
        next6Months: { value: 182, confidence: 78 },
        nextYear: { value: 175, confidence: 65 }
      },
      diabetes: {
        risk: 15,
        timeframe: '10 years',
        modifiableFactors: ['weight', 'exercise', 'diet']
      },
      cardiovascular: {
        risk: 8,
        timeframe: '10 years',
        modifiableFactors: ['blood pressure', 'cholesterol', 'smoking']
      }
    },
    recommendations: {
      immediate: [
        {
          type: 'dietary',
          title: 'Reduce Sodium Intake',
          description: 'Aim for less than 2,300mg sodium per day',
          impact: 'May reduce blood pressure by 2-8 mmHg',
          difficulty: 'moderate'
        },
        {
          type: 'exercise',
          title: 'Increase Cardio Exercise',
          description: '30 minutes brisk walking, 5 days per week',
          impact: 'Can improve cholesterol and blood pressure',
          difficulty: 'easy'
        }
      ],
      longTerm: [
        {
          type: 'monitoring',
          title: 'Regular Health Screenings',
          description: 'Lipid panel every 6 months, glucose annually',
          impact: 'Early detection of health changes',
          difficulty: 'easy'
        },
        {
          type: 'lifestyle',
          title: 'Stress Management',
          description: 'Practice meditation or yoga 20 min daily',
          impact: 'Can reduce blood pressure and improve overall health',
          difficulty: 'moderate'
        }
      ]
    }
  };

  useEffect(() => {
    if (medicalData || userProfile) {
      generateInsights();
    }
  }, [medicalData, userProfile]);

  const generateInsights = async () => {
    setIsLoading(true);
    // Simulate API call for insights generation
    setTimeout(() => {
      setInsights(demoInsights);
      setIsLoading(false);
    }, 1000);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;
      case 'worsening':
        return <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
      default:
        return <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'moderate': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className={`${colors.card} rounded-lg shadow-md p-6`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className={`${colors.card} rounded-lg shadow-md p-6`}>
        <div className="text-center py-8">
          <div className={`${colors.textSecondary} mb-4`}>
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className={`text-lg font-medium ${colors.textPrimary} mb-2`}>No Health Data Available</h4>
          <p className={colors.textSecondary}>Add medical reports to see personalized health insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${colors.card} rounded-lg shadow-md p-6 transition-all duration-300`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-lg transition-all duration-300">
          <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${colors.textPrimary}`}>🧠 AI Health Insights</h3>
          <p className={`text-sm ${colors.textSecondary}`}>Personalized health analytics and predictions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex space-x-1 ${colors.tabBackground} p-1 rounded-lg mb-6 transition-all duration-300`}>
        {[
          { id: 'overview', label: '📊 Overview', icon: 'overview' },
          { id: 'risks', label: '⚠️ Risk Factors', icon: 'risks' },
          { id: 'predictions', label: '🔮 Predictions', icon: 'predictions' },
          { id: 'recommendations', label: '💡 Recommendations', icon: 'recommendations' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 ${
              activeTab === tab.id
                ? colors.tabActive
                : colors.tabInactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Health Score */}
          <div className={`bg-gradient-to-r ${colors.gradients.accent} rounded-lg p-6 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-lg font-semibold ${colors.textPrimary}`}>Overall Health Score</h4>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(insights.overview.riskLevel)}`}>
                {insights.overview.riskLevel.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray={`${insights.overview.riskScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-300">{insights.overview.riskScore}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className={colors.textPrimary}>{insights.overview.trendsImproving} trends improving</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className={colors.textPrimary}>{insights.overview.trendsWorsening} trends worsening</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h4 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>Key Health Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(insights.overview.keyMetrics).map(([metric, data]) => (
                <div key={metric} className={`border ${colors.border} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`font-medium ${colors.textPrimary} capitalize`}>{metric.replace(/([A-Z])/g, ' $1')}</h5>
                    {getTrendIcon(data.trend)}
                  </div>
                  <div className={`text-2xl font-bold ${colors.textPrimary} mb-1`}>{data.value}</div>
                  <div className={`text-sm ${colors.textSecondary}`}>Target: {data.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors Tab */}
      {activeTab === 'risks' && (
        <div className="space-y-4">
          {insights.riskFactors.map((risk, index) => (
            <div key={index} className={`border ${colors.border} rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-lg font-semibold ${colors.textPrimary}`}>{risk.category} Risk</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(risk.level)}`}>
                    {risk.level.toUpperCase()}
                  </span>
                  <span className={`text-sm ${colors.textSecondary}`}>Score: {risk.score}/10</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className={`font-medium ${colors.textPrimary} mb-2`}>Risk Factors:</h5>
                  <ul className={`list-disc list-inside text-sm ${colors.textSecondary} space-y-1`}>
                    {risk.factors.map((factor, factorIndex) => (
                      <li key={factorIndex}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className={`font-medium ${colors.textPrimary} mb-2`}>Recommendations:</h5>
                  <ul className={`list-disc list-inside text-sm ${colors.textSecondary} space-y-1`}>
                    {risk.recommendations.map((rec, recIndex) => (
                      <li key={recIndex}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">⏱️ Timeframe: {risk.timeframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {/* Cholesterol Predictions */}
          <div className={`border ${colors.border} rounded-lg p-6`}>
            <h4 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>📈 Cholesterol Trend Prediction</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(insights.predictions.cholesterol).filter(([key]) => key !== 'confidence').map(([period, data]) => (
                <div key={period} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`text-sm ${colors.textSecondary} mb-1 capitalize`}>{period.replace(/([A-Z])/g, ' $1')}</div>
                  <div className={`text-2xl font-bold ${colors.textPrimary} mb-1`}>{data.value} mg/dL</div>
                  <div className={`text-xs ${colors.textSecondary}`}>{data.confidence}% confidence</div>
                </div>
              ))}
            </div>
          </div>

          {/* Disease Risk Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`border ${colors.border} rounded-lg p-6`}>
              <h4 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>🍭 Diabetes Risk</h4>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{insights.predictions.diabetes.risk}%</div>
                <div className={`text-sm ${colors.textSecondary}`}>Risk in {insights.predictions.diabetes.timeframe}</div>
              </div>
              <div>
                <h5 className={`font-medium ${colors.textPrimary} mb-2`}>Modifiable Factors:</h5>
                <div className="flex flex-wrap gap-2">
                  {insights.predictions.diabetes.modifiableFactors.map((factor, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full capitalize">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`border ${colors.border} rounded-lg p-6`}>
              <h4 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>❤️ Cardiovascular Risk</h4>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{insights.predictions.cardiovascular.risk}%</div>
                <div className={`text-sm ${colors.textSecondary}`}>Risk in {insights.predictions.cardiovascular.timeframe}</div>
              </div>
              <div>
                <h5 className={`font-medium ${colors.textPrimary} mb-2`}>Modifiable Factors:</h5>
                <div className="flex flex-wrap gap-2">
                  {insights.predictions.cardiovascular.modifiableFactors.map((factor, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full capitalize">
                      {factor.replace(/([A-Z])/g, ' $1')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Immediate Actions */}
          <div>
            <h4 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>🚀 Immediate Actions</h4>
            <div className="space-y-4">
              {insights.recommendations.immediate.map((rec, index) => (
                <div key={index} className={`border ${colors.border} rounded-lg p-4`}>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className={`font-medium ${colors.textPrimary}`}>{rec.title}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </span>
                  </div>
                  <p className={`text-sm ${colors.textSecondary} mb-2`}>{rec.description}</p>
                  <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 p-2 rounded">
                    <strong>Expected Impact:</strong> {rec.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Long-term Goals */}
          <div>
            <h4 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>🎯 Long-term Goals</h4>
            <div className="space-y-4">
              {insights.recommendations.longTerm.map((rec, index) => (
                <div key={index} className={`border ${colors.border} rounded-lg p-4`}>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className={`font-medium ${colors.textPrimary}`}>{rec.title}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </span>
                  </div>
                  <p className={`text-sm ${colors.textSecondary} mb-2`}>{rec.description}</p>
                  <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 p-2 rounded">
                    <strong>Expected Impact:</strong> {rec.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-purple-700 dark:text-purple-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>These insights are based on AI analysis and should not replace professional medical advice. Always consult with your healthcare provider.</span>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights; 
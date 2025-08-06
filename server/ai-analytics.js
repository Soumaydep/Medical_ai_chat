// Advanced AI Analytics for Medical Reports
// Future-ready functionality for comprehensive health analysis

const medicalInsights = {
  // Analyze medical trends and patterns
  analyzeHealthTrends: (reports) => {
    const trends = {
      cardiovascular: [],
      metabolic: [],
      immunological: [],
      hepatic: [],
      renal: []
    };

    reports.forEach(report => {
      const values = extractValues(report.originalText);
      
      // Cardiovascular trends
      if (values.cholesterol || values.triglycerides || values.hdl || values.ldl) {
        trends.cardiovascular.push({
          date: report.date || new Date(),
          totalCholesterol: values.cholesterol,
          hdl: values.hdl,
          ldl: values.ldl,
          triglycerides: values.triglycerides,
          risk: calculateCardiovascularRisk(values)
        });
      }

      // Metabolic trends
      if (values.glucose || values.hba1c) {
        trends.metabolic.push({
          date: report.date || new Date(),
          glucose: values.glucose,
          hba1c: values.hba1c,
          diabeticRisk: calculateDiabeticRisk(values)
        });
      }

      // Add other trend categories...
    });

    return trends;
  },

  // Generate health risk assessment
  generateRiskAssessment: (patientData) => {
    const assessment = {
      overallRisk: 'low',
      riskFactors: [],
      recommendations: [],
      urgentAlerts: [],
      followUpNeeded: []
    };

    // Analyze various health markers
    const { age, gender, medicalHistory, currentValues } = patientData;

    // Cardiovascular risk assessment
    if (currentValues.cholesterol > 240 || currentValues.systolicBP > 140) {
      assessment.riskFactors.push({
        category: 'cardiovascular',
        level: 'high',
        factors: ['elevated cholesterol', 'high blood pressure'],
        recommendation: 'Consult cardiologist within 2 weeks'
      });
    }

    // Diabetes risk assessment
    if (currentValues.glucose > 126 || currentValues.hba1c > 6.5) {
      assessment.riskFactors.push({
        category: 'diabetes',
        level: 'high',
        factors: ['elevated glucose', 'high HbA1c'],
        recommendation: 'Endocrinologist consultation recommended'
      });
    }

    return assessment;
  },

  // Predict future health trends using AI
  predictHealthOutcomes: (historicalData) => {
    const predictions = {
      next3Months: {},
      next6Months: {},
      nextYear: {},
      confidence: {}
    };

    // Simple trend analysis (in real app, this would use ML models)
    const trendAnalysis = analyzeTrends(historicalData);
    
    // Predict cholesterol trends
    if (trendAnalysis.cholesterol) {
      const slope = trendAnalysis.cholesterol.slope;
      const current = trendAnalysis.cholesterol.current;
      
      predictions.next3Months.cholesterol = current + (slope * 3);
      predictions.next6Months.cholesterol = current + (slope * 6);
      predictions.nextYear.cholesterol = current + (slope * 12);
      predictions.confidence.cholesterol = trendAnalysis.cholesterol.confidence;
    }

    return predictions;
  }
};

// Helper functions
const extractValues = (medicalText) => {
  const values = {};
  const text = medicalText.toLowerCase();

  // Extract common medical values using regex
  const patterns = {
    cholesterol: /(?:total\s+)?cholesterol[:\s]+(\d+(?:\.\d+)?)/i,
    hdl: /hdl[:\s]+(\d+(?:\.\d+)?)/i,
    ldl: /ldl[:\s]+(\d+(?:\.\d+)?)/i,
    triglycerides: /triglycerides[:\s]+(\d+(?:\.\d+)?)/i,
    glucose: /glucose[:\s]+(\d+(?:\.\d+)?)/i,
    hba1c: /hba1c[:\s]+(\d+(?:\.\d+)?)/i,
    wbc: /wbc[:\s]+(\d+(?:\.\d+)?)/i,
    rbc: /rbc[:\s]+(\d+(?:\.\d+)?)/i,
    hemoglobin: /(?:hemoglobin|hgb)[:\s]+(\d+(?:\.\d+)?)/i,
    creatinine: /creatinine[:\s]+(\d+(?:\.\d+)?)/i
  };

  Object.keys(patterns).forEach(key => {
    const match = text.match(patterns[key]);
    if (match) {
      values[key] = parseFloat(match[1]);
    }
  });

  return values;
};

const calculateCardiovascularRisk = (values) => {
  let risk = 0;
  
  if (values.cholesterol > 240) risk += 2;
  else if (values.cholesterol > 200) risk += 1;
  
  if (values.ldl > 160) risk += 2;
  else if (values.ldl > 130) risk += 1;
  
  if (values.hdl < 40) risk += 2;
  else if (values.hdl < 50) risk += 1;
  
  if (values.triglycerides > 200) risk += 1;

  if (risk >= 4) return 'high';
  if (risk >= 2) return 'moderate';
  return 'low';
};

const calculateDiabeticRisk = (values) => {
  if (values.glucose >= 126 || values.hba1c >= 6.5) return 'high';
  if (values.glucose >= 100 || values.hba1c >= 5.7) return 'moderate';
  return 'low';
};

const analyzeTrends = (data) => {
  // Simple linear regression for trend analysis
  const trends = {};
  
  if (data.cholesterol && data.cholesterol.length > 1) {
    const points = data.cholesterol.map((item, index) => ({ x: index, y: item.value }));
    const slope = calculateSlope(points);
    const confidence = calculateConfidence(points, slope);
    
    trends.cholesterol = {
      slope,
      current: data.cholesterol[data.cholesterol.length - 1].value,
      confidence
    };
  }

  return trends;
};

const calculateSlope = (points) => {
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
};

const calculateConfidence = (points, slope) => {
  // Simple confidence calculation based on R-squared
  const n = points.length;
  if (n < 3) return 0.5;
  
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;
  const totalVariation = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
  
  let residualVariation = 0;
  points.forEach((point, index) => {
    const predicted = points[0].y + slope * index;
    residualVariation += Math.pow(point.y - predicted, 2);
  });

  const rSquared = 1 - (residualVariation / totalVariation);
  return Math.max(0, Math.min(1, rSquared));
};

// Medical terminology with pronunciations and definitions
const medicalDictionary = {
  terms: {
    'hemoglobin': {
      pronunciation: 'HEE-muh-glow-bin',
      definition: 'A protein in red blood cells that carries oxygen throughout your body',
      category: 'blood',
      normalRange: '12-16 g/dL (women), 14-18 g/dL (men)',
      significance: 'Low levels may indicate anemia, high levels may suggest dehydration or lung disease'
    },
    'creatinine': {
      pronunciation: 'kree-AT-uh-neen',
      definition: 'A waste product filtered by your kidneys, used to measure kidney function',
      category: 'kidney',
      normalRange: '0.6-1.2 mg/dL',
      significance: 'High levels may indicate kidney problems'
    },
    'triglycerides': {
      pronunciation: 'try-GLIS-ur-ides',
      definition: 'A type of fat in your blood that provides energy to your body',
      category: 'cardiovascular',
      normalRange: 'Less than 150 mg/dL',
      significance: 'High levels increase risk of heart disease and stroke'
    },
    'lymphocytes': {
      pronunciation: 'LIM-fuh-sites',
      definition: 'White blood cells that help fight infections and diseases',
      category: 'immune',
      normalRange: '20-40% of total white blood cells',
      significance: 'High levels may indicate viral infection or immune disorders'
    },
    'bilirubin': {
      pronunciation: 'bil-ih-ROO-bin',
      definition: 'A yellow substance produced when red blood cells break down',
      category: 'liver',
      normalRange: '0.3-1.2 mg/dL',
      significance: 'High levels may indicate liver problems or blood disorders'
    }
  },

  searchTerm: (query) => {
    const searchResults = [];
    const queryLower = query.toLowerCase();

    Object.keys(medicalDictionary.terms).forEach(term => {
      if (term.includes(queryLower) || 
          medicalDictionary.terms[term].definition.toLowerCase().includes(queryLower)) {
        searchResults.push({
          term,
          ...medicalDictionary.terms[term]
        });
      }
    });

    return searchResults;
  }
};

// Advanced health recommendations engine
const healthRecommendations = {
  generatePersonalizedPlan: (userProfile, medicalData) => {
    const plan = {
      nutrition: [],
      exercise: [],
      lifestyle: [],
      monitoring: [],
      supplements: [],
      doctorVisits: []
    };

    const { age, gender, conditions, currentValues } = userProfile;

    // Cardiovascular health recommendations
    if (currentValues.cholesterol > 200) {
      plan.nutrition.push({
        type: 'dietary_change',
        recommendation: 'Reduce saturated fat intake to <7% of total calories',
        foods: ['oats', 'beans', 'fatty fish', 'nuts', 'olive oil'],
        avoid: ['red meat', 'processed foods', 'trans fats']
      });

      plan.exercise.push({
        type: 'cardio',
        recommendation: '150 minutes moderate-intensity aerobic activity per week',
        examples: ['brisk walking', 'swimming', 'cycling'],
        frequency: '30 minutes, 5 days per week'
      });
    }

    // Diabetes prevention/management
    if (currentValues.glucose > 100) {
      plan.nutrition.push({
        type: 'blood_sugar_control',
        recommendation: 'Choose low glycemic index foods',
        foods: ['whole grains', 'vegetables', 'legumes'],
        timing: 'Eat smaller, frequent meals throughout the day'
      });

      plan.monitoring.push({
        type: 'glucose_monitoring',
        frequency: 'Check fasting glucose monthly',
        target: 'Keep fasting glucose below 100 mg/dL'
      });
    }

    return plan;
  },

  generateFollowUpSchedule: (riskAssessment) => {
    const schedule = [];

    riskAssessment.riskFactors.forEach(factor => {
      switch (factor.level) {
        case 'high':
          schedule.push({
            timeframe: '2-4 weeks',
            type: 'specialist_consultation',
            specialist: getSpecialist(factor.category),
            urgency: 'high'
          });
          break;
        case 'moderate':
          schedule.push({
            timeframe: '1-3 months',
            type: 'follow_up_tests',
            tests: getRecommendedTests(factor.category),
            urgency: 'moderate'
          });
          break;
        default:
          schedule.push({
            timeframe: '6-12 months',
            type: 'routine_monitoring',
            tests: ['basic_metabolic_panel'],
            urgency: 'low'
          });
      }
    });

    return schedule;
  }
};

// Helper functions for recommendations
const getSpecialist = (category) => {
  const specialists = {
    cardiovascular: 'Cardiologist',
    diabetes: 'Endocrinologist',
    kidney: 'Nephrologist',
    liver: 'Hepatologist',
    blood: 'Hematologist'
  };
  return specialists[category] || 'Primary Care Physician';
};

const getRecommendedTests = (category) => {
  const tests = {
    cardiovascular: ['Lipid Panel', 'Blood Pressure Monitoring', 'EKG'],
    diabetes: ['HbA1c', 'Fasting Glucose', 'Oral Glucose Tolerance Test'],
    kidney: ['Comprehensive Metabolic Panel', 'Urinalysis', 'Kidney Function Tests'],
    liver: ['Liver Function Tests', 'Hepatitis Panel', 'Ultrasound'],
    blood: ['Complete Blood Count', 'Blood Smear', 'Iron Studies']
  };
  return tests[category] || ['Basic Metabolic Panel'];
};

module.exports = {
  medicalInsights,
  medicalDictionary,
  healthRecommendations
}; 
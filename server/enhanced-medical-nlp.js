// Enhanced Medical NLP Pipeline
// Provides advanced medical text processing, abbreviation recognition, and context awareness

const medicalAbbreviations = {
  // Vital Signs & Measurements
  'BP': 'Blood Pressure',
  'HR': 'Heart Rate',
  'RR': 'Respiratory Rate',
  'O2': 'Oxygen',
  'SpO2': 'Oxygen Saturation',
  'BMI': 'Body Mass Index',
  'BSA': 'Body Surface Area',
  'temp': 'Temperature',
  
  // Laboratory Values
  'CBC': 'Complete Blood Count',
  'CMP': 'Comprehensive Metabolic Panel',
  'BMP': 'Basic Metabolic Panel',
  'LFT': 'Liver Function Test',
  'RFT': 'Renal Function Test',
  'ABG': 'Arterial Blood Gas',
  'PT': 'Prothrombin Time',
  'PTT': 'Partial Thromboplastin Time',
  'INR': 'International Normalized Ratio',
  'ESR': 'Erythrocyte Sedimentation Rate',
  'CRP': 'C-Reactive Protein',
  'TSH': 'Thyroid Stimulating Hormone',
  'T3': 'Triiodothyronine',
  'T4': 'Thyroxine',
  'PSA': 'Prostate Specific Antigen',
  'HbA1c': 'Hemoglobin A1c',
  'BUN': 'Blood Urea Nitrogen',
  'Cr': 'Creatinine',
  'eGFR': 'Estimated Glomerular Filtration Rate',
  'ALT': 'Alanine Aminotransferase',
  'AST': 'Aspartate Aminotransferase',
  'ALP': 'Alkaline Phosphatase',
  'GGT': 'Gamma-Glutamyl Transferase',
  'LDH': 'Lactate Dehydrogenase',
  'CK': 'Creatine Kinase',
  'HDL': 'High-Density Lipoprotein',
  'LDL': 'Low-Density Lipoprotein',
  'VLDL': 'Very Low-Density Lipoprotein',
  
  // Blood Components
  'RBC': 'Red Blood Cells',
  'WBC': 'White Blood Cells',
  'Hgb': 'Hemoglobin',
  'Hct': 'Hematocrit',
  'MCV': 'Mean Corpuscular Volume',
  'MCH': 'Mean Corpuscular Hemoglobin',
  'MCHC': 'Mean Corpuscular Hemoglobin Concentration',
  'RDW': 'Red Cell Distribution Width',
  'PLT': 'Platelets',
  'MPV': 'Mean Platelet Volume',
  
  // Imaging & Procedures
  'CT': 'Computed Tomography',
  'MRI': 'Magnetic Resonance Imaging',
  'US': 'Ultrasound',
  'CXR': 'Chest X-Ray',
  'EKG': 'Electrocardiogram',
  'ECG': 'Electrocardiogram',
  'ECHO': 'Echocardiogram',
  'PET': 'Positron Emission Tomography',
  'SPECT': 'Single Photon Emission Computed Tomography',
  
  // Medical Conditions
  'HTN': 'Hypertension',
  'DM': 'Diabetes Mellitus',
  'T1DM': 'Type 1 Diabetes Mellitus',
  'T2DM': 'Type 2 Diabetes Mellitus',
  'CAD': 'Coronary Artery Disease',
  'CHF': 'Congestive Heart Failure',
  'COPD': 'Chronic Obstructive Pulmonary Disease',
  'UTI': 'Urinary Tract Infection',
  'DVT': 'Deep Vein Thrombosis',
  'PE': 'Pulmonary Embolism',
  'MI': 'Myocardial Infarction',
  'CVA': 'Cerebrovascular Accident',
  'TIA': 'Transient Ischemic Attack',
  'AFib': 'Atrial Fibrillation',
  'SVT': 'Supraventricular Tachycardia',
  'VT': 'Ventricular Tachycardia',
  'VF': 'Ventricular Fibrillation',
  
  // Medications
  'NSAID': 'Non-Steroidal Anti-Inflammatory Drug',
  'ACE': 'Angiotensin Converting Enzyme',
  'ARB': 'Angiotensin Receptor Blocker',
  'CCB': 'Calcium Channel Blocker',
  'PPI': 'Proton Pump Inhibitor',
  'H2': 'Histamine-2 Receptor Antagonist',
  'SSRI': 'Selective Serotonin Reuptake Inhibitor',
  'SNRI': 'Serotonin-Norepinephrine Reuptake Inhibitor',
  
  // Units & Measurements
  'mg/dL': 'milligrams per deciliter',
  'mmol/L': 'millimoles per liter',
  'mEq/L': 'milliequivalents per liter',
  'ng/mL': 'nanograms per milliliter',
  'pg/mL': 'picograms per milliliter',
  'IU/L': 'International Units per liter',
  'U/L': 'Units per liter',
  'g/dL': 'grams per deciliter',
  'mmHg': 'millimeters of mercury',
  'bpm': 'beats per minute',
  'breaths/min': 'breaths per minute'
};

const medicalContextPatterns = {
  // Normal ranges with context
  bloodPressure: {
    pattern: /(\d+)\/(\d+)\s*mmHg/gi,
    normalRange: { systolic: [90, 120], diastolic: [60, 80] },
    severity: {
      hypotensive: { systolic: [0, 90], diastolic: [0, 60] },
      normal: { systolic: [90, 120], diastolic: [60, 80] },
      prehypertension: { systolic: [120, 140], diastolic: [80, 90] },
      hypertensive: { systolic: [140, 999], diastolic: [90, 999] }
    }
  },
  
  glucose: {
    pattern: /glucose[\s:]*(\d+)\s*mg\/dL/gi,
    normalRange: [70, 100],
    severity: {
      hypoglycemic: [0, 70],
      normal: [70, 100],
      prediabetic: [100, 126],
      diabetic: [126, 999]
    }
  },
  
  cholesterol: {
    pattern: /cholesterol[\s:]*(\d+)\s*mg\/dL/gi,
    normalRange: [0, 200],
    severity: {
      desirable: [0, 200],
      borderlineHigh: [200, 240],
      high: [240, 999]
    }
  },
  
  hemoglobin: {
    pattern: /hemoglobin[\s:]*(\d+\.?\d*)\s*g\/dL/gi,
    normalRange: { male: [14, 18], female: [12, 16] },
    severity: {
      severe_anemia: [0, 7],
      moderate_anemia: [7, 10],
      mild_anemia: [10, 12],
      normal: [12, 18],
      high: [18, 999]
    }
  }
};

const emergencyKeywords = [
  'acute', 'severe', 'critical', 'emergency', 'urgent', 'stat',
  'chest pain', 'difficulty breathing', 'shortness of breath',
  'stroke', 'heart attack', 'cardiac arrest', 'anaphylaxis',
  'hemorrhage', 'bleeding', 'trauma', 'fracture', 'seizure',
  'unconscious', 'unresponsive', 'coma', 'shock'
];

const medicalSpecialties = {
  cardiology: ['heart', 'cardiac', 'cardiovascular', 'coronary', 'artery', 'ecg', 'echo'],
  pulmonology: ['lung', 'respiratory', 'breathing', 'pneumonia', 'asthma', 'copd'],
  nephrology: ['kidney', 'renal', 'creatinine', 'dialysis', 'urine'],
  endocrinology: ['diabetes', 'thyroid', 'hormone', 'insulin', 'glucose'],
  gastroenterology: ['stomach', 'liver', 'intestine', 'digestive', 'bowel'],
  hematology: ['blood', 'anemia', 'bleeding', 'clotting', 'hemoglobin'],
  neurology: ['brain', 'neurological', 'seizure', 'stroke', 'headache'],
  oncology: ['cancer', 'tumor', 'malignant', 'chemotherapy', 'radiation']
};

class EnhancedMedicalNLP {
  constructor() {
    this.abbreviationMap = medicalAbbreviations;
    this.contextPatterns = medicalContextPatterns;
    this.emergencyTerms = emergencyKeywords;
    this.specialtyKeywords = medicalSpecialties;
  }

  // Main processing pipeline
  processText(text, options = {}) {
    const results = {
      originalText: text,
      processedText: text,
      abbreviations: [],
      values: [],
      emergencyFlags: [],
      specialty: [],
      sentiment: 'neutral',
      complexity: 'medium',
      recommendations: []
    };

    try {
      // Step 1: Expand abbreviations
      results.processedText = this.expandAbbreviations(text);
      results.abbreviations = this.extractAbbreviations(text);

      // Step 2: Extract and analyze medical values
      results.values = this.extractMedicalValues(text);

      // Step 3: Detect emergency indicators
      results.emergencyFlags = this.detectEmergencyKeywords(text);

      // Step 4: Identify medical specialty
      results.specialty = this.identifySpecialty(text);

      // Step 5: Analyze sentiment and urgency
      results.sentiment = this.analyzeSentiment(text);
      results.complexity = this.assessComplexity(text);

      // Step 6: Generate recommendations
      results.recommendations = this.generateRecommendations(results);

      return results;
    } catch (error) {
      console.error('Medical NLP processing error:', error);
      return {
        ...results,
        error: 'Processing failed',
        errorDetails: error.message
      };
    }
  }

  expandAbbreviations(text) {
    let expandedText = text;
    
    // Sort abbreviations by length (longest first) to avoid partial replacements
    const sortedAbbrevs = Object.keys(this.abbreviationMap).sort((a, b) => b.length - a.length);
    
    sortedAbbrevs.forEach(abbrev => {
      const expansion = this.abbreviationMap[abbrev];
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
      expandedText = expandedText.replace(regex, `${abbrev} (${expansion})`);
    });

    return expandedText;
  }

  extractAbbreviations(text) {
    const found = [];
    
    Object.keys(this.abbreviationMap).forEach(abbrev => {
      const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
      const matches = text.match(regex);
      
      if (matches) {
        found.push({
          abbreviation: abbrev,
          expansion: this.abbreviationMap[abbrev],
          count: matches.length,
          positions: this.findPositions(text, abbrev)
        });
      }
    });

    return found;
  }

  extractMedicalValues(text) {
    const values = [];
    
    Object.entries(this.contextPatterns).forEach(([type, config]) => {
      const matches = [...text.matchAll(config.pattern)];
      
      matches.forEach(match => {
        const value = this.parseValue(match, type, config);
        if (value) {
          values.push(value);
        }
      });
    });

    return values;
  }

  parseValue(match, type, config) {
    try {
      switch (type) {
        case 'bloodPressure':
          const systolic = parseInt(match[1]);
          const diastolic = parseInt(match[2]);
          return {
            type: 'Blood Pressure',
            value: `${systolic}/${diastolic}`,
            systolic,
            diastolic,
            unit: 'mmHg',
            assessment: this.assessBloodPressure(systolic, diastolic),
            position: match.index
          };
          
        case 'glucose':
        case 'cholesterol':
          const numValue = parseFloat(match[1]);
          return {
            type: type.charAt(0).toUpperCase() + type.slice(1),
            value: numValue,
            unit: 'mg/dL',
            assessment: this.assessSingleValue(numValue, config),
            position: match.index
          };
          
        case 'hemoglobin':
          const hgbValue = parseFloat(match[1]);
          return {
            type: 'Hemoglobin',
            value: hgbValue,
            unit: 'g/dL',
            assessment: this.assessHemoglobin(hgbValue),
            position: match.index
          };
          
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error parsing ${type}:`, error);
      return null;
    }
  }

  assessBloodPressure(systolic, diastolic) {
    const { severity } = this.contextPatterns.bloodPressure;
    
    for (const [category, ranges] of Object.entries(severity)) {
      if (systolic >= ranges.systolic[0] && systolic <= ranges.systolic[1] &&
          diastolic >= ranges.diastolic[0] && diastolic <= ranges.diastolic[1]) {
        return {
          category,
          description: this.getBloodPressureDescription(category),
          severity: this.getSeverityLevel(category)
        };
      }
    }
    
    return { category: 'unknown', description: 'Unable to assess', severity: 'unknown' };
  }

  assessSingleValue(value, config) {
    for (const [category, range] of Object.entries(config.severity)) {
      if (Array.isArray(range) && value >= range[0] && value <= range[1]) {
        return {
          category,
          description: this.getValueDescription(category),
          severity: this.getSeverityLevel(category)
        };
      }
    }
    
    return { category: 'unknown', description: 'Unable to assess', severity: 'unknown' };
  }

  assessHemoglobin(value) {
    const { severity } = this.contextPatterns.hemoglobin;
    
    for (const [category, range] of Object.entries(severity)) {
      if (value >= range[0] && value <= range[1]) {
        return {
          category,
          description: this.getHemoglobinDescription(category),
          severity: this.getSeverityLevel(category)
        };
      }
    }
    
    return { category: 'unknown', description: 'Unable to assess', severity: 'unknown' };
  }

  detectEmergencyKeywords(text) {
    const flags = [];
    const lowerText = text.toLowerCase();
    
    this.emergencyTerms.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        flags.push({
          keyword,
          severity: 'high',
          recommendation: this.getEmergencyRecommendation(keyword),
          position: lowerText.indexOf(keyword.toLowerCase())
        });
      }
    });

    return flags;
  }

  identifySpecialty(text) {
    const specialties = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(this.specialtyKeywords).forEach(([specialty, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword));
      if (matches.length > 0) {
        specialties.push({
          specialty,
          confidence: matches.length / keywords.length,
          matchedKeywords: matches
        });
      }
    });

    return specialties.sort((a, b) => b.confidence - a.confidence);
  }

  analyzeSentiment(text) {
    const positiveWords = ['normal', 'good', 'excellent', 'stable', 'improved', 'healthy'];
    const negativeWords = ['abnormal', 'critical', 'severe', 'poor', 'elevated', 'high', 'low'];
    
    const lowerText = text.toLowerCase();
    let positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    let negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'concerning';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  assessComplexity(text) {
    const medicalTermCount = this.extractAbbreviations(text).length;
    const wordCount = text.split(' ').length;
    const complexityRatio = medicalTermCount / wordCount;
    
    if (complexityRatio > 0.3) return 'high';
    if (complexityRatio > 0.15) return 'medium';
    return 'low';
  }

  generateRecommendations(results) {
    const recommendations = [];
    
    // Emergency recommendations
    if (results.emergencyFlags.length > 0) {
      recommendations.push({
        type: 'emergency',
        priority: 'critical',
        text: 'Emergency indicators detected. Seek immediate medical attention.',
        action: 'contact_emergency_services'
      });
    }
    
    // Value-based recommendations
    results.values.forEach(value => {
      if (value.assessment.severity === 'high' || value.assessment.severity === 'critical') {
        recommendations.push({
          type: 'medical_attention',
          priority: 'high',
          text: `${value.type} levels require medical evaluation.`,
          action: 'consult_physician'
        });
      }
    });
    
    // General recommendations
    recommendations.push({
      type: 'general',
      priority: 'normal',
      text: 'Discuss these results with your healthcare provider for proper interpretation.',
      action: 'schedule_appointment'
    });
    
    return recommendations;
  }

  // Helper methods
  findPositions(text, term) {
    const positions = [];
    let index = text.toLowerCase().indexOf(term.toLowerCase());
    
    while (index !== -1) {
      positions.push(index);
      index = text.toLowerCase().indexOf(term.toLowerCase(), index + 1);
    }
    
    return positions;
  }

  getBloodPressureDescription(category) {
    const descriptions = {
      hypotensive: 'Blood pressure is below normal range',
      normal: 'Blood pressure is within normal range',
      prehypertension: 'Blood pressure is slightly elevated',
      hypertensive: 'Blood pressure is elevated and requires attention'
    };
    return descriptions[category] || 'Blood pressure assessment unavailable';
  }

  getValueDescription(category) {
    const descriptions = {
      low: 'Below normal range',
      normal: 'Within normal range',
      borderlineHigh: 'Slightly above normal',
      high: 'Above normal range',
      desirable: 'At desirable levels',
      prediabetic: 'In prediabetic range',
      diabetic: 'In diabetic range'
    };
    return descriptions[category] || 'Assessment unavailable';
  }

  getHemoglobinDescription(category) {
    const descriptions = {
      severe_anemia: 'Severely low hemoglobin indicating severe anemia',
      moderate_anemia: 'Moderately low hemoglobin indicating moderate anemia',
      mild_anemia: 'Mildly low hemoglobin indicating mild anemia',
      normal: 'Hemoglobin within normal range',
      high: 'Hemoglobin above normal range'
    };
    return descriptions[category] || 'Hemoglobin assessment unavailable';
  }

  getSeverityLevel(category) {
    const severityMap = {
      severe_anemia: 'critical',
      moderate_anemia: 'high',
      mild_anemia: 'medium',
      hypotensive: 'medium',
      hypertensive: 'high',
      diabetic: 'high',
      prediabetic: 'medium',
      normal: 'low',
      desirable: 'low'
    };
    return severityMap[category] || 'unknown';
  }

  getEmergencyRecommendation(keyword) {
    const recommendations = {
      'chest pain': 'Seek immediate emergency care - call 911',
      'difficulty breathing': 'Seek immediate emergency care - call 911',
      'stroke': 'Call 911 immediately',
      'heart attack': 'Call 911 immediately',
      'severe': 'Contact healthcare provider urgently',
      'critical': 'Seek immediate medical attention'
    };
    return recommendations[keyword] || 'Consult healthcare provider promptly';
  }
}

// Export for use in other modules
module.exports = {
  EnhancedMedicalNLP,
  medicalAbbreviations,
  medicalContextPatterns,
  emergencyKeywords,
  medicalSpecialties
}; 
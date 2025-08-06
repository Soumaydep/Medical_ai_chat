// Dummy medical data for testing and demo purposes

const sampleMedicalReports = [
  {
    id: 1,
    title: "Complete Blood Count (CBC)",
    originalText: `CBC Results:
WBC: 12.5 x10³/μL (elevated)
RBC: 4.2 x10⁶/μL
Hemoglobin: 13.2 g/dL
Hematocrit: 39%
Platelets: 285 x10³/μL
MCV: 87 fL
MCH: 31 pg
MCHC: 35 g/dL

Differential:
Neutrophils: 68%
Lymphocytes: 25%
Monocytes: 5%
Eosinophils: 2%
Basophils: 0%`,
    simplifiedText: `**Your Blood Test Results Explained:**

🔬 **Overall Summary:** Your blood test shows mostly normal values with one area that needs attention.

**🩸 Blood Cell Counts:**
• **White Blood Cells (WBC)**: 12.5 - This is higher than normal (normal is 4-11). This usually means your body is fighting an infection or dealing with inflammation.

• **Red Blood Cells (RBC)**: 4.2 - Normal! These carry oxygen throughout your body.

• **Hemoglobin**: 13.2 - Good level! This protein in red blood cells carries oxygen.

• **Platelets**: 285 - Normal! These help your blood clot when you get injured.

**📊 What This Means:**
Your blood work looks mostly healthy. The slightly elevated white blood cells suggest your immune system is active, possibly fighting off a minor infection. This is usually not serious but worth discussing with your doctor.

**💡 Next Steps:**
Talk to your doctor about the elevated white blood cell count. They might want to recheck this in a few weeks or look for signs of infection.`,
    category: "Blood Work"
  },
  {
    id: 2,
    title: "Comprehensive Metabolic Panel (CMP)",
    originalText: `CMP Results:
Glucose: 110 mg/dL
BUN: 18 mg/dL
Creatinine: 1.1 mg/dL
eGFR: >60 mL/min/1.73m²
Sodium: 140 mEq/L
Potassium: 4.2 mEq/L
Chloride: 102 mEq/L
CO2: 24 mEq/L
AST: 35 U/L
ALT: 28 U/L
Alkaline Phosphatase: 85 U/L
Total Bilirubin: 1.0 mg/dL
Albumin: 4.1 g/dL
Total Protein: 7.2 g/dL`,
    simplifiedText: `**Your Metabolic Panel Results:**

🧪 **Overall Summary:** Your metabolic panel shows excellent kidney and liver function with slightly elevated blood sugar.

**🍯 Blood Sugar:**
• **Glucose**: 110 mg/dL - Slightly elevated (normal is under 100 when fasting). This could indicate early insulin resistance or you may have eaten recently.

**🫘 Kidney Function:**
• **Creatinine**: 1.1 - Normal! Your kidneys are filtering waste properly.
• **BUN**: 18 - Good level! Another marker of kidney health.

**🫀 Liver Function:**
• **AST & ALT**: 35 & 28 - Excellent! Your liver enzymes are normal.
• **Bilirubin**: 1.0 - Normal! No signs of liver problems.

**⚖️ Electrolyte Balance:**
• **Sodium, Potassium, Chloride**: All normal! Your body's mineral balance is good.

**💡 Recommendations:**
Consider monitoring your blood sugar through diet and exercise. Discuss the slightly elevated glucose with your doctor.`,
    category: "Metabolic"
  },
  {
    id: 3,
    title: "Thyroid Function Test",
    originalText: `Thyroid Function Panel:
TSH: 2.8 mIU/L
Free T4: 1.2 ng/dL
Free T3: 3.1 pg/mL
TPO Antibodies: <10 IU/mL
Thyroglobulin Antibodies: <1 IU/mL`,
    simplifiedText: `**Your Thyroid Function Results:**

🦋 **Overall Summary:** Your thyroid is working normally and controlling your metabolism well.

**🔄 Thyroid Hormones:**
• **TSH**: 2.8 - Normal range! This hormone tells your thyroid how much to work.
• **Free T4**: 1.2 - Good level! This is your main thyroid hormone.
• **Free T3**: 3.1 - Normal! The active form of thyroid hormone.

**🛡️ Antibody Tests:**
• **TPO & Thyroglobulin Antibodies**: Very low - Excellent! No signs of autoimmune thyroid disease.

**💪 What This Means:**
Your thyroid gland is functioning perfectly. It's producing the right amount of hormones to regulate your metabolism, energy levels, and body temperature.

**✅ Bottom Line:**
No thyroid problems detected. Your energy levels and metabolism should be well-regulated.`,
    category: "Endocrine"
  },
  {
    id: 4,
    title: "Lipid Panel",
    originalText: `Lipid Profile:
Total Cholesterol: 195 mg/dL
HDL Cholesterol: 45 mg/dL
LDL Cholesterol: 125 mg/dL
Triglycerides: 150 mg/dL
Non-HDL Cholesterol: 150 mg/dL
Cholesterol/HDL Ratio: 4.3`,
    simplifiedText: `**Your Cholesterol Test Results:**

❤️ **Overall Summary:** Your cholesterol levels are mostly good with room for improvement in HDL (good cholesterol).

**📊 Cholesterol Breakdown:**
• **Total Cholesterol**: 195 - Good! (Target: under 200)
• **LDL (Bad Cholesterol)**: 125 - Borderline high (Ideal: under 100)
• **HDL (Good Cholesterol)**: 45 - Low (Target: over 60 for men, over 50 for women)
• **Triglycerides**: 150 - Borderline high (Ideal: under 150)

**🚦 Risk Assessment:**
Your cholesterol ratio of 4.3 is acceptable but could be better. The low HDL is the main concern.

**💡 Recommendations:**
• Increase physical activity to raise HDL
• Consider omega-3 rich foods (fish, nuts)
• Reduce refined sugars to lower triglycerides
• Discuss with your doctor if medication might help

**🎯 Goals:**
Focus on raising your "good" HDL cholesterol through exercise and healthy fats.`,
    category: "Cardiac"
  }
];

const chatbotResponses = {
  // Greetings
  greetings: [
    "Hello! I'm here to help you understand your medical reports. What would you like to know?",
    "Hi there! I can explain medical terms, test results, and answer questions about your health reports. How can I assist you?",
    "Welcome! I'm your medical report assistant. Feel free to ask me anything about your test results or medical documents."
  ],

  // Common medical questions and responses
  commonQuestions: {
    "what do these results mean": "I'd be happy to explain your results! Can you share which specific test results you'd like me to clarify?",
    "should i be worried": "I understand your concern. Based on typical medical guidelines, most test results have ranges that help determine if values are normal. Would you like me to explain what specific results mean?",
    "what are normal values": "Normal values vary by test type and individual factors like age and gender. I can help explain the normal ranges for specific tests if you tell me which ones you're curious about.",
    "what should i ask my doctor": "Great question! Here are some important questions to consider: 1) What do these results mean for my health? 2) Do I need any follow-up tests? 3) Should I make any lifestyle changes? 4) When should I retest? 5) Are there any symptoms to watch for?",
    "when should i retest": "Retesting schedules depend on the specific test and your results. Typically, routine blood work is done annually, but abnormal results might need rechecking in 1-3 months. Your doctor will recommend the best timeline for you.",
    "lifestyle changes": "Based on common medical recommendations: maintain a balanced diet, exercise regularly, stay hydrated, get adequate sleep, manage stress, avoid smoking, and limit alcohol. Specific changes depend on your test results and health goals.",
    "diet recommendations": "General healthy eating includes: plenty of fruits and vegetables, whole grains, lean proteins, healthy fats (like olive oil and nuts), limited processed foods, and adequate water intake. Specific dietary needs depend on your test results.",
    "exercise recommendations": "Most adults benefit from: 150 minutes of moderate aerobic activity weekly, strength training 2-3 times per week, and daily movement. Always consult your doctor before starting new exercise programs, especially if you have health conditions."
  },

  // Test-specific explanations
  testExplanations: {
    "cbc": "A Complete Blood Count (CBC) measures different types of blood cells. It includes white blood cells (infection fighters), red blood cells (oxygen carriers), hemoglobin (oxygen-carrying protein), hematocrit (percentage of red blood cells), and platelets (clotting helpers).",
    "cmp": "A Comprehensive Metabolic Panel (CMP) checks your body's metabolism, including blood sugar, kidney function, liver function, and electrolyte balance. It helps detect diabetes, kidney disease, and liver problems.",
    "lipid panel": "A lipid panel measures cholesterol and triglycerides in your blood. It includes total cholesterol, LDL (bad cholesterol), HDL (good cholesterol), and triglycerides. This helps assess your risk for heart disease.",
    "thyroid": "Thyroid function tests measure hormones that control your metabolism. TSH tells your thyroid how much to work, while T3 and T4 are the actual thyroid hormones that regulate energy, weight, and body temperature."
  },

  // Medical terms dictionary
  medicalTerms: {
    "wbc": "White Blood Cells - These are your body's infection fighters. Normal range is typically 4,000-11,000 cells per microliter.",
    "rbc": "Red Blood Cells - These carry oxygen throughout your body. Normal ranges vary by gender and age.",
    "hemoglobin": "A protein in red blood cells that carries oxygen. Low levels can indicate anemia.",
    "platelets": "Blood cells that help with clotting when you're injured. Normal range is 150,000-450,000.",
    "glucose": "Blood sugar level. Normal fasting glucose is under 100 mg/dL.",
    "creatinine": "A waste product filtered by your kidneys. Higher levels may indicate kidney problems.",
    "cholesterol": "A fatty substance in your blood. Total cholesterol should ideally be under 200 mg/dL.",
    "hdl": "High-Density Lipoprotein or 'good cholesterol'. Higher levels are better for heart health.",
    "ldl": "Low-Density Lipoprotein or 'bad cholesterol'. Lower levels are better for heart health.",
    "tsh": "Thyroid Stimulating Hormone - tells your thyroid gland how much hormone to produce."
  },

  // Fallback responses
  fallbacks: [
    "I'd be happy to help explain that! Could you provide more details about which specific test or result you're asking about?",
    "That's a great question! To give you the most accurate information, could you share more context about your specific test results?",
    "I want to make sure I give you helpful information. Could you tell me more about which aspect of your medical report you'd like me to explain?",
    "I'm here to help clarify medical information. What specific test results or medical terms would you like me to explain?"
  ]
};

const medicalEducationContent = {
  bloodWork: {
    title: "Understanding Blood Work",
    content: `Blood tests are one of the most common medical tests. They can help detect diseases, monitor health conditions, and check how well your organs are working. Here's what different blood tests typically measure:

**Complete Blood Count (CBC):**
- Checks different types of blood cells
- Can detect infections, anemia, and blood disorders

**Basic Metabolic Panel (BMP) or Comprehensive Metabolic Panel (CMP):**
- Measures blood sugar, kidney function, and electrolytes
- Helps detect diabetes and kidney problems

**Lipid Panel:**
- Measures cholesterol and triglycerides
- Assesses heart disease risk

**Liver Function Tests:**
- Check how well your liver is working
- Can detect liver damage or disease`
  },
  normalRanges: {
    title: "Understanding Normal Ranges",
    content: `Normal ranges for lab tests are established by testing healthy people and determining the range where 95% of healthy individuals fall. Here are some key points:

**Important Notes:**
- Normal ranges can vary slightly between labs
- Your individual normal might be different
- One abnormal result doesn't always mean you're sick
- Trends over time are often more important than single values

**Factors that affect normal ranges:**
- Age and gender
- Time of day
- Recent meals
- Medications
- Physical activity level
- Pregnancy status`
  }
};

module.exports = {
  sampleMedicalReports,
  chatbotResponses,
  medicalEducationContent
}; 
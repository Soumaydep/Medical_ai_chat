import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import config from '../config';

const GastricDietGuide = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [dietPlan, setDietPlan] = useState(null);
  const [mealPlanner, setMealPlanner] = useState({});
  const [foodTriggers, setFoodTriggers] = useState([]);
  const { colors } = useTheme();

  // Gastric symptoms and conditions
  const gastricSymptoms = {
    acidity: { label: 'Acidity/Heartburn', severity: 'mild' },
    bloating: { label: 'Bloating', severity: 'mild' },
    gasIssues: { label: 'Excessive Gas', severity: 'mild' },
    stomachPain: { label: 'Stomach Pain', severity: 'moderate' },
    nausea: { label: 'Nausea/Vomiting', severity: 'moderate' },
    pepticUlcer: { label: 'Peptic Ulcer', severity: 'severe' },
    gastritis: { label: 'Gastritis', severity: 'moderate' },
    gerd: { label: 'GERD/Acid Reflux', severity: 'moderate' },
    indigestion: { label: 'Indigestion', severity: 'mild' },
    constipation: { label: 'Constipation', severity: 'mild' }
  };

  // Diet recommendations based on symptoms
  const dietRecommendations = {
    general: {
      title: "General Gastric Health Diet",
      description: "Foundational eating principles for optimal digestive health",
      keyPrinciples: [
        "Eat smaller, more frequent meals (5-6 times daily)",
        "Chew food thoroughly and eat slowly",
        "Stay hydrated with 8-10 glasses of water daily",
        "Maintain regular meal times",
        "Avoid eating 2-3 hours before bedtime"
      ],
      goodFoods: {
        vegetables: [
          { name: "Spinach", benefits: "Easy to digest, rich in fiber" },
          { name: "Carrots", benefits: "Gentle on stomach, provides vitamins" },
          { name: "Sweet Potatoes", benefits: "Alkaline, soothing for stomach lining" },
          { name: "Pumpkin", benefits: "Low acid, easy to digest" },
          { name: "Cucumber", benefits: "Cooling, high water content" }
        ],
        fruits: [
          { name: "Bananas", benefits: "Natural antacid, rich in potassium" },
          { name: "Papaya", benefits: "Contains digestive enzymes" },
          { name: "Watermelon", benefits: "Hydrating, low acid" },
          { name: "Coconut Water", benefits: "Natural electrolytes, cooling" },
          { name: "Apple (peeled)", benefits: "Pectin helps digestion" }
        ],
        grains: [
          { name: "Brown Rice", benefits: "Easy to digest, provides energy" },
          { name: "Oats", benefits: "Soluble fiber, stomach-soothing" },
          { name: "Quinoa", benefits: "Complete protein, gluten-free" },
          { name: "White Rice", benefits: "Bland, easy on stomach during flare-ups" }
        ],
        proteins: [
          { name: "Lean Chicken", benefits: "Easy to digest protein" },
          { name: "Fish", benefits: "Omega-3 fatty acids, anti-inflammatory" },
          { name: "Eggs", benefits: "Complete protein, versatile" },
          { name: "Tofu", benefits: "Plant-based, gentle protein" }
        ],
        dairy: [
          { name: "Low-fat Yogurt", benefits: "Probiotics for gut health" },
          { name: "Buttermilk", benefits: "Cooling, aids digestion" },
          { name: "Low-fat Milk", benefits: "Calcium, less fat content" }
        ]
      },
      avoidFoods: {
        spicy: ["Hot peppers", "Chili powder", "Black pepper", "Spicy sauces"],
        acidic: ["Tomatoes", "Citrus fruits", "Vinegar", "Pickles"],
        fatty: ["Fried foods", "Fatty meats", "Full-fat dairy", "Butter"],
        beverages: ["Coffee", "Alcohol", "Carbonated drinks", "Energy drinks"],
        processed: ["Fast food", "Processed meats", "Packaged snacks", "Artificial sweeteners"]
      }
    },
    acidity: {
      specificAdvice: [
        "Drink a glass of lukewarm water first thing in the morning",
        "Include alkaline foods like bananas and melons",
        "Avoid empty stomach for long periods",
        "Sleep with head slightly elevated"
      ],
      immediateRelief: [
        "Cold milk or buttermilk",
        "Banana with honey",
        "Coconut water",
        "Jeera (cumin) water"
      ]
    },
    bloating: {
      specificAdvice: [
        "Avoid gas-producing foods like beans, cabbage",
        "Include digestive spices: ginger, fennel, cumin",
        "Practice mindful eating",
        "Take short walks after meals"
      ],
      immediateRelief: [
        "Fennel tea",
        "Ginger water",
        "Peppermint tea",
        "Light abdominal massage"
      ]
    },
    gerd: {
      specificAdvice: [
        "Elevate head of bed 6-8 inches",
        "Avoid trigger foods completely",
        "Wear loose-fitting clothes",
        "Don't lie down immediately after eating"
      ],
      strictlyAvoid: [
        "Chocolate", "Coffee", "Alcohol", "Mint",
        "Citrus fruits", "Tomatoes", "Onions", "Garlic"
      ]
    }
  };

  // Sample meal plans
  const mealPlans = {
    general: {
      breakfast: [
        "Oatmeal with sliced banana and honey",
        "Scrambled eggs with white toast",
        "Smoothie with papaya, banana, and yogurt",
        "Rice porridge with mild spices"
      ],
      midMorning: [
        "Coconut water",
        "Herbal tea with digestive biscuits",
        "Fresh fruit juice (non-citrus)",
        "Handful of soaked almonds"
      ],
      lunch: [
        "Brown rice with dal and steamed vegetables",
        "Grilled chicken with quinoa and carrots",
        "Fish curry with rice and mild spices",
        "Vegetable khichdi with yogurt"
      ],
      evening: [
        "Herbal tea with crackers",
        "Buttermilk with roasted cumin",
        "Fruit salad (banana, papaya, apple)",
        "Green tea with honey"
      ],
      dinner: [
        "Light soup with bread roll",
        "Steamed rice with dal and vegetables",
        "Grilled fish with sweet potato",
        "Vegetable porridge"
      ]
    }
  };

  // Natural remedies and home solutions
  const homeRemedies = {
    immediate: [
      {
        remedy: "Ginger Tea",
        preparation: "Boil fresh ginger slices in water for 5 minutes",
        benefits: "Reduces nausea, improves digestion",
        timing: "After meals"
      },
      {
        remedy: "Fennel Water",
        preparation: "Soak 1 tsp fennel seeds overnight, drink in morning",
        benefits: "Reduces bloating and gas",
        timing: "Empty stomach"
      },
      {
        remedy: "Cumin Water",
        preparation: "Boil 1 tsp cumin seeds in water, strain and drink",
        benefits: "Aids digestion, reduces acidity",
        timing: "Before meals"
      },
      {
        remedy: "Mint Leaves",
        preparation: "Chew fresh mint leaves or make tea",
        benefits: "Cooling effect, reduces heartburn",
        timing: "As needed"
      }
    ],
    longTerm: [
      {
        practice: "Probiotic Foods",
        examples: ["Yogurt", "Kefir", "Fermented vegetables", "Miso"],
        benefits: "Improves gut bacteria balance"
      },
      {
        practice: "Digestive Spices",
        examples: ["Turmeric", "Coriander", "Cardamom", "Cinnamon"],
        benefits: "Anti-inflammatory, aids digestion"
      },
      {
        practice: "Eating Habits",
        examples: ["Regular timing", "Proper chewing", "Mindful eating", "Smaller portions"],
        benefits: "Better digestion, reduced symptoms"
      }
    ]
  };

  const generatePersonalizedPlan = () => {
    const symptoms = selectedSymptoms;
    let personalizedPlan = { ...dietRecommendations.general };
    
    // Add specific advice based on symptoms
    const specificAdvice = [];
    const avoidanceList = [...personalizedPlan.avoidFoods.spicy];
    
    symptoms.forEach(symptom => {
      if (dietRecommendations[symptom]) {
        if (dietRecommendations[symptom].specificAdvice) {
          specificAdvice.push(...dietRecommendations[symptom].specificAdvice);
        }
        if (dietRecommendations[symptom].strictlyAvoid) {
          avoidanceList.push(...dietRecommendations[symptom].strictlyAvoid);
        }
      }
    });

    personalizedPlan.specificAdvice = specificAdvice;
    personalizedPlan.personalizedAvoidance = [...new Set(avoidanceList)];
    
    setDietPlan(personalizedPlan);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      generatePersonalizedPlan();
    }
  }, [selectedSymptoms]);

  return (
    <div className={`${colors.card} rounded-lg shadow-md p-6 transition-all duration-300`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-3 rounded-lg">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${colors.textPrimary}`}>🍽️ Gastric Health Diet Guide</h3>
          <p className={`text-sm ${colors.textSecondary}`}>Personalized nutrition for digestive wellness</p>
        </div>
      </div>

      {/* Tab Navigation */}
              <div className={`flex space-x-1 ${colors.tabBackground} p-1 rounded-lg mb-6 transition-all duration-300`}>
        {[
          { id: 'overview', label: '📋 Assessment', icon: 'overview' },
          { id: 'diet', label: '🥗 Diet Plan', icon: 'diet' },
          { id: 'meals', label: '🍱 Meal Planning', icon: 'meals' },
          { id: 'remedies', label: '🌿 Home Remedies', icon: 'remedies' }
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

      {/* Assessment Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Select Your Digestive Symptoms</h4>
            <p className="text-gray-600 mb-4">Choose the symptoms you're experiencing to get personalized dietary recommendations:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(gastricSymptoms).map(([key, symptom]) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => toggleSymptom(key)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      selectedSymptoms.includes(key)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{symptom.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(symptom.severity)}`}>
                          {symptom.severity}
                        </span>
                        {selectedSymptoms.includes(key) && (
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {selectedSymptoms.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">Selected Symptoms:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map(symptom => (
                    <span key={symptom} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                      {gastricSymptoms[symptom].label}
                    </span>
                  ))}
                </div>
                <p className="text-green-700 mt-2 text-sm">
                  ✅ Personalized diet plan generated! Check the "Diet Plan" tab for recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diet Plan Tab */}
      {activeTab === 'diet' && (
        <div className="space-y-6">
          {dietPlan ? (
            <>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{dietPlan.title}</h4>
                <p className="text-gray-600 mb-4">{dietPlan.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">🎯 Key Principles</h5>
                    <ul className="space-y-2 text-sm">
                      {dietPlan.keyPrinciples.map((principle, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {dietPlan.specificAdvice && (
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">⚡ Specific for You</h5>
                      <ul className="space-y-2 text-sm">
                        {dietPlan.specificAdvice.map((advice, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Foods to Include */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">✅ Foods to Include</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(dietPlan.goodFoods).map(([category, foods]) => (
                    <div key={category} className="border border-green-200 rounded-lg p-4">
                      <h5 className="font-semibold text-green-800 mb-3 capitalize">{category}</h5>
                      <div className="space-y-2">
                        {foods.map((food, index) => (
                          <div key={index} className="bg-green-50 rounded p-2">
                            <div className="font-medium text-sm text-gray-800">{food.name}</div>
                            <div className="text-xs text-gray-600">{food.benefits}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">❌ Foods to Avoid</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(dietPlan.avoidFoods).map(([category, foods]) => (
                    <div key={category} className="border border-red-200 rounded-lg p-4">
                      <h5 className="font-semibold text-red-800 mb-3 capitalize">{category}</h5>
                      <ul className="space-y-1">
                        {foods.map((food, index) => (
                          <li key={index} className="text-sm text-gray-700 bg-red-50 rounded px-2 py-1">
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-600 mb-2">No Symptoms Selected</h4>
              <p className="text-gray-500">Please select your symptoms in the Assessment tab to get personalized recommendations</p>
            </div>
          )}
        </div>
      )}

      {/* Meal Planning Tab */}
      {activeTab === 'meals' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">📅 Sample Daily Meal Plan</h4>
            <p className="text-gray-600 mb-6">Gastric-friendly meal suggestions for optimal digestive health:</p>
            
            <div className="space-y-6">
              {Object.entries(mealPlans.general).map(([mealType, meals]) => (
                <div key={mealType} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3 capitalize flex items-center space-x-2">
                    <span className="text-lg">
                      {mealType === 'breakfast' && '🌅'}
                      {mealType === 'midMorning' && '☀️'}
                      {mealType === 'lunch' && '🌞'}
                      {mealType === 'evening' && '🌅'}
                      {mealType === 'dinner' && '🌙'}
                    </span>
                    <span>{mealType.replace(/([A-Z])/g, ' $1')}</span>
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {meals.map((meal, index) => (
                      <div key={index} className="bg-gray-50 rounded p-3 text-sm">
                        <span className="font-medium">Option {index + 1}:</span> {meal}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hydration Guidelines */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">💧 Hydration Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">Recommended Drinks:</h5>
                <ul className="space-y-1 text-blue-700">
                  <li>• Lukewarm water (8-10 glasses daily)</li>
                  <li>• Herbal teas (ginger, fennel, chamomile)</li>
                  <li>• Coconut water</li>
                  <li>• Buttermilk (without sugar)</li>
                  <li>• Fresh vegetable juices</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Drinking Tips:</h5>
                <ul className="space-y-1 text-blue-700">
                  <li>• Drink water 30 minutes before meals</li>
                  <li>• Avoid drinking with meals</li>
                  <li>• Sip warm water throughout the day</li>
                  <li>• Avoid very cold or very hot beverages</li>
                  <li>• Start day with warm water and lemon</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Home Remedies Tab */}
      {activeTab === 'remedies' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">🌿 Natural Remedies</h4>
            
            {/* Immediate Relief */}
            <div className="mb-6">
              <h5 className="font-semibold text-green-800 mb-3">⚡ Immediate Relief</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homeRemedies.immediate.map((remedy, index) => (
                  <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h6 className="font-medium text-green-800 mb-2">{remedy.remedy}</h6>
                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Preparation:</strong> {remedy.preparation}
                      </div>
                      <div>
                        <strong>Benefits:</strong> {remedy.benefits}
                      </div>
                      <div>
                        <strong>Timing:</strong> {remedy.timing}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-term Practices */}
            <div>
              <h5 className="font-semibold text-blue-800 mb-3">🎯 Long-term Practices</h5>
              <div className="space-y-4">
                {homeRemedies.longTerm.map((practice, index) => (
                  <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h6 className="font-medium text-blue-800 mb-2">{practice.practice}</h6>
                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Examples:</strong> {practice.examples.join(', ')}
                      </div>
                      <div>
                        <strong>Benefits:</strong> {practice.benefits}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-red-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h5 className="font-semibold text-red-800 mb-2">⚠️ When to Seek Medical Help</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Severe or persistent abdominal pain</li>
                  <li>• Blood in vomit or stool</li>
                  <li>• Sudden, severe heartburn</li>
                  <li>• Difficulty swallowing</li>
                  <li>• Unexplained weight loss</li>
                  <li>• Symptoms that don't improve with dietary changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-green-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>This guidance is for educational purposes. Always consult with a healthcare provider for persistent digestive issues or before making significant dietary changes.</span>
        </div>
      </div>
    </div>
  );
};

export default GastricDietGuide; 
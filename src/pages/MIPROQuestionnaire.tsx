import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Shield, AlertTriangle, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface MIPROResponse {
  patient_id: string;
  date: string;
  responses: {
    prior_testing: boolean;
    clinical_findings: string[];
    ejaculate_changes: string[];
    erection_difficulty: "never" | "rarely" | "sometimes" | "often";
    sexual_desire: "never" | "rarely" | "sometimes" | "often";
    fertility_confidence: number;
    relationship_impact: "no" | "without_tension" | "with_tension";
    fertility_thoughts: "never" | "rarely" | "sometimes" | "often" | "daily";
    mood_impact: number;
  };
  flags: string[];
  score: number;
  risk_level?: "low" | "medium" | "high";
}

const MIPROQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Partial<MIPROResponse['responses']>>({
    clinical_findings: [],
    ejaculate_changes: [],
    fertility_confidence: 5,
    mood_impact: 0,
    prior_testing: false
  });

  const questions = useMemo(() => [
    {
      id: 'prior_testing',
      title: 'Fertility History',
      text: 'Have you or your partner ever sought medical advice for fertility concerns?',
      type: 'radio',
      options: [
        { value: 'false', label: 'No' },
        { value: 'true', label: 'Yes' }
      ],
      helpText: 'This helps us understand your fertility journey',
      section: 'Medical History'
    },
    {
      id: 'clinical_findings',
      title: 'Clinical Findings',
      text: 'Were any of the following ever identified? (Select all that apply)',
      type: 'multiple',
      options: [
        'Low sperm count',
        'Blockage in reproductive tract',
        'Hormone imbalance',
        "I don't know the details"
      ],
      showIf: () => responses.prior_testing === true,
      helpText: 'Select all that apply',
      section: 'Medical History'
    },
    {
      id: 'ejaculate_changes',
      title: 'Physical Changes',
      text: 'Some men notice differences in their ejaculate over time. Have you observed any of the following?',
      type: 'multiple',
      options: [
        'Reduced volume',
        'Thinner consistency',
        'No changes'
      ],
      helpText: 'These observations can help guide our evaluation',
      section: 'Medical History'
    },
    {
      id: 'erection_difficulty',
      title: 'Sexual Function',
      text: 'How often do you experience difficulty with erection?',
      type: 'radio',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'rarely', label: 'Rarely (less than 25% of the time)' },
        { value: 'sometimes', label: 'Sometimes (25-50% of the time)' },
        { value: 'often', label: 'Often (more than 50% of the time)' }
      ],
      helpText: 'This helps assess potential contributing factors',
      section: 'Sexual Health'
    },
    {
      id: 'sexual_desire',
      title: 'Sexual Desire',
      text: 'How often do you experience reduced sexual desire?',
      type: 'radio',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'rarely', label: 'Rarely (less than 25% of the time)' },
        { value: 'sometimes', label: 'Sometimes (25-50% of the time)' },
        { value: 'often', label: 'Often (more than 50% of the time)' }
      ],
      section: 'Sexual Health'
    },
    {
      id: 'fertility_confidence',
      title: 'Confidence Level',
      text: 'How much do you agree with: "I feel confident about my fertility health."',
      type: 'slider',
      min: 0,
      max: 10,
      labels: ['Strongly disagree', 'Strongly agree'],
      helpText: '0 = No confidence, 10 = Complete confidence',
      section: 'Emotional Impact'
    },
    {
      id: 'relationship_impact',
      title: 'Relationship Impact',
      text: 'Has fertility been a topic of discussion with your partner?',
      type: 'radio',
      options: [
        { value: 'no', label: 'No, we haven\'t discussed it' },
        { value: 'without_tension', label: 'Yes, it\'s been a neutral/positive discussion' },
        { value: 'with_tension', label: 'Yes, it\'s caused tension' }
      ],
      section: 'Emotional Impact'
    },
    {
      id: 'fertility_thoughts',
      title: 'Thought Frequency',
      text: 'How often do you think about fertility?',
      type: 'radio',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'rarely', label: 'Rarely (less than once a month)' },
        { value: 'sometimes', label: 'Sometimes (1-3 times a week)' },
        { value: 'often', label: 'Often (4-6 times a week)' },
        { value: 'daily', label: 'Daily' }
      ],
      section: 'Emotional Impact'
    },
    {
      id: 'mood_impact',
      title: 'Mood Impact',
      text: 'How much does fertility concern affect your mood?',
      type: 'slider',
      min: 0,
      max: 10,
      labels: ['Not at all', 'Extremely'],
      helpText: '0 = No impact, 10 = Severe impact',
      section: 'Emotional Impact'
    }
  ], [responses.prior_testing]);

  const visibleQuestions = useMemo(() => 
    questions.filter(q => !q.showIf || q.showIf()), 
    [questions]
  );

  const currentQuestion = visibleQuestions[currentStep];
  const progress = ((currentStep + 1) / visibleQuestions.length) * 100;

  const handleResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: currentQuestion.id === 'prior_testing' 
        ? value === 'true' 
        : value
    }));
  };

  const handleNext = () => {
    if (!isAnswered) {
      toast.warning('Please answer the question before proceeding');
      return;
    }
    
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitQuestionnaire();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateScore = (): number => {
    const confidence = responses.fertility_confidence || 5;
    const mood = responses.mood_impact || 0;
    const desireScore = responses.sexual_desire === 'often' ? 3 : 
                       responses.sexual_desire === 'sometimes' ? 2 : 
                       responses.sexual_desire === 'rarely' ? 1 : 0;
    
    return Math.round((confidence + (10 - mood) + desireScore) / 3 * 10);
  };

  const determineRiskLevel = (score: number): "low" | "medium" | "high" => {
    if (score >= 70) return "low";
    if (score >= 40) return "medium";
    return "high";
  };

  const generateFlags = (): string[] => {
    const flags: string[] = [];
    const score = calculateScore();

    if (score <= 30) flags.push("high_concern");
    if (score >= 70) flags.push("low_concern");
    
    if ((responses.ejaculate_changes || []).some(c => c !== 'No changes') && 
        !responses.prior_testing) {
      flags.push("suggest_semen_analysis");
    }
    
    if (responses.fertility_thoughts === "never" && (responses.mood_impact || 0) >= 7) {
      flags.push("response_inconsistency");
    }
    
    if (responses.relationship_impact === "with_tension") {
      flags.push("relationship_support_needed");
    }
    
    if (responses.erection_difficulty === "often" || responses.sexual_desire === "often") {
      flags.push("sexual_health_focus");
    }

    return flags;
  };

  const submitQuestionnaire = () => {
    const flags = generateFlags();
    const score = calculateScore();
    const risk_level = determineRiskLevel(score);
    
    const miproResponse: MIPROResponse = {
      patient_id: "current-user",
      date: new Date().toISOString(),
      responses: {
        prior_testing: responses.prior_testing || false,
        clinical_findings: responses.clinical_findings || [],
        ejaculate_changes: responses.ejaculate_changes || [],
        erection_difficulty: responses.erection_difficulty || "never",
        sexual_desire: responses.sexual_desire || "never",
        fertility_confidence: responses.fertility_confidence || 5,
        relationship_impact: responses.relationship_impact || "no",
        fertility_thoughts: responses.fertility_thoughts || "never",
        mood_impact: responses.mood_impact || 0
      },
      flags,
      score,
      risk_level
    };

    console.log("MIPRO Response:", miproResponse);

    // Show appropriate toast based on flags
    if (flags.includes("high_concern")) {
      toast.warning("Important Notice", {
        description: "Your responses suggest significant fertility concerns. We recommend discussing these with a specialist.",
        duration: 10000,
        action: {
          label: "Learn More",
          onClick: () => navigate('/resources')
        }
      });
    } else if (flags.includes("suggest_semen_analysis")) {
      toast.info("Assessment Recommended", {
        description: "Based on your responses, a semen analysis might provide valuable insights.",
        duration: 8000
      });
    } else {
      toast.success("Thank You!", {
        description: "Your questionnaire has been submitted successfully."
      });
    }

    navigate('/results', { 
      state: { 
        completedQuestionnaire: true,
        responseData: miproResponse
      } 
    });
  };

  const isAnswered = useMemo(() => {
    const value = responses[currentQuestion.id as keyof typeof responses];
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(value) && value.length > 0;
    }
    if (currentQuestion.type === 'slider') {
      return typeof value === 'number';
    }
    return value !== undefined && value !== null;
  }, [responses, currentQuestion]);

  const getSectionInfo = () => {
    return currentQuestion.section;
  };

  return (
    <Layout>
      <div className="py-6 max-w-2xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Male Fertility Assessment</h1>
          <p className="text-sm text-muted-foreground mb-1">
            {getSectionInfo()} • Question {currentStep + 1} of {visibleQuestions.length}
          </p>
          <div className="w-full bg-gray-100 h-2.5 rounded-full mt-2">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            All responses are confidential. This helps us provide personalized care.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
            <CardDescription className="text-base">{currentQuestion.text}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'radio' && (
              <RadioGroup
                value={responses[currentQuestion.id as keyof typeof responses] as string || ''}
                onValueChange={handleResponse}
                className="space-y-3"
              >
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`${currentQuestion.id}-option-${index}`}
                    />
                    <Label 
                      htmlFor={`${currentQuestion.id}-option-${index}`} 
                      className="flex-1 text-base font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'slider' && (
              <div className="space-y-6">
                <Slider
                  value={[responses[currentQuestion.id as keyof typeof responses] as number || currentQuestion.min || 0]}
                  onValueChange={([value]) => handleResponse(value)}
                  max={currentQuestion.max}
                  min={currentQuestion.min}
                  step={1}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion.labels?.[0]}
                  </span>
                  <div className="px-4 py-1 bg-gray-100 rounded-full text-sm font-medium">
                    {responses[currentQuestion.id as keyof typeof responses] || currentQuestion.min}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion.labels?.[1]}
                  </span>
                </div>
                {currentQuestion.helpText && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {currentQuestion.helpText}
                  </p>
                )}
              </div>
            )}

            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox
                      id={`${currentQuestion.id}-option-${index}`}
                      checked={(responses[currentQuestion.id as keyof typeof responses] as string[] || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const currentValues = responses[currentQuestion.id as keyof typeof responses] as string[] || [];
                        if (checked) {
                          handleResponse([...currentValues, option]);
                        } else {
                          handleResponse(currentValues.filter(v => v !== option));
                        }
                      }}
                    />
                    <Label 
                      htmlFor={`${currentQuestion.id}-option-${index}`} 
                      className="flex-1 text-base font-normal"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.helpText && currentQuestion.type !== 'slider' && (
              <p className="text-xs text-muted-foreground mt-2">
                {currentQuestion.helpText}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentStep === visibleQuestions.length - 1 ? 'Submit' : 'Next'}
            {currentStep < visibleQuestions.length - 1 && (
              <ChevronRight className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MIPROQuestionnaire;

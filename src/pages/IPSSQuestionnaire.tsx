import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface Question {
  id: number;
  text: string;
  options: Array<{
    value: number;
    label: string;
  }>;
}

const IPSSQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const questions: Question[] = [
    {
      id: 1,
      text: "Over the past month, how often have you had a sensation of not emptying your bladder completely after you finished urinating?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Less than 1 time in 5" },
        { value: 2, label: "Less than half the time" },
        { value: 3, label: "About half the time" },
        { value: 4, label: "More than half the time" },
        { value: 5, label: "Almost always" }
      ]
    },
    // ... (keep other questions exactly as they are)
  ];

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const totalScore = calculateTotalScore();
      submitQuestionnaire(totalScore);
    }
  };

  const calculateTotalScore = (): number => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  const submitQuestionnaire = (score: number) => {
    // Here you would typically make an API call
    console.log('Submitting answers:', answers);
    console.log('Total score:', score);
    
    toast.success("Questionnaire submitted successfully!");
    
    navigate('/', { 
      state: { 
        completedQuestionnaire: true,
        score: score,
        answers: answers // Include full answers in navigation state
      } 
    });
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentStep];
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Layout>
      <div className="py-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold mb-1">IPSS Questionnaire</h1>
          <p className="text-sm text-muted-foreground mb-2">
            International Prostate Symptom Score - Question {currentStep + 1} of {questions.length}
          </p>
          <div className="w-full bg-muted h-2 rounded-full">
            <div 
              className="bg-urolinq-light h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
            {currentQuestion.id === 7 && (
              <CardDescription className="text-sm text-muted-foreground">
                (Number of times you wake up specifically to urinate)
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id]?.toString()}
              onValueChange={(value) => handleAnswer(parseInt(value))}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value.toString()} 
                    id={`q${currentQuestion.id}-option-${index}`} 
                  />
                  <Label htmlFor={`q${currentQuestion.id}-option-${index}`} className="flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mb-20">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            aria-label="Previous question"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="bg-urolinq-light hover:bg-urolinq-medium"
            aria-label={currentStep === questions.length - 1 ? 'Submit questionnaire' : 'Next question'}
          >
            {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default IPSSQuestionnaire;

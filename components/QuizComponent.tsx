"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Award } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizComponent({ questions }: { questions: Question[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption === questions[currentStep].correctAnswer) {
      setScore(score + 1);
    }

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">تهانينا! لقد أتممت الاختبار</h2>
        <p className="text-gray-600 mb-6">درجتك هي: {score} من {questions.length}</p>
        <button 
          onClick={() => { setCurrentStep(0); setScore(0); setShowResult(false); }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
        >
          إعادة الاختبار
        </button>
      </div>
    );
  }

  const q = questions[currentStep];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-blue-600">سؤال {currentStep + 1} من {questions.length}</span>
      </div>
      <h3 className="text-xl font-bold mb-8">{q.text}</h3>
      <div className="space-y-4 mb-8">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => setSelectedOption(option)}
            className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
              selectedOption === option 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        disabled={!selectedOption}
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold disabled:opacity-50"
      >
        السؤال التالي
      </button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, CheckCircle, AlertTriangle, Clock, Star, Zap, Target } from 'lucide-react';
import { getRandomProblems, Problem } from '@/services/problems';
import { useToast } from '@/components/ui/use-toast';

interface SessionControlsProps {
  candidateName: string;
  setCandidateName: (name: string) => void;
  candidateType: 'Freshman Intern' | 'Pro/Competitive Coder';
  setCandidateType: (type: 'Freshman Intern' | 'Pro/Competitive Coder') => void;
  sessionActive: boolean;
  startSession: () => void;
  endSession: () => void;
  liveDetectionFlags: string[];
  hasAIDetection: boolean;
  selectedProblem?: Problem;
  onProblemSelect: (problem: Problem) => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  candidateName,
  setCandidateName,
  candidateType,
  setCandidateType,
  sessionActive,
  startSession,
  endSession,
  liveDetectionFlags,
  hasAIDetection,
  selectedProblem,
  onProblemSelect
}) => {
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([]);
  const [showProblemSelector, setShowProblemSelector] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionActive && showProblemSelector) {
      // Generate 3 random problems only when problem selector is shown
      const randomProblems = getRandomProblems(3);
      setAvailableProblems(randomProblems);
    }
  }, [sessionActive, showProblemSelector]);

  const getVerdictColor = () => {
    if (liveDetectionFlags.length === 0) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (liveDetectionFlags.length >= 2) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-green-400';
  };

  const getVerdictIcon = () => {
    if (liveDetectionFlags.length === 0) return <CheckCircle className="h-4 w-4" />;
    if (liveDetectionFlags.length >= 2) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return <Star className="h-4 w-4 text-green-600" />;
      case 'Medium':
        return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'Hard':
        return <Target className="h-4 w-4 text-red-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDifficultyIconBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const getProblemSummary = (problem: Problem) => {
    return `${problem.difficulty} • ${problem.category}`;
  };

  const handleStartSession = () => {
    if (!candidateName.trim()) {
      toast({ title: 'Error', description: 'Please enter candidate name', variant: 'destructive' });
      return;
    }
    
    // Show problem selector inline instead of modal
    setShowProblemSelector(true);
  };

  const handleProblemSelect = (problem: Problem) => {
    onProblemSelect(problem);
    setShowProblemSelector(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Interview Platform</h2>
        <div className="flex items-center space-x-2">
          <Badge className={getVerdictColor()}>
            {getVerdictIcon()}
            <span className="ml-1">
              {liveDetectionFlags.length === 0 ? 'Normal' : liveDetectionFlags.length >= 2 ? 'High Risk' : 'Suspicious'}
            </span>
          </Badge>
          {sessionActive && liveDetectionFlags.length > 0 && (
            <Badge variant="outline" className="border-border text-muted-foreground">
              {liveDetectionFlags.length} flags
            </Badge>
          )}
          {hasAIDetection && (
            <Badge variant="destructive" className="text-xs">
              ⚠ AI Content
            </Badge>
          )}
        </div>
      </div>

      {/* Form inputs and session controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          type="text" 
          placeholder="Candidate Name" 
          value={candidateName} 
          onChange={e => setCandidateName(e.target.value)} 
          className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground" 
          disabled={sessionActive} 
        />
        
        <Select 
          value={candidateType} 
          onValueChange={(value: 'Freshman Intern' | 'Pro/Competitive Coder') => setCandidateType(value)} 
          disabled={sessionActive}
        >
          <SelectTrigger className="bg-background border-input text-foreground">
            <User className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select Candidate Type" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="Freshman Intern" className="text-popover-foreground">Freshman Intern</SelectItem>
            <SelectItem value="Pro/Competitive Coder" className="text-popover-foreground">Pro/Competitive Coder</SelectItem>
            </SelectContent>
        </Select>
        
        <div className="flex space-x-2">
          {!sessionActive ? (
            <Button onClick={handleStartSession} className="flex-1">
              Start Session
            </Button>
          ) : (
            <Button onClick={endSession} variant="destructive" className="flex-1">
              End Session
            </Button>
          )}
        </div>
      </div>

      {/* Selected Problem Display (when session is active) */}
      {sessionActive && selectedProblem && (
        <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-white">▶</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{selectedProblem.title}</h4>
                <p className="text-xs text-muted-foreground">{getProblemSummary(selectedProblem)}</p>
              </div>
            </div>
            <Badge className={`${getDifficultyColor(selectedProblem.difficulty)} text-xs px-2 py-0.5 h-5`}>
              {selectedProblem.difficulty}
            </Badge>
          </div>
        </div>
      )}

      {/* Problem Selection (when Start Session is clicked) */}
      {showProblemSelector && !sessionActive && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Select a Problem to Solve</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowProblemSelector(false)}
            >
              Cancel
            </Button>
          </div>
          
          <div className="space-y-2">
            {availableProblems.map((problem) => (
              <div 
                key={problem.id} 
                className="group p-4 border border-border rounded-lg bg-card hover:bg-accent/30 transition-all duration-200 cursor-pointer hover:shadow-sm"
                onClick={() => handleProblemSelect(problem)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className={`w-6 h-6 rounded-full ${getDifficultyIconBg(problem.difficulty)} flex items-center justify-center flex-shrink-0`}>
                      {getDifficultyIcon(problem.difficulty)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground text-sm truncate">{problem.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{getProblemSummary(problem)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge className={`${getDifficultyColor(problem.difficulty)} text-xs px-2 py-0.5 h-5`}>
                      {problem.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">{problem.acceptanceRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message when no details entered */}
      {!sessionActive && !candidateName.trim() && !showProblemSelector && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Please enter your details above to start the session</p>
        </div>
      )}
    </div>
  );
};
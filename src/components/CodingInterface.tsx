import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SessionControls } from '@/components/coding-interface/SessionControls';
import { FlagSummary } from '@/components/coding-interface/FlagSummary';
import { CodeEditor } from '@/components/coding-interface/CodeEditor';
import { useToast } from '@/hooks/use-toast';
import TypingAnalyzer from '@/components/TypingAnalyzer';
import RealTimeMonitor from '@/components/RealTimeMonitor';
import RiskVerdictDisplay from '@/components/RiskVerdictDisplay';
import { apiService, TypingEvent } from '@/services/api';
import { CANDIDATE_PROFILES } from '@/services/profiles';
import { DetectionEngine } from '@/services/detectionEngine';
import { AIPasteDetector, AIPasteEvent } from '@/services/aiPasteDetector';
import { sessionManager } from '@/services/sessionManager';
import { setDetectionSessionActive } from '@/utils/ai-overlay-detector';
import TypingSpeedMonitor from '@/components/TypingSpeedMonitor';
import { Problem } from '@/services/problems';

const CodingInterface: React.FC = () => {
  const cleanState = sessionManager.initializeCleanSession();

  const [code, setCode] = useState(cleanState.code || '');
  const [candidateName, setCandidateName] = useState(cleanState.candidateName || '');
  const [candidateType, setCandidateType] = useState<'Freshman Intern' | 'Pro/Competitive Coder'>(cleanState.candidateType || 'Freshman Intern');
  const [sessionActive, setSessionActive] = useState(false);
  const [typingEvents, setTypingEvents] = useState<TypingEvent[]>(cleanState.typingEvents || []);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(cleanState.sessionStartTime || null);
  const [liveDetectionFlags, setLiveDetectionFlags] = useState<string[]>(cleanState.liveDetectionFlags || []);
  const [tabSwitches, setTabSwitches] = useState(cleanState.tabSwitches || 0);
  const [finalDetectionResult, setFinalDetectionResult] = useState<any>(cleanState.finalDetectionResult || null);
  const [aiPasteEvents, setAiPasteEvents] = useState<AIPasteEvent[]>(cleanState.aiPasteEvents || []);
  const [aiPasteDetector, setAiPasteDetector] = useState<AIPasteDetector | null>(cleanState.aiPasteDetector || null);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [selectedProblem, setSelectedProblem] = useState<Problem | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const currentProfile = candidateType === 'Freshman Intern' ? CANDIDATE_PROFILES.intern : CANDIDATE_PROFILES.professional;

  const addLiveFlag = (newFlag: string) => {
    const MAX_TOTAL_FLAGS = 30;
    const MAX_FLAGS_PER_TYPE = 5;
    const flagTypePrefixes = [
      'Excessive idle pauses detected',
      'Large paste detected',
      'AI-generated content detected in paste',
      'Suspicious paste after',
      'Large paste content detected',
      'Excessive tab switching detected',
      'Rapid typing',
      'Unnatural typing rhythm'
    ];
    const getBaseMessage = (flag: string): string => {
      const foundPrefix = flagTypePrefixes.find(prefix => flag.startsWith(prefix));
      if (foundPrefix) return foundPrefix;
      return flag.split(':')[0].trim();
    };
    const baseMessage = getBaseMessage(newFlag);
    setLiveDetectionFlags(prev => {
      const countForType = prev.filter(f => getBaseMessage(f) === baseMessage).length;
      if (countForType >= MAX_FLAGS_PER_TYPE) return prev;
      if (prev.length >= MAX_TOTAL_FLAGS) return prev;
      return [...prev, newFlag];
    });
  };

  const resetSession = () => {
    const next = sessionManager.initializeCleanSession();
    setCode(next.code || '');
    setCandidateName(next.candidateName || '');
    setCandidateType(next.candidateType || 'Freshman Intern');
    setSessionActive(false);
    setTypingEvents(next.typingEvents || []);
    setSessionStartTime(next.sessionStartTime || null);
    setLiveDetectionFlags(next.liveDetectionFlags || []);
    setTabSwitches(next.tabSwitches || 0);
    setFinalDetectionResult(next.finalDetectionResult || null);
    setAiPasteEvents(next.aiPasteEvents || []);
    setAiPasteDetector(next.aiPasteDetector || null);
    setSelectedProblem(undefined);
  };

  const shouldLogKey = (key: string): boolean => {
    const modifierKeys = ['Shift', 'Control', 'Alt', 'CapsLock', 'Tab', 'Meta'];
    return !modifierKeys.includes(key);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!sessionActive || !aiPasteDetector) return;
    aiPasteDetector.recordKeystroke();
    if (shouldLogKey(e.key)) {
      const event: TypingEvent = {
        timestamp: Date.now(),
        type: 'keydown',
        key: e.key,
        textLength: code.length,
        position: textareaRef.current?.selectionStart || 0
      };
      setTypingEvents(prev => [...prev, event]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!sessionActive || !aiPasteDetector) return;
    const pastedText = e.clipboardData.getData('text');
    const event: TypingEvent = {
      timestamp: Date.now(),
      type: 'paste',
      textLength: pastedText.length,
      position: textareaRef.current?.selectionStart || 0
    };
    setTypingEvents(prev => [...prev, event]);
    const aiPasteEvent = aiPasteDetector.analyzePaste(pastedText);
    setAiPasteEvents(prev => [...prev, aiPasteEvent]);
    if (aiPasteEvent.looksGPTPattern) {
      const newFlag = `AI-generated content detected in paste (${pastedText.length} chars)`;
      addLiveFlag(newFlag);
      toast({ title: 'AI Content Detected', description: newFlag, variant: 'destructive' });
    } else if (aiPasteEvent.pauseBeforePaste && pastedText.length >= 200) {
      const newFlag = `Suspicious paste after ${Math.round(aiPasteEvent.timeSinceLastKey / 1000)}s pause (${pastedText.length} chars)`;
      addLiveFlag(newFlag);
      toast({ title: 'Suspicious Paste Pattern', description: newFlag, variant: 'destructive' });
    }
    if (pastedText.length >= 160) {
      const newFlag = `Large paste content detected (≥${pastedText.length} chars)`;
      addLiveFlag(newFlag);
      toast({ title: 'AI Assistance Detected', description: newFlag, variant: 'destructive' });
    } else if (pastedText.length > currentProfile.thresholds.largePasteChars) {
      const newFlag = `Large paste detected: ${pastedText.length} characters`;
      addLiveFlag(newFlag);
      toast({ title: 'Suspicious Activity', description: newFlag, variant: 'destructive' });
    }
  };

  React.useEffect(() => {
    if (!sessionActive) return;
    const handleBlur = () => {
      setTabSwitches(prev => prev + 1);
      if (tabSwitches >= 3) {
        const flag = 'Excessive tab switching detected';
        addLiveFlag(flag);
        toast({ title: 'Suspicious Activity', description: flag, variant: 'destructive' });
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [sessionActive, tabSwitches, toast]);

  React.useEffect(() => {
    if (sessionActive && sessionStartTime) {
      const interval = setInterval(() => {
        const keydownEvents = typingEvents.filter(e => e.type === 'keydown' && shouldLogKey(e.key || ''));
        const sessionDurationSeconds = (Date.now() - sessionStartTime) / 1000;
        const speed = sessionDurationSeconds > 1 ? keydownEvents.length / sessionDurationSeconds : 0;
        setTypingSpeed(speed);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTypingSpeed(0);
    }
  }, [sessionActive, sessionStartTime, typingEvents]);

  // Start session when a problem is selected
  React.useEffect(() => {
    if (selectedProblem && !sessionActive && candidateName.trim()) {
      startSession();
    }
  }, [selectedProblem, sessionActive, candidateName]);

  const startSession = () => {
    if (!candidateName.trim()) {
      toast({ title: 'Error', description: 'Please enter candidate name', variant: 'destructive' });
      return;
    }
    
    if (!selectedProblem) {
      toast({ title: 'Error', description: 'Please select a problem first', variant: 'destructive' });
      return;
    }

    const sessionId = `${candidateName}_${Date.now()}`;
    const detector = new AIPasteDetector(sessionId);
    setAiPasteDetector(detector);
    setSessionActive(true);
    setSessionStartTime(Date.now());
    setTypingEvents([]);
    setLiveDetectionFlags([]);
    setTabSwitches(0);
    setFinalDetectionResult(null);
    setAiPasteEvents([]);
    setDetectionSessionActive(true);
    
    // Set the starter code for the selected problem
    if (selectedProblem.starterCode.javascript) {
      setCode(selectedProblem.starterCode.javascript);
    }
    
    toast({ title: 'Session Started', description: `Solving: ${selectedProblem.title} (${selectedProblem.difficulty})` });
  };

  const endSession = async () => {
    if (!sessionStartTime) return;
    setDetectionSessionActive(false);
    const sessionDuration = Date.now() - sessionStartTime;
    const detectionResult = DetectionEngine.analyze(typingEvents, code, sessionDuration);
    setFinalDetectionResult(detectionResult);
    const keydownEvents = typingEvents.filter(e => e.type === 'keydown' && shouldLogKey(e.key || ''));
    const totalTime = sessionDuration / 1000 / 60;
    const totalWPM = totalTime > 0 ? Math.round(keydownEvents.length / 5 / totalTime) : 0;
    const linesOfCode = code.split('\n').length;
    try {
      await apiService.saveSession({
        candidateName,
        candidateType,
        code,
        typingEvents,
        duration: sessionDuration,
        verdict: detectionResult.verdict === 'human' ? 'Human' : detectionResult.verdict === 'likely_bot' ? 'Likely Bot' : 'AI Assisted',
        detectionFlags: detectionResult.suspiciousActivities,
        typingStats: {
          totalWPM,
          totalTime: Math.round(totalTime * 100) / 100,
          linesOfCode,
          typingBursts: detectionResult.detailedMetrics.burstTypingEvents
        },
        aiPasteEvents
      });

      // Auto-clear all user-side data after session ends
      sessionManager.handleSessionEnd();
      const clean = sessionManager.initializeCleanSession();
      setSessionActive(false);
      setAiPasteDetector(null);
      setCode(clean.code || '');
      setCandidateName(clean.candidateName || '');
      setCandidateType(clean.candidateType || 'Freshman Intern');
      setTypingEvents([]);
      setSessionStartTime(null);
      setLiveDetectionFlags([]);
      setTabSwitches(0);
      setFinalDetectionResult(null);
      setAiPasteEvents([]);
      setSelectedProblem(undefined);

      toast({
        title: 'Session Completed',
        description: `Verdict: ${detectionResult.verdict} (Confidence: ${detectionResult.confidence})`,
        variant: detectionResult.verdict === 'human' ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save session data', variant: 'destructive' });
    }
  };

  const runCode = () => {
    toast({ title: 'Code Execution', description: 'In a real environment, this would execute the code safely' });
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    // Set the starter code for the selected problem
    if (problem.starterCode.javascript) {
      setCode(problem.starterCode.javascript);
    }
  };

  const hasAIDetection = aiPasteEvents.some(event => event.looksGPTPattern || (event.pauseBeforePaste && event.pasteLength >= 200));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="space-y-4 p-6">
            <SessionControls
              candidateName={candidateName}
              setCandidateName={setCandidateName}
              candidateType={candidateType}
              setCandidateType={setCandidateType}
              sessionActive={sessionActive}
              startSession={startSession}
              endSession={endSession}
              liveDetectionFlags={liveDetectionFlags}
              hasAIDetection={hasAIDetection}
              selectedProblem={selectedProblem}
              onProblemSelect={handleProblemSelect}
            />

            <CodeEditor
              code={code}
              setCode={setCode}
              sessionActive={sessionActive}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              textareaRef={textareaRef}
              runCode={runCode}
              selectedProblem={selectedProblem}
            />

            <FlagSummary sessionActive={sessionActive} liveDetectionFlags={liveDetectionFlags} />
          </CardContent>
        </Card>

        <RiskVerdictDisplay detectionResult={finalDetectionResult} isVisible={!sessionActive && finalDetectionResult !== null} />
      </div>

      <div className="space-y-6">
        <TypingAnalyzer
          typingEvents={typingEvents}
          isActive={sessionActive}
          profile={currentProfile}
          onSuspiciousActivity={activity => {
            addLiveFlag(activity);
            toast({ title: 'Suspicious Activity', description: activity, variant: 'destructive' });
          }}
          aiPasteEvents={aiPasteEvents}
        />

        <TypingSpeedMonitor speed={typingSpeed} isActive={sessionActive} />

        <RealTimeMonitor
          isActive={sessionActive}
          tabSwitches={tabSwitches}
          onSuspiciousActivity={activity => {
            setLiveDetectionFlags(prev => [...prev, activity]);
          }}
        />
      </div>
    </div>
  );
};

export default CodingInterface;



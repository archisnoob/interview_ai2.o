import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Send, RotateCcw, CheckCircle, Clock, AlertTriangle, Copy, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  sessionActive: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  runCode: () => void;
  selectedProblem?: {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    description: string;
    examples: Array<{ input: string; output: string; explanation?: string }>;
    constraints: string[];
    starterCode: { [key: string]: string };
  };
}

const LANGUAGES = [
  { key: 'javascript', label: 'JavaScript', extension: '.js' },
  { key: 'python', label: 'Python', extension: '.py' },
  { key: 'java', label: 'Java', extension: '.java' },
  { key: 'cpp', label: 'C++', extension: '.cpp' },
  { key: 'c', label: 'C', extension: '.c' },
  { key: 'csharp', label: 'C#', extension: '.cs' },
  { key: 'go', label: 'Go', extension: '.go' },
  { key: 'rust', label: 'Rust', extension: '.rs' },
  { key: 'php', label: 'PHP', extension: '.php' },
  { key: 'ruby', label: 'Ruby', extension: '.rb' },
  { key: 'swift', label: 'Swift', extension: '.swift' },
  { key: 'kotlin', label: 'Kotlin', extension: '.kt' },
  { key: 'scala', label: 'Scala', extension: '.scala' },
  { key: 'typescript', label: 'TypeScript', extension: '.ts' },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  sessionActive,
  onKeyDown,
  onPaste,
  textareaRef,
  runCode,
  selectedProblem
}) => {
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; input: string; expected: string; actual: string; executionTime?: number; memory?: number }>>([]);
  const [customInput, setCustomInput] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const { toast } = useToast();

  // Set initial language and code when problem changes
  useEffect(() => {
    if (selectedProblem) {
      // Find the first available language for this problem
      const availableLanguages = Object.keys(selectedProblem.starterCode);
      if (availableLanguages.length > 0) {
        const firstLanguage = availableLanguages[0];
        setLanguage(firstLanguage);
        setCode(selectedProblem.starterCode[firstLanguage]);
      }
    }
  }, [selectedProblem, setCode]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (selectedProblem?.starterCode[newLanguage]) {
      setCode(selectedProblem.starterCode[newLanguage]);
      toast({ title: 'Language Changed', description: `Switched to ${newLanguage}` });
    } else {
      // If no starter code for this language, provide a basic template
      const basicTemplate = getBasicTemplate(newLanguage);
      setCode(basicTemplate);
      toast({ title: 'Language Changed', description: `Switched to ${newLanguage} with basic template` });
    }
  };

  const getBasicTemplate = (lang: string): string => {
    const templates: { [key: string]: string } = {
      javascript: `// Solution for ${selectedProblem?.title || 'Problem'}
function solution(input) {
    // Your code here
    return input;
}`,
      python: `# Solution for ${selectedProblem?.title || 'Problem'}
def solution(input):
    # Your code here
    return input`,
      java: `// Solution for ${selectedProblem?.title || 'Problem'}
public class Solution {
    public static String solution(String input) {
        // Your code here
        return input;
    }
}`,
      cpp: `// Solution for ${selectedProblem?.title || 'Problem'}
#include <iostream>
#include <string>

std::string solution(std::string input) {
    // Your code here
    return input;
}`,
      c: `// Solution for ${selectedProblem?.title || 'Problem'}
#include <stdio.h>
#include <string.h>

char* solution(char* input) {
    // Your code here
    return input;
}`,
      csharp: `// Solution for ${selectedProblem?.title || 'Problem'}
public class Solution {
    public static string solution(string input) {
        // Your code here
        return input;
    }
}`,
      go: `// Solution for ${selectedProblem?.title || 'Problem'}
package main

func solution(input string) string {
    // Your code here
    return input
}`,
      rust: `// Solution for ${selectedProblem?.title || 'Problem'}
fn solution(input: &str) -> String {
    // Your code here
    input.to_string()
}`,
      php: `<?php
// Solution for ${selectedProblem?.title || 'Problem'}
function solution($input) {
    // Your code here
    return $input;
}`,
      ruby: `# Solution for ${selectedProblem?.title || 'Problem'}
def solution(input)
  # Your code here
  input
end`,
      swift: `// Solution for ${selectedProblem?.title || 'Problem'}
func solution(_ input: String) -> String {
    // Your code here
    return input
}`,
      kotlin: `// Solution for ${selectedProblem?.title || 'Problem'}
fun solution(input: String): String {
    // Your code here
    return input
}`,
      scala: `// Solution for ${selectedProblem?.title || 'Problem'}
def solution(input: String): String = {
    // Your code here
    input
}`,
      typescript: `// Solution for ${selectedProblem?.title || 'Problem'}
function solution(input: string): string {
    // Your code here
    return input;
}`
    };
    return templates[lang] || templates.javascript;
  };

  const handleResetCode = () => {
    if (selectedProblem?.starterCode[language]) {
      setCode(selectedProblem.starterCode[language]);
      toast({ title: 'Code Reset', description: 'Code has been reset to starter template' });
    } else {
      const basicTemplate = getBasicTemplate(language);
      setCode(basicTemplate);
      toast({ title: 'Code Reset', description: 'Code has been reset to basic template' });
    }
    setOutput('');
    setTestResults([]);
  };

  const executeCode = async (input: string, expectedOutput: string): Promise<{ passed: boolean; actual: string; executionTime: number; memory: number }> => {
    // Simulate real code execution with different results based on input
    const startTime = Date.now();
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200));
    
    const executionTime = Date.now() - startTime;
    const memory = Math.floor(Math.random() * 100) + 10; // Random memory usage
    
    // Simulate different outcomes based on the problem and input
    let actual: string;
    let passed: boolean;
    
    if (selectedProblem?.title === "Two Sum") {
      // Simulate Two Sum logic
      if (input.includes("[2,7,11,15]") && input.includes("9")) {
        actual = "[0,1]";
        passed = actual === expectedOutput;
      } else if (input.includes("[3,2,4]") && input.includes("6")) {
        actual = "[1,2]";
        passed = actual === expectedOutput;
      } else {
        actual = "Wrong Answer";
        passed = false;
      }
    } else if (selectedProblem?.title === "Palindrome Number") {
      // Simulate Palindrome logic
      if (input.includes("121")) {
        actual = "true";
        passed = actual === expectedOutput;
      } else if (input.includes("-121")) {
        actual = "false";
        passed = actual === expectedOutput;
      } else {
        actual = "Wrong Answer";
        passed = false;
      }
    } else {
      // Generic logic for other problems
      const randomSuccess = Math.random() > 0.3; // 70% success rate
      if (randomSuccess) {
        actual = expectedOutput;
        passed = true;
      } else {
        actual = "Wrong Answer";
        passed = false;
      }
    }
    
    return { passed, actual, executionTime, memory };
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    
    setIsRunning(true);
    setOutput('Running code against test cases...');
    setTestResults([]);
    
    try {
      const results = [];
      
      // Run against all example test cases
      for (const example of selectedProblem.examples) {
        const result = await executeCode(example.input, example.output);
        results.push({
          ...result,
          input: example.input,
          expected: example.output
        });
      }
      
      setTestResults(results);
      
      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;
      
      if (passedCount === totalCount) {
        setOutput(`✅ All test cases passed! (${passedCount}/${totalCount})`);
        toast({ title: 'Success!', description: 'All test cases passed!', variant: 'default' });
      } else {
        setOutput(`❌ ${passedCount}/${totalCount} test cases passed`);
        toast({ title: 'Test Results', description: `${passedCount}/${totalCount} test cases passed`, variant: 'destructive' });
      }
    } catch (error) {
      setOutput('❌ Error executing code');
      toast({ title: 'Execution Error', description: 'Failed to execute code', variant: 'destructive' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem) return;
    
    setIsSubmitting(true);
    setOutput('Submitting solution...');
    
    try {
      // Simulate submission with hidden test cases
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Run against all test cases plus some hidden ones
      const allTestCases = [
        ...selectedProblem.examples,
        // Add some hidden test cases
        { input: "hidden_test_1", output: "expected_1" },
        { input: "hidden_test_2", output: "expected_2" }
      ];
      
      const results = [];
      for (const testCase of allTestCases) {
        const result = await executeCode(testCase.input, testCase.output);
        results.push({
          ...result,
          input: testCase.input,
          expected: testCase.output
        });
      }
      
      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;
      
      if (passedCount === totalCount) {
        setOutput('🎉 Accepted! All test cases passed.');
        toast({ title: 'Accepted!', description: 'Congratulations! All test cases passed.', variant: 'default' });
      } else {
        setOutput(`❌ Wrong Answer. ${passedCount}/${totalCount} test cases passed.`);
        toast({ title: 'Wrong Answer', description: `${passedCount}/${totalCount} test cases passed`, variant: 'destructive' });
      }
      
      setTestResults(results);
    } catch (error) {
      setOutput('❌ Error submitting solution');
      toast({ title: 'Submission Error', description: 'Failed to submit solution', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: 'Code copied to clipboard' });
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProblem?.title.replace(/\s+/g, '_')}_${language}${LANGUAGES.find(l => l.key === language)?.extension || '.txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded!', description: 'Code file downloaded' });
  };

  // Only show the LeetCode editor when a problem is selected and session is active
  if (!selectedProblem || !sessionActive) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Problem Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{selectedProblem.title}</h2>
          <div className="flex items-center space-x-3">
            <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
              {selectedProblem.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground">{selectedProblem.category}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadCode}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetCode}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Problem Description */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Problem Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Problem Statement */}
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed text-base">{selectedProblem.description}</p>
          </div>
          
          {/* Examples */}
          {selectedProblem.examples.length > 0 && (
    <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Examples:</h4>
              {selectedProblem.examples.map((example, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground">Example {index + 1}:</span>
                  </div>
                  <div className="bg-background border rounded-lg p-4 space-y-3">
                    <div>
                      <span className="font-medium text-muted-foreground">Input:</span>
                      <pre className="mt-2 bg-muted p-3 rounded text-foreground font-mono text-sm leading-relaxed">{example.input}</pre>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Output:</span>
                      <pre className="mt-2 bg-muted p-3 rounded text-foreground font-mono text-sm leading-relaxed">{example.output}</pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-medium text-muted-foreground">Explanation:</span>
                        <p className="mt-2 text-foreground text-sm leading-relaxed">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {selectedProblem.constraints.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-lg">Constraints:</h4>
              <div className="bg-background border rounded-lg p-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {selectedProblem.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-foreground font-mono">•</span>
                      <span className="leading-relaxed">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Follow-up (if any) */}
          {selectedProblem.followUp && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-lg">Follow-up:</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-foreground text-sm leading-relaxed">{selectedProblem.followUp}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Code Editor</CardTitle>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.key} value={lang.key}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
        <Textarea 
          ref={textareaRef} 
          value={code} 
            onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKeyDown} 
          onPaste={onPaste} 
            placeholder="Write your solution here..."
            className="min-h-80 font-mono text-sm bg-background border-input text-foreground resize-none"
          disabled={!sessionActive} 
        />
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button 
                onClick={handleRunCode} 
                disabled={!sessionActive || isRunning}
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!sessionActive || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
      </div>
      
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCustomInput(!showCustomInput)}
            >
              {showCustomInput ? 'Hide' : 'Show'} Custom Input
        </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Input */}
      {showCustomInput && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Custom Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter custom test input..."
              className="min-h-20 font-mono text-sm"
            />
            <div className="mt-3">
              <Button 
                onClick={async () => {
                  if (!customInput.trim()) return;
                  setIsRunning(true);
                  setOutput('Running with custom input...');
                  
                  try {
                    const result = await executeCode(customInput, 'Custom Test');
                    setOutput(`Custom test result: ${result.passed ? 'Passed' : 'Failed'}`);
                    setTestResults([{
                      passed: result.passed,
                      input: customInput,
                      expected: 'Custom Test',
                      actual: result.actual,
                      executionTime: result.executionTime,
                      memory: result.memory
                    }]);
                  } catch (error) {
                    setOutput('Error running custom input');
                  } finally {
                    setIsRunning(false);
                  }
                }}
                disabled={!sessionActive || isRunning || !customInput.trim()}
                variant="outline"
                size="sm"
              >
                Run Custom Input
        </Button>
      </div>
          </CardContent>
        </Card>
      )}

      {/* Output and Results */}
      {(output || testResults.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {output && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-foreground font-medium">{output}</p>
              </div>
            )}
            
            {testResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Test Cases:</h4>
                {testResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    result.passed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-medium ${result.passed ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                          Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>⏱️ {result.executionTime}ms</span>
                        <span>💾 {result.memory}MB</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Input:</span>
                        <pre className="mt-1 bg-background p-2 rounded text-foreground font-mono">{result.input}</pre>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Expected:</span>
                        <pre className="mt-1 bg-background p-2 rounded text-foreground font-mono">{result.expected}</pre>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Actual:</span>
                        <pre className="mt-1 bg-background p-2 rounded text-foreground font-mono">{result.actual}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
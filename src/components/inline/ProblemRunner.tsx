import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LANGUAGE_ID_MAP, runCodeOnJudge0, summarizeJudgeResult, LanguageKey } from '@/services/judge';
import type { Problem } from '@/pages/Problems';

const LANGUAGES: Array<{ key: LanguageKey; label: string }> = [
  { key: 'javascript', label: 'JavaScript (Node)' },
  { key: 'python', label: 'Python 3' },
  { key: 'cpp', label: 'C++17' },
  { key: 'java', label: 'Java' },
];

interface ProblemRunnerProps {
  problem: Problem;
  onBack: () => void;
}

const ProblemRunner: React.FC<ProblemRunnerProps> = ({ problem, onBack }) => {
  const [language, setLanguage] = React.useState<LanguageKey>('javascript');
  const [source, setSource] = React.useState<string>(problem?.starterCode?.[language] ?? '');
  const [stdin, setStdin] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [status, setStatus] = React.useState('Idle');
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    if (!problem) return;
    setSource(problem.starterCode?.[language] ?? '');
  }, [language, problem]);

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setStatus('Running');
      const res = await runCodeOnJudge0({
        sourceCode: source,
        languageId: LANGUAGE_ID_MAP[language],
        stdin,
      });
      const summary = summarizeJudgeResult(res);
      setStatus(summary.status + (summary.isAccepted ? ' (Accepted)' : ''));
      setOutput(summary.output || '(no output)');
    } catch (e: any) {
      setStatus('Error');
      setOutput(e?.message ?? String(e));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold">{problem.title}</div>
            <div className="text-sm text-muted-foreground">{problem.difficulty} · {problem.tags.join(', ')}</div>
          </div>
          <Button variant="outline" onClick={onBack}>Back to Problems</Button>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p>{problem.prompt}</p>
          {problem.samples?.length ? (
            <div>
              <div className="font-medium mt-4">Samples</div>
              {problem.samples.map((s, i) => (
                <div key={i} className="text-sm bg-muted rounded p-3 mt-2">
                  <div><span className="font-medium">Input:</span> {s.input}</div>
                  <div><span className="font-medium">Output:</span> {s.output}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <Tabs value={language} onValueChange={(v) => setLanguage(v as LanguageKey)}>
          <TabsList className="flex flex-wrap">
            {LANGUAGES.map((l) => (
              <TabsTrigger key={l.key} value={l.key}>{l.label}</TabsTrigger>
            ))}
          </TabsList>
          {LANGUAGES.map((l) => (
            <TabsContent key={l.key} value={l.key}>
              <Textarea
                className="min-h-[300px] font-mono text-sm"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </TabsContent>
          ))}
        </Tabs>

        <div>
          <div className="text-sm font-medium mb-2">Input (STDIN)</div>
          <Textarea value={stdin} onChange={(e) => setStdin(e.target.value)} className="min-h-[100px] font-mono text-sm" />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleRun} disabled={isRunning}>{isRunning ? 'Running...' : 'Run'}</Button>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Status</div>
          <div className="text-sm bg-muted rounded p-2">{status}</div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Output</div>
          <Textarea readOnly value={output} className="min-h-[160px] font-mono text-sm" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemRunner;



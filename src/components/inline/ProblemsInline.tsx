import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PROBLEMS, Problem } from '@/pages/Problems';

interface ProblemsInlineProps {
  onOpen: (problem: Problem) => void;
}

const ProblemsInline: React.FC<ProblemsInlineProps> = ({ onOpen }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problems</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {PROBLEMS.map((p) => (
          <div key={p.id} className="flex items-center justify-between border-b last:border-b-0 py-3">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-muted-foreground">{p.difficulty} · {p.tags.join(', ')}</div>
            </div>
            <Button onClick={() => onOpen(p)}>Solve</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProblemsInline;



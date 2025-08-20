import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export type Problem = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  starterCode?: Record<string, string>; // language -> code
  prompt: string;
  samples?: Array<{ input: string; output: string }>;
};

export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    prompt:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    samples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\n// Read input from STDIN and print output to STDOUT\n// Example input:\n// 4\n// 2 7 11 15\n// 9\nconst fs = require('fs');\nconst input = fs.readFileSync(0,'utf8').trim().split(/\s+/).map(Number);\nconst n = input[0];\nconst nums = input.slice(1, 1+n);\nconst target = input[1+n];\nconsole.log(JSON.stringify(twoSum(nums, target)));`,
    },
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    prompt: 'Write a function that reverses a string.',
    starterCode: {
      javascript: `function solve(s){\n  return s.split('').reverse().join('');\n}\nconst fs=require('fs');\nconst s=fs.readFileSync(0,'utf8').trim();\nconsole.log(solve(s));`,
    },
  },
];

const Problems: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
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
              <Button asChild>
                <Link to={`/problems/${p.id}`}>Solve</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Problems;



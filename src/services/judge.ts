export type JudgeResult = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  status?: { id: number; description: string };
  time?: string | null;
  memory?: number | null;
};

export type LanguageKey = 'javascript' | 'python' | 'cpp' | 'java';

export const LANGUAGE_ID_MAP: Record<LanguageKey, number> = {
  javascript: 63, // Node.js 18.x
  python: 71, // Python 3.8.1
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
};

function getApiConfig() {
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY as string | undefined;
  const rapidApiHost = (import.meta.env.VITE_RAPIDAPI_HOST as string | undefined) || 'judge0-ce.p.rapidapi.com';
  const directApiUrl = import.meta.env.VITE_JUDGE0_API_URL as string | undefined; // e.g. https://judge0-ce.p.rapidapi.com or self-hosted

  if (rapidApiKey) {
    return {
      urlBase: `https://${rapidApiHost}`,
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
      } as Record<string, string>,
    };
  }

  // Fallback to direct API URL without RapidAPI
  const urlBase = directApiUrl || 'https://judge0-ce.p.rapidapi.com';
  return {
    urlBase,
    headers: {
      'content-type': 'application/json',
    } as Record<string, string>,
  };
}

export async function runCodeOnJudge0(params: {
  sourceCode: string;
  languageId: number;
  stdin?: string;
  expectedOutput?: string;
}): Promise<JudgeResult> {
  const { urlBase, headers } = getApiConfig();

  const query = new URLSearchParams({
    base64_encoded: 'false',
    fields: 'stdout,stderr,compile_output,status,time,memory',
    wait: 'true',
  });

  const response = await fetch(`${urlBase}/submissions?${query.toString()}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: params.sourceCode,
      language_id: params.languageId,
      stdin: params.stdin ?? '',
      expected_output: params.expectedOutput,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Judge0 error: ${response.status} ${text}`);
  }

  const result = (await response.json()) as JudgeResult;
  return result;
}

export function summarizeJudgeResult(result: JudgeResult): {
  status: string;
  isAccepted: boolean;
  output: string;
} {
  const status = result.status?.description || 'Unknown';
  const isAccepted = result.status?.id === 3; // 3 = Accepted
  const output =
    (result.stdout ?? '') +
    (result.stderr ? `\n[stderr]\n${result.stderr}` : '') +
    (result.compile_output ? `\n[compile]\n${result.compile_output}` : '');
  return { status, isAccepted, output: output.trim() };
}



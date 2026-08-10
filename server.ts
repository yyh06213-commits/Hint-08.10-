import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  // Initialize Gemini Client server-side
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API endpoint for AI Career Anchor analysis
  app.post('/api/analyze-career-anchor', async (req, res) => {
    try {
      const { anchorScores, targetJob, topAnchors } = req.body;

      if (!targetJob) {
        return res.status(400).json({ error: 'Target job is required' });
      }

      const apiKeyAvailable = !!process.env.GEMINI_API_KEY;

      if (ai && apiKeyAvailable) {
        const prompt = `
당신은 에드가 샤인(Edgar Schein)의 커리어 앵커(Career Anchor) 전문 최고의 커리어 코치입니다.
사용자가 40문항의 커리어 앵커 정밀 진단을 완료했습니다.

[사용자의 진단 결과]
- 희망 직무: ${targetJob}
- 상위 3대 커리어 앵커: ${JSON.stringify(topAnchors)}
- 전체 8가지 앵커 점수 (각 50점 만점 또는 상대 점수): ${JSON.stringify(anchorScores)}

8가지 앵커 항목 설명 참고:
1. TF (전문가/기술 역량): 특정 분야의 깊이 있는 전문 지식과 실무 역량 발휘
2. GM (총괄 관리 역량): 조직 관리, 의사결정 및 전반적인 리더십 책임
3. AU (자율성/독립성): 규칙에 구속받지 않는 자유롭고 독립적인 업무 방식
4. SE (보안/안정성): 조직의 안정성, 신뢰성 및 예측 가능한 보상과 환경
5. EC (창업가적 창의성): 나만의 사업/서비스 창출 및 도전적 위험 감수
6. SV (봉사/사회적 헌신): 사회적 가치 실현, 타인을 돕는 유의미한 목적
7. CH (순수한 도전): 극도의 어려운 문제 해결 및 경쟁을 통한 성취감
8. LS (라이프스타일 균형): 일과 개인 삶/가정의 조화로운 통합

사용자의 상위 앵커와 희망 직무(${targetJob})를 교차 분석하여 깊이 있고 구체적이며 현실적인 커리어 리포트를 작성하세요.
한국어로 친절하고 격려하는 전문적인 톤앤매너로 작성해주십시오.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: '너는 20년 경력의 HR 컨설턴트이자 에드가 샤인 커리어 앵커 전문가이다.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                primaryProfileSummary: {
                  type: Type.STRING,
                  description: '상위 앵커들을 조합한 사용자의 핵심 커리어 정체성 요약 (2~3문장)',
                },
                jobSynergy: {
                  type: Type.STRING,
                  description: '희망 직무와 상위 앵커 간의 적합도, 시너지 발생 지점 및 강점 발휘 방식 (4~5문장)',
                },
                stressFactors: {
                  type: Type.STRING,
                  description: '희망 직무 및 조직 환경에서 번아웃을 유발할 수 있는 스트레스 요인과 이를 관리/극복하는 조언 (4~5문장)',
                },
                interviewTips: {
                  type: Type.STRING,
                  description: '자기소개서 작성 및 면접 시 강조해야 할 핵심 경험 어필 전략과 답변 팁 (4~5문장)',
                },
                roadmap: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '커리어 성장을 위한 단계별 실행 로드맵 (3~4개 항목)',
                },
                recommendedJobs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '이 앵커 프로필과 시너지가 높은 연관 추천 직무 3~4가지',
                },
              },
              required: [
                'primaryProfileSummary',
                'jobSynergy',
                'stressFactors',
                'interviewTips',
                'roadmap',
                'recommendedJobs',
              ],
            },
          },
        });

        if (response.text) {
          const parsedData = JSON.parse(response.text);
          return res.json({ success: true, report: parsedData, isAiGenerated: true });
        }
      }

      // Fallback rule-based generator if Gemini is unavailable or failed
      const topAnchorNames = (topAnchors || ['TF', 'AU', 'SE']).map((a: any) => typeof a === 'string' ? a : a.name);
      
      const fallbackReport = {
        primaryProfileSummary: `${topAnchorNames.join(', ')} 성향이 강하게 나타납니다. 자신의 뛰어난 역량을 자율적인 환경에서 독립적으로 발휘할 때 최고의 몰입감을 느끼는 전문가형 프로필입니다.`,
        jobSynergy: `${targetJob} 직무는 당신의 핵심 동기와 깊은 시너지를 낼 수 있습니다. 독립적인 문제 해결 권한이 부여되고, 스스로의 전문성이 성과로 직접 이어지는 프로젝트를 담당할 때 커리어적 유의미함과 만족도가 대폭 상승합니다.`,
        stressFactors: `과도한 마이크로매니지먼트, 자율성이 부재한 수동적 행정 절차, 혹은 자신의 전문 지식이 존중받지 못하는 수평적 불통 환경은 심각한 스트레스와 번아웃을 유발할 수 있습니다. 조직 선택 시 자율적인 판단권 보장 여부를 확인해야 합니다.`,
        interviewTips: `'특정 난제나 복잡한 이슈를 자신의 전문 지식과 자율적 시도로 해결했던 구체적 사례'를 강조하세요. 자율성이 주어졌을 때 강한 책임감으로 목표를 초과 달성했던 성과 데이터를 제시하면 매력적인 인재로 평가받습니다.`,
        roadmap: [
          `1단계: ${targetJob} 직무의 핵심 전문 역량 심화 학습 및 개인 포트폴리오 정교화`,
          '2단계: 자기주도적 프로젝트 주도권 확보 및 구체적인 문제 해결 성과 데이터화',
          '3단계: 조직 내 전문가(Specialist) 트랙 구축 또는 자율성이 보장되는 프로젝트 리드 역할 수행',
        ],
        recommendedJobs: [targetJob, 'R&D 전문 연구원', '데이터 분석가', '전문 전략 컨설턴트'],
      };

      return res.json({ success: true, report: fallbackReport, isAiGenerated: false });
    } catch (error: any) {
      console.error('Error generating career anchor analysis:', error);
      res.status(500).json({ error: 'Failed to generate analysis', message: error?.message });
    }
  });

  // Vite middleware in dev or express.static in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

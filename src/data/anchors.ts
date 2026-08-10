import { AnchorCode, AnchorInfo, Question, LikertValue, AssessmentAnswers, AnchorScore } from '../types';

export const ANCHOR_DEFINITIONS: Record<AnchorCode, AnchorInfo> = {
  TF: {
    code: 'TF',
    name: '전문가 / 기술 역량',
    shortName: '전문가',
    tag: '#전문가형',
    englishName: 'Technical / Functional Competence',
    description: '특정 직무 분야에서 높은 수준의 전문성과 고도의 기술적 역량을 쌓고 발휘하는 데서 가장 큰 성취감을 얻는 성향입니다.',
    icon: 'wrench',
    color: '#091426',
    bgClass: 'bg-primary-container text-on-primary',
    badgeClass: 'bg-primary-container text-on-primary',
  },
  GM: {
    code: 'GM',
    name: '총괄 관리 역량',
    shortName: '관리자',
    tag: '#총괄관리형',
    englishName: 'General Managerial Competence',
    description: '조직 전반을 관리하고 리더십을 발휘하여 목표를 달성하고 종합적인 의사결정과 성과 창출에 책임을 지는 성향입니다.',
    icon: 'briefcase',
    color: '#1E293B',
    bgClass: 'bg-anchor-deep-indigo text-white',
    badgeClass: 'bg-anchor-deep-indigo text-white',
  },
  AU: {
    code: 'AU',
    name: '자율성 / 독립성',
    shortName: '자율/독립',
    tag: '#자율_독립형',
    englishName: 'Autonomy / Independence',
    description: '엄격한 규칙이나 과도한 감독 없이 자신만의 방식과 속도로 자유롭게 업무를 계획하고 실행할 때 퍼포먼스가 극대화되는 성향입니다.',
    icon: 'compass',
    color: '#2DD4BF',
    bgClass: 'bg-surface-container-high text-primary',
    badgeClass: 'bg-growth-mint/20 text-secondary font-bold border border-growth-mint/40',
  },
  SE: {
    code: 'SE',
    name: '보안 / 안정성',
    shortName: '안정',
    tag: '#안정형',
    englishName: 'Security / Stability',
    description: '조직의 안정성, 신뢰성, 지속가능한 보상체계 및 예측 가능한 근무 환경에서 안도감과 충성도를 가지는 성향입니다.',
    icon: 'shield-check',
    color: '#3B82F6',
    bgClass: 'bg-surface-container-high text-primary',
    badgeClass: 'bg-info-blue/10 text-info-blue font-bold border border-info-blue/30',
  },
  EC: {
    code: 'EC',
    name: '창업가적 창의성',
    shortName: '창업가',
    tag: '#창업가형',
    englishName: 'Entrepreneurial Creativity',
    description: '새로운 비즈니스, 제품, 신규 서비스를 무에서 유로 창조해내고 위험을 감수하면서 자신의 사업을 일구고자 하는 성향입니다.',
    icon: 'lightbulb',
    color: '#F59E0B',
    bgClass: 'bg-amber-100 text-amber-900',
    badgeClass: 'bg-amber-100 text-amber-800 font-bold border border-amber-300',
  },
  SV: {
    code: 'SV',
    name: '봉사 / 사회적 헌신',
    shortName: '봉사/헌신',
    tag: '#사회헌신형',
    englishName: 'Service / Dedication to a Cause',
    description: '사회적 문제 해결, 타인에 대한 지원, 혹은 보다 나은 가치 창출을 위해 자신의 일과 기여를 결합하고자 하는 성향입니다.',
    icon: 'heart',
    color: '#EC4899',
    bgClass: 'bg-rose-100 text-rose-900',
    badgeClass: 'bg-rose-100 text-rose-800 font-bold border border-rose-300',
  },
  CH: {
    code: 'CH',
    name: '순수한 도전',
    shortName: '순수도전',
    tag: '#도전형',
    englishName: 'Pure Challenge',
    description: '극도의 어려운 문제 극복, 치열한 경쟁에서의 승리, 불가능해 보이는 한계를 넘어서는 과정 자체에서 강한 동기를 얻는 성향입니다.',
    icon: 'zap',
    color: '#E11D48',
    bgClass: 'bg-red-100 text-red-900',
    badgeClass: 'bg-red-100 text-red-800 font-bold border border-red-300',
  },
  LS: {
    code: 'LS',
    name: '라이프스타일 균형',
    shortName: '라이프스타일',
    tag: '#워라밸형',
    englishName: 'Lifestyle Integration',
    description: '커리어적 성공뿐만 아니라 개인의 삶, 가정, 취미, 자기계발 간의 유연한 균형과 조화를 최우선 가치로 두는 성향입니다.',
    icon: 'sun',
    color: '#10B981',
    bgClass: 'bg-emerald-100 text-emerald-900',
    badgeClass: 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300',
  },
};

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  // 1-5: TF (전문가/기술 역량)
  { id: 1, anchorCode: 'TF', text: '내가 맡고 있는 일의 전문성을 지속적으로 발전시켜 해당 분야의 최고 전문가로 인정받고 싶다.' },
  { id: 2, anchorCode: 'TF', text: '내가 맡고 있는 일을 매우 잘해서 다른 사람들에게 전문적인 조언을 해주고 싶다.' },
  { id: 3, anchorCode: 'TF', text: '일반 관리 업무로 승진하는 것보다 내 전공과 전문 역량을 계속 깊이 있게 발휘하는 것이 더 중요하다.' },
  { id: 4, anchorCode: 'TF', text: '고도의 전문 지식과 기술적 난이도가 필요한 복잡한 실무 과제를 해결할 때 큰 보람을 느낀다.' },
  { id: 5, anchorCode: 'TF', text: '나의 커리어 성공은 관리자의 직급이 아니라 내 실무 역량의 우수성에 의해 결정된다고 믿는다.' },

  // 6-10: GM (총괄 관리 역량)
  { id: 6, anchorCode: 'GM', text: '조직 전반의 성과와 여러 부서의 업무를 총괄 관리하는 리더 역할을 맡고 싶다.' },
  { id: 7, anchorCode: 'GM', text: '주요 경영 의사결정을 내리고 조직의 성패에 대해 최종 책임을 지는 것을 주저하지 않는다.' },
  { id: 8, anchorCode: 'GM', text: '다양한 직무의 사람들을 이끌고 그들의 역량을 통합하여 큰 목표를 달성하는 데 자신이 있다.' },
  { id: 9, anchorCode: 'GM', text: '조직 상급자로 승진하여 더 큰 권한과 종합적인 관리 책임을 갖는 것이 커리어의 주된 목표다.' },
  { id: 10, anchorCode: 'GM', text: '특정 분야의 기술적 세부사항보다는 비즈니스 전반의 전략적 지형을 파악하는 것이 즐겁다.' },

  // 11-15: AU (자율성/독립성)
  { id: 11, anchorCode: 'AU', text: '타인의 지나친 간섭이나 통제 없이 나만의 방식과 일정대로 일할 수 있는 환경이 필수적이다.' },
  { id: 12, anchorCode: 'AU', text: '엄격한 사규나 마이크로매니지먼트가 있는 조직보다는 자율성이 높은 환경을 강력히 선호한다.' },
  { id: 13, anchorCode: 'AU', text: '목표만 명확히 주어진다면, 그 과정과 실행 방법은 스스로 결정하여 진행할 때 능률이 오른다.' },
  { id: 14, anchorCode: 'AU', text: '조직의 관료적인 승인 절차에 맞춰 일하는 것에 답답함과 커다란 스트레스를 느낀다.' },
  { id: 15, anchorCode: 'AU', text: '높은 연봉이나 권한보다 내 일에 대한 자유로운 주도권과 독립성이 커리어 선택의 최우선 조건이다.' },

  // 16-20: SE (보안/안정성)
  { id: 16, anchorCode: 'SE', text: '안정적인 고용 보장과 예측 가능한 보상 체계가 갖춰진 직장을 선호한다.' },
  { id: 17, anchorCode: 'SE', text: '갑작스러운 조직 개편이나 불확실한 변화보다는 규율과 예측 가능성이 높은 직장이 안도감을 준다.' },
  { id: 18, anchorCode: 'SE', text: '한 회사나 기관에서 오래 근무하며 안정적인 경력과 지속성을 쌓아가는 것을 가치 있게 여긴다.' },
  { id: 19, anchorCode: 'SE', text: '리스크가 큰 도전적인 보상보다 차근차근 안정적으로 누적되는 혜택과 복지를 원한다.' },
  { id: 20, anchorCode: 'SE', text: '나의 노력이 정당하게 보장되고 생활의 재정적 안정성을 든든하게 받쳐주는 조직을 원한다.' },

  // 21-25: EC (창업가적 창의성)
  { id: 21, anchorCode: 'EC', text: '나만의 독창적인 아이디어로 새로운 사업이나 제품, 신규 서비스를 직접 만들고 싶다.' },
  { id: 22, anchorCode: 'EC', text: '남이 만들어 놓은 틀 안에서 일하기보다 무에서 유를 창조하는 창업가적 도전을 열망한다.' },
  { id: 23, anchorCode: 'EC', text: '성과에 대한 리스크를 직접 지더라도, 내 노력으로 가치가 창출되는 내 비즈니스를 소유하고 싶다.' },
  { id: 24, anchorCode: 'EC', text: '기존의 방식을 개선하는 수준을 넘어 완전히 새로운 시장이나 기회를 개척하는 것에 가슴이 뛴다.' },
  { id: 25, anchorCode: 'EC', text: '언젠가는 나 자신의 이름이나 내 주도로 시작된 독립적인 프로젝트/회사를 운영할 것이다.' },

  // 26-30: SV (봉사/사회적 헌신)
  { id: 26, anchorCode: 'SV', text: '내 업무가 사회적으로 가치 있고 타인의 삶을 개선하는 데 실질적인 기여를 하길 원한다.' },
  { id: 27, anchorCode: 'SV', text: '단순히 돈을 버는 것보다 세상이나 타인을 돕는 유의미한 목적이 커리어 선택의 중요한 기준이다.' },
  { id: 28, anchorCode: 'SV', text: '사회적 문제나 타인의 어려움을 해결하는 미션을 가진 조직에서 일할 때 큰 보람을 느낀다.' },
  { id: 29, anchorCode: 'SV', text: '내 기술과 전문 역량이 긍정적인 사회적 영향력(Social Impact)을 만들어내길 바란다.' },
  { id: 30, anchorCode: 'SV', text: '조직의 목표가 나의 개인적 윤리관이나 사회적 가치관과 일치하지 않으면 일하기 어렵다.' },

  // 31-35: CH (순수한 도전)
  { id: 31, anchorCode: 'CH', text: '남들이 해결하지 못한 매우 어렵고 전례 없는 과제를 해결할 때 극도의 몰입감을 느낀다.' },
  { id: 32, anchorCode: 'CH', text: '경쟁이 치열하고 도전적인 목표가 제시될수록 오히려 승부욕과 에너지 수준이 높아진다.' },
  { id: 33, anchorCode: 'CH', text: '쉬운 업무를 반복하기보다는 계속해서 새로운 한계에 부딪히고 극복하는 자극을 원한다.' },
  { id: 34, anchorCode: 'CH', text: '내 능력을 시험할 수 있는 거칠고 복잡한 문제 상황이 나를 성장시키는 엔진이다.' },
  { id: 35, anchorCode: 'CH', text: '어려운 장애물을 뛰어넘어 승리와 성과를 이루어낼 때 가장 커다란 기쁨을 느낀다.' },

  // 36-40: LS (라이프스타일 균형)
  { id: 36, anchorCode: 'LS', text: '커리어에서의 성공도 중요하지만 개인 생활, 건강, 가정과의 균형이 무엇보다 중요하다.' },
  { id: 37, anchorCode: 'LS', text: '유연한 근무 시간과 장소 활용 등 일과 삶의 라이프스타일 통합이 잘 보장되기를 희망한다.' },
  { id: 38, anchorCode: 'LS', text: '직장 생활 때문에 개인적인 가치나 가족과의 소중한 시간을 희생하고 싶지 않다.' },
  { id: 39, anchorCode: 'LS', text: '내 재량으로 일의 우선순위를 조절하여 커리어와 휴식, 자기계발을 유연하게 배분하고 싶다.' },
  { id: 40, anchorCode: 'LS', text: '일과 삶의 조화로운 일상(Work-Life Harmony)을 선사하는 조직 환경을 최우선으로 고려한다.' },
];

export function calculateScores(answers: AssessmentAnswers): Record<AnchorCode, number> {
  const scores: Record<AnchorCode, number> = {
    TF: 0, GM: 0, AU: 0, SE: 0, EC: 0, SV: 0, CH: 0, LS: 0,
  };

  DIAGNOSTIC_QUESTIONS.forEach((q) => {
    const val = answers[q.id] || 0;
    scores[q.anchorCode] += val;
  });

  return scores;
}

export function getAnchorScoresList(answers: AssessmentAnswers): AnchorScore[] {
  const rawScores = calculateScores(answers);
  const totalQuestionsPerAnchor = 5;
  const maxScorePerAnchor = totalQuestionsPerAnchor * 4; // 20

  const codes: AnchorCode[] = ['TF', 'GM', 'AU', 'SE', 'EC', 'SV', 'CH', 'LS'];

  return codes.map((code) => {
    const info = ANCHOR_DEFINITIONS[code];
    const score = rawScores[code];
    const percentage = Math.round((score / maxScorePerAnchor) * 100);

    return {
      code,
      name: info.name,
      shortName: info.shortName,
      tag: info.tag,
      score,
      percentage,
    };
  }).sort((a, b) => b.score - a.score);
}

export function getAnchorScoresListFromRecord(scoresRecord?: Record<AnchorCode, number>): AnchorScore[] {
  if (!scoresRecord) return [];
  const maxScorePerAnchor = 20;
  const codes: AnchorCode[] = ['TF', 'GM', 'AU', 'SE', 'EC', 'SV', 'CH', 'LS'];

  return codes.map((code) => {
    const info = ANCHOR_DEFINITIONS[code];
    const score = scoresRecord[code] ?? 0;
    const percentage = Math.round((score / maxScorePerAnchor) * 100);

    return {
      code,
      name: info ? info.name : code,
      shortName: info ? info.shortName : code,
      tag: info ? info.tag : `#${code}`,
      score,
      percentage,
    };
  }).sort((a, b) => b.score - a.score);
}

export const LIKERT_OPTIONS: { value: LikertValue; label: string; number: string }[] = [
  { value: 1, label: '전혀 아니다', number: '1' },
  { value: 2, label: '아니다', number: '2' },
  { value: 3, label: '그렇다', number: '3' },
  { value: 4, label: '항상 그렇다', number: '4' },
];

export const JOB_RECOMMENDATION_EXEMPLARS = [
  '서비스 기획자',
  '데이터 분석가',
  '프론트엔드 개발자',
  '백엔드 개발자',
  '브랜드 마케터',
  'B2B 영업 대표',
  'R&D 연구원',
  'HR / 조직문화 담당자',
  '전략 컨설턴트',
  '스타트업 창업가',
];

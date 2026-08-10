import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AIReport, AnchorScore } from '../types';
import { ANCHOR_DEFINITIONS } from '../data/anchors';
import { RadarChart } from './RadarChart';
import { Download, Share2, RotateCcw, Briefcase, AlertTriangle, Lightbulb, Compass, Award, Check, Sparkles, FileText, ChevronRight, Loader2, Printer } from 'lucide-react';

interface ReportViewProps {
  targetJob: string;
  topAnchors: AnchorScore[];
  allScores: AnchorScore[];
  report: AIReport;
  isAiGenerated?: boolean;
  onRetake: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  targetJob,
  topAnchors,
  allScores,
  report,
  isAiGenerated = true,
  onRetake,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = async () => {
    const shareText = `[AnchorMe 커리어 앵커 진단 리포트]\n희망직무: ${targetJob}\n상위 앵커: ${topAnchors
      .map((a) => a.tag)
      .join(', ')}\n${report.primaryProfileSummary}`;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast('리포트 요약 내용이 클립보드에 복사되었습니다!');
      } catch (e) {
        showToast('클립보드 복사에 실패했습니다.');
      }
    } else {
      showToast('공유하기 기능이 지원되었습니다.');
    }
  };

  const handleExportPdf = async () => {
    if (!reportRef.current || isExportingPdf) return;
    setIsExportingPdf(true);
    showToast('PDF 리포트를 생성하고 있습니다. 잠시만 기다려주세요...');

    const safeJobName = targetJob.replace(/[^a-zA-Z0-KR0-9가-힣]/g, '_');
    const fileName = `AnchorMe_커리어_리포트_${safeJobName}.pdf`;

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-pdf-content]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.width = '850px';
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.padding = '36px';
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.borderRadius = '0px';
            clonedElement.style.boxShadow = 'none';
          }
        },
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 10;
      const printWidth = pdfWidth - margin * 2; // 190mm
      const printHeight = pdfHeight - margin * 2; // 277mm

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Height of one A4 printable area in canvas pixels
      const pageCanvasHeight = (canvasWidth * printHeight) / printWidth;

      let renderedHeight = 0;
      let pageIndex = 0;

      while (renderedHeight < canvasHeight) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const currentChunkHeight = Math.min(pageCanvasHeight, canvasHeight - renderedHeight);

        const chunkCanvas = document.createElement('canvas');
        chunkCanvas.width = canvasWidth;
        chunkCanvas.height = pageCanvasHeight;
        const chunkCtx = chunkCanvas.getContext('2d');

        if (chunkCtx) {
          chunkCtx.fillStyle = '#ffffff';
          chunkCtx.fillRect(0, 0, chunkCanvas.width, chunkCanvas.height);
          chunkCtx.drawImage(
            canvas,
            0,
            renderedHeight,
            canvasWidth,
            currentChunkHeight,
            0,
            0,
            canvasWidth,
            currentChunkHeight
          );

          const chunkData = chunkCanvas.toDataURL('image/png');
          pdf.addImage(chunkData, 'PNG', margin, margin, printWidth, printHeight);
        }

        renderedHeight += pageCanvasHeight;
        pageIndex++;
      }

      pdf.save(fileName);
      showToast('PDF 리포트 다운로드가 완료되었습니다!');
    } catch (error) {
      console.error('HTML2Canvas PDF generation error, trying fallback PDF draw:', error);
      
      // Complete Fallback Canvas PDF Generation including all report details
      try {
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 1200;
        fallbackCanvas.height = 2600;
        const ctx = fallbackCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);

          // Header
          ctx.fillStyle = '#091426';
          ctx.fillRect(0, 0, fallbackCanvas.width, 120);

          ctx.fillStyle = '#2DD4BF';
          ctx.font = 'bold 36px sans-serif';
          ctx.fillText('AnchorMe 커리어 앵커 분석 리포트', 60, 70);

          let y = 180;

          // Job Info & Title
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 26px sans-serif';
          ctx.fillText(`희망 직무: ${targetJob}`, 60, y);
          y += 45;

          // Summary Section
          ctx.font = 'bold 22px sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText('■ 핵심 종합 요약', 60, y);
          y += 35;

          ctx.font = '18px sans-serif';
          ctx.fillStyle = '#334155';
          const summaryLines = report.primaryProfileSummary.match(/.{1,50}/g) || [report.primaryProfileSummary];
          summaryLines.forEach((line) => {
            ctx.fillText(line, 60, y);
            y += 30;
          });
          y += 20;

          // Top Anchors & 8 Scores Header
          ctx.font = 'bold 22px sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText('■ 8가지 커리어 앵커 밸런스 및 점수 상세', 60, y);
          y += 35;

          // Draw Radar Chart on Fallback Canvas
          ctx.save();
          const chartCenterX = 600;
          const chartCenterY = y + 140;
          const chartRadius = 110;

          // Draw Grid Rings
          [0.25, 0.5, 0.75, 1.0].forEach((ringFactor) => {
            const r = chartRadius * ringFactor;
            ctx.beginPath();
            const orderedCodes: AnchorCode[] = ['TF', 'GM', 'AU', 'SE', 'EC', 'SV', 'CH', 'LS'];
            orderedCodes.forEach((code, i) => {
              const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
              const px = chartCenterX + r * Math.cos(angle);
              const py = chartCenterY + r * Math.sin(angle);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.closePath();
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });

          // Draw Axis Lines
          const orderedCodes: AnchorCode[] = ['TF', 'GM', 'AU', 'SE', 'EC', 'SV', 'CH', 'LS'];
          orderedCodes.forEach((code, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
            const ax = chartCenterX + chartRadius * Math.cos(angle);
            const ay = chartCenterY + chartRadius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(chartCenterX, chartCenterY);
            ctx.lineTo(ax, ay);
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          });

          // Draw Data Polygon
          const scoreMap = new Map();
          allScores.forEach((s) => scoreMap.set(s.code, s.score));

          ctx.beginPath();
          orderedCodes.forEach((code, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
            const score = scoreMap.get(code) || 0;
            const percentage = Math.min(Math.max((score / 20) * 100, 10), 100);
            const r = (chartRadius * percentage) / 100;
            const px = chartCenterX + r * Math.cos(angle);
            const py = chartCenterY + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.fillStyle = 'rgba(45, 212, 191, 0.35)';
          ctx.fill();
          ctx.strokeStyle = '#2DD4BF';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw Labels
          ctx.font = 'bold 15px sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          orderedCodes.forEach((code, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
            const lx = chartCenterX + (chartRadius + 32) * Math.cos(angle);
            const ly = chartCenterY + (chartRadius + 32) * Math.sin(angle);
            const info = ANCHOR_DEFINITIONS[code];
            ctx.fillText(info ? info.shortName : code, lx, ly);
          });
          ctx.restore();

          y += 310;

          allScores.forEach((s) => {
            ctx.font = '18px sans-serif';
            ctx.fillStyle = '#1e293b';
            ctx.fillText(`• [${s.code}] ${s.name} (${s.shortName}): ${s.score}점`, 80, y);
            y += 28;
          });
          y += 20;

          // Job Synergy
          ctx.font = 'bold 22px sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText(`■ 직무 적합도 및 시너지 (${targetJob})`, 60, y);
          y += 35;

          ctx.font = '18px sans-serif';
          ctx.fillStyle = '#334155';
          const synergyLines = report.jobSynergy.match(/.{1,50}/g) || [report.jobSynergy];
          synergyLines.forEach((line) => {
            ctx.fillText(line, 60, y);
            y += 30;
          });
          y += 20;

          // Stress Factors
          ctx.font = 'bold 22px sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText('■ 스트레스 요인 및 극복', 60, y);
          y += 35;

          ctx.font = '18px sans-serif';
          ctx.fillStyle = '#334155';
          const stressLines = report.stressFactors.match(/.{1,50}/g) || [report.stressFactors];
          stressLines.forEach((line) => {
            ctx.fillText(line, 60, y);
            y += 30;
          });
          y += 20;

          // Interview Tips
          ctx.font = 'bold 22px sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText('■ 자소서 & 면접 어필 팁', 60, y);
          y += 35;

          ctx.font = '18px sans-serif';
          ctx.fillStyle = '#334155';
          const tipLines = report.interviewTips.match(/.{1,50}/g) || [report.interviewTips];
          tipLines.forEach((line) => {
            ctx.fillText(line, 60, y);
            y += 30;
          });
          y += 20;

          // Roadmap
          if (report.roadmap && report.roadmap.length > 0) {
            ctx.font = 'bold 22px sans-serif';
            ctx.fillStyle = '#0f172a';
            ctx.fillText('■ 커리어 성장 실행 로드맵', 60, y);
            y += 35;

            report.roadmap.forEach((step, idx) => {
              ctx.font = '18px sans-serif';
              ctx.fillStyle = '#334155';
              const stepLines = `${idx + 1}. ${step}`.match(/.{1,50}/g) || [`${idx + 1}. ${step}`];
              stepLines.forEach((line) => {
                ctx.fillText(line, 80, y);
                y += 28;
              });
            });
            y += 20;
          }

          // Recommended Jobs
          if (report.recommendedJobs && report.recommendedJobs.length > 0) {
            ctx.font = 'bold 22px sans-serif';
            ctx.fillStyle = '#0f172a';
            ctx.fillText('■ 추천 연관 직무', 60, y);
            y += 35;

            ctx.font = '18px sans-serif';
            ctx.fillStyle = '#334155';
            ctx.fillText(report.recommendedJobs.join(', '), 80, y);
          }

          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const margin = 10;
          const printWidth = pdfWidth - margin * 2;
          const printHeight = pdfHeight - margin * 2;

          const pageCanvasHeight = (fallbackCanvas.width * printHeight) / printWidth;
          let renderedHeight = 0;
          let pageIndex = 0;

          while (renderedHeight < y + 100) {
            if (pageIndex > 0) {
              pdf.addPage();
            }

            const currentChunkHeight = Math.min(pageCanvasHeight, fallbackCanvas.height - renderedHeight);
            const chunkCanvas = document.createElement('canvas');
            chunkCanvas.width = fallbackCanvas.width;
            chunkCanvas.height = pageCanvasHeight;
            const chunkCtx = chunkCanvas.getContext('2d');

            if (chunkCtx) {
              chunkCtx.fillStyle = '#ffffff';
              chunkCtx.fillRect(0, 0, chunkCanvas.width, chunkCanvas.height);
              chunkCtx.drawImage(
                fallbackCanvas,
                0,
                renderedHeight,
                fallbackCanvas.width,
                currentChunkHeight,
                0,
                0,
                fallbackCanvas.width,
                currentChunkHeight
              );

              const chunkData = chunkCanvas.toDataURL('image/png');
              pdf.addImage(chunkData, 'PNG', margin, margin, printWidth, printHeight);
            }

            renderedHeight += pageCanvasHeight;
            pageIndex++;
          }

          pdf.save(fileName);
          showToast('PDF 리포트가 성공적으로 다운로드되었습니다.');
        } else {
          throw new Error('Could not create canvas context');
        }
      } catch (fallbackError) {
        console.error('Fallback PDF failed:', fallbackError);
        showToast('PDF 리포트 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      handleExportPdf();
    }
  };

  return (
    <div className="w-full max-w-[768px] mx-auto px-container-margin py-stack-md flex flex-col gap-stack-lg animate-fade-in print:p-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-5 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce-short border border-growth-mint/30">
          <Check className="w-4 h-4 text-growth-mint" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Report Content Container targeted by PDF Ref */}
      <div ref={reportRef} data-pdf-content="true" className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col gap-stack-lg">
        {/* Title Section */}
        <section className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-growth-mint/10 text-secondary text-xs font-bold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-growth-mint" />
            <span>{targetJob} 맞춤 분석 리포트</span>
          </div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary font-bold mb-2 tracking-tight">
            당신의 커리어 앵커 리포트
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            8가지 커리어 동기 분석이 완료되었습니다. 핵심 가치를 확인하세요.
          </p>
        </section>

        {/* Top Summary Card */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6 sm:p-8 flex flex-col items-center gap-4">
          {/* Top 3 Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {topAnchors.slice(0, 3).map((a, idx) => (
              <span
                key={a.code}
                className={`px-4 py-2 rounded-full font-label-md text-sm font-bold shadow-xs ${
                  idx === 0
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-high text-primary border border-outline-variant'
                }`}
              >
                {a.tag}
              </span>
            ))}
          </div>

          <p className="font-body-md text-body-md text-center text-on-surface-variant leading-relaxed max-w-xl">
            {report.primaryProfileSummary}
          </p>

          {isAiGenerated && (
            <div className="flex items-center gap-1.5 text-[11px] text-growth-mint font-semibold bg-growth-mint/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-growth-mint" />
              <span>Gemini AI 심층 맞춤 해설 제공</span>
            </div>
          )}
        </section>

        {/* 8 Career Anchors Radar Chart Section */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6 sm:p-8">
          <h3 className="font-headline-md text-headline-md text-primary font-bold mb-6 text-center">
            8가지 커리어 앵커 밸런스
          </h3>

          <div className="mb-4">
            <RadarChart scores={allScores} />
          </div>

          {/* Detailed Breakdown List */}
          <div className="mt-8 border-t border-outline-variant/60 pt-6">
            <h4 className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider mb-3">
              앵커별 점수 상세
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {allScores.map((s) => (
                <div
                  key={s.code}
                  className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/50 flex flex-col items-center text-center"
                >
                  <span className="text-[11px] font-bold text-growth-mint">{s.code}</span>
                  <span className="text-xs font-bold text-primary">{s.shortName}</span>
                  <span className="text-sm font-black text-primary mt-0.5">{s.score}점</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Deep Analysis Section */}
        <section className="flex flex-col gap-5">
          <div className="border-b border-outline-variant pb-2">
            <h3 className="font-headline-md text-headline-md text-primary font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-growth-mint" />
              <span>AI 심층 커리어 분석</span>
            </h3>
          </div>

          {/* 1. 직무 적합도 및 시너지 */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-3 text-growth-mint">
              <div className="w-8 h-8 rounded-lg bg-growth-mint/15 flex items-center justify-center">
                <Award className="w-5 h-5 text-growth-mint" />
              </div>
              <h4 className="font-headline-md text-headline-md text-primary font-bold">
                직무 적합도 및 시너지 ({targetJob})
              </h4>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {report.jobSynergy}
            </p>
          </div>

          {/* 2. 스트레스 요인 및 극복 */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-3 text-error-rose">
              <div className="w-8 h-8 rounded-lg bg-error-rose/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-error-rose" />
              </div>
              <h4 className="font-headline-md text-headline-md text-primary font-bold">
                스트레스 요인 및 극복
              </h4>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {report.stressFactors}
            </p>
          </div>

          {/* 3. 자소서 & 면접 팁 */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-3 text-info-blue">
              <div className="w-8 h-8 rounded-lg bg-info-blue/15 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-info-blue" />
              </div>
              <h4 className="font-headline-md text-headline-md text-primary font-bold">
                자소서 & 면접 어필 팁
              </h4>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {report.interviewTips}
            </p>
          </div>

          {/* 4. 커리어 실행 로드맵 */}
          {report.roadmap && report.roadmap.length > 0 && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-4 text-secondary">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-secondary" />
                </div>
                <h4 className="font-headline-md text-headline-md text-primary font-bold">
                  커리어 성장 실행 로드맵
                </h4>
              </div>

              <div className="space-y-3">
                {report.roadmap.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/60">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-on-surface-variant font-medium leading-normal">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Recommended Jobs */}
          {report.recommendedJobs && report.recommendedJobs.length > 0 && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6">
              <h4 className="font-headline-md text-headline-md text-primary font-bold mb-3">
                추천 연관 직무
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.recommendedJobs.map((job) => (
                  <span key={job} className="px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold text-primary">
                    {job}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Action Buttons */}
      <section className="flex flex-col sm:flex-row gap-3 justify-center mt-2 print:hidden">
        <button
          onClick={handleExportPdf}
          disabled={isExportingPdf}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-xl font-label-md font-bold hover:bg-primary/90 transition-all flex-1 shadow-sm disabled:opacity-50"
        >
          {isExportingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-growth-mint" />
              <span>PDF 저장 중...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>PDF 다운로드 / 저장</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-container-high text-primary border border-outline-variant rounded-xl font-label-md font-semibold hover:bg-surface-variant transition-colors flex-1"
        >
          <Printer className="w-4 h-4" />
          <span>페이지 인쇄</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-container-high text-primary border border-outline-variant rounded-xl font-label-md font-semibold hover:bg-surface-variant transition-colors flex-1"
        >
          <Share2 className="w-4 h-4" />
          <span>결과 공유</span>
        </button>

        <button
          onClick={onRetake}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-container-lowest text-error-rose border border-error-rose/40 rounded-xl font-label-md font-semibold hover:bg-error-rose/10 transition-colors flex-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시하기</span>
        </button>
      </section>
    </div>
  );
};

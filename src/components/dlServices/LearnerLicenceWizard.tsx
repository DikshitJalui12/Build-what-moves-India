import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Award,
  Download,
  ShieldCheck,
  Bike,
  Car,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, LearnerMockQuestion } from '../../types';
import { LEARNER_MOCK_QUESTIONS } from '../../data/mockData';
import { generateAppNumber } from '../../utils/helpers';

export const LearnerLicenceWizard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { user, addApplication, openPaymentModal, openReceiptModal, t } = useApp();

  const [step, setStep] = useState(1);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['MCWG', 'LMV']);

  // Mock Test State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<Application | null>(null);

  const totalFee = 250; // ₹200 LL Fee + ₹50 online test portal fee

  // Timer countdown during mock test
  useEffect(() => {
    if (step === 3 && !testCompleted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, testCompleted, timeLeft]);

  const handleClassToggle = (cls: string) => {
    if (selectedClasses.includes(cls)) {
      if (selectedClasses.length > 1) {
        setSelectedClasses(selectedClasses.filter((c) => c !== cls));
      }
    } else {
      setSelectedClasses([...selectedClasses, cls]);
    }
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [qIndex]: optionIndex,
    });
  };

  const handleFinishTest = () => {
    let correctCount = 0;
    LEARNER_MOCK_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const passed = correctCount >= 9; // 60% passing mark out of 15
    setScore(correctCount);
    setTestPassed(passed);
    setTestCompleted(true);
  };

  const handleProceedToPayment = () => {
    openPaymentModal(
      'New Learner’s Licence Application & e-Test Fee',
      {
        baseFee: 200,
        userCharges: 50,
        roadTax: 0,
        postalFee: 0,
        total: totalFee,
      },
      (receipt) => {
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber('DL01-LL'),
          serviceType: 'New Learner’s Licence (LL) Issuance',
          serviceCategory: 'dl',
          applicantName: user?.name || 'Citizen',
          applicantMobile: user?.mobile || '+91 9876543210',
          applicantAadhaarMasked: user?.aadhaar || 'XXXX-XXXX-8924',
          rtoCode: 'DL-01',
          rtoName: 'RTO Mall Road',
          state: 'Delhi',
          submittedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          currentStage: 'APPROVED',
          stages: [
            {
              stageKey: 'SUBMITTED',
              stageName: 'Aadhaar e-KYC Verified',
              timestamp: 'Just now',
              status: 'completed',
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'Statutory LL Application Fee Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${totalFee} paid via BharatKosh`,
            },
            {
              stageKey: 'INSPECTION_OR_TEST',
              stageName: 'Online Road Safety & Traffic Regulations Test',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `Score: ${score}/15 (PASSED)`,
            },
            {
              stageKey: 'APPROVED',
              stageName: 'Digital Learner’s Licence Issued to Vault',
              timestamp: 'Just now',
              status: 'completed',
              remarks: 'Valid for 6 Months across India',
            },
          ],
          documents: [
            {
              name: 'Provisional Learner’s Licence (Form 3)',
              type: 'PDF',
              url: 'mock://form3_ll.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
            {
              name: 'Aadhaar e-KYC Verification Certificate',
              type: 'PDF',
              url: 'mock://aadhaar_ekyc.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: 200,
            userCharges: 50,
            roadTax: 0,
            postalSmartcardFee: 0,
            total: totalFee,
            paymentStatus: 'PAID',
            transactionId: receipt.transactionId,
            paymentDate: new Date().toLocaleString('en-IN'),
            receiptNo: receipt.receiptNo,
          },
          estimatedCompletionDate: new Date().toISOString().split('T')[0],
        };

        addApplication(newApp);
        setGeneratedApp(newApp);
        setIsSuccess(true);
      }
    );
  };

  if (isSuccess && generatedApp) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <Award className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full uppercase">
            Learner’s Licence Generated
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            Congratulations! LL Issued Successfully
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Learner Licence Number:{' '}
            <strong className="font-mono text-blue-950 text-base">{generatedApp.applicationNo}</strong>
          </p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-left text-xs space-y-1 text-emerald-950">
          <div className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Authorized Vehicle Classes: {selectedClasses.join(', ')}</span>
          </div>
          <p>• Valid for 6 Months across all Indian States & UTs.</p>
          <p>• You can apply for a Permanent Driving Licence after 30 days.</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() =>
              openReceiptModal({
                receiptNo: generatedApp.feeDetails.receiptNo,
                applicationNo: generatedApp.applicationNo,
                serviceType: generatedApp.serviceType,
                applicantName: user?.name,
                amount: totalFee,
                transactionId: generatedApp.feeDetails.transactionId,
                date: generatedApp.feeDetails.paymentDate,
                rtoName: generatedApp.rtoName,
              })
            }
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Provisional Form 3 (LL)</span>
          </button>
          <button
            onClick={onCancel}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">New Learner’s Licence (LL) Application</h2>
            <p className="text-xs text-blue-200">
              100% Online Aadhaar e-KYC & Interactive RTO Mock Test
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg"
        >
          Cancel
        </button>
      </div>

      {/* Stepper Progress */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-bold">
        {[
          { num: 1, title: 'e-KYC Details' },
          { num: 2, title: 'Select Vehicle Classes' },
          { num: 3, title: 'RTO Mock Test' },
          { num: 4, title: 'Fee Payment' },
        ].map((st) => (
          <div
            key={st.num}
            className={`flex items-center gap-2 ${
              step >= st.num ? 'text-blue-900 font-extrabold' : 'text-slate-400 font-medium'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step > st.num
                  ? 'bg-emerald-600 text-white'
                  : step === st.num
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > st.num ? '✓' : st.num}
            </span>
            <span className="hidden sm:inline">{st.title}</span>
          </div>
        ))}
      </div>

      {/* Wizard Content */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: Aadhaar e-KYC Verification */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {t.step} 1: Aadhaar Paperless e-KYC Auto-Fill
              </h3>
              <p className="text-xs text-slate-500">
                Your authenticated citizen credentials from UIDAI have been securely pre-populated.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">APPLICANT NAME</span>
                <span className="font-bold text-slate-900 text-sm">{user?.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">AADHAAR NUMBER</span>
                <span className="font-bold text-slate-900 font-mono">{user?.aadhaar}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">REGISTERED MOBILE</span>
                <span className="font-bold text-slate-900">{user?.mobile}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">STATE & JURISDICTION</span>
                <span className="font-bold text-slate-900">{user?.state} • Delhi RTO</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 block">PERMANENT RESIDENCE ADDRESS</span>
                <span className="font-bold text-slate-900">{user?.address}, {user?.district} - {user?.pincode}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>No physical documents required. e-KYC verified via Aadhaar.</span>
            </div>
          </div>
        )}

        {/* STEP 2: Vehicle Class Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {t.step} 2: Select Vehicle Classes for Learner Licence
              </h3>
              <p className="text-xs text-slate-500">
                Choose the categories of vehicles you intend to learn and drive.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => handleClassToggle('MCWG')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                  selectedClasses.includes('MCWG')
                    ? 'border-blue-900 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                    <Bike className="w-5 h-5" />
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes('MCWG')}
                    readOnly
                    className="w-4 h-4 text-blue-900"
                  />
                </div>
                <h4 className="font-bold text-xs text-slate-900">MCWG (Motorcycle With Gear)</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Covers all two-wheelers, motorbikes, scooters, and geared motorcycles.
                </p>
              </div>

              <div
                onClick={() => handleClassToggle('LMV')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                  selectedClasses.includes('LMV')
                    ? 'border-blue-900 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes('LMV')}
                    readOnly
                    className="w-4 h-4 text-blue-900"
                  />
                </div>
                <h4 className="font-bold text-xs text-slate-900">LMV (Light Motor Vehicle)</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Covers private motor cars, sedans, SUVs, hatchbacks, and light utility vehicles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Interactive RTO Mock Test */}
        {step === 3 && (
          <div className="space-y-6">
            {!testCompleted ? (
              <div className="space-y-5">
                {/* Test Timer & Progress Strip */}
                <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">RTO Online LL Test:</span>
                    <span>
                      Question <strong>{currentQuestionIdx + 1}</strong> of {LEARNER_MOCK_QUESTIONS.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const passedAnswers: Record<number, number> = {};
                        LEARNER_MOCK_QUESTIONS.forEach((q, idx) => {
                          passedAnswers[idx] = q.correctAnswerIndex;
                        });
                        setUserAnswers(passedAnswers);
                        setScore(15);
                        setTestPassed(true);
                        setTestCompleted(true);
                      }}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer"
                    >
                      ⚡ Quick Pass (Demo)
                    </button>
                    <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Question Box */}
                {(() => {
                  const q = LEARNER_MOCK_QUESTIONS[currentQuestionIdx];
                  const selectedOpt = userAnswers[currentQuestionIdx];

                  return (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          Q{currentQuestionIdx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {q.question}
                        </h4>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-2">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectAnswer(currentQuestionIdx, optIdx)}
                            className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition flex items-center gap-3 ${
                              selectedOpt === optIdx
                                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                                : 'bg-white text-slate-800 border-slate-300 hover:border-blue-400'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                selectedOpt === optIdx
                                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                                  : 'border-slate-400 text-slate-600'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      {/* Nav between test questions */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                          disabled={currentQuestionIdx === 0}
                          onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                          className="text-xs font-bold text-slate-600 disabled:opacity-30 hover:text-slate-900"
                        >
                          &larr; Previous Question
                        </button>

                        {currentQuestionIdx < LEARNER_MOCK_QUESTIONS.length - 1 ? (
                          <button
                            onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                            className="bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                          >
                            Next Question &rarr;
                          </button>
                        ) : (
                          <button
                            onClick={handleFinishTest}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-5 py-2 rounded-xl shadow-md cursor-pointer animate-bounce"
                          >
                            Submit Test Answers
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Test Results Banner */
              <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                    testPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {testPassed ? <CheckCircle2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {testPassed ? 'Congratulations! You Passed the RTO Test' : 'Score Below 60% - Retake Required'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your Score: <strong className="text-base text-blue-950">{score} / 15</strong> (Passing score: 9/15)
                  </p>
                </div>

                {testPassed ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    You have qualified for provisional Learner’s Licence issuance. Proceed to statutory fee payment to receive your digital Form 3.
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setTestCompleted(false);
                      setCurrentQuestionIdx(0);
                      setUserAnswers({});
                      setTimeLeft(600);
                    }}
                    className="bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Retake Test Now
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Fee Payment */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {t.step} 4: Statutory LL Issuance Fee
              </h3>
              <p className="text-xs text-slate-500">
                Statutory fee for issuing Learner’s Licence across selected classes ({selectedClasses.join(', ')}).
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>Learner Licence Application Fee:</span>
                <span className="font-bold text-slate-900">₹200.00</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>Online Safe Driving Test Charge:</span>
                <span className="font-bold text-slate-900">₹50.00</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2">
                <span>Total Amount Payable:</span>
                <span className="text-emerald-700">₹250.00</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        {step > 1 && step !== 3 ? (
          <button
            onClick={() => setStep((prev) => prev - 1)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : (
          <div></div>
        )}

        {step < 3 ? (
          <button
            onClick={() => setStep((prev) => prev + 1)}
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <span>Continue &rarr;</span>
          </button>
        ) : step === 3 && testCompleted && testPassed ? (
          <button
            onClick={() => setStep(4)}
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Payment &rarr;</span>
          </button>
        ) : step === 4 ? (
          <button
            onClick={handleProceedToPayment}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer animate-pulse"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay ₹250 & Issue Learner’s Licence</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import { useLayerOS } from '@/lib/store';
import {
  CompleteEnrollmentInput,
  MAHARASHTRA_DISTRICTS,
  POULTRY_BREEDS,
  HOUSING_TYPES,
  BUYER_TYPES,
  MANDI_LIST,
  ownerAccountSchema,
  farmDetailsSchema,
  shedsFlocksSchema,
  feedCostsSchema,
  eggSalesUnitsSchema,
  expensesFinanceSchema,
} from '@/lib/enroll/schema';
import { enrollFarmAction, EnrollmentResult } from '@/lib/enroll/actions';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'layeros_enroll_draft_v1';

export function EnrollmentWizard() {
  const navigate = useNavigate();
  const router = { push: (url: string) => navigate(url) };
  const { t, language, setLanguage } = useI18n();
  const { setActiveFarmData } = useLayerOS();

  // Wizard state: Step 1 to 7 (Review is 7, Welcome is 8)
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [completedResult, setCompletedResult] = useState<EnrollmentResult['data'] | null>(null);

  // Form State
  const [formData, setFormData] = useState<CompleteEnrollmentInput>({
    owner: {
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
      acceptTermsAndPrivacy: true as any,
    },
    farm: {
      farmName: '',
      ownerName: '',
      villageTown: '',
      taluka: 'दौंड',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '412219',
      preferredLanguage: 'mr',
    },
    shedsFlocks: {
      numberOfSheds: 1,
      flocks: [
        {
          batchCode: 'Batch-1',
          breed: 'BV300',
          birdsPlaced: 10000,
          currentLiveBirds: 10000,
          ageWeeks: 34,
          housingType: 'elevated_cage',
        },
      ],
    },
    feed: {
      feedBagsPerDay: 22,
      bagSizeKg: 50,
      feedPricePerKg: 35.0,
      feedSupplier: '',
      planningHorizonDays: 30,
      expectedFeedStockKg: 2000,
    },
    sales: {
      traySize: 30,
      traysPerGatta: 7,
      currentSellingPricePerEgg: 5.4,
      mainBuyerType: 'trader',
      nearestMandi: 'Pune',
    },
    finance: {
      monthlyLabour: 25000,
      monthlyMedicine: 10000,
      monthlyElectricity: 8000,
      monthlyOther: 5000,
      monthlyLoanEmi: 0,
      numberOfEmployees: 2,
    },
    honeypot: '',
  });

  // 1. Load draft from sessionStorage on mount (excluding password for security)
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.owner) parsed.owner.password = '';
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => ({
          ...prev,
          ...parsed,
          owner: {
            ...prev.owner,
            ...parsed.owner,
            password: '',
          },
        }));
      }
    } catch {
      // ignore read error
    }
  }, []);

  // 2. Autosave draft to sessionStorage on changes
  useEffect(() => {
    if (step < 8) {
      try {
        const copy = { ...formData };
        if (copy.owner) {
          copy.owner = { ...copy.owner, password: '' }; // Never store password in local draft
        }
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(copy));
      } catch {
        // ignore write error
      }
    }
  }, [formData, step]);

  // 3. Sync step with URL search params (/enroll?step=N) and support Android Back
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlStep = parseInt(params.get('step') || '1', 10);
      if (urlStep >= 1 && urlStep <= 8 && urlStep !== step) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(urlStep);
      }
    } catch {}

    const handlePopState = () => {
      try {
        const p = new URLSearchParams(window.location.search);
        const s = parseInt(p.get('step') || '1', 10);
        if (s >= 1 && s <= 8) {
          setStep(s);
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 4. Confirm before abandoning draft
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step > 1 && step < 8 && formData.farm.farmName) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, formData.farm.farmName]);

  const goToStep = (targetStep: number) => {
    setStep(targetStep);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('step', String(targetStep));
        window.history.pushState({ step: targetStep }, '', url.toString());
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keep farm ownerName synced with owner fullName
  const handleOwnerNameChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      owner: { ...prev.owner, fullName: val },
      farm: { ...prev.farm, ownerName: val },
    }));
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.owner.password);

  // Localized error message helper
  const getFieldErrorMsg = (field: string, defaultZodMsg?: string) => {
    if (!defaultZodMsg) return null;
    if (field === 'mobileNumber') {
      if (language === 'mr') return '१० अंकी वैध मोबाईल नंबर टाका (उदा. 9822012345)';
      if (language === 'hi') return '१० अंकों का वैध मोबाइल नंबर दर्ज करें';
      return defaultZodMsg;
    }
    if (field === 'password') {
      if (language === 'mr') return 'पासवर्ड किमान ८ अक्षरे व १ अंक असावा';
      if (language === 'hi') return 'पासवर्ड कम से कम ८ वर्ण और १ अंक होना चाहिए';
      return defaultZodMsg;
    }
    if (field === 'acceptTermsAndPrivacy') {
      if (language === 'mr') return 'कृपया अटी व DPDP गोपनीयता धोरण मान्य करा';
      if (language === 'hi') return 'कृपया नियम और DPDP गोपनीयता नीति स्वीकार करें';
      return defaultZodMsg;
    }
    return defaultZodMsg;
  };

  // Validate step before moving forward
  const validateStep = (currentStep: number): boolean => {
    setFieldErrors({});
    setGlobalError(null);

    if (currentStep === 1) {
      const res = ownerAccountSchema.safeParse(formData.owner);
      if (!res.success) {
        const errors: Record<string, string> = {};
        res.error.issues.forEach(i => {
          errors[String(i.path[0])] = i.message;
        });
        setFieldErrors(errors);
        return false;
      }
    } else if (currentStep === 2) {
      const res = farmDetailsSchema.safeParse(formData.farm);
      if (!res.success) {
        const errors: Record<string, string> = {};
        res.error.issues.forEach(i => {
          errors[String(i.path[0])] = i.message;
        });
        setFieldErrors(errors);
        return false;
      }
    } else if (currentStep === 3) {
      const res = shedsFlocksSchema.safeParse(formData.shedsFlocks);
      if (!res.success) {
        const errors: Record<string, string> = {};
        res.error.issues.forEach(i => {
          errors[i.path.map(String).join('.')] = i.message;
        });
        setFieldErrors(errors);
        return false;
      }
    } else if (currentStep === 4) {
      const res = feedCostsSchema.safeParse(formData.feed);
      if (!res.success) {
        const errors: Record<string, string> = {};
        res.error.issues.forEach(i => {
          errors[String(i.path[0])] = i.message;
        });
        setFieldErrors(errors);
        return false;
      }
    } else if (currentStep === 5) {
      const res = eggSalesUnitsSchema.safeParse(formData.sales);
      if (!res.success) {
        const errors: Record<string, string> = {};
        res.error.issues.forEach(i => {
          errors[String(i.path[0])] = i.message;
        });
        setFieldErrors(errors);
        return false;
      }
    } else if (currentStep === 6) {
      const res = expensesFinanceSchema.safeParse(formData.finance);
      if (!res.success) {
        const errors: Record<string, string> = {};
        res.error.issues.forEach(i => {
          errors[String(i.path[0])] = i.message;
        });
        setFieldErrors(errors);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      goToStep(step + 1);
    }
  };

  const handleBack = () => {
    setGlobalError(null);
    setFieldErrors({});
    goToStep(Math.max(1, step - 1));
  };

  // Flock management handlers
  const handleAddFlock = () => {
    const nextIdx = formData.shedsFlocks.flocks.length + 1;
    setFormData(prev => ({
      ...prev,
      shedsFlocks: {
        ...prev.shedsFlocks,
        numberOfSheds: Math.max(prev.shedsFlocks.numberOfSheds, nextIdx),
        flocks: [
          ...prev.shedsFlocks.flocks,
          {
            batchCode: `Batch-${nextIdx}`,
            breed: 'BV300',
            birdsPlaced: 10000,
            currentLiveBirds: 10000,
            ageWeeks: 34,
            housingType: 'elevated_cage',
          },
        ],
      },
    }));
  };

  const handleRemoveFlock = (idx: number) => {
    if (formData.shedsFlocks.flocks.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      shedsFlocks: {
        ...prev.shedsFlocks,
        flocks: prev.shedsFlocks.flocks.filter((_, i) => i !== idx),
      },
    }));
  };

  // Submit enrollment
  const handleSubmitEnrollment = async () => {
    setIsSubmitting(true);
    setGlobalError(null);

    const result = await enrollFarmAction(formData);
    setIsSubmitting(false);

    if (!result.success) {
      setGlobalError(result.error || 'नोंदणी अयशस्वी. कृपया तपशील तपासा.');
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      return;
    }

    // Success! Clear session draft
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    setCompletedResult(result.data || null);

    // Seed newly enrolled farm into local state & switch
    if (result.data) {
      const enrolledFarm = {
        id: result.data.farmId,
        name: result.data.farmName,
        ownerName: result.data.ownerName,
        phone: result.data.phone,
        email: formData.owner.email,
        district: formData.farm.district,
        state: formData.farm.state,
        totalCapacity: result.data.totalBirds,
      };

      const primaryFlock = {
        id: result.data.flocks[0]?.id || `flock-${Date.now()}`,
        farmId: result.data.farmId,
        shedId: 'shed-01',
        batchCode: result.data.flocks[0]?.batchCode || 'Batch-1',
        breed: result.data.flocks[0]?.breed || 'BV300',
        hatcherySource: 'Direct Placement',
        placementDate: new Date().toISOString().split('T')[0],
        initialChickCount: result.data.totalBirds,
        chickCostPerBird: 42.0,
        currentBirdCount: result.data.totalBirds,
        ageWeeks: result.data.flocks[0]?.ageWeeks || 34,
        currentPhase: 'laying' as const,
      };

      const customSheds = Array.from({ length: formData.shedsFlocks.numberOfSheds }).map((_, i) => ({
        id: `shed-${i + 1}`,
        farmId: result.data!.farmId,
        shedNumber: `Shed-0${i + 1}`,
        name: `शेड ${i + 1}`,
        capacity: Math.ceil(result.data!.totalBirds / formData.shedsFlocks.numberOfSheds),
        shedType: formData.shedsFlocks.flocks[0]?.housingType || ('elevated_cage' as const),
        hasSensors: false,
      }));

      // Update store and localStorage so dashboard immediately reflects this real farm
      setActiveFarmData({
        farm: enrolledFarm,
        farms: [enrolledFarm],
        flock: primaryFlock,
        flocks: [primaryFlock],
        sheds: customSheds,
        unitSettings: result.data.unitSettings,
        dailyRecords: [], // Real account starts fresh without mock history
        sales: [],
        user: {
          id: result.data.userId,
          name: `${result.data.ownerName} (मालक)`,
          phone: result.data.phone,
          role: 'owner',
          farmId: result.data.farmId,
        },
      } as any);
    }

    setStep(8); // Move to Welcome Screen
  };

  const handleLaunchDashboard = () => {
    // Navigate straight to the farm-specific dashboard
    if (completedResult?.farmId) {
      router.push(`/dashboard/farms/${completedResult.farmId}`);
    } else {
      router.push('/?live=true');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0F1A15] text-[#1B2A24] dark:text-white flex flex-col justify-between transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md border-b border-[#E7E2D6] dark:border-[#263B30] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-lg border border-[#D9A441]">
              🥚
            </div>
            <span className="text-xl font-black tracking-tight">
              Layer<span className="text-[#D9A441]">OS</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs sm:text-sm font-black text-[#1F4D3A] dark:text-[#64D8A1]">
              {t.enrollTitle}
            </span>

            {/* Trilingual Switcher */}
            <div className="flex items-center bg-[#FAF8F3] dark:bg-[#0F1A15] p-0.5 rounded-xl border border-[#E7E2D6] dark:border-[#263B30]">
              {(['mr', 'hi', 'en'] as const).map(lang => (
                <button
                  key={lang}
                  id={`enroll-lang-${lang}`}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all min-h-[28px] ${
                    language === lang
                      ? 'bg-[#1F4D3A] text-white shadow-xs'
                      : 'text-[#6B7A72] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white'
                  }`}
                >
                  {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Wizard Form Container */}
      <main className="flex-1 py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E7E2D6] dark:border-[#263B30]">
          {/* Honeypot for bot protection */}
          <input
            id="hp_field"
            type="text"
            name="hp_field"
            value={formData.honeypot}
            onChange={e => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {/* Progress Bar (Visible for Steps 1-7) */}
          {step <= 7 && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-black text-[#0B1E15] dark:text-white mb-2">
                <span>पायरी {step} / ७</span>
                <span>
                  {step === 1 && t.enrollStep1}
                  {step === 2 && t.enrollStep2}
                  {step === 3 && t.enrollStep3}
                  {step === 4 && t.enrollStep4}
                  {step === 5 && t.enrollStep5}
                  {step === 6 && t.enrollStep6}
                  {step === 7 && t.enrollStep7}
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(s => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s <= step
                        ? 'bg-[#1F4D3A] dark:bg-[#42BF87]'
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Global Error Banner */}
          {globalError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/40 text-red-700 dark:text-red-300 flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{globalError}</span>
            </div>
          )}

          {/* STEP 1: Owner Account */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white">
                  {t.enrollStep1}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#A3B899] mt-1">
                  फार्म मालकाचे सुरक्षित खाते तयार करा.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  {t.fullNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="enroll-owner-name"
                  type="text"
                  placeholder="उदा. सचिन गायकवाड"
                  value={formData.owner.fullName}
                  onChange={e => handleOwnerNameChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
                {fieldErrors['fullName'] && (
                  <span id="enroll-name-error" className="text-xs text-red-500 font-bold mt-1 block">
                    {getFieldErrorMsg('fullName', fieldErrors['fullName'])}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  {t.mobileLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="enroll-owner-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="उदा. 9822012345"
                  value={formData.owner.mobileNumber}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      owner: { ...prev.owner, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) },
                      farm: { ...prev.farm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
                {fieldErrors['mobileNumber'] && (
                  <span id="enroll-phone-error" className="text-xs text-red-500 font-bold mt-1 block">
                    {getFieldErrorMsg('mobileNumber', fieldErrors['mobileNumber'])}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  {t.emailLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="enroll-owner-email"
                  type="email"
                  placeholder="उदा. sachin@layerfarm.com"
                  value={formData.owner.email}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      owner: { ...prev.owner, email: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
                {fieldErrors['email'] && (
                  <span id="enroll-email-error" className="text-xs text-red-500 font-bold mt-1 block">
                    {getFieldErrorMsg('email', fieldErrors['email'])}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  {t.passwordLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="enroll-owner-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.owner.password}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      owner: { ...prev.owner, password: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />

                {/* Password Strength Meter */}
                {formData.owner.password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 grid grid-cols-4 gap-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength >= 1 ? 'bg-red-500' : ''}`} />
                      <div className={`h-full ${passwordStrength >= 2 ? 'bg-amber-500' : ''}`} />
                      <div className={`h-full ${passwordStrength >= 3 ? 'bg-blue-500' : ''}`} />
                      <div className={`h-full ${passwordStrength >= 4 ? 'bg-emerald-500' : ''}`} />
                    </div>
                    <span className="text-[10px] font-bold text-[#5A6E64]">
                      {passwordStrength <= 1 && 'कमकुवत'}
                      {passwordStrength === 2 && 'मध्यम'}
                      {passwordStrength >= 3 && 'मजबूत'}
                    </span>
                  </div>
                )}
                {fieldErrors['password'] && (
                  <span id="enroll-password-error" className="text-xs text-red-500 font-bold mt-1 block">
                    {getFieldErrorMsg('password', fieldErrors['password'])}
                  </span>
                )}
              </div>

              {/* Consent checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="enroll-terms-checkbox"
                    type="checkbox"
                    checked={formData.owner.acceptTermsAndPrivacy}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        owner: { ...prev.owner, acceptTermsAndPrivacy: e.target.checked as any },
                      }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-[#1F4D3A] focus:ring-[#1F4D3A] mt-0.5"
                  />
                  <span className="text-xs text-[#3D5248] dark:text-[#CBDCD4] leading-relaxed font-medium">
                    {t.acceptTermsLabel} (DPDP सुसंगत)
                  </span>
                </label>
                {fieldErrors['acceptTermsAndPrivacy'] && (
                  <span id="enroll-terms-error" className="text-xs text-red-500 font-bold mt-1 block">
                    {getFieldErrorMsg('acceptTermsAndPrivacy', fieldErrors['acceptTermsAndPrivacy'])}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Farm Details */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white">
                  {t.enrollStep2}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#A3B899] mt-1">
                  आपल्या पोल्ट्री फार्मचे नाव आणि पत्ता.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  {t.farmNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="enroll-farm-name"
                  type="text"
                  placeholder="उदा. सह्याद्री लेयर फार्म"
                  value={formData.farm.farmName}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      farm: { ...prev.farm, farmName: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
                {fieldErrors['farmName'] && (
                  <span id="enroll-farm-name-error" className="text-xs text-red-500 font-bold mt-1 block">
                    {getFieldErrorMsg('farmName', fieldErrors['farmName'])}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.villageLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="enroll-farm-village"
                    type="text"
                    placeholder="उदा. पाटस"
                    value={formData.farm.villageTown}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        farm: { ...prev.farm, villageTown: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                  {fieldErrors['villageTown'] && (
                    <span className="text-xs text-red-500 font-bold mt-1 block">
                      {fieldErrors['villageTown']}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.talukaLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="enroll-farm-taluka"
                    type="text"
                    placeholder="उदा. दौंड"
                    value={formData.farm.taluka}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        farm: { ...prev.farm, taluka: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                  {fieldErrors['taluka'] && (
                    <span className="text-xs text-red-500 font-bold mt-1 block">
                      {fieldErrors['taluka']}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.districtLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="enroll-farm-district"
                    value={formData.farm.district}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        farm: { ...prev.farm, district: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  >
                    {MAHARASHTRA_DISTRICTS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.pincodeLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="enroll-farm-pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="उदा. 412219"
                    value={formData.farm.pincode}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        farm: { ...prev.farm, pincode: e.target.value.replace(/\D/g, '') },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                  {fieldErrors['pincode'] && (
                    <span className="text-xs text-red-500 font-bold mt-1 block">
                      {fieldErrors['pincode']}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  {t.preferredLangLabel}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { code: 'mr', label: 'मराठी' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'en', label: 'English' },
                  ].map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          farm: { ...prev.farm, preferredLanguage: l.code as any },
                        }));
                        setLanguage(l.code as any);
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all min-h-[44px] ${
                        formData.farm.preferredLanguage === l.code
                          ? 'bg-[#1F4D3A] text-white border-[#1F4D3A] shadow-sm'
                          : 'bg-[#FAF8F3] dark:bg-[#0F1A15] text-[#3D5248] dark:text-[#CBDCD4] border-[#E7E2D6] dark:border-[#263B30]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Sheds & Flocks */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white">
                  {t.enrollStep3}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#A3B899] mt-1">
                  आपल्या शेड आणि चालू बॅचची माहिती प्रविष्ट करा.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  {t.numberOfShedsLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={50}
                  value={formData.shedsFlocks.numberOfSheds}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      shedsFlocks: {
                        ...prev.shedsFlocks,
                        numberOfSheds: Math.max(1, parseInt(e.target.value) || 1),
                      },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
              </div>

              {/* Dynamic Flocks Array */}
              <div className="space-y-4">
                {formData.shedsFlocks.flocks.map((flock, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30] relative"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase text-[#1F4D3A] dark:text-[#42BF87]">
                        बॅच #{idx + 1}
                      </span>
                      {formData.shedsFlocks.flocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFlock(idx)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t.removeFlockBtn}</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#5A6E64] dark:text-[#A3B899] mb-1">
                          {t.batchCodeLabel}
                        </label>
                        <input
                          type="text"
                          value={flock.batchCode}
                          onChange={e => {
                            const val = e.target.value;
                            setFormData(prev => {
                              const updated = [...prev.shedsFlocks.flocks];
                              updated[idx].batchCode = val;
                              return {
                                ...prev,
                                shedsFlocks: { ...prev.shedsFlocks, flocks: updated },
                              };
                            });
                          }}
                          className="w-full px-3 py-2.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] text-xs font-semibold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#5A6E64] dark:text-[#A3B899] mb-1">
                          {t.breedLabel}
                        </label>
                        <select
                          value={flock.breed}
                          onChange={e => {
                            const val = e.target.value;
                            setFormData(prev => {
                              const updated = [...prev.shedsFlocks.flocks];
                              updated[idx].breed = val;
                              return {
                                ...prev,
                                shedsFlocks: { ...prev.shedsFlocks, flocks: updated },
                              };
                            });
                          }}
                          className="w-full px-3 py-2.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] text-xs font-semibold outline-none"
                        >
                          {POULTRY_BREEDS.map(b => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#5A6E64] dark:text-[#A3B899] mb-1">
                          {t.currentBirdsLabel}
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={flock.currentLiveBirds}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            setFormData(prev => {
                              const updated = [...prev.shedsFlocks.flocks];
                              updated[idx].currentLiveBirds = val;
                              updated[idx].birdsPlaced = Math.max(updated[idx].birdsPlaced, val);
                              return {
                                ...prev,
                                shedsFlocks: { ...prev.shedsFlocks, flocks: updated },
                              };
                            });
                          }}
                          className="w-full px-3 py-2.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] text-xs font-semibold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#5A6E64] dark:text-[#A3B899] mb-1">
                          {t.enrollAgeWeeksLabel}
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={120}
                          value={flock.ageWeeks}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 1;
                            setFormData(prev => {
                              const updated = [...prev.shedsFlocks.flocks];
                              updated[idx].ageWeeks = val;
                              return {
                                ...prev,
                                shedsFlocks: { ...prev.shedsFlocks, flocks: updated },
                              };
                            });
                          }}
                          className="w-full px-3 py-2.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] text-xs font-semibold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#5A6E64] dark:text-[#A3B899] mb-1">
                          {t.housingTypeLabel}
                        </label>
                        <select
                          value={flock.housingType}
                          onChange={e => {
                            const val = e.target.value as any;
                            setFormData(prev => {
                              const updated = [...prev.shedsFlocks.flocks];
                              updated[idx].housingType = val;
                              return {
                                ...prev,
                                shedsFlocks: { ...prev.shedsFlocks, flocks: updated },
                              };
                            });
                          }}
                          className="w-full px-3 py-2.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] text-xs font-semibold outline-none"
                        >
                          {HOUSING_TYPES.map(h => (
                            <option key={h.value} value={h.value}>
                              {language === 'en' ? h.labelEn : language === 'hi' ? h.labelHi : h.labelMr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddFlock}
                  className="w-full py-3 border-2 border-dashed border-[#1F4D3A]/40 dark:border-[#3BA378]/40 rounded-2xl text-xs sm:text-sm font-black text-[#1F4D3A] dark:text-[#42BF87] hover:bg-[#FAF8F3] dark:hover:bg-[#1A2E24] flex items-center justify-center gap-1.5 transition-colors min-h-[48px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addFlockBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Feed & Costs */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white">
                  {t.enrollStep4}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#A3B899] mt-1">
                  दैनिक खाद्य वापर आणि खरेदी भाव.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.feedBagsPerDayLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={formData.feed.feedBagsPerDay}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        feed: { ...prev.feed, feedBagsPerDay: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                  {fieldErrors['feedBagsPerDay'] && (
                    <span className="text-xs text-red-500 font-bold mt-1 block">
                      {fieldErrors['feedBagsPerDay']}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.feedPricePerKgLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder="उदा. 35.00"
                    value={formData.feed.feedPricePerKg}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        feed: { ...prev.feed, feedPricePerKg: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                  {fieldErrors['feedPricePerKg'] && (
                    <span className="text-xs text-red-500 font-bold mt-1 block">
                      {fieldErrors['feedPricePerKg']}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.bagSizeKgLabel}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formData.feed.bagSizeKg}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        feed: { ...prev.feed, bagSizeKg: parseInt(e.target.value) || 50 },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.planningHorizonLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 60, 90].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            feed: { ...prev.feed, planningHorizonDays: days as any },
                          }))
                        }
                        className={`py-3 rounded-xl text-xs font-bold border transition-all min-h-[48px] ${
                          formData.feed.planningHorizonDays === days
                            ? 'bg-[#1F4D3A] text-white border-[#1F4D3A] shadow-sm'
                            : 'bg-[#FAF8F3] dark:bg-[#0F1A15] text-[#3D5248] dark:text-[#CBDCD4] border-[#E7E2D6] dark:border-[#263B30]'
                        }`}
                      >
                        {days} दिवस
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  {t.feedSupplierLabel}
                </label>
                <input
                  type="text"
                  placeholder="उदा. प्रीमियम फीड्स प्रा. लि."
                  value={formData.feed.feedSupplier}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      feed: { ...prev.feed, feedSupplier: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Egg Sales & Units */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white">
                  {t.enrollStep5}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#A3B899] mt-1">
                  अंडी पॅकिंगचे स्थानिक युनिट्स आणि विक्री दर.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.sellingPricePerEggLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.05"
                    placeholder="उदा. 5.40 (किंवा ₹540 प्रति 100)"
                    value={formData.sales.currentSellingPricePerEgg}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        sales: {
                          ...prev.sales,
                          currentSellingPricePerEgg: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                  {fieldErrors['currentSellingPricePerEgg'] && (
                    <span className="text-xs text-red-500 font-bold mt-1 block">
                      {fieldErrors['currentSellingPricePerEgg']}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.traysPerGattaLabel}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={formData.sales.traysPerGatta}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        sales: { ...prev.sales, traysPerGatta: parseInt(e.target.value) || 7 },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                  <span className="text-[10px] text-[#5A6E64] font-semibold mt-1 block">
                    (पश्चिम महाराष्ट्रात ७ ट्रे = २१० अंडी प्रमाणित)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.mainBuyerTypeLabel}
                  </label>
                  <select
                    value={formData.sales.mainBuyerType}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        sales: { ...prev.sales, mainBuyerType: e.target.value as any },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  >
                    {BUYER_TYPES.map(b => (
                      <option key={b.value} value={b.value}>
                        {language === 'en' ? b.labelEn : language === 'hi' ? b.labelHi : b.labelMr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.nearestMandiLabel}
                  </label>
                  <select
                    value={formData.sales.nearestMandi}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        sales: { ...prev.sales, nearestMandi: e.target.value as any },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  >
                    {MANDI_LIST.map(m => (
                      <option key={m} value={m}>
                        {m} Mandi
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Expenses & Finance (Optional) */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white">
                  {t.enrollStep6}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#A3B899] mt-1">
                  मासिक खर्च आणि बँकेचा हप्ता (खरा नफा काढण्यासाठी ऐच्छिक पण उपयुक्त).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.monthlyLabourLabel}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formData.finance.monthlyLabour}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        finance: { ...prev.finance, monthlyLabour: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.monthlyMedicineLabel}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formData.finance.monthlyMedicine}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        finance: {
                          ...prev.finance,
                          monthlyMedicine: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.monthlyElectricityLabel}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formData.finance.monthlyElectricity}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        finance: {
                          ...prev.finance,
                          monthlyElectricity: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.monthlyLoanEmiLabel}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="उदा. 0"
                    value={formData.finance.monthlyLoanEmi}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        finance: {
                          ...prev.finance,
                          monthlyLoanEmi: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Review & Final Confirmation */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white">
                  {t.enrollStep7}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#A3B899] mt-1">
                  सर्व तपशील तपासा. बदल करण्यासाठी शेजारील बदला (Edit) लिंकवर क्लिक करा.
                </p>
              </div>

              {/* Review Section Cards */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                {/* 1. Account */}
                <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#5A6E64] block">खाते व मालक:</span>
                    <span className="font-black text-[#0B1E15] dark:text-white text-sm">
                      {formData.owner.fullName} ({formData.owner.mobileNumber})
                    </span>
                    <span className="text-xs text-[#5A6E64] block">{formData.owner.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] underline p-2"
                  >
                    बदला
                  </button>
                </div>

                {/* 2. Farm */}
                <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#5A6E64] block">फार्म व पत्ता:</span>
                    <span className="font-black text-[#0B1E15] dark:text-white text-sm">
                      {formData.farm.farmName}
                    </span>
                    <span className="text-xs text-[#5A6E64] block">
                      {formData.farm.villageTown}, {formData.farm.taluka}, {formData.farm.district} - {formData.farm.pincode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] underline p-2"
                  >
                    बदला
                  </button>
                </div>

                {/* 3. Sheds & Flocks */}
                <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#5A6E64] block">शेड्स व पक्षी संख्या:</span>
                    <span className="font-black text-[#0B1E15] dark:text-white text-sm">
                      {formData.shedsFlocks.numberOfSheds} शेड्स |{' '}
                      {formData.shedsFlocks.flocks.reduce((acc, f) => acc + f.currentLiveBirds, 0)}{' '}
                      एकूण पक्षी
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] underline p-2"
                  >
                    बदला
                  </button>
                </div>

                {/* 4. Feed & Rate */}
                <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#5A6E64] block">खुराक व विक्री भाव:</span>
                    <span className="font-black text-[#0B1E15] dark:text-white text-sm">
                      {formData.feed.feedBagsPerDay} गोण्या/दिवस @ ₹{formData.feed.feedPricePerKg}/कि.ग्रा. | अंडी भाव: ₹{formData.sales.currentSellingPricePerEgg}/नग
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] underline p-2"
                  >
                    बदला
                  </button>
                </div>
              </div>

              {/* Final Submit Button */}
              <button
                id="enroll-submit-btn"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitEnrollment}
                className="w-full py-4 px-6 rounded-2xl text-base sm:text-lg font-black text-white bg-[#1F4D3A] hover:bg-[#173A2C] shadow-lg hover:shadow-xl transition-all border-b-4 border-[#122A20] flex items-center justify-center gap-2 min-h-[52px]"
              >
                {isSubmitting ? (
                  <span>{t.savingEnrollment}</span>
                ) : (
                  <>
                    <span>{t.createMyLayerOSBtn}</span>
                    <Sparkles className="w-5 h-5 text-[#D9A441]" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 8: Success Welcome Screen */}
          {step === 8 && completedResult && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-[#EAF3EF] dark:bg-[#1A2E24] text-[#1F4D3A] dark:text-[#42BF87] mx-auto flex items-center justify-center border-2 border-[#D9A441] shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-[#2E7D5B]" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0B1E15] dark:text-white">
                  {t.welcomeTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#CBDCD4] mt-1 font-medium">
                  {completedResult.farmName} साठी सर्व हिशोब आणि सूत्रे तयार आहेत.
                </p>
              </div>

              {/* Initial Instant Numbers Computed */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30] text-left">
                <div>
                  <span className="text-[11px] font-bold text-[#5A6E64] block">
                    अंदाजे दैनिक अंडी
                  </span>
                  <span className="text-base font-black text-[#0B1E15] dark:text-white">
                    {completedResult.welcomeStats.dailyEggsEstimate.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#5A6E64] block">
                    मासिक खाद्य गोण्या (३० दिवस)
                  </span>
                  <span className="text-base font-black text-[#0B1E15] dark:text-white">
                    {completedResult.welcomeStats.monthlyFeedBags.toLocaleString('en-IN')} गोण्या
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#5A6E64] block">
                    अंदाजे ब्रेक-इव्हन भाव
                  </span>
                  <span className="text-base font-black text-amber-600">
                    ₹{completedResult.projectedBreakEvenPrice.toFixed(2)} / अंडे
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#5A6E64] block">
                    अंदाजे मासिक नफा
                  </span>
                  <span className="text-base font-black text-emerald-600">
                    ₹{completedResult.welcomeStats.estimatedMonthlyProfit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 3 Next Actions */}
              <div className="text-left space-y-2.5">
                <span className="text-xs font-black text-[#1F4D3A] dark:text-[#42BF87] uppercase tracking-wider block">
                  पुढील ३ महत्त्वाच्या पायऱ्या:
                </span>
                <div className="p-3 rounded-xl bg-white dark:bg-[#1A2E24] border border-[#E7E2D6] dark:border-[#263B30] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] flex-shrink-0" />
                  <span>{t.nextAction1}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#1A2E24] border border-[#E7E2D6] dark:border-[#263B30] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] flex-shrink-0" />
                  <span>{t.nextAction2}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#1A2E24] border border-[#E7E2D6] dark:border-[#263B30] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] flex-shrink-0" />
                  <span>{t.nextAction3}</span>
                </div>
              </div>

              {/* Go to Dashboard Button */}
              <button
                id="enroll-to-dashboard-btn"
                type="button"
                onClick={handleLaunchDashboard}
                className="w-full py-4 px-6 rounded-2xl text-base sm:text-lg font-black text-white bg-[#1F4D3A] hover:bg-[#173A2C] shadow-lg hover:shadow-xl transition-all border-b-4 border-[#122A20] flex items-center justify-center gap-2 min-h-[52px]"
              >
                <span>{t.goToDashboardBtn}</span>
                <ArrowRight className="w-5 h-5 text-[#D9A441]" />
              </button>
            </div>
          )}

          {/* Navigation Buttons (Back & Next) for Steps 1-6 */}
          {step <= 6 && (
            <div className="mt-8 pt-6 border-t border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  id="enroll-back-btn"
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] text-xs sm:text-sm font-bold text-[#2D4538] dark:text-[#CBDCD4] hover:bg-gray-50 dark:hover:bg-[#1F2E26] flex items-center gap-1.5 transition-colors min-h-[48px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>मागे (Back)</span>
                </button>
              ) : (
                <div />
              )}

              <button
                id="enroll-next-btn"
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs sm:text-sm font-black shadow-md flex items-center gap-1.5 transition-all min-h-[48px] border-b-2 border-[#122A20]"
              >
                <span>पुढे (Next)</span>
                <ArrowRight className="w-4 h-4 text-[#D9A441]" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

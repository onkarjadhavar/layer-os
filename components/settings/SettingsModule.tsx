'use client';

import React, { useState, useEffect } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import {
  Settings,
  Scale,
  Building,
  RotateCcw,
  Download,
  CheckCircle,
  Users,
  UserPlus,
  ShieldCheck,
  Copy,
  Share2,
  Trash2,
  CreditCard,
  Sparkles,
  Check,
  Zap,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { getFarmMembers, createStaffInvitation, deactivateFarmMember } from '@/lib/auth/actions';
import { UserRole } from '@/lib/supabase/database.types';
import {
  SUBSCRIPTION_PLANS,
  PlanId,
  BillingCycle,
  FarmSubscriptionState,
  getSubscriptionPlan,
} from '@/lib/billing/plans';
import {
  getFarmSubscriptionAction,
  createCheckoutOrderAction,
  verifyPaymentAndUpgradeAction,
  getBillingInvoicesAction,
  BillingInvoiceRecord,
} from '@/lib/billing/actions';

export function SettingsModule() {
  const { farm, unitSettings, updateUnitSettings, resetDemoData, isDemoMode, dailyRecords, customers, sales, user } = useLayerOS();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'units' | 'team' | 'billing' | 'backup'>('units');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Billing & SaaS state
  const [subscription, setSubscription] = useState<FarmSubscriptionState>({
    farmId: farm.id,
    planId: isDemoMode ? 'grower' : 'starter',
    status: 'active',
    billingCycle: 'monthly',
    currentPeriodStart: '2026-10-01T00:00:00.000Z',
    currentPeriodEnd: '2026-11-01T00:00:00.000Z',
    cancelAtPeriodEnd: false,
  });
  const [invoices, setInvoices] = useState<BillingInvoiceRecord[]>([
    {
      id: 'inv-seed-01',
      farmId: farm.id,
      paymentId: 'pay_rzp_mock_2026',
      orderId: 'order_rzp_mock_2026',
      amountInr: 999,
      status: 'paid',
      invoiceNumber: 'INV-2026-089',
      createdAt: '2026-10-07T00:00:00.000Z',
    },
  ]);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeSuccessMsg, setUpgradeSuccessMsg] = useState<string | null>(null);
  const [upgradeErrorMsg, setUpgradeErrorMsg] = useState<string | null>(null);

  // Unit settings form state
  const [traySize, setTraySize] = useState(unitSettings.traySizeEggs);
  const [gattaSizeTrays, setGattaSizeTrays] = useState(unitSettings.gattaSizeTrays);
  const [cartonSizeTrays, setCartonSizeTrays] = useState(unitSettings.cartonSizeTrays);
  const [feedBagKg, setFeedBagKg] = useState(unitSettings.feedBagWeightKg);
  const [defaultUnit, setDefaultUnit] = useState(unitSettings.defaultRateUnit);

  // Team & Invites state
  const [members, setMembers] = useState<Array<{ id: string; name: string; phone: string; role: UserRole; isActive: boolean }>>([
    { id: 'usr-owner-01', name: 'सचिन गायकवाड', phone: '9822012345', role: 'owner', isActive: true },
    { id: 'usr-sup-01', name: 'रमेश जाधव', phone: '9822067890', role: 'supervisor', isActive: true },
    { id: 'usr-acc-01', name: 'अनिल कुलकर्णी', phone: '9822099999', role: 'accountant', isActive: true },
  ]);
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('supervisor');
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    if (farm.id) {
      getFarmMembers(farm.id).then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setMembers(res.data);
        }
      });
      getFarmSubscriptionAction(farm.id).then(res => {
        if (res.success && res.data) {
          setSubscription(res.data);
        }
      });
      getBillingInvoicesAction(farm.id).then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setInvoices(res.data);
        }
      });
    }
  }, [farm.id]);

  const handleUpgradePlan = async (targetPlanId: PlanId) => {
    setIsUpgrading(true);
    setUpgradeSuccessMsg(null);
    setUpgradeErrorMsg(null);

    try {
      const orderRes = await createCheckoutOrderAction(
        farm.id,
        targetPlanId,
        selectedCycle,
        (user as any)?.email || undefined,
        user?.phone || farm.phone
      );

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.error || 'पेमेंट ऑर्डर तयार करता आली नाही');
      }

      const orderData = orderRes.data;

      // Check if live Razorpay checkout script is loaded in browser
      if (typeof window !== 'undefined' && (window as any).Razorpay && orderData.keyId) {
        const rzp = new (window as any).Razorpay({
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: orderData.currency,
          name: 'LayerOS Poultry Management',
          description: `Plan Upgrade: ${SUBSCRIPTION_PLANS[targetPlanId].name.mr}`,
          order_id: orderData.orderId,
          handler: async (resp: any) => {
            const verifyRes = await verifyPaymentAndUpgradeAction(
              farm.id,
              targetPlanId,
              selectedCycle,
              resp.razorpay_payment_id,
              resp.razorpay_order_id,
              resp.razorpay_signature
            );
            if (verifyRes.success && verifyRes.data) {
              setSubscription(verifyRes.data);
              setUpgradeSuccessMsg(t.paymentSuccess);
              getBillingInvoicesAction(farm.id).then(r => r.data && setInvoices(r.data));
            } else {
              setUpgradeErrorMsg(verifyRes.error || 'पेमेंट पडताळणी अयशस्वी झाली.');
            }
          },
        });
        rzp.open();
      } else {
        // Fast-path Sandbox & Demo verification
        const mockPayId = `pay_mock_${orderData.orderId}`;
        const mockSig = `sig_mock_${orderData.orderId}`;
        const verifyRes = await verifyPaymentAndUpgradeAction(
          farm.id,
          targetPlanId,
          selectedCycle,
          mockPayId,
          orderData.orderId,
          mockSig
        );
        if (verifyRes.success && verifyRes.data) {
          setSubscription(verifyRes.data);
          setUpgradeSuccessMsg(t.paymentSuccess);
          getBillingInvoicesAction(farm.id).then(r => r.data && setInvoices(r.data));
        } else {
          setUpgradeErrorMsg(verifyRes.error || 'अपग्रेड अयशस्वी झाले');
        }
      }
    } catch (err: any) {
      setUpgradeErrorMsg(err.message || 'पेमेंट प्रक्रिया त्रुटी');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleSaveUnits = (e: React.FormEvent) => {
    e.preventDefault();
    updateUnitSettings({
      traySizeEggs: Number(traySize),
      gattaSizeTrays: Number(gattaSizeTrays),
      cartonSizeTrays: Number(cartonSizeTrays),
      feedBagWeightKg: Number(feedBagKg),
      defaultRateUnit: defaultUnit,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invitePhone.length < 10) {
      alert('कृपया १० अंकी वैध मोबाईल नंबर टाका');
      return;
    }

    const res = await createStaffInvitation(farm.id, invitePhone, inviteRole);
    if (res.success && res.data) {
      setGeneratedInviteUrl(res.data.inviteUrl);
      // Add optimistically to member list
      setMembers(prev => [
        ...prev,
        {
          id: `usr-inv-${Date.now()}`,
          name: `कर्मचारी (+91 ${invitePhone})`,
          phone: invitePhone,
          role: inviteRole,
          isActive: true,
        },
      ]);
      setInvitePhone('');
    }
  };

  const handleDeactivate = async (userId: string) => {
    if (confirm('तुम्हाला खरोखर या कर्मचाऱ्याचा ॲक्सेस बंद करायचा आहे का?')) {
      await deactivateFarmMember(farm.id, userId);
      setMembers(prev => prev.map(m => m.id === userId ? { ...m, isActive: false } : m));
    }
  };

  const handleExportFullJSON = () => {
    const backup = {
      farm,
      unitSettings,
      dailyRecords,
      customers,
      sales,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LayerOS_CompleteBackup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
        <div className="pb-3 border-b border-[#E7E2D6] dark:border-[#263B30] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>फार्म सेटिंग्ज व कर्मचारी (Settings & Team)</span>
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
              स्थानिक युनिट व्याख्या, कर्मचारी इनव्हाईट, भूमिका अधिकार आणि डेटा बॅकअप
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'units'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            १. स्थानिक युनिट सेटिंग्ज (Units)
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'team'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>२. कर्मचारी व भूमिका (Team & Roles)</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'billing'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>३. {t.billingAndPlans}</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            ४. फार्म माहिती व बॅकअप (Profile & Backup)
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-300 flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>सेटिंग्ज यशस्वीपणे जतन झाल्या!</span>
        </div>
      )}

      {/* TAB 1: REGIONAL UNIT SETTINGS */}
      {activeTab === 'units' && (
        <form onSubmit={handleSaveUnits} className="card-layer p-5 md:p-6 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <Scale className="w-5 h-5 text-[#D9A441]" />
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                स्थानिक अंडी व खुराक युनिट व्याख्या (Custom Regional Units)
              </h3>
              <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
                महाराष्ट्रातील वेगवेगळ्या जिल्ह्यांत गट्ट्याची व्याख्या वेगळी असते. हे कधीही हार्डकोड केलेले नसते.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
                १ ट्रे = किती अंडी? (Tray Size)
              </label>
              <input
                type="number"
                value={traySize}
                onChange={e => setTraySize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
              <span className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">मानक: ३० अंडी</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
                १ गट्टा / पेटी = किती ट्रे? (Gatta Size)
              </label>
              <input
                type="number"
                value={gattaSizeTrays}
                onChange={e => setGattaSizeTrays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#D9A441] text-sm font-black"
              />
              <span className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
                पश्चिम महाराष्ट्र / पुणे: ७ ट्रे = {gattaSizeTrays * traySize} अंडी
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
                १ कार्टन / केस = किती ट्रे? (Carton Size)
              </label>
              <input
                type="number"
                value={cartonSizeTrays}
                onChange={e => setCartonSizeTrays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
              <span className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
                मानक केस: १२ ट्रे = {cartonSizeTrays * traySize} अंडी
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
                १ खुराक पोत्याचे वजन (Feed Bag Kg)
              </label>
              <input
                type="number"
                value={feedBagKg}
                onChange={e => setFeedBagKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
              <span className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">मानक: ५० किलो</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
                प्राधान्य दिलेला भाव प्रकार (Default Rate)
              </label>
              <select
                value={defaultUnit}
                onChange={e => setDefaultUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
              >
                <option value="per_100">प्रति १०० अंडी (NECC)</option>
                <option value="per_egg">प्रति १ अंडे</option>
                <option value="tray">प्रति ट्रे (३०)</option>
                <option value="gatta">प्रति गट्टा / पेटी</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#1F4D3A] text-white text-xs font-bold shadow-md hover:bg-[#173A2C]"
            >
              युनिट बदल साठवा
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: TEAM & EMPLOYEE INVITES */}
      {activeTab === 'team' && (
        <div className="space-y-5">
          {/* Invite Form (Owner / Manager Only) */}
          {(user?.role === 'owner' || user?.role === 'manager') && (
            <form onSubmit={handleCreateInvite} className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E7E2D6] dark:border-[#263B30]">
                <UserPlus className="w-5 h-5 text-[#1F4D3A] dark:text-[#3BA378]" />
                <div>
                  <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                    नवीन कर्मचाऱ्याला इनव्हाईट करा (Invite Staff Member)
                  </h3>
                  <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
                    कर्मचाऱ्याच्या मोबाईलवर लिंक पाठवून योग्य भूमिकेचा ॲक्सेस द्या
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
                    मोबाईल नंबर (१० अंकी)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98220 12345"
                    value={invitePhone}
                    onChange={e => setInvitePhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-sm font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
                    भूमिका व अधिकार (Role)
                  </label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-sm font-bold text-[#0B1E15] dark:text-white"
                  >
                    <option value="supervisor">सुपरवायझर (Supervisor - केवळ नोंदी)</option>
                    <option value="accountant">हिशोबनीस (Accountant - विक्री व खर्च)</option>
                    <option value="manager">व्यवस्थापक (Manager - पूर्ण अधिकार)</option>
                    <option value="viewer">तपासनीस (Viewer - केवळ पाहणे)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#1F4D3A] text-white text-xs font-black shadow-md hover:bg-[#173A2C] flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>इनव्हाईट लिंक तयार करा</span>
                </button>
              </div>

              {/* Generated Invite Box */}
              {generatedInviteUrl && (
                <div className="p-4 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/40 space-y-2 animate-in fade-in">
                  <div className="text-xs font-black text-[#1F4D3A] dark:text-[#3BA378] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>इनव्हाईट लिंक तयार झाली! ही लिंक कर्मचाऱ्याला पाठवा:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedInviteUrl}
                      className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#16241D] border border-gray-300 dark:border-gray-700 text-[#0B1E15] dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedInviteUrl);
                        setCopiedSuccess(true);
                        setTimeout(() => setCopiedSuccess(false), 2000);
                      }}
                      className="py-2 px-3 rounded-xl bg-[#1F4D3A] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSuccess ? 'कॉपी झाले!' : 'कॉपी करा'}</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`LayerOS फार्म इनव्हाईट: ${generatedInviteUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Members Table */}
          <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E2D6] dark:border-[#263B30]">
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>सक्रिय कर्मचारी व भूमिका ({members.length})</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-[#2D4538] dark:text-[#CBDCD4] font-bold">
                    <th className="py-2 px-3">कर्मचाऱ्याचे नाव</th>
                    <th className="py-2 px-3">मोबाईल नंबर</th>
                    <th className="py-2 px-3">भूमिका (Role)</th>
                    <th className="py-2 px-3">स्थिती</th>
                    <th className="py-2 px-3 text-right">कृती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {members.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-[#1F3027]/50">
                      <td className="py-2.5 px-3 font-bold text-[#0B1E15] dark:text-white">{m.name}</td>
                      <td className="py-2.5 px-3 text-[#2D4538] dark:text-[#CBDCD4] font-mono">+91 {m.phone}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          m.role === 'owner' ? 'bg-[#FCF6E9] text-[#B07B18]' :
                          m.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                          m.role === 'supervisor' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[11px] font-bold ${m.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {m.isActive ? '● सक्रिय (Active)' : '○ बंद (Inactive)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {m.role !== 'owner' && (user?.role === 'owner' || user?.role === 'manager') && m.isActive && (
                          <button
                            onClick={() => handleDeactivate(m.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                          >
                            ॲक्सेस काढा
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FARM PROFILE & BACKUP */}
      {activeTab === 'backup' && (
        <div className="space-y-5">
          <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E7E2D6] dark:border-[#263B30]">
              <Building className="w-5 h-5 text-[#1F4D3A] dark:text-[#3BA378]" />
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                फार्म माहिती (Farm Profile)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold block">फार्म नाव:</span>
                <strong className="text-sm font-black text-[#0B1E15] dark:text-white">{farm.name}</strong>
              </div>
              <div>
                <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold block">चालक/मालक:</span>
                <strong className="text-sm font-black text-[#0B1E15] dark:text-white">{farm.ownerName}</strong>
              </div>
              <div>
                <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold block">जिल्हा:</span>
                <strong className="text-sm font-black text-[#0B1E15] dark:text-white">{farm.district}, महाराष्ट्र</strong>
              </div>
              <div>
                <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold block">एकूण क्षमता:</span>
                <strong className="text-sm font-black text-[#0B1E15] dark:text-white">{farm.totalCapacity.toLocaleString('en-IN')} पक्षी</strong>
              </div>
            </div>
          </div>

          <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
              डेटा बॅकअप व रीसेट (Data Management & Reset)
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportFullJSON}
                className="py-2.5 px-4 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] text-xs font-bold text-[#0B1E15] dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1F3027]"
              >
                <Download className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
                <span>संपूर्ण डेटा बॅकअप डाऊनलोड (JSON)</span>
              </button>

              {isDemoMode && (
                <button
                  onClick={() => {
                    if (confirm('तुम्हाला खरोखर सह्याद्री लेयर फार्मचा सर्व डेटा पूर्ववत (Reset) करायचा आहे का?')) {
                      resetDemoData();
                      alert('डेमो डेटा पूर्ववत रीसेट झाला!');
                    }
                  }}
                  className="py-2.5 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 border border-amber-300 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.resetDemoData}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BILLING & PLANS TAB */}
      {activeTab === 'billing' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Notification Messages */}
          {upgradeSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 flex items-center gap-3 text-xs font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{upgradeSuccessMsg}</span>
            </div>
          )}

          {upgradeErrorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800 flex items-center gap-3 text-xs font-bold">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{upgradeErrorMsg}</span>
            </div>
          )}

          {/* Active Subscription Summary Banner */}
          <div className="card-layer p-5 border border-[#D9A441]/40 dark:border-[#D9A441]/30 bg-gradient-to-r from-amber-50/60 via-white to-emerald-50/40 dark:from-[#1A2E24] dark:to-[#16241D]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#1F4D3A] text-white">
                    {subscription.status === 'active' ? t.planActiveStatus : t.planTrialStatus}
                  </span>
                  <span className="text-xs font-bold text-[#6B7A72] dark:text-[#A4B5AC]">
                    {subscription.billingCycle === 'yearly' ? t.yearlyBilling : t.monthlyBilling}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
                  <span>{SUBSCRIPTION_PLANS[subscription.planId].name.mr}</span>
                  {SUBSCRIPTION_PLANS[subscription.planId].popular && (
                    <span className="text-xs font-bold bg-[#D9A441] text-[#1F4D3A] px-2 py-0.5 rounded-full">
                      ★ शिफारस
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium">
                  {SUBSCRIPTION_PLANS[subscription.planId].tagline.mr}
                </p>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E7E2D6] dark:border-[#263B30]">
                <span className="text-[11px] text-[#6B7A72] dark:text-[#A4B5AC] font-bold block">
                  नूतनीकरण / समाप्ती दिनांक:
                </span>
                <span className="text-sm font-black text-[#0B1E15] dark:text-white">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString('mr-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Resource Usage & Headroom Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Bird Capacity Meter */}
            {(() => {
              const currentBirds = dailyRecords.length > 0 ? dailyRecords[dailyRecords.length - 1].closingBirds : (farm.totalCapacity || 29985);
              const maxBirds = SUBSCRIPTION_PLANS[subscription.planId].limits.maxBirds;
              const pct = maxBirds === Infinity ? 25 : Math.min(100, Math.round((currentBirds / maxBirds) * 100));

              return (
                <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2D4538] dark:text-[#CBDCD4]">{t.birdCapacityUsage}</span>
                    <span className="font-black text-[#0B1E15] dark:text-white">
                      {currentBirds.toLocaleString('en-IN')} / {maxBirds === Infinity ? 'अमर्यादित' : maxBirds.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF8F3] dark:bg-[#1F3027] h-2.5 rounded-full overflow-hidden border border-[#E7E2D6] dark:border-[#263B30]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 90 ? 'bg-amber-500' : 'bg-[#1F4D3A] dark:bg-[#3BA378]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#6B7A72] dark:text-[#A4B5AC] flex justify-between font-semibold">
                    <span>{pct}% वापरले</span>
                    <span>{maxBirds === Infinity ? 'अमर्यादित स्केल' : `${(maxBirds - currentBirds).toLocaleString('en-IN')} शिल्लक`}</span>
                  </div>
                </div>
              );
            })()}

            {/* Sheds Capacity Meter */}
            {(() => {
              const currentSheds = 2;
              const maxSheds = SUBSCRIPTION_PLANS[subscription.planId].limits.maxSheds;
              const pct = maxSheds === Infinity ? 20 : Math.min(100, Math.round((currentSheds / maxSheds) * 100));

              return (
                <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2D4538] dark:text-[#CBDCD4]">{t.shedCapacityUsage}</span>
                    <span className="font-black text-[#0B1E15] dark:text-white">
                      {currentSheds} / {maxSheds === Infinity ? 'अमर्यादित' : maxSheds} शेड
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF8F3] dark:bg-[#1F3027] h-2.5 rounded-full overflow-hidden border border-[#E7E2D6] dark:border-[#263B30]">
                    <div
                      className="h-full bg-[#1F4D3A] dark:bg-[#3BA378] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#6B7A72] dark:text-[#A4B5AC] flex justify-between font-semibold">
                    <span>{pct}% वापरले</span>
                    <span>{maxSheds === Infinity ? 'अमर्यादित' : `${maxSheds - currentSheds} शेड शिल्लक`}</span>
                  </div>
                </div>
              );
            })()}

            {/* Staff Members Meter */}
            {(() => {
              const currentStaff = members.filter(m => m.isActive).length;
              const maxStaff = SUBSCRIPTION_PLANS[subscription.planId].limits.maxStaff;
              const pct = maxStaff === Infinity ? 20 : Math.min(100, Math.round((currentStaff / maxStaff) * 100));

              return (
                <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2D4538] dark:text-[#CBDCD4]">{t.staffCapacityUsage}</span>
                    <span className="font-black text-[#0B1E15] dark:text-white">
                      {currentStaff} / {maxStaff === Infinity ? 'अमर्यादित' : maxStaff} सदस्य
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF8F3] dark:bg-[#1F3027] h-2.5 rounded-full overflow-hidden border border-[#E7E2D6] dark:border-[#263B30]">
                    <div
                      className="h-full bg-[#1F4D3A] dark:bg-[#3BA378] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#6B7A72] dark:text-[#A4B5AC] flex justify-between font-semibold">
                    <span>{pct}% वापरले</span>
                    <span>{maxStaff === Infinity ? 'अमर्यादित' : `${maxStaff - currentStaff} जागा शिल्लक`}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Pricing Plans Comparison Cards */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#D9A441]" />
                  <span>{t.upgradePlan}</span>
                </h3>
                <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4]">
                  तुमच्या फार्मच्या आवश्यकतेनुसार योग्य योजना निवडा व सुरक्षित ऑनलाइन पेमेंट करा
                </p>
              </div>

              {/* Monthly / Yearly Switch */}
              <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
                <button
                  type="button"
                  onClick={() => setSelectedCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCycle === 'monthly'
                      ? 'bg-[#1F4D3A] text-white shadow-sm'
                      : 'text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15]'
                  }`}
                >
                  {t.monthlyBilling}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCycle('yearly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCycle === 'yearly'
                      ? 'bg-[#1F4D3A] text-white shadow-sm'
                      : 'text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15]'
                  }`}
                >
                  <span>{t.yearlyBilling}</span>
                  <span className="text-[9px] bg-[#D9A441] text-[#1F4D3A] px-1.5 py-0.2 rounded-full font-black">
                    -१७%
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Tier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['starter', 'grower', 'enterprise'] as PlanId[]).map((planKey) => {
                const plan = SUBSCRIPTION_PLANS[planKey];
                const isCurrent = subscription.planId === planKey;
                const price = plan.priceINR[selectedCycle];

                return (
                  <div
                    key={planKey}
                    className={`card-layer p-5 rounded-2xl flex flex-col justify-between transition-all relative ${
                      plan.popular
                        ? 'border-2 border-[#D9A441] bg-white dark:bg-[#16241D] shadow-md'
                        : 'border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D9A441] text-[#1F4D3A] text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                        सर्वात लोकप्रिय
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-base font-black text-[#0B1E15] dark:text-white">
                          {plan.name.mr}
                        </h4>
                        <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] mt-1 font-medium min-h-[32px]">
                          {plan.tagline.mr}
                        </p>
                      </div>

                      <div className="pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#0B1E15] dark:text-white">
                            {price === 0 ? 'मोफत' : `₹${price.toLocaleString('en-IN')}`}
                          </span>
                          {price > 0 && (
                            <span className="text-xs text-[#6B7A72] dark:text-[#A4B5AC] font-bold">
                              / {selectedCycle === 'yearly' ? 'वर्ष' : 'महिना'}
                            </span>
                          )}
                        </div>
                        {selectedCycle === 'yearly' && price > 0 && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">
                            {t.saveAnnualDiscount}
                          </span>
                        )}
                      </div>

                      {/* Features list */}
                      <ul className="space-y-2 text-xs">
                        {plan.features.mr.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#0B1E15] dark:text-[#CBDCD4] font-medium">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E7E2D6] dark:border-[#263B30]">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-bold cursor-default"
                        >
                          सध्याची योजना (Current Plan)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpgradePlan(planKey)}
                          disabled={isUpgrading}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                            plan.popular
                              ? 'bg-[#1F4D3A] hover:bg-[#173A2C] text-white shadow-md'
                              : 'border-2 border-[#1F4D3A] text-[#1F4D3A] dark:text-[#3BA378] dark:border-[#3BA378] hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                          }`}
                        >
                          {isUpgrading ? (
                            <span>प्रक्रिया सुरू आहे...</span>
                          ) : (
                            <>
                              <span>{t.upgradeNow}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invoices & Receipts History */}
          <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
                <span>{t.invoicesAndReceipts}</span>
              </h3>
              <span className="text-xs text-[#6B7A72] dark:text-[#A4B5AC] font-semibold">
                एकूण {invoices.length} देयके
              </span>
            </div>

            {invoices.length === 0 ? (
              <p className="text-xs text-[#6B7A72] dark:text-[#A4B5AC] py-4 text-center">
                अद्याप कोणतेही बिलिंग इनव्हॉइस उपलब्ध नाही.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E7E2D6] dark:border-[#263B30] text-[#6B7A72] dark:text-[#A4B5AC]">
                      <th className="py-2 px-3 font-bold">चलन क्र. (Invoice #)</th>
                      <th className="py-2 px-3 font-bold">दिनांक</th>
                      <th className="py-2 px-3 font-bold">रक्कम</th>
                      <th className="py-2 px-3 font-bold">स्थिती</th>
                      <th className="py-2 px-3 font-bold">पावती</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-gray-100 dark:border-[#1F3027] hover:bg-gray-50 dark:hover:bg-[#1A2E24] text-[#0B1E15] dark:text-[#CBDCD4]"
                      >
                        <td className="py-2.5 px-3 font-bold">{inv.invoiceNumber}</td>
                        <td className="py-2.5 px-3 text-[#6B7A72] dark:text-[#A4B5AC]">
                          {new Date(inv.createdAt).toLocaleDateString('mr-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-2.5 px-3 font-black">
                          ₹{inv.amountInr.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            यशस्वी (Paid)
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => alert(`चलन क्रमांक ${inv.invoiceNumber} डाऊनलोड होत आहे.`)}
                            className="text-[#1F4D3A] dark:text-[#3BA378] font-bold hover:underline"
                          >
                            PDF पावती
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

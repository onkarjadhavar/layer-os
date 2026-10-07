'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency, formatIndianNumber, convertEggUnits, convertEggRate } from '@/lib/calc';
import {
  CircleDollarSign,
  Plus,
  Share2,
  Clock,
  CheckCircle,
  Truck,
  UserCheck,
  Search,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export function SalesModule() {
  const { customers, sales, addSale, recordPayment, unitSettings } = useLayerOS();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'sales-list' | 'new-sale' | 'customers' | 'ageing'>('sales-list');
  const [searchTerm, setSearchTerm] = useState('');

  // New Sale Form State
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [saleType, setSaleType] = useState<'eggs' | 'empty_bags' | 'spent_birds' | 'manure' | 'other'>('eggs');
  const [unitType, setUnitType] = useState<'per_egg' | 'per_100' | 'tray' | 'gatta'>('per_100');
  const [quantity, setQuantity] = useState<number>(15000);
  const [rate, setRate] = useState<number>(540); // ₹540 per 100 = ₹5.40/egg
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(81000);
  const [paymentMode, setPaymentMode] = useState<string>('upi');
  const [vehicleNo, setVehicleNo] = useState<string>('MH 12 QW 4421');
  const [driverName, setDriverName] = useState<string>('गोविंद राठोड');

  // Customer Payment Modal
  const [payingCustomerId, setPayingCustomerId] = useState<string | null>(null);
  const [payAmountInput, setPayAmountInput] = useState<string>('');

  const selectedCustomer = customers.find(c => c.id === customerId);

  // Compute total eggs equivalent and gross amount
  let totalEggsEquivalent = quantity;
  let grossAmount = 0;

  if (saleType === 'eggs') {
    if (unitType === 'per_egg') {
      totalEggsEquivalent = quantity;
      grossAmount = quantity * rate;
    } else if (unitType === 'per_100') {
      totalEggsEquivalent = quantity;
      grossAmount = (quantity / 100) * rate;
    } else if (unitType === 'tray') {
      totalEggsEquivalent = quantity * unitSettings.traySizeEggs;
      grossAmount = quantity * rate;
    } else if (unitType === 'gatta') {
      const eggsInGatta = unitSettings.gattaSizeTrays * unitSettings.traySizeEggs;
      totalEggsEquivalent = quantity * eggsInGatta;
      grossAmount = quantity * rate;
    }
  } else {
    // other sale types
    grossAmount = quantity * rate;
  }

  const netAmount = Math.max(0, grossAmount - discount);

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    let paymentStatus: 'paid' | 'partial' | 'pending' = 'pending';
    if (paidAmount >= netAmount) {
      paymentStatus = 'paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'partial';
    }

    addSale({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      saleDate: new Date().toISOString().split('T')[0],
      saleType,
      quantityUnits: quantity,
      unitName: unitType,
      ratePerUnit: rate,
      grossAmount,
      discount,
      netAmount,
      paidAmount,
      paymentStatus,
      vehicleNumber: vehicleNo,
      deliveryPerson: driverName,
    });

    setActiveTab('sales-list');
  };

  const handleSettlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payingCustomerId && Number(payAmountInput) > 0) {
      recordPayment(payingCustomerId, Number(payAmountInput));
      setPayingCustomerId(null);
      setPayAmountInput('');
    }
  };

  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentOutstanding, 0);

  // Filtered customers
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-5">
      {/* Top Header & Metrics */}
      <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCD3C3] dark:border-[#263B30] gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <CircleDollarSign className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>अंडी विक्री व ग्राहक व्यवस्थापन (Sales & Receivables)</span>
            </h2>
            <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
              अंडी, रिकामी पोती, खत विक्री, इनव्हॉइस आणि उधारीचे वय विश्लेषण
            </p>
          </div>

          <button
            onClick={() => setActiveTab('new-sale')}
            className="py-2.5 px-4 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#D9A441]" />
            <span>नवीन विक्री नोंदवा (New Sale)</span>
          </button>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('sales-list')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeTab === 'sales-list'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            आजच्या व अलीकडील विक्री ({sales.length})
          </button>
          <button
            onClick={() => setActiveTab('new-sale')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeTab === 'new-sale'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            + नवीन चलन (New Invoice)
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            ग्राहक यादी ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('ageing')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeTab === 'ageing'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            उधारीचे वय विश्लेषण (Ageing)
          </button>
        </div>
      </div>

      {/* 1. SALES LIST TAB */}
      {activeTab === 'sales-list' && (
        <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
              विक्री नोंदी (Recent Sales & Dispatches)
            </h3>
            <span className="text-xs font-bold text-[#4D6558] dark:text-[#CBDCD4]">
              एकूण {sales.length} नोंदी
            </span>
          </div>

          <div className="space-y-3">
            {sales.map(s => {
              const unpaid = s.netAmount - s.paidAmount;
              const waText = encodeURIComponent(
                `*सह्याद्री लेयर फार्म - अंडी विक्री पावती*\nचलन क्र: ${s.invoiceNumber}\nग्राहक: ${s.customerName}\nप्रमाण: ${s.quantityUnits} ${s.unitName}\nदर: ₹${s.ratePerUnit}\nएकूण रक्कम: ₹${s.netAmount.toLocaleString('en-IN')}\nजमा रक्कम: ₹${s.paidAmount.toLocaleString('en-IN')}\nशिल्लक उधारी: ₹${unpaid.toLocaleString('en-IN')}\nवाहन: ${s.vehicleNumber || 'MH 12 QW 4421'}\nधन्यवाद!`
              );

              return (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#1F4D3A] transition-colors shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#1F4D3A] dark:text-[#42BF87]">
                        {s.invoiceNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-white dark:bg-[#16241D] text-[#2D4538] dark:text-[#CBDCD4] border border-[#DCD3C3] dark:border-[#263B30]">
                        {s.saleType}
                      </span>
                      <span className="text-xs font-medium text-[#4D6558] dark:text-[#CBDCD4]">
                        • {s.saleDate}
                      </span>
                    </div>

                    <div className="text-sm font-black text-[#0B1E15] dark:text-white">
                      {s.customerName}
                    </div>

                    <div className="text-xs text-[#2D4538] dark:text-[#CBDCD4] flex items-center gap-3">
                      <span>
                        प्रमाण: <strong className="text-[#0B1E15] dark:text-white font-bold">{formatIndianNumber(s.quantityUnits)} {s.unitName}</strong>
                      </span>
                      <span>
                        दर: <strong className="text-[#B07B18] dark:text-[#E5B252] font-bold">₹{s.ratePerUnit}</strong>
                      </span>
                      {s.vehicleNumber && (
                        <span className="hidden sm:inline text-[#4D6558] dark:text-[#CBDCD4]">
                          वाहन: {s.vehicleNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-[#DCD3C3]/50 dark:border-gray-700">
                    <div className="text-left md:text-right">
                      <div className="text-base font-black text-[#0B1E15] dark:text-white">
                        {formatIndianCurrency(s.netAmount)}
                      </div>
                      <div className="text-[11px] font-semibold">
                        {s.paymentStatus === 'paid' && (
                          <span className="text-emerald-600 font-bold">✓ पूर्ण जमा</span>
                        )}
                        {s.paymentStatus === 'partial' && (
                          <span className="text-amber-600 font-bold">
                            थकबाकी: {formatIndianCurrency(unpaid)}
                          </span>
                        )}
                        {s.paymentStatus === 'pending' && (
                          <span className="text-red-600 font-bold">उधारीवर बाकी</span>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp share invoice button */}
                    <a
                      href={`https://wa.me/?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-sm"
                      title="WhatsApp वर पावती पाठवा"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. NEW SALE FORM TAB */}
      {activeTab === 'new-sale' && (
        <form onSubmit={handleCreateSale} className="card-layer p-5 md:p-7 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] max-w-2xl mx-auto space-y-4 shadow-xs">
          <div className="pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
            <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
              नवीन विक्री चलन तयार करा (Create Egg Sale Invoice)
            </h3>
            <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
              अंडी, रिकामी पोती किंवा इतर मालाचे अधिकृत बिल
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                ग्राहक निवडा *
              </label>
              <select
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.area}) • उधारी: ₹{c.currentOutstanding.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                विक्री प्रकार *
              </label>
              <select
                value={saleType}
                onChange={e => setSaleType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
              >
                <option value="eggs">अंडी (Fresh Table Eggs)</option>
                <option value="empty_bags">रिकामी पोती (Empty Feed Bags)</option>
                <option value="spent_birds">कल्ड पक्षी (Spent Hens)</option>
                <option value="manure">पोल्ट्री खत (Poultry Manure)</option>
                <option value="other">इतर</option>
              </select>
            </div>
          </div>

          {saleType === 'eggs' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  युनिट प्रकार (Unit) *
                </label>
                <select
                  value={unitType}
                  onChange={e => {
                    const u = e.target.value as any;
                    setUnitType(u);
                    if (u === 'per_100') setRate(540);
                    if (u === 'per_egg') setRate(5.40);
                    if (u === 'tray') setRate(162);
                    if (u === 'gatta') setRate(1134);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                >
                  <option value="per_100">प्रति १०० अंडी (NECC)</option>
                  <option value="per_egg">प्रति १ अंडे</option>
                  <option value="tray">ट्रे (३० अंडी)</option>
                  <option value="gatta">गट्टा / पेटी ({unitSettings.gattaSizeTrays * unitSettings.traySizeEggs} अंडी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  प्रमाण (Quantity) *
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  दर प्रति युनिट (₹) *
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-black text-[#B07B18] dark:text-[#E5B252]"
                />
              </div>
            </div>
          )}

          {/* Amount Calculation Box */}
          <div className="p-4 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/20 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">एकूण बिल रक्कम (Net Amount)</div>
              <div className="text-xl font-black text-[#1F4D3A] dark:text-[#42BF87] mt-0.5">
                {formatIndianCurrency(netAmount)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">एकूण अंडी संख्या</div>
              <div className="text-sm font-black text-[#0B1E15] dark:text-white mt-0.5">
                {formatIndianNumber(totalEggsEquivalent)} अंडी
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                जमा रोख / ऑनलाईन रक्कम (₹)
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={e => setPaidAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                पेमेंट पद्धत
              </label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
              >
                <option value="upi">UPI / PhonePe / GPay</option>
                <option value="cash">रोख (Cash)</option>
                <option value="bank">बँक ट्रान्सफर (NEFT/RTGS)</option>
                <option value="credit">उधारीवर (Full Credit)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">गाडी नंबर</label>
              <input
                type="text"
                value={vehicleNo}
                onChange={e => setVehicleNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-medium text-[#0B1E15] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">डिलिव्हरी व्यक्ती</label>
              <input
                type="text"
                value={driverName}
                onChange={e => setDriverName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-medium text-[#0B1E15] dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab('sales-list')}
              className="px-4 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]"
            >
              रद्द करा
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-black shadow-md flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-[#D9A441]" />
              <span>विक्री बिल साठवा</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. CUSTOMER MASTER TAB */}
      {activeTab === 'customers' && (
        <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                ग्राहकांची यादी व पत मर्यादा (Customer Master & Credit Limits)
              </h3>
              <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
                एकूण थकबाकी: <strong className="text-red-600 dark:text-red-400">{formatIndianCurrency(totalOutstanding)}</strong>
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#2D4538] dark:text-[#CBDCD4] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="नाव, परिसर किंवा फोन..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCustomers.map(c => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] flex flex-col justify-between hover:border-[#1F4D3A] transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-white dark:bg-[#16241D] text-[#2D4538] dark:text-[#CBDCD4] border border-[#DCD3C3] dark:border-[#263B30]">
                      {c.customerType}
                    </span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                      {c.onTimePaymentPct}% वेळेवर भरणा
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#0B1E15] dark:text-white mt-1.5">
                    {c.name}
                  </h4>
                  <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
                    {c.area} • +91 {c.phone}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#DCD3C3]/50 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-[#4D6558] dark:text-[#CBDCD4]">चालू उधारी (Outstanding)</div>
                    <div className="text-sm font-black text-amber-700 dark:text-amber-400 mt-0.5">
                      {formatIndianCurrency(c.currentOutstanding)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPayingCustomerId(c.id);
                      setPayAmountInput(String(c.currentOutstanding));
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black shadow-xs"
                  >
                    पेमेंट जमा करा
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AGEING ANALYSIS TAB */}
      {activeTab === 'ageing' && (
        <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4 shadow-xs">
          <div className="pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
              उधारीचे वय विश्लेषण (Receivables Ageing Analysis)
            </h3>
            <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
              किती दिवसांपासून उधारी प्रलंबित आहे याचे वर्गीकरण
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">ग्राहक नाव</th>
                  <th className="p-3">०-७ दिवस</th>
                  <th className="p-3">८-१५ दिवस</th>
                  <th className="p-3">१६-३० दिवस</th>
                  <th className="p-3 text-red-600 dark:text-red-400">३०+ दिवस (धोका)</th>
                  <th className="p-3 text-right">एकूण उधारी</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="p-3 font-bold text-[#0B1E15] dark:text-white">{c.name}</td>
                    <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">₹{c.days0to7.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-400">₹{c.days8to15.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-amber-700 dark:text-amber-400">₹{c.days16to30.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-black text-red-600 dark:text-red-400">₹{c.days30Plus.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-black text-right text-[#0B1E15] dark:text-white">{formatIndianCurrency(c.currentOutstanding)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settle Payment Modal */}
      {payingCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSettlePayment} className="w-full max-w-sm bg-white dark:bg-[#16241D] rounded-2xl p-6 border shadow-xl space-y-4">
            <h4 className="text-sm font-bold">ग्राहकाचे पेमेंट जमा करा</h4>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">जमा झालेली रक्कम (₹)</label>
              <input
                type="number"
                required
                value={payAmountInput}
                onChange={e => setPayAmountInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-base font-bold text-[#1F4D3A]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPayingCustomerId(null)}
                className="px-3 py-1.5 rounded-lg border text-xs font-bold"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#1F4D3A] text-white text-xs font-bold"
              >
                जमा करा
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  Search,
  Car,
  CreditCard,
  AlertTriangle,
  MapPin,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency, getStatusBadgeColor } from '../../utils/helpers';
import { RTO_OFFICES, INITIAL_VEHICLES, INITIAL_CHALLANS } from '../../data/mockData';

export const PublicServicesHub: React.FC = () => {
  const { openPaymentModal, payChallan, challans, t } = useApp();

  const [activeTab, setActiveTab] = useState<'rc' | 'challan' | 'dl' | 'rto' | 'calculator'>('rc');

  // RC Search State
  const [rcQuery, setRcQuery] = useState('DL01AB1234');
  const [rcResult, setRcResult] = useState<any | null>(INITIAL_VEHICLES[0]);

  // Challan Search State
  const [challanQuery, setChallanQuery] = useState('DL01AB1234');
  const [challanResults, setChallanResults] = useState<any[]>(
    challans.filter((c) => c.vehicleNo === 'DL01AB1234')
  );

  // DL Verify State
  const [dlQuery, setDlQuery] = useState('DL-0120150045678');
  const [dlDob, setDlDob] = useState('1988-06-24');
  const [dlResult, setDlResult] = useState<any | null>({
    licenceNo: 'DL-0120150045678',
    holderName: 'R***** K**** S*****',
    validTill: '2038-06-23',
    status: 'ACTIVE & VALID',
    rto: 'RTO Mall Road, Delhi',
    classes: 'MCWG, LMV',
  });

  // RTO Locator State
  const [rtoStateFilter, setRtoStateFilter] = useState('All');
  const [selectedRto, setSelectedRto] = useState<any>(RTO_OFFICES[0]);

  // Fee Calculator State
  const [calcVehicleType, setCalcVehicleType] = useState('4W');
  const [calcService, setCalcService] = useState('transfer');
  const [calcVehicleCost, setCalcVehicleCost] = useState('800000');

  const handleSearchRC = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = rcQuery.trim().toUpperCase().replace(/\s/g, '');
    const found = INITIAL_VEHICLES.find((v) => v.registrationNo.replace(/\s/g, '') === clean);
    if (found) {
      setRcResult(found);
    } else {
      // Mock result
      setRcResult({
        registrationNo: clean,
        chassisNo: 'MAT621345N2XXXXXX',
        engineNo: 'REV12P8765XXX',
        ownerName: 'R***** K****',
        vehicleClass: 'Motor Car / LMV',
        makerModel: 'Maruti Suzuki Baleno Alpha',
        fuelType: 'PETROL',
        registrationDate: '2021-03-10',
        rcExpiryDate: '2036-03-09',
        rcStatus: 'VALID',
        insurance: { provider: 'New India Assurance', validTill: '2027-03-10', status: 'VALID' },
        puc: { certificateNo: 'PUC-DL-99120', validTill: '2026-11-20', status: 'VALID' },
        fitness: { certificateNo: 'FIT-2021-99', validTill: '2036-03-09', status: 'VALID' },
        tax: { receiptNo: 'LTT-DL-8812', paidTill: 'Lifetime', status: 'VALID' },
        rtoName: 'RTO Delhi West',
        state: 'Delhi',
      });
    }
  };

  const handleSearchChallan = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = challanQuery.trim().toUpperCase();
    const found = challans.filter(
      (c) => c.vehicleNo.includes(clean) || c.challanNo.includes(clean)
    );
    setChallanResults(found);
  };

  const handlePayPublicChallan = (challan: any) => {
    openPaymentModal(
      `Traffic Violation Fine Payment (${challan.challanNo})`,
      {
        baseFee: challan.fineAmount,
        userCharges: 0,
        roadTax: 0,
        postalFee: 0,
        total: challan.fineAmount,
      },
      (receipt) => {
        payChallan(challan.challanNo, receipt);
        setChallanResults((prev) =>
          prev.map((c) =>
            c.challanNo === challan.challanNo
              ? {
                  ...c,
                  status: 'PAID',
                  paymentDetails: {
                    transactionId: receipt.transactionId,
                    paidAt: new Date().toLocaleString('en-IN'),
                    receiptNo: receipt.receiptNo,
                    paymentMode: 'BharatKosh Gateway',
                  },
                }
              : c
          )
        );
      }
    );
  };

  // Fee calculation computation
  const calculateEstimatedFee = () => {
    let fee = 0;
    if (calcService === 'transfer') fee = 530;
    else if (calcService === 'renewal') fee = 1250;
    else if (calcService === 'new_reg') {
      const cost = Number(calcVehicleCost) || 0;
      fee = cost * 0.08 + 600; // 8% road tax + ₹600 registration
    } else if (calcService === 'll') fee = 250;
    else if (calcService === 'pdl') fee = 650;
    return fee;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            {t.publicHubTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
          {t.publicHubSubtitle}
        </p>

        {/* Tab Buttons */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'rc', label: t.knowYourVehicle, icon: Car },
            { id: 'challan', label: t.checkChallan, icon: AlertTriangle },
            { id: 'dl', label: t.verifyDL, icon: CreditCard },
            { id: 'rto', label: t.rtoLocator, icon: MapPin },
            { id: 'calculator', label: t.feeCalculator, icon: Calculator },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. RC LOOKUP */}
      {activeTab === 'rc' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-2">
              Public Vehicle Registration Details Lookup
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter any Indian vehicle registration number to check masked owner details, insurance status, and fitness validity.
            </p>

            <form onSubmit={handleSearchRC} className="flex gap-2 max-w-lg">
              <input
                type="text"
                value={rcQuery}
                onChange={(e) => setRcQuery(e.target.value)}
                placeholder="e.g. DL01AB1234, MH02CD5678..."
                className="flex-1 uppercase font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {rcResult && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="font-mono font-black text-lg bg-slate-900 text-white px-3.5 py-1.5 rounded-xl border-2 border-slate-700 shadow-inner">
                    {rcResult.registrationNo}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rcResult.makerModel}</h4>
                    <p className="text-xs text-slate-500">RTO: {rcResult.rtoName}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Status: {rcResult.rcStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">OWNER (MASKED)</span>
                  <span className="font-bold text-slate-800">{rcResult.ownerName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">FUEL & CLASS</span>
                  <span className="font-bold text-slate-800">{rcResult.fuelType} • {rcResult.vehicleClass}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">INSURANCE VALID TILL</span>
                  <span className="font-bold text-slate-800">{formatDate(rcResult.insurance?.validTill || '')}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">PUC VALID TILL</span>
                  <span className="font-bold text-slate-800">{formatDate(rcResult.puc?.validTill || '')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. CHALLAN SEARCH & PAY */}
      {activeTab === 'challan' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-2">
              Online Traffic Violation Challan Search & Instant Fine Payment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter vehicle registration number to view pending photographic violation notices from City Traffic Police.
            </p>

            <form onSubmit={handleSearchChallan} className="flex gap-2 max-w-lg">
              <input
                type="text"
                value={challanQuery}
                onChange={(e) => setChallanQuery(e.target.value)}
                placeholder="Vehicle Number or Challan No"
                className="flex-1 uppercase font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
              />
              <button
                type="submit"
                className="bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Search Fines</span>
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {challanResults.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <strong className="text-slate-800 text-sm block">No Pending Traffic Challans Found</strong>
                Great job! Your vehicle has a clean driving record with zero pending violations.
              </div>
            ) : (
              challanResults.map((ch) => (
                <div
                  key={ch.challanNo}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-blue-950 bg-blue-50 px-2.5 py-0.5 rounded">
                          {ch.challanNo}
                        </span>
                        <span className="font-mono font-bold text-xs text-slate-700">
                          {ch.vehicleNo}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1.5">
                        {ch.violationType}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ch.section} • {ch.trafficPoliceJurisdiction}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          ch.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800 animate-pulse'
                        }`}
                      >
                        {ch.status}
                      </span>
                      <div className="text-lg font-black text-slate-900 mt-1">
                        {formatCurrency(ch.fineAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">VIOLATION DATE & TIME</span>
                        <span className="font-bold text-slate-800">{ch.date} at {ch.time}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">INTERSECTION / ROAD LOCATION</span>
                        <span className="font-semibold text-slate-800">{ch.location}</span>
                      </div>
                    </div>

                    {/* Photo Proof */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                      <img
                        src={ch.evidenceUrl}
                        alt="Evidence"
                        className="w-24 h-16 object-cover rounded-lg border border-slate-300 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">ANPR CAMERA EVIDENCE</span>
                        <span className="text-[11px] text-slate-600">High-resolution CCTV camera snapshot capture.</span>
                      </div>
                    </div>
                  </div>

                  {ch.status === 'PENDING' ? (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handlePayPublicChallan(ch)}
                        className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
                      >
                        Pay Fine ({formatCurrency(ch.fineAmount)}) Online &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Fine cleared. Receipt #{ch.paymentDetails?.receiptNo}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{ch.paymentDetails?.paidAt}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. RTO LOCATOR */}
      {activeTab === 'rto' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">RTO Directory</h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {RTO_OFFICES.map((r) => (
                <div
                  key={r.code}
                  onClick={() => setSelectedRto(r)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedRto.code === r.code
                      ? 'border-blue-900 bg-blue-50 text-blue-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-mono text-[11px] text-blue-900 font-bold">{r.code}</div>
                  <div className="font-semibold text-slate-900">{r.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{r.state}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedRto && (
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono font-bold text-sm bg-blue-950 text-white px-2.5 py-0.5 rounded">
                    {selectedRto.code}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {selectedRto.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedRto.state}</p>
                </div>
              </div>

              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{selectedRto.address} - PIN: {selectedRto.pincode}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>{selectedRto.workingHours}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Phone: {selectedRto.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Official Email: {selectedRto.email}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Regional Transport Officer (In-Charge):
                </span>
                <span className="font-bold text-slate-900">{selectedRto.rtoOfficerName}</span>
                <p className="text-[11px] text-slate-500">{selectedRto.counterTimings}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FEE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-5 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              National RTO Service Fee & Road Tax Estimator
            </h3>
            <p className="text-xs text-slate-500">
              Estimate official statutory government fee before submitting your application.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Type</label>
              <select
                value={calcService}
                onChange={(e) => setCalcService(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              >
                <option value="transfer">Transfer of Ownership (Form 29/30)</option>
                <option value="renewal">15-Year RC Renewal & Fitness</option>
                <option value="new_reg">New Vehicle Registration & Lifetime Road Tax</option>
                <option value="ll">New Learner’s Licence (LL)</option>
                <option value="pdl">Permanent Driving Licence (DL)</option>
              </select>
            </div>

            {calcService === 'new_reg' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Ex-Showroom Cost (₹)</label>
                <input
                  type="number"
                  value={calcVehicleCost}
                  onChange={(e) => setCalcVehicleCost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
              </div>
            )}
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl text-center space-y-1 shadow-md">
            <span className="text-[11px] text-blue-200 uppercase font-bold tracking-wider">
              Estimated Total Government Statutory Fee:
            </span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {formatCurrency(calculateEstimatedFee())}
            </div>
            <p className="text-[10px] text-slate-400">
              Includes RTO statutory fee, user charge, and Smartcard dispatch postal costs.
            </p>
          </div>
        </div>
      )}

      {/* 5. DL VERIFY */}
      {activeTab === 'dl' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">
            Verify Driving Licence Authenticity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Driving Licence Number</label>
              <input
                type="text"
                value={dlQuery}
                onChange={(e) => setDlQuery(e.target.value)}
                placeholder="DL-0120150045678"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dlDob}
                onChange={(e) => setDlDob(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          {dlResult && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-2 text-emerald-950">
              <div className="flex items-center justify-between font-bold">
                <span className="font-mono text-sm">{dlResult.licenceNo}</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                  {dlResult.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Holder: <strong>{dlResult.holderName}</strong></div>
                <div>Valid Till: <strong>{dlResult.validTill}</strong></div>
                <div>Issuing RTO: <strong>{dlResult.rto}</strong></div>
                <div>Authorized Classes: <strong>{dlResult.classes}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Car,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Download,
  MapPin,
  FileText,
  Share2,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { generateAppNumber, formatCurrency, isValidMobile, isValidAadhaar } from '../../utils/helpers';

interface GenericVehicleWizardProps {
  serviceId: string;
  onCancel: () => void;
}

export const GenericVehicleWizard: React.FC<GenericVehicleWizardProps> = ({ serviceId, onCancel }) => {
  const { vehicles, user, addApplication, openPaymentModal, openReceiptModal } = useApp();

  const serviceConfigs: Record<
    string,
    { title: string; subtitle: string; baseFee: number; userCharge: number; postalFee: number; icon: any; formType: string }
  > = {
    'change-address-rc': {
      title: 'Change of Residential Address in RC',
      subtitle: 'Aadhaar e-KYC instant address update for vehicle registration',
      baseFee: 300,
      userCharge: 50,
      postalFee: 200,
      icon: MapPin,
      formType: 'address',
    },
    'duplicate-rc': {
      title: 'Issue of Duplicate RC (Form 26)',
      subtitle: 'Replacement smartcard RC for lost, stolen, or mutilated certificates',
      baseFee: 300,
      userCharge: 50,
      postalFee: 200,
      icon: FileText,
      formType: 'duplicate',
    },
    'interstate-noc': {
      title: 'Interstate Transfer NOC (Form 28)',
      subtitle: 'Grant of No Objection Certificate for vehicle re-registration in another state',
      baseFee: 300,
      userCharge: 50,
      postalFee: 0,
      icon: Share2,
      formType: 'noc',
    },
    'fitness-renewal': {
      title: 'Vehicle Fitness Certificate Renewal',
      subtitle: 'Mandatory emissions & roadworthiness inspection certificate',
      baseFee: 800,
      userCharge: 100,
      postalFee: 0,
      icon: ShieldCheck,
      formType: 'fitness',
    },
    'new-registration': {
      title: 'New Vehicle Registration (Form 20)',
      subtitle: 'Permanent registration certificate and lifetime road tax payment',
      baseFee: 600,
      userCharge: 50,
      postalFee: 200,
      icon: Award,
      formType: 'new_reg',
    },
  };

  const config = serviceConfigs[serviceId] || serviceConfigs['change-address-rc'];
  const totalFee = config.baseFee + config.userCharge + config.postalFee;

  const [step, setStep] = useState(1);
  const [selectedVehicleReg, setSelectedVehicleReg] = useState(
    vehicles.length > 0 ? vehicles[0].registrationNo : ''
  );

  // Dynamic Form Fields
  const [newAddress, setNewAddress] = useState('Flat 501, Palm Meadows, Whitefield, Bengaluru - 560066');
  const [firNumber, setFirNumber] = useState('FIR-DEL-2026-99120');
  const [firDate, setFirDate] = useState('2026-08-20');
  const [targetState, setTargetState] = useState('Karnataka (KA)');
  const [targetRto, setTargetRto] = useState('KA-03 Indiranagar');
  const [makerModel, setMakerModel] = useState('Mahindra XUV700 AX7 Luxury');
  const [chassisNumber, setChassisNumber] = useState('MA1XU700N2A881290');
  const [vehicleCost, setVehicleCost] = useState('1800000');
  const [fuelType, setFuelType] = useState<'PETROL' | 'DIESEL' | 'ELECTRIC'>('DIESEL');

  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<Application | null>(null);

  const selectedVehicle = vehicles.find((v) => v.registrationNo === selectedVehicleReg) || vehicles[0];

  const handleSubmitAndPay = () => {
    openPaymentModal(
      config.title,
      {
        baseFee: config.baseFee,
        userCharges: config.userCharge,
        roadTax: 0,
        postalFee: config.postalFee,
        total: totalFee,
      },
      (receipt) => {
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber('VEH'),
          serviceType: config.title,
          serviceCategory: 'vehicle',
          applicantName: user?.name || 'Citizen',
          applicantMobile: user?.mobile || '+91 9876543210',
          applicantAadhaarMasked: user?.aadhaar || 'XXXX-XXXX-8924',
          vehicleNo: serviceId === 'new-registration' ? 'NEW-APPLIED' : selectedVehicle?.registrationNo,
          rtoCode: selectedVehicle?.rtoCode || 'DL-01',
          rtoName: selectedVehicle?.rtoName || 'RTO Mall Road',
          state: selectedVehicle?.state || 'Delhi',
          submittedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          currentStage: 'SCRUTINY',
          stages: [
            {
              stageKey: 'SUBMITTED',
              stageName: `${config.title} Application Filed`,
              timestamp: 'Just now',
              status: 'completed',
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'Statutory Government Fee Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${totalFee} paid via BharatKosh`,
            },
            {
              stageKey: 'SCRUTINY',
              stageName: 'RTO Officer Scrutiny & Clearance',
              status: 'current',
            },
            {
              stageKey: 'APPROVED',
              stageName: 'Certificate Issued & Dispatched',
              status: 'pending',
            },
          ],
          documents: [
            {
              name: `Application Document (${config.title})`,
              type: 'PDF',
              url: 'mock://app_doc.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: config.baseFee,
            userCharges: config.userCharge,
            roadTax: 0,
            postalSmartcardFee: config.postalFee,
            total: totalFee,
            paymentStatus: 'PAID',
            transactionId: receipt.transactionId,
            paymentDate: new Date().toLocaleString('en-IN'),
            receiptNo: receipt.receiptNo,
          },
          estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        };

        addApplication(newApp);
        setGeneratedApp(newApp);
        setIsSuccess(true);
      }
    );
  };

  const Icon = config.icon;

  if (isSuccess && generatedApp) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full uppercase">
            Application Registered
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{config.title}</h3>
          <p className="text-xs text-slate-600 mt-1">
            Application Ref No: <strong className="font-mono text-blue-950 text-base">{generatedApp.applicationNo}</strong>
          </p>
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
            <span>Download Tax Receipt</span>
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
      {/* Header */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">{config.title}</h2>
            <p className="text-xs text-blue-200">{config.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg"
        >
          Cancel
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-5 text-xs">
        {serviceId !== 'new-registration' ? (
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Registered Vehicle</label>
            <select
              value={selectedVehicleReg}
              onChange={(e) => setSelectedVehicleReg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
            >
              {vehicles.map((v) => (
                <option key={v.registrationNo} value={v.registrationNo}>
                  {v.registrationNo} - {v.makerModel}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Maker & Model</label>
                <input
                  type="text"
                  value={makerModel}
                  onChange={(e) => setMakerModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chassis Number</label>
                <input
                  type="text"
                  value={chassisNumber}
                  onChange={(e) => setChassisNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                >
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric (EV)</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ex-Showroom Price (₹)</label>
                <input
                  type="number"
                  value={vehicleCost}
                  onChange={(e) => setVehicleCost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Fields */}
        {config.formType === 'address' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1">New Residential Address</label>
            <textarea
              rows={2}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900"
            />
          </div>
        )}

        {config.formType === 'duplicate' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Police Complaint / FIR Number</label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of FIR / Loss</label>
              <input
                type="date"
                value={firDate}
                onChange={(e) => setFirDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
          </div>
        )}

        {config.formType === 'noc' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Destination State</label>
              <select
                value={targetState}
                onChange={(e) => setTargetState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option>Karnataka (KA)</option>
                <option>Maharashtra (MH)</option>
                <option>Tamil Nadu (TN)</option>
                <option>Uttar Pradesh (UP)</option>
                <option>Gujarat (GJ)</option>
                <option>Telangana (TS)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Destination RTO Office</label>
              <input
                type="text"
                value={targetRto}
                onChange={(e) => setTargetRto(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
          </div>
        )}

        {/* Fee Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Statutory Application Fee:</span>
            <span className="font-bold">₹{config.baseFee}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Portal User Charge:</span>
            <span className="font-bold">₹{config.userCharge}</span>
          </div>
          {config.postalFee > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Smartcard Dispatch Fee:</span>
              <span className="font-bold">₹{config.postalFee}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Payable:</span>
            <span className="text-emerald-700">{formatCurrency(totalFee)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-xs font-bold text-slate-600 cursor-pointer">
          Cancel
        </button>
        <button
          onClick={handleSubmitAndPay}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay {formatCurrency(totalFee)} & Submit Application</span>
        </button>
      </div>
    </div>
  );
};

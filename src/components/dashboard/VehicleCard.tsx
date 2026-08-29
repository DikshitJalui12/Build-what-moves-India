import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Fuel,
  Calendar,
  AlertTriangle,
  FileText,
  ChevronDown,
  Download,
  Share2,
  RefreshCw,
  Landmark,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Vehicle } from '../../types';
import { getStatusBadgeColor, formatDate } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onActionClick?: (actionType: string, vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onActionClick }) => {
  const { setActiveNavTab, setActiveServiceWizard, openAppointmentModal, vaultDocs } = useApp();
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const insBadge = getStatusBadgeColor(vehicle.insurance.status);
  const pucBadge = getStatusBadgeColor(vehicle.puc.status);
  const fitBadge = getStatusBadgeColor(vehicle.fitness.status);
  const rcBadge = getStatusBadgeColor(vehicle.rcStatus);

  const hasPendingAlert =
    vehicle.insurance.status !== 'VALID' ||
    vehicle.puc.status !== 'VALID' ||
    vehicle.rcStatus !== 'VALID';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* Top Banner with License Plate & Fuel Badge */}
      <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        {/* Indian High-Security Registration Plate (HSRP) Visual */}
        <div className="flex items-center bg-white text-slate-900 border-2 border-slate-700 px-3 py-1 rounded-lg font-mono font-black text-sm tracking-wider shadow-inner">
          <span className="text-[10px] text-blue-900 font-sans font-bold mr-1.5 flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
            <span className="text-[9px] leading-none">IND</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span>
          </span>
          <span>{vehicle.registrationNo}</span>
        </div>

        <div className="flex items-center gap-2">
          {vehicle.fuelType === 'ELECTRIC' ? (
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3 text-emerald-400" />
              100% Electric (EV)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
              <Fuel className="w-3 h-3 text-amber-400" />
              {vehicle.fuelType}
            </span>
          )}

          <span className="text-[11px] bg-blue-950 text-blue-200 border border-blue-800 px-2 py-0.5 rounded-full font-medium">
            {vehicle.vehicleClass}
          </span>
        </div>
      </div>

      {/* Vehicle Model & Registration Info */}
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-snug">
              {vehicle.makerModel}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Registered at {vehicle.rtoName} ({vehicle.rtoCode})
            </p>
          </div>

          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${rcBadge.bg} flex items-center gap-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${rcBadge.dot}`}></span>
            RC {rcBadge.text}
          </span>
        </div>

        {/* Chassis & Engine Details */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 mb-4 border border-slate-100 font-mono">
          <div>
            <span className="text-slate-400 block font-sans text-[10px]">CHASSIS NO:</span>
            <span className="font-semibold text-slate-800">{vehicle.chassisNo}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans text-[10px]">ENGINE NO:</span>
            <span className="font-semibold text-slate-800">{vehicle.engineNo}</span>
          </div>
        </div>

        {/* 4 Essential Health & Expiry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {/* Insurance */}
          <div className={`p-2 rounded-xl border text-left ${insBadge.bg}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold opacity-75">INSURANCE</span>
              <Shield className="w-3 h-3" />
            </div>
            <div className="font-bold text-xs leading-tight">
              {vehicle.insurance.status === 'EXPIRED' ? 'EXPIRED' : vehicle.insurance.status === 'EXPIRING_SOON' ? 'RENEW NOW' : 'ACTIVE'}
            </div>
            <div className="text-[10px] opacity-75 mt-0.5 truncate">
              {formatDate(vehicle.insurance.validTill)}
            </div>
          </div>

          {/* PUC Pollution */}
          <div className={`p-2 rounded-xl border text-left ${pucBadge.bg}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold opacity-75">PUC (POLLUTION)</span>
              <RefreshCw className="w-3 h-3" />
            </div>
            <div className="font-bold text-xs leading-tight">
              {vehicle.puc.status === 'EXPIRED' ? 'EXPIRED' : vehicle.puc.status === 'EXPIRING_SOON' ? 'RENEW NOW' : 'VALID'}
            </div>
            <div className="text-[10px] opacity-75 mt-0.5 truncate">
              {formatDate(vehicle.puc.validTill)}
            </div>
          </div>

          {/* Fitness Certificate */}
          <div className={`p-2 rounded-xl border text-left ${fitBadge.bg}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold opacity-75">FITNESS</span>
              <FileText className="w-3 h-3" />
            </div>
            <div className="font-bold text-xs leading-tight">
              {fitBadge.text}
            </div>
            <div className="text-[10px] opacity-75 mt-0.5 truncate">
              {formatDate(vehicle.fitness.validTill)}
            </div>
          </div>

          {/* Road Tax Status */}
          <div className="p-2 rounded-xl border bg-blue-50 text-blue-900 border-blue-200 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold opacity-75">ROAD TAX</span>
              <Landmark className="w-3 h-3 text-blue-700" />
            </div>
            <div className="font-bold text-xs leading-tight">LIFETIME PAID</div>
            <div className="text-[10px] opacity-75 mt-0.5 truncate">
              Receipt: {vehicle.tax.receiptNo}
            </div>
          </div>
        </div>

        {/* Hypothecation / Financed Badge if any */}
        {vehicle.hypothecation?.isFinanced && (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs mb-3">
            <div className="flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                Financed with <strong>{vehicle.hypothecation.bankName}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                setActiveNavTab('vehicle-services');
                setActiveServiceWizard('hypothecation-term');
              }}
              className="text-[11px] font-bold text-blue-700 hover:underline shrink-0 cursor-pointer"
            >
              Clear NOC &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons Tray */}
      <div className="bg-slate-50 border-t border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveNavTab('vehicle-services');
              setActiveServiceWizard('ownership-transfer');
            }}
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
          >
            Transfer Ownership
          </button>
          <button
            onClick={() => {
              setActiveNavTab('vehicle-services');
              setActiveServiceWizard('rc-renewal');
            }}
            className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            Renew RC
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-900 bg-white border border-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <span>More Actions</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isActionsOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 text-xs animate-in fade-in">
              <button
                onClick={() => {
                  setActiveNavTab('vault');
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-700" />
                <span>View / Download Digital RC</span>
              </button>
              <button
                onClick={() => {
                  openAppointmentModal('Vehicle Physical Inspection', vehicle.registrationNo, vehicle.rtoCode);
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>Book RTO Inspection Slot</span>
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('vehicle-services');
                  setActiveServiceWizard('change-address-rc');
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-blue-700" />
                <span>Change Address in RC</span>
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('vehicle-services');
                  setActiveServiceWizard('interstate-noc');
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-blue-700" />
                <span>Apply Interstate NOC</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

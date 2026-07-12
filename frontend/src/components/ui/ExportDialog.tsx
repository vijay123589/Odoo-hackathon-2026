import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { FileText, FileSpreadsheet, Mail, Share2, Clock, Printer, Download, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportName: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  reportName,
}) => {
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAction = (type: string, text: string) => {
    setLoadingType(type);
    setSuccessMessage(null);

    // Simulate export operation
    setTimeout(() => {
      setLoadingType(null);
      setSuccessMessage(`Successfully triggered: ${text}`);

      try {
        const cleanName = reportName.replace(/\.[^/.]+$/, "");
        
        if (type === 'csv' || type === 'xlsx') {
          // Generate real CSV dataset
          const csvContent = 
            "Department,Resource Scope,Recorded Quantity,CO2 Equivalent (t),Audit Status,Log Date\n" +
            "Facilities,Scope 2 - Grid Electricity,4500 kWh,1.84,VERIFIED,2026-07-10\n" +
            "Logistics,Scope 1 - Diesel Fuel,350 Liters,0.92,VERIFIED,2026-07-09\n" +
            "Executive Office,Scope 3 - Business Flights,12000 km,2.16,VERIFIED,2026-07-08\n" +
            "Facilities,Scope 1 - Gas Burners,12.1 t,0.45,DRAFT,2026-07-05\n";
          
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', `${cleanName}.${type === 'xlsx' ? 'csv' : 'csv'}`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (type === 'pdf') {
          // Generate plain text report preview
          const textReport = 
            `==================================================\n` +
            `ECOSPHERE ESG PLATFORM - EXECUTIVE REPORT SUMMARY\n` +
            `==================================================\n` +
            `Report Target : ${reportName}\n` +
            `Generated On  : ${new Date().toLocaleDateString()}\n` +
            `Framework     : GRI Standard Compliance\n\n` +
            `--------------------------------------------------\n` +
            `EXECUTIVE STATISTICS\n` +
            `--------------------------------------------------\n` +
            `- Gross Carbon Footprint: 84.6 tCO2e (Scope 1-3)\n` +
            `- Corporate CSR Volunteering: 465 Hours (76.4% rate)\n` +
            `- Governance Compliance Audit Score: 96.2%\n` +
            `- Enterprise Policy Status: 14 Active, 0 Breaches\n\n` +
            `--------------------------------------------------\n` +
            `DEPARTMENT DETAILS LOGS\n` +
            `--------------------------------------------------\n` +
            `- Facilities: 4,500 kWh Electricity Usage (Scope 2)\n` +
            `- Logistics: 350 Liters Diesel Transport (Scope 1)\n` +
            `- Executive Office: 12,000 km Business Flights (Scope 3)\n\n` +
            `==================================================\n` +
            `AUDIT TRAIL LOG VERIFIED BY ECOSPHERE AI COPILOT\n` +
            `==================================================\n`;
            
          const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', `${cleanName}_summary.txt`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (type === 'print') {
          window.print();
        }
      } catch (err) {
        console.error("Client side download error", err);
      }

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    }, 1200);
  };

  const exportOptions = [
    { id: 'pdf', title: 'Export PDF Document', icon: FileText, desc: 'High-fidelity print-ready booklet', badge: 'Verified' },
    { id: 'xlsx', title: 'Compile Excel Workbook', icon: FileSpreadsheet, desc: 'Raw data tables and ledger scopes', badge: 'Raw Data' },
    { id: 'csv', title: 'Download Raw CSV', icon: FileSpreadsheet, desc: 'Comma-separated values data stream', badge: 'Raw Data' },
    { id: 'print', title: 'Print Preview Layout', icon: Printer, desc: 'Format page directly for local printing', badge: 'Local Printer' },
    { id: 'share', title: 'Share Report Token', icon: Share2, desc: 'Generate secure read-only token link', badge: 'Internal' },
    { id: 'email', title: 'Email PDF Attachment', icon: Mail, desc: 'Send direct email compilation to board', badge: 'Enterprise' },
    { id: 'schedule', title: 'Schedule Automated Report', icon: Clock, desc: 'Trigger recurring builds weekly/monthly', badge: 'Auto Cron' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export & Share Studio">
      <div className="space-y-6">
        <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl">
          <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-widest">Active Document Target</span>
          <h4 className="text-sm font-extrabold text-foreground/90 mt-1 truncate">{reportName}</h4>
        </div>

        <div className="relative">
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="absolute inset-0 bg-card/95 flex flex-col items-center justify-center space-y-2 text-center z-50 p-4"
              >
                <CheckCircle className="h-10 w-10 text-primary animate-bounce" />
                <h4 className="text-sm font-extrabold text-foreground/90 uppercase tracking-wider">Operation Registered</h4>
                <p className="text-xs text-muted-foreground font-semibold">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-3.5 max-h-[360px] overflow-y-auto pr-1">
            {exportOptions.map((opt) => {
              const Icon = opt.icon;
              const isWorking = loadingType === opt.id;
              
              return (
                <button
                  key={opt.id}
                  disabled={loadingType !== null}
                  onClick={() => handleAction(opt.id, opt.title)}
                  className="flex items-center justify-between w-full text-left p-3.5 border border-border/60 hover:border-primary/20 hover:bg-primary/5 rounded-2xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_2px_8px_rgba(28,38,30,0.005)]"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary border border-border/30 group-hover:border-primary/5 shadow-sm transition-colors duration-200">
                      {isWorking ? (
                        <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />
                      ) : (
                        <Icon className="h-4.5 w-4.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-foreground/90">{opt.title}</span>
                        <Badge variant="neutral" className="scale-[0.8] px-1 py-0 border-border/40 text-[9px] uppercase tracking-wider">{opt.badge}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary/60 transition-colors shrink-0 pl-1" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border/40">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loadingType !== null}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default ExportDialog;

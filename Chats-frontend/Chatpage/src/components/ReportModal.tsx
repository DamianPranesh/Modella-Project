import React from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (reason: string) => void;
}

export function ReportModal({ isOpen, onClose, onReport }: ReportModalProps) {
  const reportReasons = [
    { id: 'fake_profile', label: 'Fake Profile' },
    { id: 'rude_abusive', label: 'Rude or Abusive Behavior' },
    { id: 'inappropriate', label: 'Inappropriate Content' },
    { id: 'scam', label: 'Scam or Commercial Activity' },
    { id: 'hate', label: 'Identity-Based Hate' },
    { id: 'off_modella', label: 'Off-Modella Behavior' },
    { id: 'underage', label: 'Underage (18+)' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-bold text-[#000000] mb-4">Report User</h3>
        <p className="text-[#000000] mb-6">Please select a reason for reporting this user:</p>
        
        <div className="space-y-3">
          {reportReasons.map((reason) => (
            <button
              key={reason.id}
              onClick={() => onReport(reason.id)}
              className="w-full text-left px-4 py-3 bg-[#DD8560] hover:bg-[#c77754] rounded-lg text-white text-sm transition-colors"
              style={{ backgroundColor: '#DD8560' }}
            >
              {reason.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 text-[#DD8560] bg-white hover:bg-gray-50 rounded-lg text-sm transition-colors border border-[#DD8560]"
          style={{ backgroundColor: 'white' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

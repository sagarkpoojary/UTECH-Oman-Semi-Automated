import React from 'react';
import { Lead, LeadStatus } from '../types';
import { Icon } from './icons';

interface AdminPageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const statusColors: { [key in LeadStatus]: string } = {
    New: 'bg-gray-100 text-gray-700',
    Verified: 'bg-yellow-100 text-yellow-700',
    Quoted: 'bg-blue-100 text-blue-700',
    Converted: 'bg-green-100 text-green-700',
    Completed: 'bg-primary/20 text-primary',
};

const calculateLeadScore = (lead: Omit<Lead, 'score'>): number => {
    let score = 0;
    if (lead.email && lead.email.includes('@') && !lead.email.endsWith('@gmail.com') && !lead.email.endsWith('@hotmail.com')) {
        score += 2; // Business email +2
    }
    if (lead.phoneVerified) {
        score += 1; // Verified phone +1
    }
    if (lead.company && lead.company.length > 5 && lead.company !== 'N/A') {
        score += 1; // Company name +1
    }
    return score;
};


export const AdminPage: React.FC<AdminPageProps> = ({ leads, setLeads }) => {

    React.useEffect(() => {
        setLeads(currentLeads => currentLeads.map(lead => ({
            ...lead,
            score: calculateLeadScore(lead)
        })));
    }, []);

    const summary = React.useMemo(() => ({
        New: leads.filter(l => l.status === 'New').length,
        Verified: leads.filter(l => l.status === 'Verified').length,
        Quoted: leads.filter(l => l.status === 'Quoted').length,
        Converted: leads.filter(l => l.status === 'Converted').length,
    }), [leads]);

    const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
        setLeads(prev => prev.map(lead => lead.id === leadId ? {...lead, status: newStatus} : lead));
        alert(`Lead #${leadId} status changed to ${newStatus}`);
    };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Admin Lead Dashboard</h1>
        <p className="text-sm text-gray-600 mb-6">Simulated CRM view for UTECH sales and service teams. Lead scoring and automation triggers shown below.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {Object.entries(summary).map(([key, value]) => (
                <div key={key} className="bg-white p-5 rounded-xl shadow border-l-4 border-primary">
                    <p className="text-sm font-medium text-gray-500">{key.toUpperCase()}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Score / Priority</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map(lead => {
                         const isHighPriority = lead.score >= 3;
                        return (
                        <tr key={lead.id} className="border-b hover:bg-gray-50 transition duration-150">
                            <td className="p-4 text-sm font-medium text-gray-900">{lead.name}<br/><span className="text-gray-500 font-normal">{lead.company}</span></td>
                            <td className="p-4 text-sm text-gray-600">{lead.interest}</td>
                            <td className="p-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>{lead.status}</span></td>
                            <td className="p-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${isHighPriority ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>Score: {lead.score}</span></td>
                            <td className="p-4 text-sm">
                                <select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)} className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50 transition">
                                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>

         <div className="mt-8 p-4 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center"><Icon name="zap" className="w-4 h-4 inline mr-1 text-accent"/>Automated Workflow Simulation</h3>
            <ul className="list-disc list-inside space-y-1">
                <li><span className="font-medium">Lead Capture Webhook:</span> All form submissions trigger a POST to <code>https://example.com/webhook/lead-form</code>.</li>
                <li><span className="font-medium">n8n Automation:</span> Webhook &rarr; Create Lead in CRM/Sheet &rarr; Auto Acknowledgement Email.</li>
                <li><span className="font-medium">Post-Install Automation:</span> 'Installation Complete' status triggers automated 5-star rating form email.</li>
            </ul>
        </div>
    </main>
  );
};

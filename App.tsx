import React from 'react';
import { Page, Lead, ConfigState, Product } from './types';
import { HomePage } from './components/HomePage';
import { ConfiguratorPage } from './components/ConfiguratorPage';
import { AdminPage } from './components/AdminPage';
import { Icon } from './components/icons';
import { MOCK_LEADS, MAINTENANCE_PLANS, PRODUCTS } from './constants';

const Header: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => (
    <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage(Page.Home)}>
                <Icon name="shield-check" className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold text-gray-800">UTECH Oman</span>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6">
                <a href="#" onClick={(e) => {e.preventDefault(); alert("Search clicked!")}} className="text-gray-600 hover:text-primary transition hidden sm:block"><Icon name="search" /></a>
                <a href="#" onClick={(e) => {e.preventDefault(); alert("Contact clicked!")}} className="text-gray-600 hover:text-primary transition hidden sm:block"><Icon name="phone" /></a>
                <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(Page.Admin)}} className="text-gray-600 hover:text-primary transition flex items-center space-x-1.5">
                    <Icon name="layout-dashboard" />
                    <span className="hidden md:inline text-sm font-medium">Admin</span>
                </a>
                <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(Page.Configurator)}} className="text-gray-600 hover:text-primary transition"><Icon name="package" /></a>
            </div>
        </div>
    </header>
);

const Chatbot: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <>
            <div onClick={() => setIsOpen(!isOpen)} className="fixed bottom-4 left-4 bg-primary text-white p-3 rounded-full shadow-lg cursor-pointer z-40 hover:scale-105 transition duration-200">
                <Icon name="message-square-text" />
            </div>
            {isOpen && (
                <div className="fixed bottom-20 left-4 w-72 bg-white rounded-xl shadow-2xl p-4 z-40 border border-primary/20">
                    <div className="font-bold text-primary mb-2">UTECH Support Bot</div>
                    <p className="text-sm text-gray-700 mb-4">Hello! I can guide you through building your perfect tech package.</p>
                    <button onClick={() => { onStart(); setIsOpen(false); }} className="w-full bg-accent text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition">Build a Quote</button>
                    <div className="text-xs text-center mt-2 text-gray-500 cursor-pointer" onClick={() => setIsOpen(false)}>Close</div>
                </div>
            )}
        </>
    )
}

const calculateQuoteSummary = (configState: ConfigState) => {
    let itemTotal = 0;
    let totalItems = 0;
    let totalSecurityItems = 0;

    for (const productId in configState.components) {
        const quantity = configState.components[productId];
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) {
            itemTotal += product.price * quantity;
            totalItems += quantity;
            if (product.category === 'Security Systems') {
                totalSecurityItems += quantity;
            }
        }
    }

    let discountRate = 0;
    if (totalItems > 10) discountRate = 0.12;
    else if (totalItems > 5) discountRate = 0.08;

    const bundleDiscount = itemTotal * discountRate;
    let subtotal = itemTotal - bundleDiscount;
    const deliveryFee = 50;
    const installationFee = Math.min(Math.max(totalItems * 20, 150), 5000);
    const totalExclMaintenance = subtotal + deliveryFee + installationFee;
    
    // Maintenance cost only applies to security items
    const maintenancePlan = MAINTENANCE_PLANS[configState.maintenancePlan];
    const maintenanceCost = totalSecurityItems * maintenancePlan.price;

    return { itemTotal, totalItems, discountRate: (discountRate * 100).toFixed(0), bundleDiscount, subtotal, deliveryFee, installationFee, maintenanceCost, totalExclMaintenance };
};


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState<Page>(Page.Home);
    const [leads, setLeads] = React.useState<Lead[]>(MOCK_LEADS);
    const [configState, setConfigState] = React.useState<ConfigState>({
        step: 1,
        selectedCategories: [],
        components: {},
        maintenancePlan: 'Standard',
    });
    const [leadModal, setLeadModal] = React.useState<{ active: boolean, step: 'form' | 'otp', options: any, data?: any }>({ active: false, step: 'form', options: {} });
    const [lastLead, setLastLead] = React.useState<{id: string, name: string} | null>(null);

    React.useEffect(() => {
        // This is crucial for Lucide icons to render from `<i>` tags
        (window as any).lucide?.createIcons();
    });

    const summary = React.useMemo(() => calculateQuoteSummary(configState), [configState]);

    const handleRequestQuote = (options = {}) => {
        setLeadModal({ active: true, step: 'form', options });
    };

    const handleLeadSubmit = (data: any) => {
        setLeadModal(prev => ({ ...prev, step: 'otp', data }));
    };

    const handleOtpVerify = (otp: string) => {
        if (otp === '1234') { // Mock OTP check
            const leadData = leadModal.data;
            const newLeadId = (Math.floor(Math.random() * 90000) + 10000).toString();
            const interest = leadModal.options.prefillConfig ? 'Custom Quote (Builder)' : 'General Inquiry';
            
            const newLead: Lead = {
                id: newLeadId,
                name: leadData.name,
                company: leadData.company,
                email: leadData.email,
                phoneVerified: true,
                interest,
                status: 'New',
                score: 0,
                createdAt: new Date(),
            };

            setLeads(prev => [newLead, ...prev]);
            setLastLead({ id: newLeadId, name: leadData.name });
            setLeadModal({ active: false, step: 'form', options: {} });
            setCurrentPage(Page.Success);
            
            // Reset configurator
            setConfigState({ step: 1, selectedCategories: [], components: {}, maintenancePlan: 'Standard' });
            
        } else {
            alert('Invalid OTP. Please use 1234.');
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case Page.Configurator:
                return <ConfiguratorPage configState={configState} setConfigState={setConfigState} onRequestQuote={handleRequestQuote} summary={summary} />;
            case Page.Admin:
                return <AdminPage leads={leads} setLeads={setLeads} />;
            case Page.Success:
                return <SuccessPage lead={lastLead} setCurrentPage={setCurrentPage} />;
            case Page.Home:
            default:
                return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header setCurrentPage={setCurrentPage} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Chatbot onStart={() => setCurrentPage(Page.Configurator)} />
            {leadModal.active && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    {leadModal.step === 'form' && <LeadForm onSubmit={handleLeadSubmit} onCancel={() => setLeadModal({ ...leadModal, active: false })} />}
                    {leadModal.step === 'otp' && <OtpForm email={leadModal.data.email} onVerify={handleOtpVerify} />}
                </div>
            )}
        </div>
    );
};

const SuccessPage = ({ lead, setCurrentPage }: { lead: {id: string, name: string} | null, setCurrentPage: (p: Page) => void }) => (
    <div className="max-w-xl mx-auto py-20 text-center">
        <Icon name="rocket" className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Request Submitted Successfully!</h1>
        {lead && <>
            <p className="text-xl text-primary font-semibold mb-6">Quote ID: #${lead.id}</p>
            <p className="text-gray-600 mb-8">
                Thank you, {lead.name}. Your request has been received. A UTECH representative will contact you with your detailed quote within 24 hours.
            </p>
        </>}
        <button onClick={() => setCurrentPage(Page.Home)} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">Return to Home</button>
    </div>
);

const LeadForm = ({ onSubmit, onCancel } : {onSubmit: (data: any) => void, onCancel: () => void}) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    };
    return (
         <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">Request Your Custom Quote</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" required className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                <input type="text" name="company" placeholder="Business Name" required className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                <input type="email" name="email" placeholder="Business Email" required className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                <div className="flex justify-between mt-6">
                    <button type="button" onClick={onCancel} className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">Cancel</button>
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition">Submit & Verify</button>
                </div>
            </form>
        </div>
    );
};

const OtpForm = ({ email, onVerify }: { email: string, onVerify: (otp: string) => void }) => {
    const [otp, setOtp] = React.useState('');
    return (
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <Icon name="mail-check" className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Verify Your Email</h3>
            <p className="text-gray-600 mb-6">A 4-digit verification code has been sent to {email}. (Hint: use 1234)</p>
            <form onSubmit={(e) => { e.preventDefault(); onVerify(otp); }}>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="1234" maxLength={4} required className="w-full mb-6 p-3 text-center text-xl tracking-widest border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                <button type="submit" className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition w-full">Verify Code</button>
            </form>
        </div>
    );
};

export default App;

import React from 'react';
import { ConfigState, Page, Product } from '../types';
import { MAINTENANCE_PLANS, PRODUCTS } from '../constants';
import { Icon } from './icons';

interface ConfiguratorPageProps {
  configState: ConfigState;
  setConfigState: React.Dispatch<React.SetStateAction<ConfigState>>;
  onRequestQuote: (options: object) => void;
  summary: any;
}

const steps = [
    { id: 1, title: 'Select Categories' },
    { id: 2, title: 'Add Products' },
    { id: 3, title: 'Services & Review' },
];

export const ConfiguratorPage: React.FC<ConfiguratorPageProps> = ({ configState, setConfigState, onRequestQuote, summary }) => {

  const handleUpdate = (key: keyof ConfigState, value: any, isCheckbox: boolean = false) => {
    setConfigState(prev => {
        if (isCheckbox) {
            const current = (prev[key] as string[]);
            const newSet = new Set(current);
            if(newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return { ...prev, [key]: Array.from(newSet) };
        }
        return { ...prev, [key]: value };
    });
  };

  const updateComponentQuantity = (productId: string, change: number) => {
    setConfigState(prev => {
        const newComponents = { ...prev.components };
        const currentQty = newComponents[productId] || 0;
        const newQty = Math.max(0, currentQty + change);
        if (newQty > 0) {
            newComponents[productId] = newQty;
        } else {
            delete newComponents[productId];
        }
        return { ...prev, components: newComponents };
    });
  };

  const setStep = (step: number) => setConfigState(prev => ({ ...prev, step: Math.max(1, Math.min(steps.length, step)) }));

  const renderStepContent = () => {
    switch (configState.step) {
      case 1: return <Step1 configState={configState} onUpdate={handleUpdate} />;
      case 2: return <Step2 configState={configState} onUpdateQty={updateComponentQuantity} />;
      case 3: return <Step3 configState={configState} onUpdate={handleUpdate} />;
      default: return null;
    }
  };
  
  const progressBarHTML = steps.map(s => (
    <React.Fragment key={s.id}>
        <div className="flex-1">
            <div className="text-center">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-sm ${s.id === configState.step ? 'bg-accent text-white' : s.id < configState.step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {s.id < configState.step ? <Icon name="check" className="w-4 h-4" /> : s.id}
                </div>
                <p className={`text-xs mt-2 ${s.id === configState.step ? 'text-accent font-semibold' : 'text-gray-600'}`}>{s.title}</p>
            </div>
        </div>
        {s.id < steps.length ? <div className="flex-1 border-t-2 mt-4 border-dashed border-gray-300"></div> : ''}
    </React.Fragment>
));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Build Your Custom Technology Quote</h1>

        <div className="flex items-center justify-between mb-8">{progressBarHTML}</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Step {configState.step}: {steps[configState.step - 1].title}</h2>
                <div>{renderStepContent()}</div>
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                    <button onClick={() => setStep(configState.step - 1)} disabled={configState.step === 1} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition flex items-center">
                        <Icon name="arrow-left" className="w-4 h-4 mr-1" /> Previous
                    </button>
                    {configState.step === steps.length ? (
                        <button onClick={() => onRequestQuote({ prefillConfig: true })} className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
                            Request Quote
                        </button>
                    ) : (
                        <button onClick={() => setStep(configState.step + 1)} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center">
                            Next Step <Icon name="arrow-right" className="w-4 h-4 ml-1" />
                        </button>
                    )}
                </div>
            </div>
            <SummaryPanel summary={summary} onRequestQuote={onRequestQuote} />
        </div>
    </main>
  );
};


const Step1 = ({ configState, onUpdate }: any) => {
    const categories = Array.from(new Set(PRODUCTS.map(p => p.category)));
    return (
        <div className="space-y-4">
            <p className="text-gray-600">What type of products are you looking for? Select all that apply.</p>
            {categories.map(cat => (
                <label key={cat} className={`flex items-center bg-gray-50 p-4 rounded-lg cursor-pointer border transition ${configState.selectedCategories.includes(cat) ? 'border-primary ring-2 ring-primary/50' : 'border-gray-200'}`}>
                    <input type="checkbox" name="category" value={cat} onChange={(e) => onUpdate('selectedCategories', e.target.value, true)} checked={configState.selectedCategories.includes(cat)} className="text-primary focus:ring-primary h-4 w-4 rounded" />
                    <span className="ml-3 font-medium text-gray-800">{cat}</span>
                </label>
            ))}
        </div>
    );
};

const Step2 = ({ configState, onUpdateQty }: any) => {
    const { selectedCategories } = configState;

    const filteredProducts = PRODUCTS.filter(p => selectedCategories.includes(p.category));

    if (filteredProducts.length === 0) {
        return <p className="text-red-500">Please select at least one category in Step 1 to add products.</p>;
    }

    const groupedBySubcategory = filteredProducts.reduce((acc, product) => {
        const key = `${product.category} > ${product.subcategory}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <div className="space-y-6">
            <p className="text-gray-600">Specify the quantity for each required product:</p>
            {Object.entries(groupedBySubcategory).map(([groupName, products]) => (
                <div key={groupName}>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">{groupName}</h3>
                    <div className="space-y-3">
                        {products.map(p => {
                            const quantity = configState.components[p.id] || 0;
                            return (
                                <div key={p.id} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-contain bg-white rounded-md mr-4"/>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.brand}</p>
                                    </div>
                                    <span className="text-sm text-gray-500 w-24 text-center">OMR {p.price}</span>
                                    <div className="flex items-center ml-4 space-x-2">
                                        <button onClick={() => onUpdateQty(p.id, -1)} className="bg-white text-gray-700 border border-gray-300 w-8 h-8 rounded-full hover:bg-gray-100 transition disabled:opacity-50" disabled={quantity === 0}>-</button>
                                        <span className="w-12 text-center font-semibold">{quantity}</span>
                                        <button onClick={() => onUpdateQty(p.id, 1)} className="bg-white text-gray-700 border border-gray-300 w-8 h-8 rounded-full hover:bg-gray-100 transition">+</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

const Step3 = ({ configState, onUpdate }: any) => {
    return (
        <div className="space-y-4">
            <p className="text-gray-600">For security systems, select an optional Annual Maintenance Contract (AMC) plan:</p>
            {Object.values(MAINTENANCE_PLANS).map(plan => (
                 <label key={plan.name} className={`block bg-white p-4 rounded-lg border cursor-pointer transition duration-200 ${configState.maintenancePlan === plan.name ? 'border-primary ring-2 ring-primary/50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input type="radio" name="maintenancePlan" value={plan.name} onChange={(e) => onUpdate('maintenancePlan', e.target.value)} checked={configState.maintenancePlan === plan.name} className="text-primary focus:ring-primary h-4 w-4"/>
                            <span className="ml-3 font-bold text-gray-800">{plan.name}</span>
                        </div>
                        <span className="font-bold text-lg text-primary">OMR {plan.price} / Unit / Yr</span>
                    </div>
                </label>
            ))}
             <p className="text-xs text-gray-500 pt-2">*Maintenance plans apply only to items in the 'Security Systems' category.</p>
        </div>
    );
};

const SummaryPanel = ({ summary, onRequestQuote }: any) => (
    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg sticky top-24 h-fit">
        <h2 className="text-xl font-bold text-primary mb-4">Live Quote Summary</h2>

        <div className="space-y-2 border-b pb-4 mb-4">
            <div className="flex justify-between text-sm text-gray-700"><span>Items Total ({summary.totalItems} units)</span><span>OMR {summary.itemTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-green-600 font-semibold"><span>Bundle Discount ({summary.discountRate}%)</span><span>- OMR {summary.bundleDiscount.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold text-gray-800 pt-2"><span>Subtotal</span><span>OMR {summary.subtotal.toFixed(2)}</span></div>
        </div>

        <div className="space-y-2 border-b pb-4 mb-4">
            <div className="flex justify-between text-sm text-gray-700"><span>Delivery Fee</span><span>+ OMR {summary.deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-700"><span>Installation (Estimate)</span><span>+ OMR {summary.installationFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-700 font-medium"><span>Maintenance (AMC)</span><span>OMR {summary.maintenanceCost.toFixed(2)} / Yr</span></div>
        </div>

        <div className="flex justify-between text-2xl font-extrabold text-primary pt-2"><span>TOTAL (EXCL. AMC)</span><span>OMR {summary.totalExclMaintenance.toFixed(2)}</span></div>

        <button onClick={() => onRequestQuote({ prefillConfig: true })} className="w-full bg-accent text-white py-3 rounded-lg text-lg font-semibold mt-6 hover:bg-blue-600 transition">Request Quote</button>
        <button onClick={() => alert("Simulating PDF download...")} className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm mt-3 hover:bg-gray-50 transition flex items-center justify-center">
            <Icon name="file-text" className="w-4 h-4 mr-1" /> Download Quote (PDF Mock)
        </button>
    </div>
);
import React from 'react';
import { Page, Product } from '../types';
import { PRODUCTS } from '../constants';
import { Icon } from './icons';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    const services = [
        { icon: 'package', title: 'Delivery', desc: 'Fast, secure shipping across Oman.' },
        { icon: 'tools', title: 'Installation', desc: 'Certified technician setup.' },
        { icon: 'settings', title: 'Maintenance', desc: 'Proactive system monitoring.' },
        { icon: 'calendar', title: 'AMC', desc: 'Annual Maintenance Contracts.' },
    ];

    const allCategories = ['Security Systems', 'Laptops', 'Computers', 'Printers & Office', 'Networking', 'Accessories'];
    const categories = Array.from(new Set(allCategories));
    
    // Curated list of featured products to show variety
    const featuredProducts = [
        PRODUCTS.find(p => p.id === 'cctv_dome'),
        PRODUCTS.find(p => p.id === 'mbp_14'),
        PRODUCTS.find(p => p.id === 'hp_laserjet'),
    ].filter(Boolean) as Product[];


  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-primary text-white rounded-xl shadow-lg p-8 md:p-16 mb-12 relative overflow-hidden">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Your One-Stop Shop for Business Technology</h1>
            <p className="text-xl mb-8 opacity-90">From integrated security systems to high-performance laptops, build your perfect tech package with a live quote.</p>
            <button onClick={() => setCurrentPage(Page.Configurator)} className="bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:bg-gray-100 transition duration-300">
                Build a Quote
            </button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 transform rotate-45 translate-x-1/2 -translate-y-1/2 rounded-full"></div>
        </div>

        {/* Category Chips */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore Categories</h2>
        <div className="flex space-x-3 overflow-x-auto pb-4 mb-12" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map(cat => (
                <button key={cat} onClick={() => alert(`Navigating to ${cat}...`)} className="flex-shrink-0 px-4 py-2 bg-white border border-primary text-primary rounded-full font-medium text-sm shadow-sm hover:bg-primary hover:text-white transition duration-200">
                    {cat}
                </button>
            ))}
        </div>

        {/* Featured Bundles */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProducts.map(p => (
                <div key={p.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col">
                    <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                         <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-grow">
                        <p className="text-xs font-semibold text-primary uppercase mb-1">{p.brand}</p>
                        <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{p.subcategory} | From OMR {p.price}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                        <button onClick={() => setCurrentPage(Page.Configurator)} className="text-primary hover:text-primary-dark transition text-sm font-medium flex items-center">
                            <Icon name="package" className="w-4 h-4 mr-1" /> Add to Quote
                        </button>
                        <button onClick={() => setCurrentPage(Page.Configurator)} className="bg-primary text-white text-xs px-3 py-1 rounded-full hover:bg-primary-dark transition">
                            Request Quote
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Services Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            {services.map(s => (
                <div key={s.title} className="text-center p-3">
                    <Icon name={s.icon} className="w-8 h-8 text-accent mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-800">{s.title}</h4>
                    <p className="text-xs text-gray-500 hidden sm:block">{s.desc}</p>
                </div>
            ))}
        </div>
    </main>
  );
};
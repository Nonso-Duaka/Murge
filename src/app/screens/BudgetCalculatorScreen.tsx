import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface BudgetCalculatorScreenProps {
  onBack: () => void;
}

interface BudgetItem {
  id: string;
  label: string;
  category: 'income' | 'housing' | 'utilities' | 'transportation' | 'food' | 'personal' | 'savings';
  amount: number;
  isFixed: boolean;
}

const defaultBudgetItems: BudgetItem[] = [
  // Income
  { id: 'salary', label: 'Monthly Salary (after tax)', category: 'income', amount: 8000, isFixed: false },
  { id: 'bonus', label: 'Signing Bonus (monthly)', category: 'income', amount: 500, isFixed: false },
  { id: 'relocation', label: 'Relocation Stipend', category: 'income', amount: 200, isFixed: false },

  // Housing
  { id: 'rent', label: 'Rent', category: 'housing', amount: 2400, isFixed: false },
  { id: 'renters-insurance', label: "Renter's Insurance", category: 'housing', amount: 25, isFixed: true },

  // Utilities
  { id: 'electric', label: 'Electric', category: 'utilities', amount: 80, isFixed: false },
  { id: 'internet', label: 'Internet', category: 'utilities', amount: 60, isFixed: true },
  { id: 'phone', label: 'Phone', category: 'utilities', amount: 85, isFixed: true },
  { id: 'subscriptions', label: 'Subscriptions', category: 'utilities', amount: 50, isFixed: false },

  // Transportation
  { id: 'transit', label: 'Public Transit', category: 'transportation', amount: 100, isFixed: true },
  { id: 'rideshare', label: 'Rideshare/Taxi', category: 'transportation', amount: 100, isFixed: false },

  // Food
  { id: 'groceries', label: 'Groceries', category: 'food', amount: 400, isFixed: false },
  { id: 'dining', label: 'Dining Out', category: 'food', amount: 300, isFixed: false },
  { id: 'coffee', label: 'Coffee/Drinks', category: 'food', amount: 100, isFixed: false },

  // Personal
  { id: 'gym', label: 'Gym Membership', category: 'personal', amount: 80, isFixed: true },
  { id: 'entertainment', label: 'Entertainment', category: 'personal', amount: 150, isFixed: false },
  { id: 'shopping', label: 'Shopping', category: 'personal', amount: 200, isFixed: false },
  { id: 'healthcare', label: 'Healthcare', category: 'personal', amount: 100, isFixed: false },

  // Savings
  { id: '401k', label: '401k Contribution', category: 'savings', amount: 500, isFixed: false },
  { id: 'emergency', label: 'Emergency Fund', category: 'savings', amount: 300, isFixed: false },
];

export function BudgetCalculatorScreen({ onBack }: BudgetCalculatorScreenProps) {
  const [budgetItems, setBudgetItems] = useLocalStorage<BudgetItem[]>('murge_budget', defaultBudgetItems);
  const [mounted, setMounted] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('housing');

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateAmount = (id: string, amount: number) => {
    setBudgetItems(prev =>
      prev.map(item => (item.id === id ? { ...item, amount: Math.max(0, amount) } : item))
    );
  };



  const categories = [
    { id: 'income', label: 'Income', color: 'bg-green-500/20 text-green-400' },
    { id: 'housing', label: 'Housing', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'utilities', label: 'Utilities', color: 'bg-yellow-500/20 text-yellow-400' },
    { id: 'transportation', label: 'Transportation', color: 'bg-purple-500/20 text-purple-400' },
    { id: 'food', label: 'Food', color: 'bg-orange-500/20 text-orange-400' },
    { id: 'personal', label: 'Personal', color: 'bg-pink-500/20 text-pink-400' },
    { id: 'savings', label: 'Savings', color: 'bg-cyan-500/20 text-cyan-400' },
  ];

  const getCategoryIcon = (id: string) => {
    const props = { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 };
    switch (id) {
      case 'income':
        return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'housing':
        return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case 'utilities':
        return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case 'transportation':
        return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
      case 'food':
        return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'personal':
        return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
      case 'savings':
        return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
      default: return null;
    }
  };

  const totals = useMemo(() => {
    const income = budgetItems
      .filter(i => i.category === 'income')
      .reduce((sum, i) => sum + i.amount, 0);

    const expenses = budgetItems
      .filter(i => i.category !== 'income' && i.category !== 'savings')
      .reduce((sum, i) => sum + i.amount, 0);

    const savings = budgetItems
      .filter(i => i.category === 'savings')
      .reduce((sum, i) => sum + i.amount, 0);

    const remaining = income - expenses - savings;

    return { income, expenses, savings, remaining };
  }, [budgetItems]);

  const categoryTotals = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = budgetItems
        .filter(i => i.category === cat.id)
        .reduce((sum, i) => sum + i.amount, 0);
      return acc;
    }, {} as Record<string, number>);
  }, [budgetItems]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">Budget Calculator</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Monthly Income</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(totals.income)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Expenses</p>
            <p className="text-2xl font-bold text-red-400">{formatCurrency(totals.expenses)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Savings</p>
            <p className="text-2xl font-bold text-cyan-400">{formatCurrency(totals.savings)}</p>
          </div>
          <div className={`backdrop-blur-md rounded-xl p-4 border ${totals.remaining >= 0
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
            }`}>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Remaining</p>
            <p className={`text-2xl font-bold ${totals.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(totals.remaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">
        {/* Spending Chart */}
        <div
          className={`bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Spending Breakdown</h3>
          <div className="h-4 rounded-full overflow-hidden flex">
            {categories
              .filter(c => c.id !== 'income' && c.id !== 'savings')
              .map((cat, index) => {
                const percentage = totals.expenses > 0 ? (categoryTotals[cat.id] / totals.expenses) * 100 : 0;
                if (percentage === 0) return null;
                return (
                  <div
                    key={cat.id}
                    className={`h-full ${cat.color.split(' ')[0]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                    title={`${cat.label}: ${formatCurrency(categoryTotals[cat.id])}`}
                  />
                );
              })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {categories
              .filter(c => c.id !== 'income' && c.id !== 'savings' && categoryTotals[c.id] > 0)
              .map(cat => (
                <div key={cat.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${cat.color.split(' ')[0]}`} />
                  <span className="text-white/70">{cat.label}</span>
                  <span className="text-white/40">{Math.round((categoryTotals[cat.id] / totals.expenses) * 100)}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Category Sections */}
        {categories.map((category, catIndex) => (
          <div
            key={category.id}
            className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            style={{ transitionDelay: `${catIndex * 50}ms` }}
          >
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-white/5 border border-white/10 rounded-xl">{getCategoryIcon(category.id)}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{category.label}</h3>
                    <p className="text-sm text-white/50">
                      {budgetItems.filter(i => i.category === category.id).length} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${category.id === 'income' ? 'text-green-400' : 'text-white'
                    }`}>
                    {formatCurrency(categoryTotals[category.id])}
                  </span>
                  <svg
                    className={`w-5 h-5 text-white/40 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Expanded Items */}
            {expandedCategory === category.id && (
              <div className="mt-2 space-y-2 animate-slide-up">
                {budgetItems
                  .filter(item => item.category === category.id)
                  .map(item => (
                    <div
                      key={item.id}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          {item.isFixed && (
                            <span className="text-xs text-white/40">Fixed cost</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/40">$</span>
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateAmount(item.id, parseInt(e.target.value) || 0)}
                            className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-right focus:outline-none focus:border-white/40"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}

        {/* Tips */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Budget Tips
          </h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>• Aim to save at least 20% of your income</li>
            <li>• Keep housing under 30% of gross income</li>
            <li>• Build 3-6 months of expenses in emergency fund</li>
            <li>• Track spending for the first 3 months to adjust</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

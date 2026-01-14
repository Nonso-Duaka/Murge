import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SuccessCelebration, MilestoneCelebration } from '../components/Confetti';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: 'before' | 'during' | 'after';
  priority: 'high' | 'medium' | 'low';
  dueOffset?: number; // Days before/after move date
  points: number;
}

const defaultChecklist: ChecklistItem[] = [
  // Before Move
  { id: 'research', title: 'Research neighborhoods', description: 'Learn about different areas', category: 'before', priority: 'high', dueOffset: -30, points: 10 },
  { id: 'budget', title: 'Set housing budget', description: 'Calculate what you can afford', category: 'before', priority: 'high', dueOffset: -28, points: 15 },
  { id: 'connect', title: 'Connect with 5 relocators', description: 'Build your network early', category: 'before', priority: 'medium', dueOffset: -25, points: 25 },
  { id: 'listings', title: 'Save 10 listings', description: 'Create your shortlist', category: 'before', priority: 'high', dueOffset: -21, points: 20 },
  { id: 'schedule', title: 'Schedule virtual tours', description: 'View apartments remotely', category: 'before', priority: 'high', dueOffset: -14, points: 15 },
  { id: 'documents', title: 'Prepare documents', description: 'ID, pay stubs, references', category: 'before', priority: 'high', dueOffset: -14, points: 10 },
  { id: 'notify', title: 'Notify current landlord', description: 'Give proper notice', category: 'before', priority: 'high', dueOffset: -30, points: 10 },
  { id: 'utilities', title: 'Research utilities', description: 'Internet, electric, gas', category: 'before', priority: 'medium', dueOffset: -10, points: 10 },

  // During Move
  { id: 'sign-lease', title: 'Sign lease agreement', description: 'Review and sign your lease', category: 'during', priority: 'high', dueOffset: -7, points: 30 },
  { id: 'movers', title: 'Book movers', description: 'Or rent a truck', category: 'during', priority: 'high', dueOffset: -7, points: 15 },
  { id: 'pack', title: 'Pack belongings', description: 'Start with non-essentials', category: 'during', priority: 'high', dueOffset: -5, points: 20 },
  { id: 'forward-mail', title: 'Forward mail', description: 'Update your address', category: 'during', priority: 'medium', dueOffset: -3, points: 10 },
  { id: 'travel', title: 'Book travel', description: 'Flights or road trip', category: 'during', priority: 'high', dueOffset: -7, points: 10 },

  // After Move
  { id: 'unpack', title: 'Unpack essentials', description: 'Set up your new space', category: 'after', priority: 'high', dueOffset: 1, points: 15 },
  { id: 'explore-hood', title: 'Explore neighborhood', description: 'Find local spots', category: 'after', priority: 'medium', dueOffset: 3, points: 15 },
  { id: 'meet-neighbors', title: 'Meet neighbors', description: 'Introduce yourself', category: 'after', priority: 'low', dueOffset: 7, points: 20 },
  { id: 'update-address', title: 'Update address everywhere', description: 'Banks, subscriptions, etc.', category: 'after', priority: 'high', dueOffset: 7, points: 10 },
  { id: 'join-groups', title: 'Join local groups', description: 'Meetups, sports, hobbies', category: 'after', priority: 'medium', dueOffset: 14, points: 20 },
  { id: 'first-day', title: 'Ace your first day', description: 'Start your new role!', category: 'after', priority: 'high', dueOffset: 0, points: 50 },
];

interface ChecklistScreenProps {
  onBack: () => void;
}

export function ChecklistScreen({ onBack }: ChecklistScreenProps) {
  const [completedItems, setCompletedItems] = useLocalStorage<string[]>('murge_checklist_completed', []);
  const [totalPoints, setTotalPoints] = useLocalStorage('murge_checklist_points', 0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'before' | 'during' | 'after'>('all');
  const [mounted, setMounted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneData, setMilestoneData] = useState({ milestone: '', description: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return defaultChecklist;
    return defaultChecklist.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const progress = useMemo(() => {
    return Math.round((completedItems.length / defaultChecklist.length) * 100);
  }, [completedItems]);

  const categoryProgress = useMemo(() => {
    const categories = ['before', 'during', 'after'] as const;
    return categories.reduce((acc, cat) => {
      const total = defaultChecklist.filter(i => i.category === cat).length;
      const completed = defaultChecklist.filter(i => i.category === cat && completedItems.includes(i.id)).length;
      acc[cat] = total > 0 ? Math.round((completed / total) * 100) : 0;
      return acc;
    }, {} as Record<string, number>);
  }, [completedItems]);

  const handleToggleItem = (item: ChecklistItem) => {
    const isCompleted = completedItems.includes(item.id);

    if (isCompleted) {
      setCompletedItems(prev => prev.filter(id => id !== item.id));
      setTotalPoints(prev => prev - item.points);
      toast.info(`Unmarked: ${item.title}`);
    } else {
      setCompletedItems(prev => [...prev, item.id]);
      setTotalPoints(prev => prev + item.points);

      // Check for milestones
      const newCompleted = completedItems.length + 1;
      if (newCompleted === 5) {
        setMilestoneData({ milestone: 'Getting Started!', description: "You've completed 5 tasks" });
        setShowMilestone(true);
      } else if (newCompleted === 10) {
        setMilestoneData({ milestone: 'Making Progress!', description: "You've completed 10 tasks" });
        setShowMilestone(true);
      } else if (newCompleted === defaultChecklist.length) {
        setMilestoneData({ milestone: 'Relocation Master!', description: 'All tasks completed!' });
        setShowMilestone(true);
      } else {
        setShowCelebration(true);
      }

      toast.success(`Completed: ${item.title}`, {
        description: `+${item.points} points`,
      });
    }
  };

  const getLevel = () => {
    if (totalPoints < 50) return { level: 1, title: 'Newcomer', next: 50 };
    if (totalPoints < 100) return { level: 2, title: 'Explorer', next: 100 };
    if (totalPoints < 200) return { level: 3, title: 'Settler', next: 200 };
    if (totalPoints < 350) return { level: 4, title: 'Local', next: 350 };
    return { level: 5, title: 'Relocation Pro', next: null };
  };

  const levelInfo = getLevel();

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-black text-white';
      case 'medium': return 'bg-gray-200 text-black';
      case 'low': return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'before':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'during':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
      case 'after':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      <SuccessCelebration show={showCelebration} onComplete={() => setShowCelebration(false)} />
      <MilestoneCelebration
        show={showMilestone}
        milestone={milestoneData.milestone}
        description={milestoneData.description}
        onComplete={() => setShowMilestone(false)}
      />

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Relocation Checklist</h1>
            <p className="text-white/60 text-sm">{completedItems.length} of {defaultChecklist.length} completed</p>
          </div>
        </div>

        {/* Level & Points */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-xl text-black">
                {levelInfo.level}
              </div>
              <div>
                <p className="font-bold text-white">{levelInfo.title}</p>
                <p className="text-sm text-white/60">{totalPoints} points</p>
              </div>
            </div>
            {levelInfo.next && (
              <div className="text-right">
                <p className="text-xs text-white/40">Next level</p>
                <p className="text-sm text-white/70">{levelInfo.next - totalPoints} pts</p>
              </div>
            )}
          </div>
          {levelInfo.next && (
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${(totalPoints / levelInfo.next) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/70">Overall Progress</span>
            <span className="text-sm font-bold text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'before', label: 'Before', progress: categoryProgress.before },
            { id: 'during', label: 'During', progress: categoryProgress.during },
            { id: 'after', label: 'After', progress: categoryProgress.after },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as typeof selectedCategory)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === tab.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label}
              {tab.progress !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedCategory === tab.id ? 'bg-black/10' : 'bg-white/20'
                }`}>
                  {tab.progress}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-3">
        {filteredItems.map((item, index) => {
          const isCompleted = completedItems.includes(item.id);
          return (
            <div
              key={item.id}
              className={`transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 30}ms` }}
            >
              <button
                onClick={() => handleToggleItem(item)}
                className={`w-full text-left bg-white/10 backdrop-blur-xl rounded-2xl p-4 border transition-all group hover:bg-white/15 ${
                  isCompleted ? 'border-white/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-white border-white'
                      : 'border-white/30 group-hover:border-white/50'
                  }`}>
                    {isCompleted && (
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold transition-all ${
                        isCompleted ? 'text-white/50 line-through' : 'text-white'
                      }`}>
                        {item.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    {item.description && (
                      <p className={`text-sm ${isCompleted ? 'text-white/30' : 'text-white/60'}`}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Points */}
                  <div className={`text-right flex-shrink-0 ${isCompleted ? 'text-white/30' : 'text-white/70'}`}>
                    <span className="text-sm font-bold">+{item.points}</span>
                    <span className="text-xs block">pts</span>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

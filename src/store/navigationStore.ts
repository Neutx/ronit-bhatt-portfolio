import { create } from 'zustand';

type View = 'home' | 'about' | 'commercial' | 'brands' | 'creative-process';

interface NavigationState {
  currentView: View;
  history: View[];
  setView: (view: View) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentView: 'home',
  history: ['home'],
  setView: (view) => set((state) => {
    // Only add to history if it's a different view
    if (view !== state.currentView) {
      return {
        currentView: view,
        history: [...state.history, view],
      };
    }
    return { currentView: view };
  }),
  goBack: () => set((state) => {
    // If history has more than one item, go back
    if (state.history.length > 1) {
      const newHistory = [...state.history];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      return {
        currentView: previousView,
        history: newHistory,
      };
    }
    // If only one item in history, go to home
    return {
      currentView: 'home',
      history: ['home'],
    };
  }),
}));


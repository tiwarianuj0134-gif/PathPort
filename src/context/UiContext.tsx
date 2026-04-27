import React, { createContext, useState } from 'react';

interface UiContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const UiContext = createContext<UiContextType>({} as UiContextType);

export const UiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <UiContext.Provider value={{ sidebarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </UiContext.Provider>
  );
};

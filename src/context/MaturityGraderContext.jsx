import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const MaturityGraderContext = createContext(null);

export function MaturityGraderProvider() {
  const [results, setResults] = useState(null);

  return (
    <MaturityGraderContext.Provider value={{ results, setResults }}>
      <Outlet />
    </MaturityGraderContext.Provider>
  );
}

export function useMaturityGrader() {
  return useContext(MaturityGraderContext);
}

import React, { createContext, useState, ReactNode } from "react";

interface PillDetail {
  pillName: string;
  time: string;
  slot: string;
  dosage: string;
}

interface PillDetailsContextType {
  pillDetails: PillDetail[];
  setPillDetails: React.Dispatch<React.SetStateAction<PillDetail[]>>;
}

const PillDetailsContext = createContext<PillDetailsContextType | undefined>(undefined);

export const PillDetailsProvider = ({ children }: { children: ReactNode }) => {
  // Define the state with an initial empty array of the correct type
  const [pillDetails, setPillDetails] = useState<PillDetail[]>([]);

  return (
    <PillDetailsContext.Provider value={{ pillDetails, setPillDetails }}>
      {children}
    </PillDetailsContext.Provider>
  );
};

export default PillDetailsContext;

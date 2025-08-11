import { ReactNode } from "react";

const WizardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="realtive flex h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default WizardLayout;

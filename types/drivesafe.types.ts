export interface DriveSafeState {
  // Alert system state
  alertActive: boolean;
  alertLevel: number;
  alertVariant: 'A' | 'B';
  
  // Driving & phone handling state
  isDriving: boolean;
  phoneHandling: boolean;
  sensorAvailable: boolean;
  isPassenger: boolean;
  
  // Alert actions
  setAlertActive: (active: boolean) => void;
  updateAlertLevel: (level: number) => void;
  setAlertVariant: (variant: 'A' | 'B') => void;
  
  // Phone handling actions
  setPhoneHandling: (handling: boolean) => void;
  setIsPassenger: (isPassenger: boolean) => void;
}

export interface AlertMetrics {
  variantA: {
    count: number;
    avgDuration: number;
  };
  variantB: {
    count: number;
    avgDuration: number;
  };
} 
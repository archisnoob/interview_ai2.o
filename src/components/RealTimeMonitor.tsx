
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Eye, AlertCircle } from 'lucide-react';

interface RealTimeMonitorProps {
  isActive: boolean;
  tabSwitches: number;
  onSuspiciousActivity: (activity: string) => void;
}

const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({
  isActive,
  tabSwitches,
  onSuspiciousActivity
}) => {
  const [focusEvents, setFocusEvents] = useState(0);
  const [windowInactive, setWindowInactive] = useState(false);
  const [inactiveStartTime, setInactiveStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleFocus = () => {
      setFocusEvents(prev => prev + 1);
      setWindowInactive(false);

      // Check if window was inactive for more than 10 seconds
      if (inactiveStartTime) {
        const inactiveDuration = (Date.now() - inactiveStartTime) / 1000;
        if (inactiveDuration > 10) {
          onSuspiciousActivity(`Window inactive for ${inactiveDuration.toFixed(1)}s - possible tab switch`);
        }
        setInactiveStartTime(null);
      }
    };

    const handleBlur = () => {
      setWindowInactive(true);
      setInactiveStartTime(Date.now());
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWindowInactive(true);
        setInactiveStartTime(Date.now());
      } else {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, inactiveStartTime, onSuspiciousActivity]);

  // Reset when session becomes inactive
  useEffect(() => {
    if (!isActive) {
      setFocusEvents(0);
      setWindowInactive(false);
      setInactiveStartTime(null);
    }
  }, [isActive]);

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 transition-colors">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span>Live System Monitoring</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isActive && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            System monitoring inactive
          </div>
        )}
        
        {isActive && (
          <>
            <div className="grid grid-cols-2 gap-4">
              {/* Focus Events */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 p-5 rounded-xl border border-green-200 dark:border-green-700/50 transition-all hover:shadow-lg hover:scale-[1.02] duration-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200 flex items-center justify-center mb-2">
                    <Eye className="h-5 w-5 mr-2" />
                    {focusEvents}
                  </div>
                  <div className="text-xs font-semibold text-green-600 dark:text-green-300 uppercase tracking-wide">
                    Focus Events
                  </div>
                </div>
              </div>
              
              {/* Tab Switches */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 p-5 rounded-xl border border-red-200 dark:border-red-700/50 transition-all hover:shadow-lg hover:scale-[1.02] duration-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-800 dark:text-red-200 flex items-center justify-center mb-2">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {tabSwitches}
                  </div>
                  <div className="text-xs font-semibold text-red-600 dark:text-red-300 uppercase tracking-wide">
                    Tab Switches
                  </div>
                  {tabSwitches >= 3 && (
                    <Badge variant="destructive" className="text-xs mt-2 font-medium">
                      Excessive
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {windowInactive && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border border-red-200 dark:border-red-700/50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Window Currently Inactive
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <strong className="text-gray-700 dark:text-gray-300">Note:</strong> Tracking window focus and tab switching behavior. 
              Inactivity &gt; 10s triggers suspicious activity flag.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitor;

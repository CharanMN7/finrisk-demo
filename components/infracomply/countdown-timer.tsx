'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2025-10-01T00:00:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
          Days Until RBI Deadline
        </h3>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">October 1, 2025</p>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {timeLeft.days}
            </div>
            <div className="text-xs text-red-700 dark:text-red-300">Days</div>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">:</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs text-red-700 dark:text-red-300">Hours</div>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">:</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-red-700 dark:text-red-300">Minutes</div>
          </div>
        </div>
      </div>
    </Card>
  );
}


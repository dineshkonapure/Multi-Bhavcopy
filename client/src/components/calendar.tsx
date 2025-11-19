import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Circle, RefreshCw } from 'lucide-react';
import { 
  monthCells, 
  sameDay, 
  inRange, 
  isMarketDayNoFuture,
  isWeekend,
  isHoliday,
  statusText,
  inIST
} from '@/lib/dateUtils';

interface CalendarProps {
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onDateSelect: (date: Date) => void;
  onInfoChange: (text: string) => void;
  onQuickSelect: () => void;
}

export function Calendar({ rangeStart, rangeEnd, onDateSelect, onInfoChange, onQuickSelect }: CalendarProps) {
  const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(new Date().getMonth());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rangeStart) {
      setViewYear(rangeStart.getFullYear());
      setViewMonth(rangeStart.getMonth());
    }
  }, [rangeStart]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleToday = () => {
    const t = inIST();
    setViewYear(t.getFullYear());
    setViewMonth(t.getMonth());
  };

  const handleDateClick = (date: Date) => {
    if (!isMarketDayNoFuture(date)) return;
    onDateSelect(date);
  };

  const cells = monthCells(viewYear, viewMonth);
  const now = inIST();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(viewYear, viewMonth, 1);
  const monthName = monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="border border-border rounded-[14px] overflow-hidden bg-[#0f1730]">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1.5 px-2.5 py-2 bg-[#0f1730] border-b border-border">
        <div className="flex gap-1.5 items-center">
          <Button
            onClick={handlePrevMonth}
            variant="ghost"
            size="sm"
            className="border border-border rounded-[10px] px-2.5 min-h-8 font-bold hover:bg-[#141d3a] transition-colors no-default-hover-elevate no-default-active-elevate"
            data-testid="button-prev-month"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleToday}
            variant="ghost"
            size="sm"
            className="border border-border rounded-[10px] px-2.5 min-h-8 font-bold hover:bg-[#141d3a] transition-colors no-default-hover-elevate no-default-active-elevate"
            data-testid="button-today"
          >
            <Circle className="w-2 h-2 fill-current" />
          </Button>
          
          <Button
            onClick={handleNextMonth}
            variant="ghost"
            size="sm"
            className="border border-border rounded-[10px] px-2.5 min-h-8 font-bold hover:bg-[#141d3a] transition-colors no-default-hover-elevate no-default-active-elevate"
            data-testid="button-next-month"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center font-bold tracking-[0.2px]" data-testid="text-month-year">
          {monthName}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onQuickSelect}
            className="font-semibold text-[13px] px-2.5 py-1.5 rounded-full cursor-pointer border border-dashed transition-all text-[#0fe7d4] border-[rgba(15,231,212,.5)] bg-[rgba(15,231,212,.08)] hover:bg-[rgba(15,231,212,.16)] hover:text-[#14fff0] no-default-hover-elevate no-default-active-elevate"
            title="Ctrl+Q"
            data-testid="button-quick-select"
          >
            <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
            Quick Select
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 px-2.5 py-2.5 text-muted-foreground text-[11px] font-bold text-center">
        <div>SUN</div>
        <div>MON</div>
        <div>TUE</div>
        <div>WED</div>
        <div>THU</div>
        <div>FRI</div>
        <div>SAT</div>
      </div>

      <div 
        ref={gridRef}
        className="grid grid-cols-7 gap-2 px-2.5 pb-3 animate-[fade_0.14s_ease]"
        style={{
          animation: 'fade 0.14s ease'
        }}
      >
        {cells.map((date, idx) => {
          const isOtherMonth = date.getMonth() !== viewMonth;
          const isToday = sameDay(date, today);
          const isDisabled = !isMarketDayNoFuture(date);
          const isStart = sameDay(date, rangeStart);
          const isEnd = sameDay(date, rangeEnd);
          const isMiddle = rangeStart && rangeEnd && inRange(date, rangeStart, rangeEnd);
          const showWeekendDot = isWeekend(date);
          const showHolidayDot = isHoliday(date);

          let className = 'rounded-xl bg-[#0e1631] border border-border flex items-center justify-center font-bold text-foreground cursor-pointer select-none outline-none transition-all duration-[120ms] relative text-sm h-[46px]';
          
          if (isDisabled) {
            className += ' text-[#8d97b8] bg-[#0b1126] cursor-not-allowed';
          } else {
            className += ' hover:bg-[#131f42]';
          }
          
          if (isOtherMonth) {
            className += ' opacity-[0.58]';
          }
          
          if (isToday) {
            className += ' shadow-[0_0_0_2px_#47C6FC_inset]';
          }
          
          if (isStart || isEnd) {
            className += ' bg-gradient-to-b from-[#1C8CEB] to-[#147ED4] border-[#0f6bb5] text-white';
          } else if (isMiddle) {
            className += ' bg-[rgba(20,126,212,.28)] border-[rgba(20,126,212,.55)] text-[#061b39] font-extrabold';
          }

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => onInfoChange(statusText(date))}
              onMouseLeave={() => onInfoChange('')}
              onFocus={() => onInfoChange(statusText(date))}
              onBlur={() => onInfoChange('')}
              disabled={isDisabled}
              className={className}
              data-testid={`day-${date.getDate()}-${date.getMonth()}`}
            >
              {date.getDate()}
              
              {showWeekendDot && (
                <span 
                  className="absolute left-2 bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#B0B9D6]"
                  data-testid="weekend-indicator"
                />
              )}
              
              {showHolidayDot && (
                <span 
                  className="absolute left-2 bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#E74C3C]"
                  data-testid="holiday-indicator"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

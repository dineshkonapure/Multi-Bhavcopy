import { useState, useEffect } from 'react';
import { Calendar } from '@/components/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, X, RefreshCw } from 'lucide-react';
import { fmtHuman, selectedDates, getInitialDate, latestAvailableTradingDay, nextMktDay } from '@/lib/dateUtils';
import { QuickSelectDialog } from '@/components/quick-select-dialog';

export default function Home() {
  const { toast } = useToast();
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [infoText, setInfoText] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [quickSelectOpen, setQuickSelectOpen] = useState(false);

  useEffect(() => {
    const initial = getInitialDate();
    setRangeStart(initial);
    setRangeEnd(null);
  }, []);

  const handleDateSelect = (date: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      setRangeEnd(date);
    }
  };

  const handleClearDates = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setInfoText('');
  };

  const handleDownload = async () => {
    const dates = selectedDates(rangeStart, rangeEnd);
    if (dates.length === 0 && rangeStart) {
      dates.push(rangeStart);
    }
    
    if (dates.length === 0) {
      toast({
        title: "No dates selected",
        description: "Please select at least one market day to download.",
        variant: "destructive"
      });
      return;
    }

    const urls: string[] = [];
    setDownloadProgress(0);

    try {
      for (const date of dates) {
        const response = await fetch('/api/download-urls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: date.toISOString() })
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          throw new Error('Invalid response from server');
        }

        if (!data.success || !data.urls) {
          throw new Error(data.error || 'Failed to generate download URLs');
        }

        urls.push(...data.urls);
      }

      let completed = 0;
      const failedUrls: string[] = [];

      for (const url of urls) {
        try {
          const iframe = document.createElement('iframe');
          iframe.style.cssText = 'width:0;height:0;border:0;position:absolute;left:-9999px;';
          iframe.src = url;
          document.body.appendChild(iframe);
          
          await new Promise(resolve => setTimeout(resolve, 1700));
          
          completed++;
          setDownloadProgress(completed / urls.length);
          
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 5000);
        } catch (downloadError) {
          console.error('Download error for URL:', url, downloadError);
          failedUrls.push(url);
          completed++;
          setDownloadProgress(completed / urls.length);
        }
      }

      const lastDate = dates.reduce((a, b) => a > b ? a : b);
      
      if (failedUrls.length === 0) {
        localStorage.setItem('bhavcopyLastDate', lastDate.toISOString());
      }

      setTimeout(() => {
        setDownloadProgress(0);
      }, 1200);

      if (failedUrls.length === 0) {
        toast({
          title: "Download complete",
          description: `Successfully started download for ${urls.length} file${urls.length !== 1 ? 's' : ''} across ${dates.length} day${dates.length !== 1 ? 's' : ''}.`
        });
      } else if (failedUrls.length === urls.length) {
        toast({
          title: "All downloads failed",
          description: `Failed to download ${failedUrls.length} file${failedUrls.length !== 1 ? 's' : ''}. Please check your network connection and try again.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Partial download",
          description: `Downloaded ${urls.length - failedUrls.length} of ${urls.length} files. ${failedUrls.length} file${failedUrls.length !== 1 ? 's' : ''} failed. Some data may be incomplete.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadProgress(0);
      
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuickSelect = () => {
    const lastISO = localStorage.getItem('bhavcopyLastDate');
    
    if (!lastISO) {
      toast({
        title: "No download history",
        description: "You haven't downloaded any files yet. Please select a date range from the Quick Select menu.",
      });
      setQuickSelectOpen(true);
      return;
    }
    
    try {
      const last = new Date(lastISO);
      if (isNaN(last.getTime())) {
        toast({
          title: "Invalid download history",
          description: "Your saved download history is corrupted. Please select a new date range from the Quick Select menu.",
          variant: "destructive"
        });
        localStorage.removeItem('bhavcopyLastDate');
        setQuickSelectOpen(true);
        return;
      }
      
      const from = nextMktDay(last);
      const to = latestAvailableTradingDay();
      
      if (from > to) {
        toast({
          title: "Already up to date",
          description: "You've already downloaded all available market days. No new data to download."
        });
        return;
      }
      
      setRangeStart(from);
      setRangeEnd(to);
      
      const newDaysCount = selectedDates(from, to).length;
      toast({
        title: "Quick select applied",
        description: `Selected ${newDaysCount} new market day${newDaysCount !== 1 ? 's' : ''} since your last download.`
      });
    } catch (error) {
      console.error('Quick select error:', error);
      toast({
        title: "Quick select failed",
        description: "An unexpected error occurred. Please try selecting dates manually.",
        variant: "destructive"
      });
      setQuickSelectOpen(true);
    }
  };

  const getSelectionText = () => {
    const dates = selectedDates(rangeStart, rangeEnd);
    if (dates.length === 0 && rangeStart) {
      return `Selected ${fmtHuman(rangeStart)} (single day)`;
    }
    if (dates.length === 0) {
      return 'No date selected';
    }
    if (dates.length === 1) {
      return `Selected ${fmtHuman(dates[0])}`;
    }
    return `${dates.length} days: ${fmtHuman(dates[0])} → ${fmtHuman(dates[dates.length - 1])}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[760px] bg-card border border-card-border rounded-2xl shadow-xl relative overflow-hidden">
        {downloadProgress > 0 && (
          <div 
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#147ED4] to-[#47C6FC] transition-all duration-300 ease-out"
            style={{ 
              width: `${downloadProgress * 100}%`,
              boxShadow: '0 8px 18px rgba(20,126,212,.45)'
            }}
            data-testid="progress-bar"
          />
        )}

        <div className="p-4 pt-5">
          <header className="text-center mb-3">
            <h1 className="text-[22px] font-extrabold tracking-[0.2px] text-foreground" data-testid="title">
              NSE-BSE BhavCopy & CA
            </h1>
          </header>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-2.5">
            <Button
              onClick={handleDownload}
              disabled={!rangeStart && !rangeEnd}
              className="bg-gradient-to-b from-[#1C8CEB] to-[#147ED4] hover:from-[#1C8CEB] hover:to-[#147ED4] border-0 text-white font-extrabold tracking-[0.2px] rounded-full px-4 min-h-9 shadow-[0_10px_24px_rgba(20,126,212,.34)] hover:shadow-[0_12px_28px_rgba(20,126,212,.40)] active:translate-y-px transition-all no-default-hover-elevate no-default-active-elevate"
              data-testid="button-download"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download
            </Button>
            
            <Button
              onClick={handleClearDates}
              variant="outline"
              className="bg-[#0f1730] border-border font-extrabold tracking-[0.2px] rounded-full px-4 min-h-9 hover:bg-[#0f1730] hover-elevate active-elevate-2"
              data-testid="button-clear"
            >
              <X className="w-4 h-4 mr-1.5" />
              Clear
            </Button>
            
            <Badge 
              variant="outline" 
              className="px-3 py-2 rounded-full text-xs bg-[#0f1730] border-border text-muted-foreground font-normal"
              data-testid="text-selection-status"
            >
              {getSelectionText()}
            </Badge>
          </div>

          <div 
            className="text-center text-muted-foreground text-[13px] min-h-[22px] mb-2.5 opacity-95 transition-opacity duration-150"
            data-testid="text-info-line"
          >
            {infoText}
          </div>

          <Calendar
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onDateSelect={handleDateSelect}
            onInfoChange={setInfoText}
            onQuickSelect={handleQuickSelect}
          />

          <footer className="text-center text-muted-foreground text-xs mt-2">
            © Dinesh FA@Validus
          </footer>
        </div>
      </div>

      <QuickSelectDialog
        open={quickSelectOpen}
        onOpenChange={setQuickSelectOpen}
        onSelect={(start, end) => {
          setRangeStart(start);
          setRangeEnd(end);
          setQuickSelectOpen(false);
        }}
      />
    </div>
  );
}

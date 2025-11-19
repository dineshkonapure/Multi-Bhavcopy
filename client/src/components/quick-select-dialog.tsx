import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Clock } from "lucide-react";
import { latestAvailableTradingDay, prevMktDay } from "@/lib/dateUtils";

interface QuickSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (start: Date, end: Date) => void;
}

export function QuickSelectDialog({ open, onOpenChange, onSelect }: QuickSelectDialogProps) {
  const handleLast5Days = () => {
    const end = latestAvailableTradingDay();
    let start = new Date(end);
    for (let i = 0; i < 4; i++) {
      start = prevMktDay(start);
    }
    onSelect(start, end);
  };

  const handleLast10Days = () => {
    const end = latestAvailableTradingDay();
    let start = new Date(end);
    for (let i = 0; i < 9; i++) {
      start = prevMktDay(start);
    }
    onSelect(start, end);
  };

  const handleCurrentMonth = () => {
    const end = latestAvailableTradingDay();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    onSelect(start, end);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-card-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Quick Select</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a predefined date range for downloading BhavCopy files
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          <Button
            onClick={handleLast5Days}
            variant="outline"
            className="justify-start h-auto py-3 px-4 hover-elevate active-elevate-2"
            data-testid="button-last-5-days"
          >
            <Clock className="w-5 h-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Last 5 Market Days</div>
              <div className="text-xs text-muted-foreground">Quick download for recent data</div>
            </div>
          </Button>

          <Button
            onClick={handleLast10Days}
            variant="outline"
            className="justify-start h-auto py-3 px-4 hover-elevate active-elevate-2"
            data-testid="button-last-10-days"
          >
            <TrendingUp className="w-5 h-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Last 10 Market Days</div>
              <div className="text-xs text-muted-foreground">Extended period for analysis</div>
            </div>
          </Button>

          <Button
            onClick={handleCurrentMonth}
            variant="outline"
            className="justify-start h-auto py-3 px-4 hover-elevate active-elevate-2"
            data-testid="button-current-month"
          >
            <Calendar className="w-5 h-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Current Month</div>
              <div className="text-xs text-muted-foreground">All trading days this month</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

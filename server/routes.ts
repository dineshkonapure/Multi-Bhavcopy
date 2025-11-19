import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const pad = (n: number): string => (n < 10 ? '0' : '') + n;

const ymd = (d: Date): string => 
  d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());

const dmy2 = (d: Date): string => 
  pad(d.getDate()) + pad(d.getMonth() + 1) + String(d.getFullYear()).slice(2);

const buildUrls = (d: Date): string[] => [
  `https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_${ymd(d)}_F_0000.csv.zip`,
  `https://www.bseindia.com/download/BhavCopy/Equity/BhavCopy_BSE_CM_0_0_0_${ymd(d)}_F_0000.csv`,
  `https://archives.nseindia.com/archives/equities/bhavcopy/pr/PR${dmy2(d)}.zip`
];

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/download-urls", async (req, res) => {
    try {
      const { date } = req.body;
      
      if (!date) {
        return res.status(400).json({ error: "Date is required" });
      }

      const dateObj = new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      const urls = buildUrls(dateObj);
      
      res.json({
        success: true,
        urls,
        date: dateObj.toISOString()
      });
    } catch (error) {
      console.error("Error generating download URLs:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate download URLs" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

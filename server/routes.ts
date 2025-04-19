import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertResearchSchema, insertReportSchema } from "@shared/schema";
import { analyzeCompetitors, generateReport } from "./ai";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);
  
  // Research endpoints
  app.get("/api/researches", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user!.id;
    const researches = await storage.getResearchesByUserId(userId);
    res.json(researches);
  });
  
  app.get("/api/researches/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const researchId = parseInt(req.params.id);
    const research = await storage.getResearch(researchId);
    
    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }
    
    if (research.userId !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    res.json(research);
  });
  
  app.post("/api/researches", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const researchData = {
        ...req.body,
        userId,
      };
      
      const validatedData = insertResearchSchema.parse(researchData);
      const research = await storage.createResearch(validatedData);
      
      // If auto-find competitors is enabled, start the analysis process
      if (research.autoFindCompetitors) {
        // This would be done asynchronously in a production environment
        // For simplicity, we'll do it synchronously in this MVP
        try {
          const competitors = await analyzeCompetitors(research);
          await storage.updateResearch(research.id, {
            competitors: competitors.join(", "),
            status: "completed"
          });
          
          // Generate the report
          const reportContent = await generateReport(research, competitors);
          await storage.createReport({
            researchId: research.id,
            userId,
            content: reportContent
          });
        } catch (error) {
          console.error("Error during AI analysis:", error);
          await storage.updateResearch(research.id, { status: "failed" });
        }
      }
      
      res.status(201).json(research);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create research" });
    }
  });
  
  app.put("/api/researches/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const researchId = parseInt(req.params.id);
    const research = await storage.getResearch(researchId);
    
    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }
    
    if (research.userId !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const updatedResearch = await storage.updateResearch(researchId, req.body);
      res.json(updatedResearch);
    } catch (error) {
      res.status(500).json({ message: "Failed to update research" });
    }
  });
  
  app.delete("/api/researches/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const researchId = parseInt(req.params.id);
    const research = await storage.getResearch(researchId);
    
    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }
    
    if (research.userId !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      await storage.deleteResearch(researchId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete research" });
    }
  });
  
  // Report endpoints
  app.get("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user!.id;
    const reports = await storage.getReportsByUserId(userId);
    res.json(reports);
  });
  
  app.get("/api/reports/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const reportId = parseInt(req.params.id);
    const report = await storage.getReport(reportId);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    if (report.userId !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    res.json(report);
  });
  
  app.get("/api/researches/:id/report", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const researchId = parseInt(req.params.id);
    const research = await storage.getResearch(researchId);
    
    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }
    
    if (research.userId !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const report = await storage.getReportByResearchId(researchId);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found for this research" });
    }
    
    res.json(report);
  });
  
  app.post("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const reportData = {
        ...req.body,
        userId,
      };
      
      const validatedData = insertReportSchema.parse(reportData);
      
      // Check if the user owns the research
      const research = await storage.getResearch(validatedData.researchId);
      if (!research || research.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });
  
  // User statistics
  app.get("/api/user/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user!.id;
    const stats = await storage.getUserStats(userId);
    res.json(stats);
  });

  const httpServer = createServer(app);

  return httpServer;
}

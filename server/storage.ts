import { users, type User, type InsertUser, researches, type Research, type InsertResearch, reports, type Report, type InsertReport } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Research operations
  getResearch(id: number): Promise<Research | undefined>;
  getResearchesByUserId(userId: number): Promise<Research[]>;
  createResearch(research: InsertResearch): Promise<Research>;
  updateResearch(id: number, research: Partial<Research>): Promise<Research | undefined>;
  deleteResearch(id: number): Promise<boolean>;
  
  // Report operations
  getReport(id: number): Promise<Report | undefined>;
  getReportByResearchId(researchId: number): Promise<Report | undefined>;
  getReportsByUserId(userId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
  // Stats
  getUserStats(userId: number): Promise<{
    totalResearches: number;
    totalCompetitors: number;
    totalReports: number;
  }>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private researches: Map<number, Research>;
  private reports: Map<number, Report>;
  private userIdCounter: number;
  private researchIdCounter: number;
  private reportIdCounter: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.researches = new Map();
    this.reports = new Map();
    this.userIdCounter = 1;
    this.researchIdCounter = 1;
    this.reportIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours in milliseconds
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Research operations
  async getResearch(id: number): Promise<Research | undefined> {
    return this.researches.get(id);
  }

  async getResearchesByUserId(userId: number): Promise<Research[]> {
    return Array.from(this.researches.values())
      .filter(research => research.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createResearch(insertResearch: InsertResearch): Promise<Research> {
    const id = this.researchIdCounter++;
    const now = new Date();
    const research: Research = { ...insertResearch, id, status: 'pending', createdAt: now };
    this.researches.set(id, research);
    return research;
  }

  async updateResearch(id: number, researchData: Partial<Research>): Promise<Research | undefined> {
    const research = await this.getResearch(id);
    if (!research) return undefined;
    
    const updatedResearch = { ...research, ...researchData };
    this.researches.set(id, updatedResearch);
    return updatedResearch;
  }

  async deleteResearch(id: number): Promise<boolean> {
    return this.researches.delete(id);
  }

  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReportByResearchId(researchId: number): Promise<Report | undefined> {
    return Array.from(this.reports.values()).find(
      (report) => report.researchId === researchId
    );
  }

  async getReportsByUserId(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.reportIdCounter++;
    const now = new Date();
    const report: Report = { ...insertReport, id, createdAt: now };
    this.reports.set(id, report);
    return report;
  }

  // Stats
  async getUserStats(userId: number): Promise<{ totalResearches: number; totalCompetitors: number; totalReports: number; }> {
    const userResearches = await this.getResearchesByUserId(userId);
    const userReports = await this.getReportsByUserId(userId);
    
    let totalCompetitors = 0;
    userReports.forEach(report => {
      totalCompetitors += report.content.competitors.length;
    });

    return {
      totalResearches: userResearches.length,
      totalCompetitors,
      totalReports: userReports.length
    };
  }
}

export const storage = new MemStorage();

import { type Task, type InsertTask, type DailyStats, type InsertDailyStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Task operations
  getTasksByDate(date: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Daily stats operations
  getDailyStats(date: string): Promise<DailyStats | undefined>;
  getDailyStatsRange(startDate: string, endDate: string): Promise<DailyStats[]>;
  upsertDailyStats(stats: InsertDailyStats): Promise<DailyStats>;
  updateDailyStatsForDate(date: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private dailyStats: Map<string, DailyStats>;

  constructor() {
    this.tasks = new Map();
    this.dailyStats = new Map();
  }

  // Task operations
  async getTasksByDate(date: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((task) => task.date === date);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      id,
      title: insertTask.title,
      description: insertTask.description ?? null,
      completed: insertTask.completed ?? false,
      date: insertTask.date,
      createdAt: new Date(),
      completedAt: null,
    };
    this.tasks.set(id, task);
    
    // Update daily stats for this date
    await this.updateDailyStatsForDate(task.date);
    
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask: Task = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    
    // Update daily stats for this date
    await this.updateDailyStatsForDate(task.date);
    
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = this.tasks.get(id);
    if (!task) return false;
    
    const date = task.date;
    const deleted = this.tasks.delete(id);
    
    if (deleted) {
      // Update daily stats for this date
      await this.updateDailyStatsForDate(date);
    }
    
    return deleted;
  }

  // Daily stats operations
  async getDailyStats(date: string): Promise<DailyStats | undefined> {
    return this.dailyStats.get(date);
  }

  async getDailyStatsRange(startDate: string, endDate: string): Promise<DailyStats[]> {
    return Array.from(this.dailyStats.values())
      .filter((stats) => stats.date >= startDate && stats.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async upsertDailyStats(insertStats: InsertDailyStats): Promise<DailyStats> {
    const existing = this.dailyStats.get(insertStats.date);
    
    if (existing) {
      const updated: DailyStats = {
        ...existing,
        date: insertStats.date,
        totalTasks: insertStats.totalTasks,
        completedTasks: insertStats.completedTasks,
        completionRate: insertStats.completionRate,
      };
      this.dailyStats.set(insertStats.date, updated);
      return updated;
    }
    
    const id = randomUUID();
    const stats: DailyStats = {
      id,
      date: insertStats.date,
      totalTasks: insertStats.totalTasks,
      completedTasks: insertStats.completedTasks,
      completionRate: insertStats.completionRate,
    };
    this.dailyStats.set(insertStats.date, stats);
    return stats;
  }

  async updateDailyStatsForDate(date: string): Promise<void> {
    const tasksForDate = await this.getTasksByDate(date);
    const totalTasks = tasksForDate.length;
    const completedTasks = tasksForDate.filter((task) => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await this.upsertDailyStats({
      date,
      totalTasks,
      completedTasks,
      completionRate,
    });
  }
}

export const storage = new MemStorage();

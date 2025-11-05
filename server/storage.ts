import { type Task, type InsertTask, type DailyStats, type InsertDailyStats } from "@shared/schema";
import { randomUUID } from "crypto";
import { MongoClient, type Db, type Collection } from "mongodb";

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

class MongoStorage implements IStorage {
  private client: MongoClient;
  private db?: Db;
  private tasksCol?: Collection<Task>;
  private statsCol?: Collection<DailyStats>;
  private initialized?: Promise<void>;

  constructor(private url: string) {
    this.client = new MongoClient(url);
  }

  private async ensureInit(): Promise<void> {
    if (!this.initialized) {
      this.initialized = (async () => {
        await this.client.connect();
        const dbName = (() => {
          try {
            const u = new URL(this.url);
            const name = u.pathname.replace(/^\//, "");
            return name || "tasktrackgrowth";
          } catch {
            return "tasktrackgrowth";
          }
        })();
        this.db = this.client.db(dbName);
        this.tasksCol = this.db.collection<Task>("tasks");
        this.statsCol = this.db.collection<DailyStats>("daily_stats");
        await this.tasksCol.createIndex({ id: 1 }, { unique: true });
        await this.tasksCol.createIndex({ date: 1 });
        await this.statsCol.createIndex({ date: 1 }, { unique: true });
      })();
    }
    return this.initialized;
  }

  async getTasksByDate(date: string): Promise<Task[]> {
    await this.ensureInit();
    const docs = await this.tasksCol!.find({ date }).sort({ createdAt: 1 }).toArray();
    return docs.map((d: any) => {
      const { _id, ...rest } = d;
      return rest as Task;
    });
  }

  async getTask(id: string): Promise<Task | undefined> {
    await this.ensureInit();
    const doc = await this.tasksCol!.findOne({ id });
    if (!doc) return undefined;
    const { _id, ...rest } = (doc as any);
    return rest as Task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    await this.ensureInit();
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
    await this.tasksCol!.insertOne(task as any);
    await this.updateDailyStatsForDate(task.date);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    await this.ensureInit();
    const existing = await this.tasksCol!.findOne({ id });
    if (!existing) return undefined;
    await this.tasksCol!.updateOne({ id }, { $set: updates });
    const updated = await this.tasksCol!.findOne({ id });
    if (!updated) return undefined;
    await this.updateDailyStatsForDate(existing.date);
    const { _id, ...rest } = (updated as any);
    return rest as Task;
  }

  async deleteTask(id: string): Promise<boolean> {
    await this.ensureInit();
    const existing = await this.tasksCol!.findOne({ id });
    if (!existing) return false;
    const res = await this.tasksCol!.deleteOne({ id });
    if (res.deletedCount === 1) {
      await this.updateDailyStatsForDate(existing.date);
      return true;
    }
    return false;
  }

  async getDailyStats(date: string): Promise<DailyStats | undefined> {
    await this.ensureInit();
    const doc = await this.statsCol!.findOne({ date });
    if (!doc) return undefined;
    const { _id, ...rest } = (doc as any);
    return rest as DailyStats;
  }

  async getDailyStatsRange(startDate: string, endDate: string): Promise<DailyStats[]> {
    await this.ensureInit();
    const docs = await this.statsCol!
      .find({ date: { $gte: startDate, $lte: endDate } })
      .sort({ date: 1 })
      .toArray();
    return docs.map((d: any) => {
      const { _id, ...rest } = d;
      return rest as DailyStats;
    });
  }

  async upsertDailyStats(insertStats: InsertDailyStats): Promise<DailyStats> {
    await this.ensureInit();
    const newId = randomUUID();
    await this.statsCol!.updateOne(
      { date: insertStats.date },
      {
        $set: {
          totalTasks: insertStats.totalTasks,
          completedTasks: insertStats.completedTasks,
          completionRate: insertStats.completionRate,
        },
        $setOnInsert: {
          id: newId,
          date: insertStats.date,
        },
      },
      { upsert: true }
    );
    const doc = await this.statsCol!.findOne({ date: insertStats.date });
    const { _id, ...rest } = (doc as any);
    return rest as DailyStats;
  }

  async updateDailyStatsForDate(date: string): Promise<void> {
    await this.ensureInit();
    const totalTasks = await this.tasksCol!.countDocuments({ date });
    const completedTasks = await this.tasksCol!.countDocuments({ date, completed: true });
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    await this.upsertDailyStats({
      date,
      totalTasks,
      completedTasks,
      completionRate,
    });
  }
}

export const storage: IStorage =
  process.env.MONGO_URL && process.env.MONGO_URL.length > 0
    ? new MongoStorage(process.env.MONGO_URL)
    : new MemStorage();

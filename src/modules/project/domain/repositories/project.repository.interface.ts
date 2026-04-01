import { Project } from '../entities/project.entity';
import { ProjectStatus } from '../enums/project-status.enum';

export interface ProjectFindAllQuery {
  page: number;
  limit: number;
  search?: string; // ILIKE on judulProyek or namaClient
  status?: ProjectStatus;
  kategori?: string;
  tipePembayaran?: string;
  prioritas?: string;
}

export interface ProjectFindAllResult {
  data: Project[];
  total: number;
}

export type ProjectStatusSummary = Record<ProjectStatus, number>;

/**
 * Abstract port — defines what the application layer needs from persistence.
 * The concrete implementation lives in the infrastructure layer (TypeORM).
 */
export abstract class IProjectRepository {
  abstract save(project: Project): Promise<Project>;
  abstract findById(id: string): Promise<Project | null>;
  abstract findAll(query: ProjectFindAllQuery): Promise<ProjectFindAllResult>;
  abstract countByStatus(): Promise<ProjectStatusSummary>;
  abstract nextNomorProyek(): Promise<string>;
  abstract hardDelete(id: string): Promise<void>;
}

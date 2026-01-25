
export enum DataSourceType {
  LOGS = 'System Logs',
  CSV = 'Spreadsheet',
  PDF = 'Unstructured Document',
  TEXT = 'Raw Text'
}

export interface TransformationSchema {
  id: string;
  name: string;
  description: string;
  targetJsonSchema: any;
}

export interface DataObject {
  id: string;
  name: string;
  rawContent: string;
  type: DataSourceType;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  structuredData?: any;
  confidence?: number;
  explanation?: string;
}

export interface VectorEntry {
  id: string;
  chunk: string;
  embedding: number[];
  metadata: Record<string, any>;
}

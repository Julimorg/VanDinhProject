export interface IImportRowError {
  rowNumber: number;
  messages: string[];
}

export interface IImportSummaryRes {
  importedCount: number;
  message: string;
}
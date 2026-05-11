export const ICsvReaderToken = Symbol('ICsvReader');

export interface ICsvReader {
  readCsv(filePath: string): Promise<any[]>;
}

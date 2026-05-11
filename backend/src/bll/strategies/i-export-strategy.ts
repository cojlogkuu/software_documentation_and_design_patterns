export interface IExportStrategy {
  export(data: any[]): Promise<void>;
}

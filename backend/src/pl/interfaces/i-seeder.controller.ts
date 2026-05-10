export interface ISeederController {
  seed(): Promise<string>;
}

export class EnvService {
  public get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }
}

export class Configurable<T> {
    configuration: T = {} as T;

    applyConfig(config: any): void {
        this.configuration = Object.assign(this.configuration,  config) as T;
    }
}

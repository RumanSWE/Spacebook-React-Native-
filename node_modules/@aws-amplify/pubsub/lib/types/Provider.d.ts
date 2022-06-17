import Observable from 'zen-observable-ts';
import { ProviderOptions } from './PubSub';
export interface PubSubProvider {
    configure(config: object): object;
    getCategory(): string;
    getProviderName(): string;
    publish(topics: string[] | string, msg: any, options?: ProviderOptions): void;
    subscribe(topics: string[] | string, options?: ProviderOptions): Observable<any>;
}

export default class EventEmitter {
    private events;
    constructor();
    _getEventListByName(eventName: string): Set<Function> | undefined;
    on(eventName: string, fn: Function): void;
    once(eventName: string, fn: Function): void;
    emit(eventName: string, ...args: any[]): void;
    removeListener(eventName: string, fn: Function): void;
}

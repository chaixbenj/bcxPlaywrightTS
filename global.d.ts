declare const window: Window & typeof globalThis;

declare global {
    interface Window {
        findClosestElementByText: (name: string) => HTMLElement | null;
    }
}

export { };
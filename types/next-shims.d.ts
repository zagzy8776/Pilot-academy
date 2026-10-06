/**
 * Minimal ambient type shims for `next`.
 *
 * The `next` package resolved from this workspace's node_modules ships WITHOUT
 * its bundled TypeScript declaration files (there are zero *.d.ts files in
 * node_modules/next), so TypeScript cannot resolve the `next/*` public types.
 * These declarations restore just the surface this project uses so that
 * `tsc` and `next build` can type-check successfully.
 *
 * They are intentionally permissive. Once node_modules/next is reinstalled with
 * its declarations intact (e.g. `npm ci` on a machine with npm registry access),
 * delete this file so the real Next types are used.
 */

declare module 'next' {
  export type Metadata = Record<string, any>;
  export type Viewport = Record<string, any>;
}

declare module 'next/server' {
  export class NextResponse extends Response {
    constructor(body?: BodyInit | null, init?: ResponseInit);
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(init?: ResponseInit): NextResponse;
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse;
  }
  export interface RequestCookies {
    get(name: string): { name: string; value: string } | undefined;
    set(name: string, value: string): void;
    delete(name: string): void;
  }
  export class NextRequest extends Request {
    readonly nextUrl: URL;
    readonly cookies: RequestCookies;
  }
  export type NextFetchEvent = { waitUntil(promise: Promise<any>): void };
}

declare module 'next/server.js' {
  export * from 'next/server';
}

declare module 'next/headers' {
  export interface ReadonlyRequestCookies {
    get(name: string): { name: string; value: string } | undefined;
    set(name: string, value: string, options?: any): void;
    delete(name: string): void;
  }
  export function cookies(): Promise<ReadonlyRequestCookies>;
  export function headers(): Promise<Headers>;
  export function draftMode(): Promise<{ isEnabled: boolean; enable(): void; disable(): void }>;
}

declare module 'next/types.js' {
  export type ResolvingMetadata = Record<string, any>;
  export type ResolvingViewport = Record<string, any>;
}

declare module 'next/dist/lib/metadata/types/metadata-interface.js' {
  export type ResolvingMetadata = Record<string, any>;
  export type ResolvingViewport = Record<string, any>;
  export type Metadata = Record<string, any>;
  export type Viewport = Record<string, any>;
}

declare module 'next/dist/server/next.js' {
  const next: any;
  export default next;
}

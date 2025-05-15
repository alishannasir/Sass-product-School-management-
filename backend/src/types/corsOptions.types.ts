export interface CorsOptions {
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    methods: string[];
}
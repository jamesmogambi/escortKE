if (typeof File === "undefined") {
    (global as any).File = class File extends Blob {
        name: string;
        lastModified: number;

        constructor(chunks: any[], name: string, options?: any) {
            super(chunks, options);
            this.name = name;
            this.lastModified = options?.lastModified || Date.now();
        }
    };
}

export {};

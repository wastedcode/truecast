declare module "write-file-atomic" {
  interface Options {
    chown?: { uid: number; gid: number } | false;
    encoding?: BufferEncoding | null;
    fsync?: boolean;
    mode?: number;
    tmpfileCreated?: (tmpfile: string) => void;
  }
  function writeFileAtomic(
    file: string,
    data: string | NodeJS.ArrayBufferView,
    options?: Options,
  ): Promise<void>;
  namespace writeFileAtomic {
    function sync(file: string, data: string | NodeJS.ArrayBufferView, options?: Options): void;
  }
  export = writeFileAtomic;
}

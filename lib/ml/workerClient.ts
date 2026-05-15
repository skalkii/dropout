import * as Comlink from "comlink";
import type { Trainer } from "./worker";

export type TrainerHandle = {
  proxy: Comlink.Remote<Trainer>;
  terminate: () => void;
};

export function spawnTrainer(): TrainerHandle {
  const worker = new Worker(new URL("./worker.ts", import.meta.url));
  const proxy = Comlink.wrap<Trainer>(worker);
  return {
    proxy,
    terminate: () => {
      try {
        worker.terminate();
      } catch {
        /* noop */
      }
    },
  };
}

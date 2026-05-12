import { readFile } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';

const CHECKPOINT = process.env.HERMES_CHECKPOINT_PATH
  ?? `${process.env.HOME}/.hermes/workspace_checkpoint.json`;

export const dynamic = 'force-dynamic';

export async function GET() {
  const enc = new TextEncoder();
  let closed = false;
  let watcher: ReturnType<typeof watch> | null = null;
  let keepAlive: ReturnType<typeof setInterval> | null = null;

  const send = (controller: ReadableStreamDefaultController, data: object) => {
    if (closed) return;
    try {
      controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch {
      closed = true;
    }
  };

  const ping = (controller: ReadableStreamDefaultController) => {
    if (closed) return;
    try {
      controller.enqueue(enc.encode(': ping\n\n'));
    } catch {
      closed = true;
    }
  };

  const stream = new ReadableStream({
    async start(controller) {
      const emitCurrent = async () => {
        if (!existsSync(CHECKPOINT)) return send(controller, { agents: {} });
        try {
          const raw = await readFile(CHECKPOINT, 'utf8');
          send(controller, JSON.parse(raw));
        } catch {
          send(controller, { agents: {} });
        }
      };

      await emitCurrent();
      watcher = watch(CHECKPOINT, { persistent: false }, () => { emitCurrent(); });
      keepAlive = setInterval(() => { ping(controller); }, 15000);
    },
    cancel() {
      closed = true;
      watcher?.close();
      if (keepAlive) clearInterval(keepAlive);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

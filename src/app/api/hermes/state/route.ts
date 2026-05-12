import { readFile } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';

const CHECKPOINT = process.env.HERMES_CHECKPOINT_PATH
  ?? `${process.env.HOME}/.hermes/workspace_checkpoint.json`;

const ACTIVITY = process.env.HERMES_ACTIVITY_PATH
  ?? `${process.env.HOME}/.hermes/activity_log.json`;

export const dynamic = 'force-dynamic';

export async function GET() {
  const enc = new TextEncoder();
  let closed = false;
  let watcher: ReturnType<typeof watch> | null = null;
  let activityWatcher: ReturnType<typeof watch> | null = null;
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

      const emitActivity = async () => {
        if (!existsSync(ACTIVITY)) return;
        try {
          const raw = await readFile(ACTIVITY, 'utf8');
          const parsed = JSON.parse(raw);
          send(controller, { events: parsed.events ?? parsed });
        } catch {}
      };

      await emitCurrent();
      await emitActivity();
      if (existsSync(CHECKPOINT)) {
        watcher = watch(CHECKPOINT, { persistent: false }, () => { emitCurrent(); });
      }
      if (existsSync(ACTIVITY)) {
        activityWatcher = watch(ACTIVITY, { persistent: false }, () => { emitActivity(); });
      }
      keepAlive = setInterval(() => { ping(controller); }, 15000);
    },
    cancel() {
      closed = true;
      watcher?.close();
      activityWatcher?.close();
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

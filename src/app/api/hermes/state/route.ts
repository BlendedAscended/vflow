import { readFile } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';

const CHECKPOINT = process.env.HERMES_CHECKPOINT_PATH
  ?? `${process.env.HOME}/.hermes/workspace_checkpoint.json`;

export const dynamic = 'force-dynamic';

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (data: object) =>
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));

      const emitCurrent = async () => {
        if (!existsSync(CHECKPOINT)) return send({ agents: {} });
        try {
          const raw = await readFile(CHECKPOINT, 'utf8');
          send(JSON.parse(raw));
        } catch {
          send({ agents: {} });
        }
      };

      await emitCurrent();
      const watcher = watch(CHECKPOINT, { persistent: false }, () => { emitCurrent(); });
      const keepAlive = setInterval(() => controller.enqueue(enc.encode(': ping\n\n')), 15000);

      // Cleanup on cancel
      return () => { watcher.close(); clearInterval(keepAlive); };
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

import { rotateAgentKey } from "@/features/admin/server/admin-api";

export async function GET(
  request: Request,
  context: { params: Promise<{ agentId: string }> },
) {
  const { agentId } = await context.params;
  const rotated = await rotateAgentKey(agentId);

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AgentWatch · Nueva API key</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(180deg, #f4f7fb 0%, #e9f0f8 100%);
            color: #0f172a;
          }
          .wrap {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
          }
          .card {
            width: min(760px, 100%);
            background: #fff;
            border: 1px solid #dbe2ea;
            border-radius: 24px;
            box-shadow: 0 18px 60px rgba(15, 23, 42, 0.1);
            padding: 32px;
          }
          .eyebrow {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: #0f766e;
            font-weight: 700;
          }
          h1 {
            margin: 10px 0 8px;
            font-size: 30px;
          }
          p {
            color: #475569;
            line-height: 1.6;
          }
          pre {
            overflow: auto;
            white-space: pre-wrap;
            word-break: break-word;
            padding: 18px;
            border-radius: 18px;
            background: #0f172a;
            color: #e2e8f0;
            font-size: 14px;
          }
          .warning {
            margin-top: 14px;
            padding: 14px 16px;
            border-radius: 16px;
            background: #fff7ed;
            color: #9a3412;
            border: 1px solid #fdba74;
          }
          .back {
            display: inline-block;
            margin-top: 18px;
            padding: 12px 16px;
            border-radius: 14px;
            background: #0f172a;
            color: white;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <div class="eyebrow">FEA-03 · Credencial rotada</div>
            <h1>Nueva API key del agente</h1>
            <p>
              Esta clave se muestra una sola vez después de la rotación.
              Guárdala en tu vault o secreto operativo antes de volver al catálogo.
            </p>
            <pre>${rotated.apiKey}</pre>
            <div class="warning">
              Si cierras esta vista sin guardarla, tendrás que rotar la credencial otra vez.
            </div>
            <a class="back" href="/agents">Volver al catálogo de agentes</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

const code = `npm install @agentwatch/sdk

import { AgentWatch } from "@agentwatch/sdk";

const aw = new AgentWatch({
  apiKey: process.env.AGENTWATCH_API_KEY,
});

// Automatically trace your AI agent
aw.trace(agent);`

export function MarketingCodeDemo() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="border-t border-slate-100 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Para desarrolladores
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Hecho por devs, para devs
          </h2>
          <p className="mt-4 text-slate-500">
            Integrá AgentWatch en tu proyecto con una línea. Open Telemetry compatible, sin lock-in.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-2xl">
          <div className="relative rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-500" />
                  <div className="size-2.5 rounded-full bg-yellow-500" />
                  <div className="size-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-slate-500">terminal</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-300"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-green-400" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-6">
              <code>
                <span className="text-slate-500">npm install </span>
                <span className="text-blue-400">@agentwatch/sdk</span>
                <br />
                <br />
                <span className="text-slate-500">import </span>
                <span className="text-purple-400">{"{ AgentWatch }"}</span>
                <span className="text-slate-500"> from </span>
                <span className="text-green-400">&quot;@agentwatch/sdk&quot;</span>
                <span className="text-slate-500">;</span>
                <br />
                <br />
                <span className="text-slate-500">const aw = </span>
                <span className="text-blue-400">new</span>
                <span className="text-slate-500"> AgentWatch({`{`}</span>
                <br />
                <span className="text-slate-500">&nbsp;&nbsp;apiKey: process.env.</span>
                <span className="text-amber-400">AGENTWATCH_API_KEY</span>
                <span className="text-slate-500">,</span>
                <br />
                <span className="text-slate-500">{`}`});</span>
                <br />
                <br />
                <span className="text-slate-400">// Automatically trace your AI agent</span>
                <br />
                <span className="text-slate-500">aw.</span>
                <span className="text-blue-400">trace</span>
                <span className="text-slate-500">(agent);</span>
              </code>
            </pre>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
          {["OpenTelemetry compatible", "Sin lock-in", "SDK open source", "5 minutos de setup"].map(
            (item) => (
              <div key={item} className="inline-flex items-center gap-1.5 text-slate-500">
                <Check className="size-3.5 text-green-500" />
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

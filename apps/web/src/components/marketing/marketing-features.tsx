import { Search, Bell, ClipboardCheck, Route, Activity, Users } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Trazabilidad completa",
    description:
      "Cada interacción de tus agentes AI queda registrada. Buscá por sesión, usuario, herramienta o palabra clave con búsqueda semántica.",
  },
  {
    icon: Bell,
    title: "Alertas inteligentes",
    description:
      "Detectá patrones anómalos, fallos de herramientas, escalaciones y quiebres de confianza. Recibí notificaciones antes de que los usuarios se quejen.",
  },
  {
    icon: ClipboardCheck,
    title: "Aprobaciones en vivo",
    description:
      "Configurá flujos de aprobación para acciones sensibles. Aprobá o rechazá desde el dashboard o directo desde Slack.",
  },
  {
    icon: Route,
    title: "Reportes automáticos",
    description:
      "Generá reportes de uso, costos, errores y tendencias sin escribir una línea de código. Exportá a PDF o compartí el enlace.",
  },
  {
    icon: Activity,
    title: "Métricas en tiempo real",
    description:
      "Latencia, tokens por solicitud, tasa de éxito, agentes activos. Todo en dashboards actualizados al segundo.",
  },
  {
    icon: Users,
    title: "Multi-tenant y roles",
    description:
      "Organizaciones, equipos y permisos granulares. Cada cliente ve solo sus datos, vos tenés visión global.",
  },
]

export function MarketingFeatures() {
  return (
    <section className="border-t border-slate-100 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Funcionalidades
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Todo lo que necesitás para monitorear tus agentes
          </h2>
          <p className="mt-4 text-slate-500">
            Una plataforma unificada para observar, alertar y reportar el comportamiento de tus automatizaciones.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/5"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-blue-50 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm leading-6 text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

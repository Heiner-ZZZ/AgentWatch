# Summary And Risk Flow

## Objetivo

Documentar el flujo real de Sprint 4 para resumen de negocio y clasificacion de riesgo.

## Flujo implementado

1. El evento ya validado entra por `CreateEventUseCase`.
2. Se normalizan `eventType`, `category`, `source` y `sourceApp`.
3. `RiskClassificationService` clasifica el evento usando:
   - tipo de accion;
   - categoria;
   - volumen;
   - flags sensibles;
   - señales de metadata como `environment`, `permission_scope`, `key_id`.
4. `BusinessSummaryService` genera `business_summary`:
   - usando plantilla cuando reconoce el tipo de evento;
   - usando fallback tecnico solo si el texto no expone secretos;
   - degradando a frase segura si detecta `api_key`, `token`, `secret`, `password` o similares.
5. El evento se persiste con `risk_level`, `status`, `requires_approval` y `business_summary`.
6. Timeline y detalle consumen esos campos ya enriquecidos.

## Controles activos

- reglas deterministicas y explicables;
- clasificacion persistida;
- proteccion contra eco de secretos en `business_summary`;
- separacion entre datos tecnicos brutos y presentacion de negocio;
- trazabilidad desde evento hasta timeline y aprobacion futura.

## Lo que Sprint 4 no promete aun

- editor de reglas por organizacion;
- calibracion por industria;
- LLM productivo;
- motor estadistico o de anomalias.

## Evidencia tecnica

- `apps/api/src/modules/events/services/business-summary.service.ts`
- `apps/api/src/modules/events/services/risk-classification.service.ts`
- `apps/api/src/modules/events/use-cases/create-event.use-case.ts`
- `apps/api/src/modules/events/services/business-summary.service.spec.ts`
- `apps/api/src/modules/events/services/risk-classification.service.spec.ts`
- `apps/api/test/sprint-4.e2e-spec.ts`

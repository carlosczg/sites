"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Database,
  FileInput,
  Layers3,
  Lightbulb,
  Moon,
  Network,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type PhaseId = "strategy" | "implementation" | "operation";
type TrackId = "delivery" | "management" | "architecture";

type Capability = {
  title: string;
  summary: string;
  work: string[];
};

type UseCase = {
  title: string;
  description: string;
  value: string;
};

type ServiceCell = {
  id: string;
  phase: PhaseId;
  track: TrackId;
  action: string;
  headline: string;
  overview: string;
  outcome: string;
  capabilities: Capability[];
  scope: string[];
  consultants: string[];
  clientRoles: string[];
  inputs: string[];
  outputs: string[];
};

const phases: Array<{ id: PhaseId; title: string; subtitle: string }> = [
  { id: "strategy", title: "Estrategia", subtitle: "Alinear valor, prioridades y arquitectura" },
  { id: "implementation", title: "Implementación", subtitle: "Diseñar, construir y desplegar capacidades" },
  { id: "operation", title: "Operación", subtitle: "Adoptar, optimizar y escalar" },
];

const tracks: Array<{
  id: TrackId;
  title: string;
  subtitle: string;
  accent: string;
}> = [
  { id: "delivery", title: "Data Delivery", subtitle: "Valor y casos de uso", accent: "orange" },
  { id: "management", title: "Data Management", subtitle: "Control y gobierno", accent: "purple" },
  { id: "architecture", title: "Data Architecture", subtitle: "Fundación tecnológica", accent: "blue" },
];

const services: ServiceCell[] = [
  {
    id: "strategy-delivery",
    phase: "strategy",
    track: "delivery",
    action: "Definir",
    headline: "Definir valor y casos de uso",
    overview:
      "Convertimos prioridades de negocio en un portafolio accionable de productos de datos y casos de uso, con valor, factibilidad y responsables explícitos.",
    outcome: "Un backlog priorizado y defendible, listo para pasar de idea a ejecución.",
    capabilities: [
      {
        title: "Business Analytics & CU",
        summary:
          "Identificación, diseño y priorización de casos de uso analíticos, ML, GenAI y agentes con métricas de valor y factibilidad.",
        work: ["Talleres de descubrimiento", "Value–feasibility scoring", "KPIs y business case"],
      },
      {
        title: "Data Products & Modeling",
        summary:
          "Diseño del producto de datos, sus consumidores, contratos, dominio, modelo conceptual y criterios de calidad.",
        work: ["Product canvas", "Modelo de dominio", "Contratos y SLOs de datos"],
      },
    ],
    scope: ["Diagnóstico ejecutivo · 2–4 semanas", "Portafolio priorizado · 4–6 semanas", "Blueprint de producto · 6–8 semanas"],
    consultants: ["Data & AI Strategist", "Data Product Lead", "Business Analyst", "Data / Enterprise Architect"],
    clientRoles: ["Sponsor ejecutivo", "Dueños de proceso y producto", "Líder de Data & AI", "Expertos del negocio"],
    inputs: ["Prioridades y objetivos de negocio", "KPIs y línea base", "Inventario de datos y sistemas", "Restricciones, riesgos y dependencias"],
    outputs: ["Mapa de oportunidades", "Backlog y matriz de priorización", "Business cases", "Canvas y blueprint de productos de datos"],
  },
  {
    id: "implementation-delivery",
    phase: "implementation",
    track: "delivery",
    action: "Construir",
    headline: "Construir productos y soluciones",
    overview:
      "Diseñamos y entregamos incrementos funcionales de datos, BI e IA con criterios de producción, trazabilidad, seguridad y adopción desde el primer sprint.",
    outcome: "Productos de datos e IA utilizables, medibles y listos para escalar.",
    capabilities: [
      { title: "Data Integration", summary: "Ingesta batch o streaming, transformación, calidad, contratos y orquestación de datos.", work: ["Pipelines y conectores", "Reglas de calidad", "Orquestación y lineage"] },
      { title: "Reporting & Dataviz", summary: "Modelos semánticos, tableros y experiencias analíticas orientadas a decisiones.", work: ["Diseño de KPIs", "Modelo semántico", "Dashboards y analítica embebida"] },
      { title: "ML, GenAI & Agentes", summary: "Modelos predictivos, RAG, copilotos y agentes con guardrails, evaluación y observabilidad.", work: ["Experimentación y evaluación", "MVP funcional", "Integración con procesos y APIs"] },
    ],
    scope: ["Piloto funcional · 6–10 semanas", "MVP productivo · 8–14 semanas", "Industrialización por oleadas"],
    consultants: ["Solution Architect", "Data / Analytics Engineer", "BI & UX Specialist", "ML / GenAI Engineer", "QA Automation"],
    clientRoles: ["Product Owner", "Usuarios clave", "Equipos de datos y aplicaciones", "Seguridad y arquitectura"],
    inputs: ["Backlog priorizado", "Acceso a fuentes y ambientes", "Reglas de negocio", "Criterios de aceptación y seguridad"],
    outputs: ["Pipelines y modelos de datos", "Tableros y capas semánticas", "Modelos, RAG o agentes", "Runbooks y documentación técnica"],
  },
  {
    id: "operation-delivery",
    phase: "operation",
    track: "delivery",
    action: "Operar",
    headline: "Estabilizar, optimizar y escalar",
    overview:
      "Operamos los productos de datos e IA con prácticas DataOps/MLOps, SLOs, automatización y optimización continua de rendimiento.",
    outcome: "Servicios confiables con menor tiempo de recuperación y costo controlado.",
    capabilities: [
      { title: "DataOps & MLOps", summary: "Operación de pipelines, modelos y agentes con versionado, monitoreo y despliegue continuo.", work: ["SLOs y runbooks", "CI/CD de datos y modelos", "Monitoreo y respuesta"] },
      { title: "Performance & Tuning", summary: "Optimización de consultas, cargas, almacenamiento y cómputo con foco en experiencia y costo.", work: ["Profiling de cargas", "Tuning de consultas", "Rightsizing y capacity planning"] },
    ],
    scope: ["Health check · 2–3 semanas", "Estabilización · 4–8 semanas", "Servicio administrado mensual"],
    consultants: ["DataOps / SRE Lead", "MLOps Engineer", "Platform Engineer", "FinOps Analyst"],
    clientRoles: ["Service Owner", "Operaciones TI", "Product Owners", "Control financiero"],
    inputs: ["Telemetría y logs", "Inventario de cargas y SLAs", "Histórico de incidentes", "Consumo y costos"],
    outputs: ["SLOs y tablero operativo", "Plan de optimización", "Automatizaciones y alertas", "Reporte de capacidad y costo"],
  },
  {
    id: "strategy-management",
    phase: "strategy",
    track: "management",
    action: "Definir",
    headline: "Diagnosticar madurez y definir dirección",
    overview:
      "Establecemos el punto de partida, la ambición y la hoja de ruta de Data & AI, conectando gobierno, capacidades, organización y valor.",
    outcome: "Una agenda de transformación priorizada, con decisiones y responsables claros.",
    capabilities: [
      { title: "Maturity Assessment", summary: "Evaluación de madurez en estrategia, datos, tecnología, gobierno, talento y adopción.", work: ["Entrevistas y evidencia", "Benchmark de capacidades", "Brechas y quick wins"] },
      { title: "Data & AI Strategy", summary: "Visión objetivo, principios, modelo de valor y roadmap de iniciativas Data & AI.", work: ["North star", "Principios rectores", "Roadmap y modelo de inversión"] },
    ],
    scope: ["Assessment ejecutivo · 3–5 semanas", "Estrategia y roadmap · 6–10 semanas", "Oficina de transformación fraccional"],
    consultants: ["Data & AI Strategy Lead", "Governance Lead", "Enterprise Architect", "Change Lead"],
    clientRoles: ["Comité ejecutivo", "CIO / CDO / CTO", "Líderes de negocio", "Riesgos y cumplimiento"],
    inputs: ["Estrategia corporativa", "Mapa de iniciativas", "Modelo organizacional", "Políticas y métricas actuales"],
    outputs: ["Diagnóstico de madurez", "Visión y principios", "Roadmap por horizontes", "Modelo de valor y gobernanza"],
  },
  {
    id: "implementation-management",
    phase: "implementation",
    track: "management",
    action: "Construir",
    headline: "Activar gobierno y modelo operativo",
    overview:
      "Implementamos los mecanismos que permiten escalar Data & AI con ownership, catálogo, semántica, políticas y formas de trabajo repetibles.",
    outcome: "Gobierno ejecutable integrado al ciclo de entrega, no una capa documental.",
    capabilities: [
      { title: "Data Platform", summary: "Habilitación de zonas, dominios, workspaces y servicios compartidos con controles integrados.", work: ["Landing zones", "Patrones reutilizables", "Servicios de plataforma"] },
      { title: "Catalog, Semantic & Ontology", summary: "Catálogo, glosario, lineage, semántica y conocimiento empresarial conectados.", work: ["Metadatos y ownership", "Capa semántica", "Ontologías y búsqueda"] },
      { title: "Operating Model", summary: "Roles, foros, procesos y métricas para operar productos y dominios de datos.", work: ["RACI y decision rights", "Ceremonias y workflows", "KPIs de adopción y calidad"] },
    ],
    scope: ["MVP de gobierno · 8–12 semanas", "Dominio prioritario · 10–16 semanas", "Despliegue federado por oleadas"],
    consultants: ["Data Governance Lead", "Platform Architect", "Metadata / Semantic Specialist", "Operating Model Consultant"],
    clientRoles: ["CDO y Data Office", "Data Owners y Stewards", "Arquitectura y seguridad", "Equipos de dominio"],
    inputs: ["Políticas y estándares", "Inventario de dominios y datos", "Modelo de roles", "Herramientas disponibles"],
    outputs: ["Modelo operativo y RACI", "Catálogo y glosario MVP", "Políticas automatizadas", "Playbooks de gobierno"],
  },
  {
    id: "operation-management",
    phase: "operation",
    track: "management",
    action: "Operar",
    headline: "Adoptar, medir valor y controlar costo",
    overview:
      "Aseguramos que las capacidades se usen, generen valor y operen dentro de umbrales económicos transparentes.",
    outcome: "Adopción sostenida y trazabilidad entre consumo, desempeño y valor de negocio.",
    capabilities: [
      { title: "Business Adoption", summary: "Gestión del cambio, formación, comunidades y medición del uso efectivo de productos.", work: ["Mapeo de audiencias", "Learning journeys", "Métricas de adopción"] },
      { title: "FinOps & Value Tracking", summary: "Unit economics, presupuestos, showback/chargeback y seguimiento de beneficios.", work: ["Etiquetado y allocation", "Presupuestos y alertas", "Value realization"] },
    ],
    scope: ["Sprint de adopción · 4–6 semanas", "FinOps foundation · 6–8 semanas", "Acompañamiento operativo mensual"],
    consultants: ["Change & Adoption Lead", "FinOps Practitioner", "Data Product Manager", "Value Management Analyst"],
    clientRoles: ["Business Owners", "Finanzas y compras", "Plataforma / Cloud CoE", "Usuarios y champions"],
    inputs: ["Métricas de uso", "Consumo y facturación", "Business cases", "Mapa de usuarios"],
    outputs: ["Plan de adopción", "Tablero FinOps", "Modelo de showback", "Reporte de valor realizado"],
  },
  {
    id: "strategy-architecture",
    phase: "strategy",
    track: "architecture",
    action: "Definir",
    headline: "Diseñar una fundación agnóstica",
    overview:
      "Definimos la arquitectura objetivo y el journey tecnológico sin forzar una plataforma, evaluando ajuste, interoperabilidad, riesgo y costo total.",
    outcome: "Decisiones tecnológicas justificadas y una ruta de evolución sin lock-in innecesario.",
    capabilities: [
      { title: "Arquitectura de Servicios", summary: "Patrones y capacidades objetivo para datos, analítica, ML, GenAI y agentes.", work: ["Capability map", "Arquitectura lógica", "Patrones de integración y seguridad"] },
      { title: "Cloud Journey", summary: "Escenarios de modernización, migración y coexistencia cloud, on-premise o híbrida.", work: ["Assessment técnico", "Escenarios y TCO", "Roadmap de transición"] },
    ],
    scope: ["Architecture assessment · 3–5 semanas", "Target architecture · 6–8 semanas", "Cloud journey · 8–12 semanas"],
    consultants: ["Enterprise Architect", "Cloud / Data Architect", "Security Architect", "FinOps Architect"],
    clientRoles: ["CTO / Arquitectura empresarial", "Infraestructura y cloud", "Seguridad", "Equipos de aplicaciones y datos"],
    inputs: ["Arquitectura actual", "Inventario tecnológico", "NFRs y regulaciones", "Costos y contratos"],
    outputs: ["Arquitectura objetivo", "Matriz de decisiones", "Patrones y standards", "Roadmap de transición y TCO"],
  },
  {
    id: "implementation-architecture",
    phase: "implementation",
    track: "architecture",
    action: "Construir",
    headline: "Automatizar seguridad y despliegue",
    overview:
      "Construimos guardrails, infraestructura y pipelines de entrega que vuelven la arquitectura repetible, auditable y segura.",
    outcome: "Ambientes consistentes y despliegues confiables con controles incorporados.",
    capabilities: [
      { title: "Security", summary: "IAM, secretos, cifrado, segmentación, políticas y controles de datos e IA.", work: ["Threat modeling", "Guardrails y policies", "Pruebas y evidencias"] },
      { title: "Infrastructure as Code", summary: "Provisionamiento versionado y modular de plataforma, redes, datos y observabilidad.", work: ["Módulos reutilizables", "Configuración por ambiente", "Policy as code"] },
      { title: "CI/CD & SDLC", summary: "Pipelines y prácticas para promover código, datos, modelos y configuración entre ambientes.", work: ["Branching y quality gates", "Automated testing", "Release pipelines"] },
    ],
    scope: ["Foundation sprint · 6–10 semanas", "Landing zone productiva · 10–16 semanas", "Aceleradores y factory"],
    consultants: ["Cloud Platform Engineer", "DevSecOps Engineer", "Security Architect", "Data Platform Engineer"],
    clientRoles: ["Cloud CoE", "Seguridad e identidad", "DevOps / Operaciones", "Equipos de entrega"],
    inputs: ["Arquitectura objetivo", "Políticas de seguridad", "Repositorios y toolchain", "Modelo de ambientes"],
    outputs: ["Landing zone", "Módulos IaC", "Pipelines CI/CD", "Controles y evidencias automatizadas"],
  },
  {
    id: "operation-architecture",
    phase: "operation",
    track: "architecture",
    action: "Operar",
    headline: "Asegurar confiabilidad y continuidad",
    overview:
      "Instrumentamos observabilidad y gestión de releases para operar la plataforma con visibilidad extremo a extremo y mejora continua.",
    outcome: "Menos incidentes, recuperación más rápida y cambios con riesgo controlado.",
    capabilities: [
      { title: "Observability", summary: "Métricas, logs, traces y alertas conectados a salud técnica, calidad y costo.", work: ["Mapa de señales", "Dashboards y alertas", "SLOs y error budgets"] },
      { title: "Release & Support Mgmt", summary: "Gestión de cambios, incidentes, problemas, releases y soporte por niveles.", work: ["Runbooks y escalamiento", "Release calendar", "Postmortems y mejora"] },
    ],
    scope: ["Observability baseline · 4–6 semanas", "Service transition · 6–8 semanas", "Soporte y mejora continua"],
    consultants: ["SRE / Observability Lead", "Release Manager", "Platform Support Engineer", "Service Delivery Manager"],
    clientRoles: ["Operaciones TI", "Service Owners", "Mesa de ayuda", "Equipos de plataforma y producto"],
    inputs: ["Inventario de servicios", "SLAs y criticidad", "Herramientas de monitoreo", "Histórico de cambios e incidentes"],
    outputs: ["Modelo de observabilidad", "SLOs y alertas", "Runbooks de soporte", "Proceso de releases e incidentes"],
  },
];

const capabilityDetails: Record<string, string> = {
  "Business Analytics & CU": "Facilitamos sesiones con negocio y tecnología para convertir problemas, decisiones y oportunidades en iniciativas concretas. Cada caso queda asociado a un usuario, una decisión, una métrica de éxito, los datos requeridos y una hipótesis de valor.",
  "Data Products & Modeling": "Diseñamos el producto de datos como un activo operable: definimos consumidores, dominio, interfaces, contratos, reglas de calidad, modelo conceptual y nivel de servicio. El resultado permite construir sin perder el contexto del negocio.",
  "Data Integration": "Construimos flujos batch, near-real-time o streaming desde las fuentes hasta las capas de consumo. Incorporamos validaciones, manejo de errores, reintentos, observabilidad y trazabilidad para que el dato sea confiable en producción.",
  "Reporting & Dataviz": "Partimos de las decisiones y preguntas del usuario, no del inventario de gráficos. Estructuramos KPIs, modelo semántico, navegación y experiencia visual para que los tableros sean consistentes, reutilizables y accionables.",
  "ML, GenAI & Agentes": "Diseñamos la solución desde el riesgo y el valor: datos, modelo, prompts o herramientas, evaluaciones, guardrails, experiencia humana e integración. La prueba de concepto se construye con una ruta explícita hacia producción.",
  "DataOps & MLOps": "Estandarizamos versionado, pruebas, promoción entre ambientes, observabilidad y respuesta operativa para pipelines, modelos y agentes. Definimos responsables, SLOs y automatizaciones que reducen la dependencia de intervenciones manuales.",
  "Performance & Tuning": "Analizamos telemetría, patrones de uso, tiempos de respuesta y consumo para encontrar cuellos de botella. Priorizamos acciones por impacto, riesgo y ahorro, y comprobamos cada mejora contra una línea base.",
  "Maturity Assessment": "Evaluamos evidencia y prácticas reales en estrategia, gobierno, arquitectura, delivery, talento y adopción. Contrastamos la ambición con la capacidad actual para identificar brechas, dependencias y quick wins ejecutables.",
  "Data & AI Strategy": "Traducimos la estrategia corporativa en una visión Data & AI con principios, apuestas, capacidades objetivo y métricas. La hoja de ruta equilibra valor, riesgo, costo, adopción y velocidad de implementación.",
  "Data Platform": "Habilitamos una plataforma consumible como producto interno, con zonas, servicios compartidos, plantillas y guardrails. El foco es reducir el tiempo de inicio de los equipos manteniendo seguridad, gobierno y control de costos.",
  "Catalog, Semantic & Ontology": "Conectamos términos de negocio, metadatos técnicos, ownership y lineage para que personas y soluciones de IA encuentren información confiable. La semántica se diseña para reutilización analítica y operacional.",
  "Operating Model": "Definimos cómo se toman decisiones y cómo colaboran los equipos: roles, foros, procesos, niveles de servicio, funding y métricas. Probamos el modelo con un dominio real antes de escalarlo.",
  "Business Adoption": "Segmentamos audiencias, cambios de comportamiento y momentos de uso para diseñar formación, acompañamiento y comunidades. Medimos adopción efectiva y resultados, no solo asistencia a capacitaciones.",
  "FinOps & Value Tracking": "Relacionamos consumo técnico con productos, equipos y resultados de negocio. Definimos unit economics, presupuestos, alertas, showback o chargeback y un ciclo de revisión para optimizar sin frenar la innovación.",
  "Arquitectura de Servicios": "Modelamos capacidades y patrones antes de seleccionar herramientas. Comparamos alternativas por interoperabilidad, seguridad, escalabilidad, habilidades disponibles, costo total y riesgo de dependencia tecnológica.",
  "Cloud Journey": "Construimos escenarios de modernización y coexistencia con oleadas, dependencias, criterios de salida y TCO. La transición protege la continuidad operativa y captura valor temprano sin imponer una migración de una sola vez.",
  "Security": "Integramos identidad, secretos, cifrado, segmentación, privacidad y políticas desde el diseño. Los controles se traducen en guardrails automatizados y evidencia auditable dentro del ciclo de entrega.",
  "Infrastructure as Code": "Convertimos la plataforma en módulos versionados, repetibles y configurables por ambiente. Esto acelera el aprovisionamiento, reduce diferencias entre entornos y facilita aplicar políticas de forma consistente.",
  "CI/CD & SDLC": "Diseñamos el flujo completo desde el cambio hasta producción, con branching, revisiones, pruebas, quality gates, promoción y rollback. Incluimos código, datos, modelos, prompts y configuración cuando corresponde.",
  "Observability": "Definimos las señales que explican salud, calidad, experiencia, seguridad y costo. Unificamos métricas, logs, traces y lineage en vistas orientadas a servicio, con alertas accionables y SLOs.",
  "Release & Support Mgmt": "Establecemos un modelo operativo para cambios, releases, incidentes, problemas y escalamiento. Los runbooks, calendarios y postmortems convierten la operación diaria en un ciclo de mejora continua.",
};

const serviceUseCases: Record<string, UseCase[]> = {
  "strategy-delivery": [
    { title: "Portafolio comercial Data & AI", description: "Priorizar churn, next-best-action, forecast y copilotos según valor, datos disponibles y complejidad de adopción.", value: "Foco de inversión" },
    { title: "Producto financiero certificado", description: "Diseñar un producto de ingresos y margen con definiciones, ownership, consumidores y niveles de servicio comunes.", value: "Una versión confiable" },
    { title: "Mapa de oportunidades GenAI", description: "Identificar procesos intensivos en conocimiento y seleccionar los candidatos apropiados para RAG, copilotos o agentes.", value: "Riesgo y valor explícitos" },
  ],
  "implementation-delivery": [
    { title: "Customer 360 accionable", description: "Integrar interacciones, ventas y servicio en un producto de datos que alimente segmentación, campañas y atención.", value: "Mejor conversión" },
    { title: "Forecast de demanda", description: "Construir predicciones con señales internas y externas, explicación de variables y monitoreo del error por categoría.", value: "Menos quiebres y sobrestock" },
    { title: "Copiloto de conocimiento", description: "Responder sobre políticas y documentos corporativos con RAG, citas, control de acceso y evaluación continua.", value: "Menor tiempo de búsqueda" },
  ],
  "operation-delivery": [
    { title: "Confiabilidad de pipelines críticos", description: "Operar cargas financieras con SLOs, alertas por calidad, reintentos y runbooks de recuperación.", value: "Menos interrupciones" },
    { title: "Monitoreo de modelos y agentes", description: "Detectar drift, degradación de precisión, respuestas inseguras y cambios en costo o latencia.", value: "IA controlada" },
    { title: "Optimización de workloads", description: "Ajustar consultas, clústeres y almacenamiento usando telemetría y costo por producto o dominio.", value: "Mayor desempeño por dólar" },
  ],
  "strategy-management": [
    { title: "Roadmap corporativo Data & AI", description: "Alinear áreas de negocio, tecnología, gobierno y talento en una agenda de transformación por horizontes.", value: "Dirección compartida" },
    { title: "Marco de gobierno de IA", description: "Definir clasificación de riesgos, responsabilidades y controles para casos predictivos, generativos y agentic.", value: "Innovación responsable" },
    { title: "Modelo federado de datos", description: "Diseñar la relación entre Data Office, plataforma y dominios con responsabilidades y servicios claros.", value: "Escala con ownership" },
  ],
  "implementation-management": [
    { title: "Catálogo de datos prioritarios", description: "Publicar datasets críticos con owner, definiciones, lineage, calidad y proceso de solicitud de acceso.", value: "Datos encontrables" },
    { title: "Capa semántica de KPIs", description: "Unificar definiciones de clientes, ventas y margen para BI, analítica conversacional y agentes.", value: "Métricas consistentes" },
    { title: "Workflow de gobierno", description: "Automatizar alta de productos, certificación, excepciones, acceso y resolución de problemas de calidad.", value: "Control ejecutable" },
  ],
  "operation-management": [
    { title: "Programa de adopción analítica", description: "Acompañar a líderes y usuarios con journeys, champions, office hours y métricas de uso por decisión.", value: "Uso sostenido" },
    { title: "Showback por producto", description: "Asignar consumo de plataforma a productos y dominios, con presupuestos, tendencias y oportunidades de ahorro.", value: "Costo transparente" },
    { title: "Value realization trimestral", description: "Contrastar beneficios logrados contra business cases y decidir continuidad, ajuste o retiro de iniciativas.", value: "Inversión basada en evidencia" },
  ],
  "strategy-architecture": [
    { title: "Lakehouse multi-cloud", description: "Definir arquitectura interoperable para AWS, Azure, GCP o Databricks con formatos abiertos y gobierno común.", value: "Menor lock-in" },
    { title: "Arquitectura GenAI y agentes", description: "Diseñar modelos, RAG, herramientas, identidad, memoria, evaluación y observabilidad antes de elegir fabricantes.", value: "IA lista para producción" },
    { title: "Modernización por oleadas", description: "Priorizar migraciones según riesgo, dependencia, costo y valor, manteniendo coexistencia durante la transición.", value: "Cambio controlado" },
  ],
  "implementation-architecture": [
    { title: "Landing zone segura", description: "Crear ambientes, redes, identidades, logging y políticas base para equipos de datos e IA.", value: "Inicio rápido y gobernado" },
    { title: "Módulos IaC reutilizables", description: "Provisionar workspaces, storage, catálogos y observabilidad con configuraciones consistentes por ambiente.", value: "Menos errores manuales" },
    { title: "Factory de despliegue", description: "Automatizar pruebas y promoción de pipelines, dashboards, modelos, prompts y agentes entre ambientes.", value: "Releases repetibles" },
  ],
  "operation-architecture": [
    { title: "Observabilidad extremo a extremo", description: "Correlacionar pipelines, calidad, consultas, modelos, agentes y costo en una vista de servicio.", value: "Diagnóstico más rápido" },
    { title: "Gestión de releases", description: "Coordinar cambios de plataforma y productos con ventanas, criterios de salida, rollback y comunicación.", value: "Menor riesgo de cambio" },
    { title: "Soporte por niveles", description: "Definir atención, escalamiento, runbooks y métricas para plataforma, datos, BI e IA.", value: "Continuidad operativa" },
  ],
};

const detailSections = [
  { id: "capacidades", label: "Capacidades", icon: Layers3 },
  { id: "alcances", label: "Alcances", icon: CheckCircle2 },
  { id: "equipo", label: "Equipo ZAT", icon: Users },
  { id: "participantes", label: "Equipo cliente", icon: Building2 },
  { id: "inputs", label: "Inputs", icon: FileInput },
  { id: "outputs", label: "Outputs", icon: PackageCheck },
  { id: "casos", label: "Casos de uso", icon: Lightbulb },
];

function MetaList({ items }: { items: string[] }) {
  return (
    <ul className="meta-list">
      {items.map((item) => (
        <li key={item}>
          <CheckCircle2 aria-hidden="true" size={17} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const [quickId, setQuickId] = useState<string | null>(null);
  const [deepId, setDeepId] = useState<string | null>(null);
  const [activeCapability, setActiveCapability] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [themeReady, setThemeReady] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const quickService = useMemo(
    () => services.find((service) => service.id === quickId) ?? null,
    [quickId],
  );
  const deepService = useMemo(
    () => services.find((service) => service.id === deepId) ?? null,
    [deepId],
  );

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("zat-services-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light");
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (themeReady) window.localStorage.setItem("zat-services-theme", theme);
  }, [theme, themeReady]);

  useEffect(() => {
    const isOpen = Boolean(quickId || deepId);
    document.body.style.overflow = isOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuickId(null);
        setDeepId(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      if (clickTimer.current) window.clearTimeout(clickTimer.current);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [quickId, deepId]);

  const openQuick = (service: ServiceCell, capabilityIndex = 0) => {
    setActiveCapability(capabilityIndex);
    setQuickId(service.id);
  };

  const scheduleQuick = (service: ServiceCell, capabilityIndex = 0) => {
    if (clickTimer.current) window.clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => {
      openQuick(service, capabilityIndex);
      clickTimer.current = null;
    }, 220);
  };

  const cancelScheduledQuick = () => {
    if (clickTimer.current) window.clearTimeout(clickTimer.current);
    clickTimer.current = null;
  };

  const openDeep = (service: ServiceCell) => {
    setQuickId(null);
    setDeepId(service.id);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  };

  const stepDeep = (delta: number) => {
    if (!deepService) return;
    const current = services.findIndex((service) => service.id === deepService.id);
    const next = (current + delta + services.length) % services.length;
    setDeepId(services[next].id);
    setActiveCapability(0);
    window.requestAnimationFrame(() => {
      document.querySelector(".deep-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <main className={theme === "dark" ? "theme-dark" : "theme-light"} id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="ZAT — inicio">
          <img src="./zat-logo.png" alt="ZAT Data Driven Decision Making" />
        </a>
        <nav className="topnav" aria-label="Navegación principal">
          <a href="#roadmap">Roadmap</a>
          <a href="#principles">Principios</a>
        </nav>
        <div className="header-actions">
          <a className="social-button" href="https://www.linkedin.com/company/zat-consulting/" target="_blank" rel="noreferrer" aria-label="LinkedIn de ZAT">
            <i className="linkedin-icon" aria-hidden="true">in</i><span>ZAT</span>
          </a>
          <a className="social-button" href="https://www.linkedin.com/in/carlosczg/" target="_blank" rel="noreferrer" aria-label="LinkedIn de Carlos Zapata">
            <i className="linkedin-icon" aria-hidden="true">in</i><span>Carlos Zapata</span>
          </a>
          <button
            className="theme-button"
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
            type="button"
            aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Tema claro" : "Tema oscuro"}</span>
          </button>
        </div>
      </header>

      <section className="intro">
        <div>
          <p className="eyebrow">PORTAFOLIO DE SERVICIOS ZAT</p>
          <h1>Data &amp; AI <span>Roadmap</span></h1>
          <p className="intro-copy">
            Explora cómo conectamos estrategia, entrega y operación. Cada bloque abre la especificación de servicios, alcances, equipos, inputs y outputs.
          </p>
        </div>
        <div className="interaction-guide" aria-label="Guía de interacción">
          <span><i>1×</i> Resumen</span>
          <span><i>2×</i> Vista completa</span>
        </div>
      </section>

      <section className="roadmap-shell" id="roadmap" aria-labelledby="roadmap-title">
        <div className="roadmap-heading">
          <div>
            <p className="kicker">MAPA DE CAPACIDADES</p>
            <h2 id="roadmap-title">Elige dónde quieres entrar.</h2>
          </div>
          <p>Cada cliente avanza según su madurez, sin perder continuidad entre estrategia, implementación y operación.</p>
        </div>

        <div className="roadmap-grid" role="grid" aria-label="Servicios por frente y etapa">
          <div className="grid-corner">
            <img src="./zat-mark.png" alt="ZAT" />
          </div>
          {phases.map((phase) => (
            <div className={`phase-heading phase-${phase.id}`} key={phase.id} role="columnheader">
              <strong>{phase.title}</strong>
              <span>{phase.subtitle}</span>
            </div>
          ))}

          {tracks.map((track) => (
            <div className="grid-row" key={track.id} role="row">
              <div className={`track-heading track-${track.accent}`} role="rowheader">
                <span className="track-number">0{tracks.findIndex((item) => item.id === track.id) + 1}</span>
                <strong>{track.title}</strong>
                <small>{track.subtitle}</small>
              </div>

              {phases.map((phase) => {
                const service = services.find(
                  (item) => item.track === track.id && item.phase === phase.id,
                )!;
                return (
                  <article
                    className={`service-cell cell-${phase.id}${quickId === service.id || deepId === service.id ? " is-selected" : ""}`}
                    key={service.id}
                    onClick={() => scheduleQuick(service)}
                    onDoubleClick={() => {
                      cancelScheduledQuick();
                      openDeep(service);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") openQuick(service);
                    }}
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`${service.action}: ${service.headline}. Clic para ver resumen; doble clic para detalle completo.`}
                  >
                    <div className="cell-topline">
                      <span><i>{phase.title}</i>{service.action}</span>
                      <ArrowRight aria-hidden="true" size={17} />
                    </div>
                    <h3>{service.headline}</h3>
                    <div className="capability-pills">
                      {service.capabilities.map((capability, index) => (
                        <button
                          key={capability.title}
                          onClick={(event) => {
                            event.stopPropagation();
                            scheduleQuick(service, index);
                          }}
                          onDoubleClick={(event) => {
                            event.stopPropagation();
                            cancelScheduledQuick();
                            setActiveCapability(index);
                            openDeep(service);
                          }}
                          type="button"
                        >
                          {capability.title}
                        </button>
                      ))}
                    </div>
                    <span className="cell-hint">Explorar servicio</span>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="principles" id="principles">
        <div className="principle-heading">
          <p className="kicker">PRINCIPIOS TRANSVERSALES</p>
          <h2>Control desde el diseño.</h2>
        </div>
        <div className="principle-grid">
          <div><Network /><strong>Arquitectura agnóstica</strong><span>Cloud-native, on-premise o híbrida según el contexto.</span></div>
          <div><ShieldCheck /><strong>Gobierno y seguridad</strong><span>Ownership, trazabilidad y controles integrados al delivery.</span></div>
          <div><CircleDollarSign /><strong>FinOps y valor</strong><span>Costos visibles, unit economics y beneficios medibles.</span></div>
          <div><Database /><strong>Transferencia de capacidad</strong><span>Co-creación, playbooks y operación sostenible por el cliente.</span></div>
        </div>
      </section>

      <footer>
        <img src="./zat-logo.png" alt="ZAT" />
        <p>Una hoja de ruta modular para construir, gobernar y operar Data &amp; AI a escala.</p>
        <span>© ZAT · Data Driven Decision Making</span>
      </footer>

      {quickService && (
        <div
          className="quick-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setQuickId(null);
          }}
          role="presentation"
        >
          <aside className="quick-panel" role="dialog" aria-modal="true" aria-labelledby="quick-title">
            <div className={`panel-accent cell-${quickService.phase}`} />
            <button className="icon-button close-button" onClick={() => setQuickId(null)} type="button" aria-label="Cerrar resumen">
              <X size={20} />
            </button>
            <p className="panel-breadcrumb">
              {tracks.find((track) => track.id === quickService.track)?.title}
              <ChevronRight size={13} />
              {phases.find((phase) => phase.id === quickService.phase)?.title}
            </p>
            <span className="panel-action">{quickService.action}</span>
            <h2 id="quick-title">{quickService.headline}</h2>
            <p className="panel-overview">{quickService.overview}</p>

            <div className="quick-capabilities" role="tablist" aria-label="Capacidades del servicio">
              {quickService.capabilities.map((capability, index) => (
                <button
                  className={activeCapability === index ? "active" : ""}
                  key={capability.title}
                  onClick={() => setActiveCapability(index)}
                  role="tab"
                  type="button"
                  aria-selected={activeCapability === index}
                >
                  <strong>{capability.title}</strong>
                  <span>{capability.summary}</span>
                </button>
              ))}
            </div>

            <div className="selected-capability">
              <span>Qué hacemos</span>
              <MetaList items={quickService.capabilities[activeCapability]?.work ?? []} />
            </div>

            <div className="quick-meta-grid">
              <div><small>Alcances típicos</small><strong>{quickService.scope[0]}</strong></div>
              <div><small>Resultado</small><strong>{quickService.outcome}</strong></div>
            </div>

            <button className="primary-button" onClick={() => openDeep(quickService)} type="button">
              Ver especificación completa <ArrowRight size={18} />
            </button>
            <p className="mobile-note">En móvil, este botón reemplaza el doble clic.</p>
          </aside>
        </div>
      )}

      {deepService && (
        <section className="deep-view" role="dialog" aria-modal="true" aria-labelledby="deep-title">
          <header className="deep-header">
            <button className="back-button" onClick={() => setDeepId(null)} type="button">
              <ArrowLeft size={18} /> Volver al roadmap
            </button>
            <div className="deep-brand">
              <img src="./zat-logo.png" alt="ZAT" />
              <span>Especificación de servicio</span>
            </div>
            <div className="deep-pagination" aria-label="Navegar entre servicios">
              <button onClick={() => stepDeep(-1)} type="button" aria-label="Servicio anterior"><ChevronLeft size={19} /></button>
              <span>{services.findIndex((item) => item.id === deepService.id) + 1} / {services.length}</span>
              <button onClick={() => stepDeep(1)} type="button" aria-label="Servicio siguiente"><ChevronRight size={19} /></button>
            </div>
          </header>

          <div className="deep-body">
            <aside className="deep-nav" aria-label="Secciones de la especificación">
              <p>{tracks.find((track) => track.id === deepService.track)?.title}</p>
              <strong>{deepService.headline}</strong>
              <nav>
                {detailSections.map((section) => {
                  const Icon = section.icon;
                  return <a href={`#${section.id}`} key={section.id}><Icon size={16} />{section.label}</a>;
                })}
              </nav>
              <div className="agnostic-note">
                <ShieldCheck size={18} />
                <span><strong>Agnóstico por diseño</strong>Seleccionamos tecnología por ajuste, riesgo y costo total.</span>
              </div>
            </aside>

            <div className="deep-scroll">
              <div className="mobile-section-nav">
                {detailSections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}
              </div>

              <div className={`deep-hero cell-${deepService.phase}`}>
                <p>{phases.find((phase) => phase.id === deepService.phase)?.title} · {deepService.action}</p>
                <h1 id="deep-title">{deepService.headline}</h1>
                <span>{deepService.overview}</span>
                <div className="outcome-band"><Sparkles size={18} /><strong>Resultado:</strong> {deepService.outcome}</div>
              </div>

              <section className="detail-section" id="capacidades">
                <div className="section-label"><Layers3 size={19} /><span>01</span> Capacidades</div>
                <h2>Qué hacemos dentro de este bloque.</h2>
                <div className="capability-detail-grid">
                  {deepService.capabilities.map((capability) => (
                    <article key={capability.title}>
                      <h3>{capability.title}</h3>
                      <p>{capability.summary}</p>
                      <p className="capability-detail-copy">{capabilityDetails[capability.title]}</p>
                      <MetaList items={capability.work} />
                    </article>
                  ))}
                </div>
              </section>

              <section className="detail-section" id="alcances">
                <div className="section-label"><CheckCircle2 size={19} /><span>02</span> Tipos de alcance</div>
                <h2>Formas habituales de empezar y escalar.</h2>
                <div className="scope-grid">
                  {deepService.scope.map((item, index) => (
                    <article key={item}><span>0{index + 1}</span><strong>{item}</strong></article>
                  ))}
                </div>
              </section>

              <section className="detail-section split-section" id="equipo">
                <div>
                  <div className="section-label"><Users size={19} /><span>03</span> Equipo ZAT</div>
                  <h2>Perfiles consultores.</h2>
                </div>
                <MetaList items={deepService.consultants} />
              </section>

              <section className="detail-section split-section" id="participantes">
                <div>
                  <div className="section-label"><Building2 size={19} /><span>04</span> Equipo cliente</div>
                  <h2>Participantes clave.</h2>
                </div>
                <MetaList items={deepService.clientRoles} />
              </section>

              <div className="io-grid">
                <section className="detail-section" id="inputs">
                  <div className="section-label"><FileInput size={19} /><span>05</span> Inputs necesarios</div>
                  <h2>Lo que necesitamos para avanzar.</h2>
                  <MetaList items={deepService.inputs} />
                </section>
                <section className="detail-section output-section" id="outputs">
                  <div className="section-label"><PackageCheck size={19} /><span>06</span> Ejemplos de outputs</div>
                  <h2>Lo que recibe el cliente.</h2>
                  <MetaList items={deepService.outputs} />
                </section>
              </div>

              <section className="detail-section use-cases-section" id="casos">
                <div className="section-label"><Lightbulb size={19} /><span>07</span> Casos de uso de referencia</div>
                <h2>Cómo se materializa esta capacidad.</h2>
                <p className="section-intro">Ejemplos típicos que ajustamos al sector, madurez, datos y prioridades de cada cliente.</p>
                <div className="use-case-grid">
                  {(serviceUseCases[deepService.id] ?? []).map((useCase, index) => (
                    <article key={useCase.title}>
                      <span>0{index + 1}</span>
                      <h3>{useCase.title}</h3>
                      <p>{useCase.description}</p>
                      <strong>{useCase.value}</strong>
                    </article>
                  ))}
                </div>
              </section>

              <div className="deep-cta">
                <div><p>Siguiente bloque sugerido</p><strong>{services[(services.findIndex((item) => item.id === deepService.id) + 1) % services.length].headline}</strong></div>
                <button onClick={() => stepDeep(1)} type="button">Continuar <ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

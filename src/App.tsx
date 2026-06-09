import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Code, 
  Link, 
  Cpu, 
  BookOpen, 
  Settings, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Server, 
  RefreshCw, 
  Send, 
  Clipboard, 
  ShieldAlert, 
  BadgeCheck, 
  MessageSquare, 
  Database, 
  FileText,
  FileCode,
  Laptop,
  Folder,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QualifierConfig, WebhookConfig, SimulatedScreen, SimulationStepLog } from "./types";
import { boilerplateFiles, BoilerplateFile } from "./boilerplateData";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"puppeteer" | "boilerplate" | "webhooks" | "qualifier" | "vps">("puppeteer");
  
  // Overall Server Health Stats Status
  const [serverStatus, setServerStatus] = useState<any>({
    status: "connecting",
    env: "development",
    hasGeminiKey: false,
    uptime: 0,
    platform: "node",
    nodeVersion: "v20"
  });
  
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch Server health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const data = await res.json();
          setServerStatus(data);
        } else {
          setServerStatus((prev: any) => ({ ...prev, status: "offline" }));
        }
      } catch (err) {
        setServerStatus((prev: any) => ({ ...prev, status: "offline" }));
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const triggerCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // -----------------------------------------------------
  // TAB 1 STATES (PUPPETEER SIMULATOR)
  // -----------------------------------------------------
  const [selectedPresetId, setSelectedPresetId] = useState<string>("leads-whatsapp");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isGeneratingCode, setIsGeneratingCode] = useState<boolean>(false);
  const [generatedCodeData, setGeneratedCodeData] = useState<any>({
    code: `/**
 * DevNexus WA Automation Engine - Module: Leads WhatsApp (VPS Optimized)
 * Autor: Roberto + DevNexus
 * Versión: 2.1.0
 */
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function runWhatsAppAutomation() {
  console.log('🚀 [DevNexus] Iniciando robot de WhatsApp...');
  
  // Opciones de inicialización optimizadas para VPS sin entorno gráfico
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // Ahorra memoria RAM crítica en VPS de 1GB
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('🌐 Navegando a WhatsApp Web...');
    await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('📸 Esperando escaneo de código QR (se guardará captura en logs)...');
    await page.waitForSelector('canvas', { timeout: 30000 });
    
    const qrCanvas = await page.$('canvas');
    if (qrCanvas) {
      await qrCanvas.screenshot({ path: 'whatsapp-qr-vps.png' });
      console.log('🔍 [QR GENERADO] whatsapp-qr-vps.png guardado en el servidor.');
    }

    console.log('⏳ Esperando carga de la bandeja de mensajes...');
    await page.waitForSelector('div[data-testid="chat-list"]', { timeout: 120000 });
    console.log('✅ Sesión iniciada con éxito!');

    const unreadSelector = 'span[aria-label*="no leído"]';
    const hasUnread = await page.$(unreadSelector);
    if (hasUnread) {
      console.log('💬 Se detectaron chats no leídos. Procesando...');
      await hasUnread.click();
      
      await page.waitForSelector('div[data-testid="conversation-panel-wrapper"]');
      const messages = await page.$$('div.message-in span.selectable-text');
      if (messages.length > 0) {
        const lastMsg = await page.evaluate(el => el.textContent, messages[messages.length - 1]);
        console.log(\`📩 Contenido del mensaje: "\${lastMsg}"\`);
        
        const inputSelector = 'div[contenteditable="true"][data-tab="10"]';
        await page.waitForSelector(inputSelector);
        await page.focus(inputSelector);
        
        const answer = "¡Hola! He recibido tu mensaje de automatización correctamente. En breve Roberto te dará soporte personalizado. [Bot DevNexus VPS]";
        await page.keyboard.type(answer, { delay: 40 });
        
        await page.keyboard.press('Enter');
        console.log('📤 Respuesta enviada al cliente potencial.');
      }
    } else {
      console.log('📭 No hay mensajes pendientes de lectura en este ciclo.');
    }

  } catch (error) {
    console.error('❌ [ERROR EN FLUJO]:', error);
  } finally {
    console.log('🔒 Cerrando navegador Puppeteer...');
    await browser.close();
  }
}

runWhatsAppAutomation();`,
    steps: [
      "Inicializar Puppeteer con argumentos especiales para ahorrar hasta 40% de RAM en VPS.",
      "Establecer User-Agent y Viewport reales para evadir mecanismos automatizados de WA.",
      "Navegar a WhatsApp Web y esperar el renderizado del código QR táctico.",
      "Capturar el código QR en un archivo local para que el administrador pueda vincular su teléfono.",
      "Identificar nuevos mensajes no leídos usando selectores específicos y emular tecleo humano (con delay variable).",
      "Exportar cookies de sesión a un archivo JSON para persistencia de login y evitar re-escaneos."
    ],
    vpsTips: [
      "Dockerización de Puppeteer: Instala dependencias con 'apt-get install libgconf-2-4 libxss1 libxtst6 ...' en tu Dockerfile.",
      "Ejecuta con PM2: El script maneja timeouts automáticos, ponlo en cron permanente.",
      "Persistencia de cookies: Guarda el archivo wa-session-cookies.json fuera de directorios efímeros.",
      "Baneos de Cuenta: Evita enviar más de 50 mensajes de golpe a números no agendados."
    ]
  });

  // Simulated live execution console states
  const [isSimulatingRun, setIsSimulatingRun] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<SimulationStepLog[]>([]);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(-1);

  const simulationWalkthrough: SimulatedScreen[] = [
    {
      title: "Inicializando Navegador Headless",
      subtitle: "Chromium seguro modo Sandbox",
      iconBg: "bg-indigo-600",
      description: "Puppeteer inicia una instancia aislada del motor Chromium. Argumentos de evasión inyectados para simular huella humana. RAM consumida: +85MB.",
      badge: "Iniciando"
    },
    {
      title: "Cargando WhatsApp Web",
      subtitle: "Estableciendo conexión TLS a web.whatsapp.com",
      iconBg: "bg-blue-600",
      description: "Página cargada. Esperando renderizado de la estructura de react asíncronamente. Se bloquea la descarga de audios e imágenes secundarias para optimizar el VPS.",
      badge: "Cargando"
    },
    {
      title: "Código QR Renderizado",
      subtitle: "Generación del screenshot táctico de vinculación",
      iconBg: "bg-amber-600",
      description: "Se detecta el canvas de WhatsApp. Puppeteer captura la región de pantalla exacta y la guarda localmente como 'whatsapp-qr-vps.png' en logs para el administrador.",
      badge: "QR LISTO"
    },
    {
      title: "Inicio de Sesión Detectado",
      subtitle: "Panel de mensajes cargado exitosamente",
      iconBg: "bg-purple-600",
      description: "El selector de la lista de chats ha sido detectado de forma asíncrona. Cookies inyectadas y sincronizadas. Guardando sesión local.",
      badge: "LOGGED"
    },
    {
      title: "Escrutinio de Leads Recientes",
      subtitle: "Leyendo la bandeja de mensajes no leídos",
      iconBg: "bg-emerald-600",
      description: "Se detecta un círculo verde con mensaje sin leer de '+34 612 34 56 78'. Haciendo clic simulando velocidad del mouse real (200px/s).",
      badge: "LEAD ENCONTRADO"
    },
    {
      title: "Respuesta de Conversación Enviada",
      subtitle: "Acción de tipeado humano exitosa",
      iconBg: "bg-teal-600",
      description: "Tipeando '¡Hola! He recibido tu mensaje... [Bot DevNexus]' con una demora aleatoria de 40ms por tecla. Botón de enter accionado. Cerrando Chromium de forma segura.",
      badge: "COMPLETADO"
    }
  ];

  const simulationEvents = [
    { log: "INFO: Iniciando proceso de ejecución en subproceso de PM2...", delay: 50 },
    { log: "INFO: Lanzando Puppeteer v22.1.0 en puerto virtual sin cabecera...", delay: 600 },
    { log: "SUCCESS: Chromium instanciado perfectamente. PID: 301258", delay: 1000 },
    { log: "INFO: Navegando asíncronamente a https://web.whatsapp.com...", delay: 1500 },
    { log: "WARN: Esperando detección de Canvas de vinculación en el DOM...", delay: 2200 },
    { log: "SUCCESS: Canvas del código QR detectado. Capturando pantalla...", delay: 3000 },
    { log: "SUCCESS: QR guardado en [whatsapp-qr-vps.png] exitosamente.", delay: 3600 },
    { log: "INFO: Esperando autenticación con el dispositivo móvil titular...", delay: 4200 },
    { log: "SUCCESS: Lista de chats cargada. Se detectaron 2 chats activos.", delay: 5000 },
    { log: "INFO: Chat seleccionado con clic mecánico simulado.", delay: 5800 },
    { log: "SUCCESS: Mensaje enviado con ratio de retardo humano de 40ms.", delay: 6600 },
    { log: "INFO: Grabando cookies de sesión en almacenamiento del VPS...", delay: 7200 },
    { log: "SUCCESS: cookies guardadas. Proceso finalizado. Cerrando Chromium...", delay: 8000 }
  ];

  const handleFetchCode = async (presetId: string, promptText?: string) => {
    setIsGeneratingCode(true);
    try {
      const response = await fetch("/api/flow/generate-puppeteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset: presetId, prompt: promptText })
      });
      if (response.ok) {
        const result = await response.json();
        setGeneratedCodeData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleSelectPreset = async (presetId: string) => {
    setSelectedPresetId(presetId);
    setCustomPrompt("");
    await handleFetchCode(presetId);
  };

  const handleCustomPromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    await handleFetchCode("custom", customPrompt);
  };

  const handleRunBotSimulation = () => {
    if (isSimulatingRun) return;
    setIsSimulatingRun(true);
    setSimulationLogs([]);
    setSimulationStepIndex(0);

    // Feed lines iteratively based on artificial timers
    simulationEvents.forEach((ev, i) => {
      setTimeout(() => {
        const type: any = ev.log.startsWith("SUCCESS") ? "success" : ev.log.startsWith("WARN") ? "warn" : "info";
        const cleanMsg = ev.log.replace(/^(INFO|SUCCESS|WARN|ERROR):\s*/, "");
        const newLog: SimulationStepLog = {
          time: new Date().toLocaleTimeString(),
          type,
          message: cleanMsg
        };
        setSimulationLogs(prev => [...prev, newLog]);

        // Map log timeline milestones to simulated browser graphics screen steps
        if (ev.log.includes("Chromium instanciado")) setSimulationStepIndex(0);
        if (ev.log.includes("Navegando asíncronamente")) setSimulationStepIndex(1);
        if (ev.log.includes("Canvas del código QR")) setSimulationStepIndex(2);
        if (ev.log.includes("Lista de chats cargada")) setSimulationStepIndex(3);
        if (ev.log.includes("Chat seleccionado")) setSimulationStepIndex(4);
        if (ev.log.includes("Mensaje enviado")) setSimulationStepIndex(5);

        if (i === simulationEvents.length - 1) {
          setTimeout(() => {
            setIsSimulatingRun(false);
          }, 1500);
        }
      }, ev.delay);
    });
  };

  // -----------------------------------------------------
  // TAB BOILERPLATE SYSTEM (EVENT EMITTER / OBSERVER)
  // -----------------------------------------------------
  const [selectedBoilerplateFile, setSelectedBoilerplateFile] = useState<BoilerplateFile>(boilerplateFiles[2]); // Default to index.js
  const [isSimulatingBoilerplate, setIsSimulatingBoilerplate] = useState<boolean>(false);
  const [boilerplateLogs, setBoilerplateLogs] = useState<SimulationStepLog[]>([]);
  const [activeBoilerplateSimScenario, setActiveBoilerplateSimScenario] = useState<"welcome" | "crm" | "help">("welcome");

  const runBoilerplateSimulation = (scenario: "welcome" | "crm" | "help") => {
    if (isSimulatingBoilerplate) return;
    setIsSimulatingBoilerplate(true);
    setActiveBoilerplateSimScenario(scenario);
    setBoilerplateLogs([]);

    const timestamp = () => new Date().toLocaleTimeString();

    const addLog = (message: string, type: "info" | "success" | "warn" | "error" = "info", delay: number) => {
      setTimeout(() => {
        setBoilerplateLogs(prev => [...prev, { time: timestamp(), type, message }]);
      }, delay);
    };

    // Step 1: Boot bot core
    addLog("--- DEVNEXUS MODULAR AUTOMATION MOTOR ---", "info", 100);
    addLog("📢 [LOG STATUS]: Iniciando navegador virtual...", "info", 500);
    
    // Step 2: Set page limits & load chrome
    addLog("📢 [LOG STATUS]: Navegador listo y configurado en modo Headless (VPS Ready).", "success", 1100);
    addLog("✓ [EVENT]: El motor de Puppeteer está encendido y listo.", "success", 1500);

    // Step 3: Registering dynamic observers
    addLog("[Core] Skill registrado con éxito: Welcome Skill (Escucha: 'message_received')", "info", 1800);
    addLog("[Core] Skill registrado con éxito: CRM Sync Skill (Escucha: 'message_received')", "info", 2100);
    addLog("[Core] Skill registrado con éxito: Help Skill (Escucha: 'message_received')", "info", 2400);

    // Step 4: Dispatch event scenario
    if (scenario === "welcome") {
      addLog("💬 [SIMULACIÓN]: Recibiendo mensaje entrante...", "info", 2900);
      addLog("📢 [LOG STATUS]: Mensaje entrante detectado de [+34600112233]: 'Hola buenas tardes! Me interesa contratar un plan de bots.'", "info", 3400);
      addLog("[Core] Despachando evento 'message_received' al skill: Welcome Skill", "info", 4000);
      addLog("[Core] Despachando evento 'message_received' al skill: CRM Sync Skill", "info", 4050);
      addLog("[Core] Despachando evento 'message_received' al skill: Help Skill", "info", 4100);
      
      addLog("[Skill: Welcome] Procesando mensaje de +34600112233...", "warn", 4600);
      addLog("[Skill: Welcome] Respuesta generada para +34600112233: '¡Hola! Gracias por iniciar contacto. ¿En qué automatización puedo ayudarte?'", "success", 5200);
      addLog("📢 [LOG STATUS]: Respuesta enviada de forma interactiva por Welcome Skill.", "success", 5800);
    } else if (scenario === "crm") {
      addLog("💬 [SIMULACIÓN]: Recibiendo mensaje entrante...", "info", 2900);
      addLog("📢 [LOG STATUS]: Mensaje entrante detectado de [+34600122334]: 'Hola, agrégame al boletín de noticias, mi correo es roberto_vps@example.com.'", "info", 3400);
      addLog("[Core] Despachando evento 'message_received' al skill: Welcome Skill", "info", 4000);
      addLog("[Core] Despachando evento 'message_received' al skill: CRM Sync Skill", "info", 4050);
      addLog("[Core] Despachando evento 'message_received' al skill: Help Skill", "info", 4100);
      
      addLog("[Skill: CRM] Email detectado: roberto_vps@example.com. Registrando en pipeline de ventas...", "warn", 4700);
      addLog("[Skill: CRM] Lead roberto_vps@example.com sincronizado con éxito.", "success", 5400);
      addLog("📢 [LOG STATUS]: Lead registrado de manera persistente en CRM por CRM Sync Skill.", "success", 6000);
    } else {
      addLog("💬 [SIMULACIÓN]: Recibiendo mensaje entrante...", "info", 2900);
      addLog("📢 [LOG STATUS]: Mensaje entrante detectado de [+34612345678]: 'ayuda'", "info", 3400);
      addLog("[Core] Despachando evento 'message_received' al skill: Welcome Skill", "info", 4000);
      addLog("[Core] Despachando evento 'message_received' al skill: CRM Sync Skill", "info", 4050);
      addLog("[Core] Despachando evento 'message_received' al skill: Help Skill", "info", 4100);
      
      addLog("[Skill: Help] Desplegando catálogo de comandos para +34612345678", "warn", 4700);
      addLog("[Skill: Help] Menú enviado: 'Comandos Disponibles: - ayuda...'", "success", 5400);
      addLog("📢 [LOG STATUS]: Menú de ayuda despachado por Help Skill.", "success", 6000);
    }

    addLog("📢 [LOG STATUS]: Cerrando navegador virtual...", "info", 6800);
    addLog("🏁 [EVENT FINISHED]: Proceso finalizado con seguridad.", "success", 7300);

    setTimeout(() => {
      setIsSimulatingBoilerplate(false);
    }, 7500);
  };

  // -----------------------------------------------------
  // TAB 2 STATES (WEBHOOK & CRM BUILDER)
  // -----------------------------------------------------
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    platform: "whatsapp",
    crm: "pipedrive",
    verifyToken: "devnexus_secret_token_2026"
  });
  const [generatedWebhookCode, setGeneratedWebhookCode] = useState<string>("");
  const [isGeneratingWebhookCode, setIsGeneratingWebhookCode] = useState<boolean>(false);
  const [simulatePayloadInput, setSimulatePayloadInput] = useState<string>(
    JSON.stringify({
      id: "message_wa_993021",
      profile_name: "Roberto",
      phone: "+34600112233",
      text: "Hola Roberto, vi tu bot en el vps y me interesa conectarlo a mi Pipedrive ya mismo, mi email es roberto_vps@example.com."
    }, null, 2)
  );
  const [isTestingWebhook, setIsTestingWebhook] = useState<boolean>(false);
  const [testWebhookLogs, setTestWebhookLogs] = useState<string[]>([]);

  // Auto generate webhook boilerplate on config changes
  useEffect(() => {
    const fetchWebhookCode = async () => {
      setIsGeneratingWebhookCode(true);
      try {
        const response = await fetch("/api/flow/generate-webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookConfig)
        });
        if (response.ok) {
          const result = await response.json();
          setGeneratedWebhookCode(result.code);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsGeneratingWebhookCode(false);
      }
    };
    fetchWebhookCode();
  }, [webhookConfig]);

  const handleTestWebhookSimulation = () => {
    setIsTestingWebhook(true);
    setTestWebhookLogs([]);
    
    const steps = [
      `📡 [POST /api/webhook-receiver] Recibiendo llamada HTTP entrante de ${webhookConfig.platform.toUpperCase()}...`,
      `🔒 Calificando cabeceras de firma del webhook...`,
      `✓ [OK] Firma validada satisfactoriamente con el token de verificación asignado.`,
      `📦 Extrayendo payload raw de la transmisión...`,
      `⚙️ Mapeando variables a estructura unificada...`,
      `👤 Lead identificado: "${JSON.parse(simulatePayloadInput).profile_name || 'Desconocido'}" (${JSON.parse(simulatePayloadInput).phone})`,
      `⚡ Conectando asíncronamente con la API REST de ${webhookConfig.crm.toUpperCase()}...`,
      `✓ [API SUCCESS] Lead insertado en ${webhookConfig.crm.toUpperCase()} con ID de transacción: CRM-LEAD-88402`,
      `📥 Respondiendo de inmediato con HTTP 200 { success: true } para liberar recursos en VPS. Duración: 43ms.`
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setTestWebhookLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsTestingWebhook(false);
        }
      }, idx * 500);
    });
  };

  // -----------------------------------------------------
  // TAB 3 STATES (AI LEAD QUALIFIER - GEMINI INTEGRATED)
  // -----------------------------------------------------
  const [qualifierConfig, setQualifierConfig] = useState<QualifierConfig>({
    agentPersona: "Ventas de Automatizaciones Profesional",
    fields: ["Email", "Teléfono", "Presupuesto", "Ciudad", "Intención"]
  });
  const [newQualifierField, setNewQualifierField] = useState<string>("");
  const [incomingMessageText, setIncomingMessageText] = useState<string>(
    "Hola, me llamo Carlos de Barcelona. Necesito automatizar mi CRM Pipedrive porque me entran muchos mensajes de soporte. Mi presupuesto es de unos 300 USD y mi email es carlos.vps@example.com."
  );
  const [isProcessingLead, setIsProcessingLead] = useState<boolean>(false);
  const [qualifiedLeadResult, setQualifiedLeadResult] = useState<any>(null);

  const testMessagePresets = [
    {
      label: "Lead Potencial (Warm)",
      text: "Hola Roberto, soy Juan de Madrid. Estoy interesado en integrar mi CRM HubSpot para automatizar un bot de WhatsApp. Conseguí este número de tus posts. ¿Qué presupuesto manejas? Mi email es juan.madrid@gmail.com y cuento con un capital de 1200 euros."
    },
    {
      label: "Incidencia / Soporte Técnico",
      text: "Buenas, tengo un problema urgente. El webhook de facturación de Stripe no está enviando las firmas correctas y las facturas se quedan colgadas en el VPS. Mi teléfono es +34 600998877, ¿me puedes dar soporte técnico para solucionar esto?"
    },
    {
      label: "Mensaje de Spam",
      text: "💥 ¡OFERTA LIMITADA! Gana $5000 USD diarios con nuestro robot inteligente de trading automático. Ingresa ya a http://enlace-spam-cripto.com y retira tus ganancias de inmediato. No requiere depósito."
    }
  ];

  const handleRunQualifier = async () => {
    setIsProcessingLead(true);
    setQualifiedLeadResult(null);
    try {
      const response = await fetch("/api/flow/analyze-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: incomingMessageText,
          agentPersona: qualifierConfig.agentPersona,
          fields: qualifierConfig.fields
        })
      });
      if (response.ok) {
        const result = await response.json();
        setQualifiedLeadResult(result);
      } else {
        console.error("Failed to process lead on server");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingLead(false);
    }
  };

  const handleAddField = () => {
    if (newQualifierField.trim() && !qualifierConfig.fields.includes(newQualifierField)) {
      setQualifierConfig(prev => ({
        ...prev,
        fields: [...prev.fields, newQualifierField.trim()]
      }));
      setNewQualifierField("");
    }
  };

  const handleRemoveField = (fieldToRemove: string) => {
    setQualifierConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f !== fieldToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-[#0c0f16] text-[#dfdfdf] flex flex-col font-sans selection:bg-[#3b82f6] selection:text-white" id="main_container">
      {/* HEADER BAR */}
      <header className="border-b border-[#1e293b] bg-[#0c0f16]/95 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6] shadow-inner">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              DevNexus
              <span className="text-xs bg-indigo-500/20 text-[#60a5fa] border border-indigo-400/30 px-2 py-0.5 rounded font-mono font-medium">v2.5</span>
            </h1>
            <p className="text-xs text-slate-400">Automatización de Bots • Entorno de Desarrollo de Roberto</p>
          </div>
        </div>

        {/* Real-time server status indicators */}
        <div className="flex items-center gap-3 flex-wrap shadow-xl bg-slate-900/60 p-2 rounded-lg border border-slate-800" id="status_indicators">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 rounded">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-slate-300 font-mono">VPS Engine:</span>
            <span className="text-xs text-emerald-400 font-bold font-mono">
              {serverStatus.status === "online" ? "LIVE" : "SIMULATED"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 rounded">
            <div className={`w-2 h-2 rounded-full ${serverStatus.hasGeminiKey ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="text-xs text-slate-300 font-mono">Gemini API:</span>
            <span className={`text-xs font-bold font-mono ${serverStatus.hasGeminiKey ? 'text-emerald-400' : 'text-amber-400'}`}>
              {serverStatus.hasGeminiKey ? "CONECTADO" : "SIN CONFIGURAR"}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 bg-[#1e1b4b] rounded text-indigo-300 text-xs font-mono">
            <span>swap 2GB</span>
          </div>
        </div>
      </header>

      {/* SYSTEM METRICS GRID */}
      <section className="bg-slate-950 border-b border-slate-900 px-6 py-3 grid grid-cols-2 lg:grid-cols-5 gap-4" id="vps_metrics">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">SO & HOSTING</span>
          <span className="text-xs text-slate-300 font-mono flex items-center gap-1 font-semibold mt-0.5">
            <Laptop className="w-3.5 h-3.5 text-blue-300" /> Linux Ubuntu VPS
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">RAM CONSUMPTION</span>
          <span className="text-xs text-slate-300 font-mono flex items-center gap-1 font-semibold mt-0.5">
            <span className="inline-block w-2.5 h-2.5 bg-sky-500 rounded-sm"></span> 421 MB / 1024 MB
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">INTEGRACIÓN PM2</span>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-bold mt-0.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> ONLINE [Cluster]
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">UPTIME DEL SERVIDOR</span>
          <span className="text-xs text-slate-300 font-mono font-semibold mt-0.5">
            14d, 02h, 45m
          </span>
        </div>
        <div className="flex flex-col col-span-2 lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-900 pt-2 lg:pt-0 lg:pl-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">PROMPT EN INSTANCE</span>
          <span className="text-xs text-[#a78bfa] font-mono font-semibold mt-0.5">
            gemini-3.5-flash
          </span>
        </div>
      </section>

      {/* CORE CONTENT LAYOUT */}
      <main className="flex-1 flex flex-col lg:flex-row" id="core_workspace">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-72 border-r border-[#1e293b] bg-slate-950/80 p-5 flex flex-col gap-6" id="sidebar">
          <div>
            <h2 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3">Módulos de Desarrollo</h2>
            <nav className="flex flex-col gap-2" id="sidebar_nav">
              <button
                onClick={() => setActiveTab("puppeteer")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "puppeteer"
                    ? "bg-[#38bdf8]/10 text-[#38bdf8] border-l-4 border-[#38bdf8]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                id="btn_tab_puppeteer"
              >
                <Terminal className="w-4.5 h-4.5" />
                <span>Simulador Puppeteer</span>
              </button>

              <button
                onClick={() => setActiveTab("boilerplate")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                  activeTab === "boilerplate"
                    ? "bg-[#38bdf8]/10 text-[#38bdf8] border-l-4 border-[#38bdf8]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                id="btn_tab_boilerplate"
              >
                <Layers className="w-4.5 h-4.5 text-indigo-400" />
                <span className="flex-1">Boilerplate Observer</span>
                <span className="absolute right-3 top-3 px-1 rounded bg-indigo-500/20 text-indigo-300 text-[8px] font-mono leading-none py-0.5 border border-indigo-400/35">NUEVO</span>
              </button>

              <button
                onClick={() => setActiveTab("webhooks")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "webhooks"
                    ? "bg-[#38bdf8]/10 text-[#38bdf8] border-l-4 border-[#38bdf8]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                id="btn_tab_webhooks"
              >
                <Link className="w-4.5 h-4.5" />
                <span>Orquestación CRM Webhook</span>
              </button>

              <button
                onClick={() => setActiveTab("qualifier")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                  activeTab === "qualifier"
                    ? "bg-[#38bdf8]/10 text-[#38bdf8] border-l-4 border-[#38bdf8]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                id="btn_tab_qualifier"
              >
                <Cpu className="w-4.5 h-4.5 text-indigo-400" />
                <span>Cualificador Leads IA</span>
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-400" />
              </button>

              <button
                onClick={() => setActiveTab("vps")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "vps"
                    ? "bg-[#38bdf8]/10 text-[#38bdf8] border-l-4 border-[#38bdf8]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                id="btn_tab_vps"
              >
                <BookOpen className="w-4.5 h-4.5" />
                <span>Ecosistema & VPS Guías</span>
              </button>
            </nav>
          </div>

          <div className="mt-auto bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs">
            <h3 className="font-bold text-slate-300 flex items-center gap-1.5 mb-1.5 text-xs">
              <Settings className="w-3.5 h-3.5 text-[#3b82f6]" /> VPS Best Practice Tip
            </h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Al utilizar Puppeteer en VPS remotos de pocos recursos, configura <code className="text-sky-300 bg-black/40 px-1 py-0.5 rounded font-mono font-bold">--single-process</code> para forzar hilos de Chrome en el mismo ejecutable de Node.js.
            </p>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <section className="flex-1 p-6 overflow-y-auto" id="workspace_display">
          <AnimatePresence mode="wait">
            
            {/* ----------------------------------------------------- */}
            {/* TAB 1: PUPPETEER CODE GENERATOR & VM SIMULATOR */}
            {/* ----------------------------------------------------- */}
            {activeTab === "puppeteer" && (
              <motion.div
                key="puppeteer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="tab_puppeteer_workspace"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-950 p-6 rounded-xl border border-slate-900">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#38bdf8]" /> Generador y Simulador de Bots de Automatación
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Genera código Puppeteer limpio y modular optimizado para correr en segundo plano en VPS remotos sin entorno gráfico.
                    </p>
                  </div>
                </div>

                {/* Automation Preset selector bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="preset_grid">
                  <div
                    onClick={() => handleSelectPreset("leads-whatsapp")}
                    className={`cursor-pointer border p-4 rounded-xl transition-all ${
                      selectedPresetId === "leads-whatsapp"
                        ? "bg-[#38bdf8]/5 border-[#38bdf8] shadow-lg"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Bot WhatsApp Auto-Responder</h3>
                        <p className="text-sky-400 text-[10px] uppercase font-bold tracking-wider font-mono">Básico / Baileys alternativa</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Escanea el QR mediante captura de consola, guarda sesiones con cookies, e interactúa con delay variable para evitar bloqueos.
                    </p>
                  </div>

                  <div
                    onClick={() => handleSelectPreset("crm-invoice")}
                    className={`cursor-pointer border p-4 rounded-xl transition-all ${
                      selectedPresetId === "crm-invoice"
                        ? "bg-[#38bdf8]/5 border-[#38bdf8] shadow-lg"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Facturación CRM Extractor</h3>
                        <p className="text-sky-400 text-[10px] uppercase font-bold tracking-wider font-mono">CRM Auto Scraper</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Controla accesos a portales protegidos de clientes, lee estados de cobros de tablas con selectores, y los agrupa.
                    </p>
                  </div>

                  <div
                    onClick={() => handleSelectPreset("custom")}
                    className={`cursor-pointer border p-4 rounded-xl transition-all ${
                      selectedPresetId === "custom"
                        ? "bg-[#38bdf8]/5 border-[#38bdf8] shadow-lg"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-purple-500/10 text-purple-400">
                        <Code className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Bot Flujo a Medida</h3>
                        <p className="text-sky-400 text-[10px] uppercase font-bold tracking-wider font-mono">+ IA Modular</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Escribe tu requerimiento personalizado. Utiliza el motor de Gemini de forma asíncrona para armar el andamiaje del script.
                    </p>
                  </div>
                </div>

                {/* Custom system description for Custom option */}
                {selectedPresetId === "custom" && (
                  <form onSubmit={customPromptSubmit => handleCustomPromptSubmit(customPromptSubmit)} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3">
                    <input
                      type="text"
                      className="bg-slate-950 border border-slate-800 text-sm rounded-lg px-4 py-2 flex-1 outline-none text-[#e2e8f0] focus:border-[#38bdf8]/60"
                      placeholder="Ej: Extrae los precios de hoteles de la web Booking filtrando por Madrid..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={isGeneratingCode || !customPrompt.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2"
                    >
                      {isGeneratingCode ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generando...
                        </>
                      ) : (
                        "Generar Código"
                      )}
                    </button>
                  </form>
                )}

                {/* DOUBLE COLUMN: LEFT COMPILER VIEW / RIGHT LIVE VM EMULATOR */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="code_vs_sandbox">
                  
                  {/* GENERATED / SELECTED CODE VIEWER */}
                  <div className="xl:col-span-7 bg-[#0c1020] border border-[#1e293b] rounded-xl flex flex-col h-[580px] overflow-hidden">
                    <div className="bg-[#0f172a] px-4 py-3 border-b border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-xs text-slate-400 font-mono ml-2 flex items-center gap-1">
                          <FileCode className="w-3.5 h-3.5 text-sky-400"/> index.js
                        </span>
                      </div>
                      <button
                        onClick={() => triggerCopy(generatedCodeData.code, "puppeteer-code")}
                        className="p-1 px-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-xs flex items-center gap-1 font-mono transition-all"
                      >
                        {copiedText === "puppeteer-code" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copiar
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-emerald-300 leading-relaxed selection:bg-slate-800">
                      {isGeneratingCode ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
                          <p className="text-xs">Armando script de Puppeteer con Best Practices VPS...</p>
                        </div>
                      ) : (
                        <pre className="whitespace-pre">{generatedCodeData.code}</pre>
                      )}
                    </div>

                    <div className="bg-slate-900 border-t border-slate-800 p-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Pasos del Script Puppeteer:</h4>
                      <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 font-sans">
                        {generatedCodeData.steps?.map((step: string, idx: number) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* HIGH FIDELITY SIMULATION TERMINAL AND BROWSER VIEWER */}
                  <div className="xl:col-span-5 flex flex-col gap-6">
                    {/* TRIGGER PANEL */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between h-[150px]">
                      <div>
                        <h3 className="text-sm font-bold text-slate-200">Prueba Local del Script en VPS</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Antes de cargar el script a producción en tu servidor (VPS), haz una simulación paso a paso del navegador virtual aquí.
                        </p>
                      </div>
                      <button
                        onClick={handleRunBotSimulation}
                        disabled={isSimulatingRun}
                        className={`w-full py-2 px-4 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isSimulatingRun
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg active:scale-[0.98]"
                        }`}
                      >
                        {isSimulatingRun ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Ejecutando Simulación...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-white" /> Ejecutar Simulación en VPS
                          </>
                        )}
                      </button>
                    </div>

                    {/* VIRTUAL BROWSER VIEWPOT CONTAINER */}
                    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl flex-1 flex flex-col h-[400px] overflow-hidden">
                      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-semibold">Navegador Virtual de Puppeteer</span>
                        </div>
                        <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-mono text-cyan-400 border border-cyan-800">
                          {isSimulatingRun ? "HEADLESS: LIVE" : "HEADLESS: DETENIDO"}
                        </span>
                      </div>

                      {/* SIMULATED WINDOW SCREEN DISPLAY */}
                      <div className="flex-1 bg-slate-950 p-4 flex flex-col justify-center items-center relative overflow-hidden">
                        <AnimatePresence mode="wait">
                          {simulationStepIndex >= 0 && isSimulatingRun ? (
                            <motion.div
                              key={simulationStepIndex}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                              className="w-full h-full flex flex-col justify-between bg-slate-900 border border-[#1e293b] rounded-lg p-5"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold text-white shadow-sm ${simulationWalkthrough[simulationStepIndex].iconBg}`}>
                                  {simulationWalkthrough[simulationStepIndex].badge}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">Paso {simulationStepIndex + 1} de 6</span>
                              </div>

                              <div className="my-auto space-y-2">
                                <h4 className="text-sm font-bold text-white">{simulationWalkthrough[simulationStepIndex].title}</h4>
                                <p className="text-xs text-sky-400 font-mono">{simulationWalkthrough[simulationStepIndex].subtitle}</p>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{simulationWalkthrough[simulationStepIndex].description}</p>
                              </div>

                              {/* Simulation Browser Bottom Loading line */}
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
                                <motion.div
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 3 }}
                                  className="h-full bg-sky-500"
                                />
                              </div>
                            </motion.div>
                          ) : (
                            <div className="text-center space-y-3 p-4">
                              <Laptop className="w-10 h-10 text-slate-600 mx-auto" />
                              <h4 className="text-xs font-bold text-slate-400">Pantalla Virtual Off</h4>
                              <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
                                Presiona &quot;Ejecutar Simulación&quot; para iniciar la emulación en consola y ver de forma visual lo que Puppeteer orquesta internamente en el VPS.
                              </p>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* VPS Live console logs */}
                      <div className="h-[140px] bg-black/90 p-3 border-t border-slate-900 font-mono text-[10px] overflow-y-auto space-y-1">
                        {simulationLogs.length === 0 ? (
                          <span className="text-slate-600 italic">// Consola de logs vacía. Listo para iniciar emulación...</span>
                        ) : (
                          simulationLogs.map((logItem, idx) => (
                            <div key={idx} className="flex gap-1.5 leading-normal">
                              <span className="text-slate-500 font-semibold select-none">{logItem.time}</span>
                              <span className={`font-semibold shrink-0 uppercase select-none ${
                                logItem.type === "success" ? "text-green-400" : logItem.type === "warn" ? "text-yellow-400" : "text-blue-400"
                              }`}>
                                [{logItem.type}]
                              </span>
                              <span className="text-slate-200">{logItem.message}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* VPS Performance notes directly referencing why preset is cool */}
                <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-sky-400" /> Consejos Técnicos de DevNexus para entornos de bajo coste (VPS 1GB)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                    {generatedCodeData.vpsTips?.map((tip: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-[#38bdf8] font-bold font-mono">0{idx + 1}.</span>
                        <p className="leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------- */}
            {/* TAB BOILERPLATE: MODULAR BOT SYSTEM (OBSERVER PATTERN) */}
            {/* ----------------------------------------------------- */}
            {activeTab === "boilerplate" && (
              <motion.div
                key="boilerplate"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="tab_boilerplate_workspace"
              >
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-400 animate-pulse" /> Estructura Base (Boilerplate) - Patrón Observer
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Estructura modular optimizada para VPS de bajo coste. El Core <span className="font-mono bg-slate-900 text-indigo-300 px-1 py-0.5 rounded border border-slate-800">BotEventEmitter.js</span> maneja Puppeteer, y los comportamientos se desacoplan en <span className="font-mono bg-slate-900 text-teal-300 px-1 py-0.5 rounded border border-slate-800">skills/</span> con eventos asíncronos sin tocar el núcleo.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 font-bold">
                      ✓ Guardado en /boilerplate-bot
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT FILE COLUMN: FOLDER RUNNER */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Explorador de Archivos</h3>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Haz clic en un archivo para visualizar su código y comentarios técnicos.
                      </p>

                      <div className="bg-slate-950 rounded-lg border border-slate-850 p-2.5 space-y-1 select-none">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 pb-1.5 border-b border-slate-900/60 mb-2">
                          <Folder className="w-4 h-4 text-indigo-400" />
                          <span className="font-bold">boilerplate-bot/</span>
                        </div>

                        {/* package.json */}
                        <div 
                          onClick={() => setSelectedBoilerplateFile(boilerplateFiles[0])}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                            selectedBoilerplateFile.name === "package.json"
                              ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold"
                              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-orange-400" /> package.json
                          </span>
                        </div>

                        {/* BotEventEmitter.js */}
                        <div 
                          onClick={() => setSelectedBoilerplateFile(boilerplateFiles[1])}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                            selectedBoilerplateFile.name === "BotEventEmitter.js"
                              ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold"
                              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-yellow-500" /> BotEventEmitter.js
                          </span>
                        </div>

                        {/* index.js */}
                        <div 
                          onClick={() => setSelectedBoilerplateFile(boilerplateFiles[2])}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                            selectedBoilerplateFile.name === "index.js"
                              ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold"
                              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-yellow-500" /> index.js
                          </span>
                        </div>

                        {/* Directory skills/ */}
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-2 pl-3 pb-1">
                          <Folder className="w-3.5 h-3.5 text-teal-500" />
                          <span>skills/</span>
                        </div>

                        {/* skills/welcome.js */}
                        <div 
                          onClick={() => setSelectedBoilerplateFile(boilerplateFiles[3])}
                          className={`flex items-center justify-between p-2 pl-7 rounded cursor-pointer transition-all ${
                            selectedBoilerplateFile.name === "skills/welcome.js"
                              ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold"
                              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-emerald-400" /> welcome.js
                          </span>
                        </div>

                        {/* skills/crm.js */}
                        <div 
                          onClick={() => setSelectedBoilerplateFile(boilerplateFiles[4])}
                          className={`flex items-center justify-between p-2 pl-7 rounded cursor-pointer transition-all ${
                            selectedBoilerplateFile.name === "skills/crm.js"
                              ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold"
                              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-emerald-400" /> crm.js
                          </span>
                        </div>

                        {/* skills/help.js */}
                        <div 
                          onClick={() => setSelectedBoilerplateFile(boilerplateFiles[5])}
                          className={`flex items-center justify-between p-2 pl-7 rounded cursor-pointer transition-all ${
                            selectedBoilerplateFile.name === "skills/help.js"
                              ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold"
                              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-emerald-400" /> help.js
                          </span>
                        </div>

                        {/* README.md */}
                        <div 
                          onClick={() => setSelectedBoilerplateFile(boilerplateFiles[6])}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all border-t border-slate-900/60 mt-2 ${
                            selectedBoilerplateFile.name === "README.md"
                              ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold"
                              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-mono flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-sky-400" /> README.md
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LIVE INTERACTIVE SIMULATOR CARD */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Consola de Simulación</h3>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">OBSERVER</span>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Selecciona un escenario de mensajería para disparar eventos simulados en tiempo real y observar cómo los Skills reaccionan al instante sin acoplarse con el núcleo:
                      </p>

                      <div className="space-y-2">
                        <button
                          type="button"
                          disabled={isSimulatingBoilerplate}
                          onClick={() => runBoilerplateSimulation("welcome")}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between outline-none ${
                            activeBoilerplateSimScenario === "welcome" && isSimulatingBoilerplate
                              ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold"
                              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-750"
                          }`}
                        >
                          <span>💬 1. Mensaje de Saludo</span>
                          <span className="text-[9px] text-slate-500 font-normal">Welcome Skill</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSimulatingBoilerplate}
                          onClick={() => runBoilerplateSimulation("crm")}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between outline-none ${
                            activeBoilerplateSimScenario === "crm" && isSimulatingBoilerplate
                              ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold"
                              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-750"
                          }`}
                        >
                          <span>📧 2. Mensaje con Email</span>
                          <span className="text-[9px] text-slate-500 font-normal">CRM Sync Skill</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSimulatingBoilerplate}
                          onClick={() => runBoilerplateSimulation("help")}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between outline-none ${
                            activeBoilerplateSimScenario === "help" && isSimulatingBoilerplate
                              ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold"
                              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-750"
                          }`}
                        >
                          <span>ℹ️ 3. Comando 'ayuda'</span>
                          <span className="text-[9px] text-slate-500 font-normal">Help Skill</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => runBoilerplateSimulation(activeBoilerplateSimScenario)}
                        disabled={isSimulatingBoilerplate}
                        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-2"
                      >
                        {isSimulatingBoilerplate ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Corriendo Loop Reactivo...
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Disparar Evento en Consola
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: FILE CODE VIEWER & TERMINAL */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* CODE VIEWER BOX */}
                    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl flex flex-col h-[400px] overflow-hidden">
                      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between shrink-0">
                        <div className="space-y-0.5">
                          <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-indigo-400" /> {selectedBoilerplateFile.name}
                          </span>
                        </div>
                        <button
                          onClick={() => triggerCopy(selectedBoilerplateFile.code, "bp-file-copy")}
                          className="text-[10px] text-slate-300 hover:text-white font-mono bg-slate-950 px-3 py-1 rounded border border-slate-850 hover:border-slate-600 flex items-center gap-1 transition-all"
                        >
                          {copiedText === "bp-file-copy" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copiar Código
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-2 bg-slate-900 text-[10px] text-slate-400 italic px-4 border-b border-slate-800/60 font-sans shrink-0">
                        {selectedBoilerplateFile.description}
                      </div>

                      <div className="flex-1 bg-slate-950 overflow-auto p-4 font-mono text-xs text-[#dfdfdf] whitespace-pre-wrap leading-normal selection:bg-slate-800">
                        {selectedBoilerplateFile.code}
                      </div>
                    </div>

                    {/* VIRTUAL TERMINAL */}
                    <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden h-[230px] flex flex-col">
                      <div className="bg-slate-900 px-4 py-2 border-b border-slate-950 flex items-center justify-between shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-semibold">Consola del Proceso Node.js (Observer Flow)</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isSimulatingBoilerplate ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                          <span className="text-[9px] text-slate-500 font-mono leading-none">{isSimulatingBoilerplate ? 'EJECUTANDO' : 'DETENIDA'}</span>
                        </div>
                      </div>

                      <div className="flex-1 overflow-auto p-3.5 font-mono text-[11px] leading-relaxed space-y-1 bg-black/95">
                        {boilerplateLogs.length === 0 ? (
                          <div className="text-slate-600 italic h-full flex flex-col items-center justify-center space-y-1">
                            <span>// Selecciona un escenario a la izquierda y presiona &quot;Disparar Evento en Consola&quot;.</span>
                            <span>// Verás los despachos del patrón Observer y logs de Puppeteer interactuando de manera desacoplada.</span>
                          </div>
                        ) : (
                          boilerplateLogs.map((logItem, idx) => (
                            <div key={idx} className="flex gap-2 text-left" id={`log_line_${idx}`}>
                              <span className="text-slate-600 select-none">{logItem.time}</span>
                              <span className={`${
                                logItem.type === "success" 
                                  ? "text-emerald-400 font-medium" 
                                  : logItem.type === "warn" 
                                  ? "text-yellow-400" 
                                  : logItem.type === "error" 
                                  ? "text-red-400" 
                                  : "text-indigo-400"
                              } shrink-0`}>
                                &gt;&gt;
                              </span>
                              <span className={`text-slate-200 whitespace-pre-wrap`}>{logItem.message}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* VPS DEPLOY BEST PRACTICE FOR MODULAR PATTERN */}
                <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-3" id="vps-decouple-advantages">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-indigo-400" /> Ventajas Técnicas de la Arquitectura Observer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-400">
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                      <h4 className="font-bold text-slate-200">1. Desacoplamiento Absoluto</h4>
                      <p className="leading-relaxed text-slate-400 text-[11px]">
                        El núcleo no necesita saber si respondes un mensaje, envías un email o disparas una facturación. Cada skill es autónomo y se suscribe secuencial e independientemente. Ideal para escalabilidad infinita de comandos.
                      </p>
                    </div>
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                      <h4 className="font-bold text-slate-200">2. Control de Fugas en VPS</h4>
                      <p className="leading-relaxed text-slate-400 text-[11px]">
                        Al delegar a un Event-Emitter unificado, los manejadores de Puppeteer siguen encapsulados en el mismo proceso activo de Node, impidiendo fugas de memoria Chromium. Máximo rendimiento para VPS de 1GB de RAM.
                      </p>
                    </div>
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                      <h4 className="font-bold text-slate-200">3. Mitigación Global de Fallas</h4>
                      <p className="leading-relaxed text-slate-400 text-[11px]">
                        Si un skill de CRM falla por una caída de red externa, el evento de error global lo captura. Al estar aislados, los demás módulos siguen funcionando con total normalidad sin derrumbar el hilo de ejecución principal.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------- */}
            {/* TAB 2: WEBHOOK CONNECTOR & EXPRESS BUILDER */}
            {/* ----------------------------------------------------- */}
            {activeTab === "webhooks" && (
              <motion.div
                key="webhooks"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="tab_webhooks_workspace"
              >
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-900">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Link className="w-5 h-5 text-[#3b82f6]" /> Orquestador de Webhooks y CRM
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Construye receptores HTTP robustos en Node.js Express para capturar eventos entrantes desde plataformas de WhatsApp o formularios, normalizar información y subirlos a tu CRM preferido de forma segura.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* GENERATOR OPTIONS & TEST BOX */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      <h3 className="text-sm font-bold text-slate-200">Configuración de Flujo</h3>

                      {/* Platfrom Source */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">Plataforma Origen (WhatsApp / Lead Source)</label>
                        <select
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-[#3b82f6]"
                          value={webhookConfig.platform}
                          onChange={(e: any) => setWebhookConfig(prev => ({ ...prev, platform: e.target.value }))}
                        >
                          <option value="whatsapp">WhatsApp Cloud (Meta API o Bot local)</option>
                          <option value="formspree">Formspree (Formularios Web)</option>
                          <option value="stripe">Stripe Checkout (Pasarelas de Pago)</option>
                          <option value="custom">Formato Customizado (JSON general)</option>
                        </select>
                      </div>

                      {/* CRM Destination */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">CRM de Destino (Pipeline / Base de datos)</label>
                        <select
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-[#3b82f6]"
                          value={webhookConfig.crm}
                          onChange={(e: any) => setWebhookConfig(prev => ({ ...prev, crm: e.target.value }))}
                        >
                          <option value="pipedrive">Pipedrive CRM (Flujo de Negocios)</option>
                          <option value="hubspot">HubSpot API (Pipeline unificado)</option>
                          <option value="sql-db">Relational PostgreSQL / MySQL (Database)</option>
                        </select>
                      </div>

                      {/* Encryption Secret Key */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">Token Secreto de Validación (SHA256)</label>
                        <input
                          type="text"
                          className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 outline-none font-mono text-cyan-400"
                          value={webhookConfig.verifyToken}
                          onChange={(e) => setWebhookConfig(prev => ({ ...prev, verifyToken: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* MOCK JSON INPUT TEST BOX */}
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
                        Enviar JSON de Prueba
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">Modo Sandbox</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Simula una llamada Webhook a tu servidor VPS, enviando el siguiente cuerpo de datos estructurados:
                      </p>
                      
                      <textarea
                        className="w-full h-[150px] bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-[#a5f3fc] outline-none resize-none focus:border-[#3b82f6]"
                        value={simulatePayloadInput}
                        onChange={(e) => setSimulatePayloadInput(e.target.value)}
                      />

                      <button
                        onClick={handleTestWebhookSimulation}
                        disabled={isTestingWebhook}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2"
                      >
                        {isTestingWebhook ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Procesando llamada...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" /> Disparar Payload de Simulación
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* BOILERPLATE EXPOSED & TEST TIMELINE LOGS */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl flex flex-col h-[400px] overflow-hidden">
                      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-mono flex items-center gap-1">
                          <Code className="w-3.5 h-3.5 text-blue-400" /> express-webhook-router.js
                        </span>
                        <button
                          onClick={() => triggerCopy(generatedWebhookCode, "webhook-code")}
                          className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-all"
                        >
                          {copiedText === "webhook-code" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copiar Código
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex-1 bg-slate-950 overflow-auto p-4 font-mono text-xs text-blue-300 selection:bg-slate-800">
                        {isGeneratingWebhookCode ? (
                          <div className="h-full flex items-center justify-center text-slate-500">
                            <span className="animate-pulse">Calculando webhook modular...</span>
                          </div>
                        ) : (
                          <pre className="whitespace-pre">{generatedWebhookCode}</pre>
                        )}
                      </div>
                    </div>

                    {/* INTERACTIVE TRANSMISSION RESPONSE VERIFIER */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-widest mb-3">Logs de Transmisión Webhook (Simulados):</h4>
                      <div className="bg-black rounded-lg p-3 h-[120px] overflow-y-auto space-y-1.5 font-mono text-[11px]">
                        {testWebhookLogs.length === 0 ? (
                          <span className="text-slate-600 italic">// En espera de disparo del webhook...</span>
                        ) : (
                          testWebhookLogs.map((log, i) => (
                            <div key={i} className="text-slate-300 flex items-center gap-1">
                              <span className="text-slate-500 select-none">&gt;&gt;</span>
                              <span>{log}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-yellow-400 font-mono">Regla de Oro en Webhooks VPS (Evitar Cuellos de Botella)</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      Siempre responde con un código de estado <code className="bg-black/30 px-1 py-0.5 rounded text-white">HTTP 200</code> de inmediato a la plataforma origen (ej: WhatsApp Cloud API). Las integraciones tardías con APIs de terceros (Pipedrive, etc.) deben orquestarse asíncronamente con promesas o colas de fondo, liberando al hilo de NodeJS para no bloquear el VPS ante ráfagas de mensajes simultáneos.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------- */}
            {/* TAB 3: REAL-TIME AI QUALIFIER (GEMINI INTEGRATION)    */}
            {/* ----------------------------------------------------- */}
            {activeTab === "qualifier" && (
              <motion.div
                key="qualifier"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="tab_qualifier_workspace"
              >
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-900">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-400" /> Cualificador de Leads con Inteligencia Artificial (Real)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Usa modelos de lenguaje avanzados para filtrar y calificar las conversaciones de los clientes de Roberto en WhatsApp de forma automática en tu servidor. Extrae variables, mide intención y genera borradores de respuesta personalizados.
                  </p>
                </div>

                {/* REAL INTEGRATION BANNER */}
                <div className="bg-[#1e1b4b]/50 border border-indigo-500/30 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider">Integración Gemini 3.5 Flash</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                        Este módulo se conecta directamente al SDK de Google GenAI en el servidor Express. Si tu clave no está configurada, utiliza un algoritmo heurístico predictivo para simular el análisis.
                      </p>
                    </div>
                  </div>
                  {!serverStatus.hasGeminiKey && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded font-mono font-semibold whitespace-nowrap shrink-0">
                      MODO SIMULADOR ACTIVO
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* CONFIGURATION COLUMN */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      <h3 className="text-sm font-bold text-slate-200">Ajustes del Bot Calificador</h3>

                      {/* Agent role */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">Personalidad / Rol del Soporte</label>
                        <input
                          type="text"
                          className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 outline-none text-[#dfdfdf]"
                          value={qualifierConfig.agentPersona}
                          onChange={(e) => setQualifierConfig(prev => ({ ...prev, agentPersona: e.target.value }))}
                        />
                      </div>

                      {/* Targeted Fields */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 block">Campos a Extraer de la conversación</label>
                        <div className="flex flex-wrap gap-1.5" id="fields_collection">
                          {qualifierConfig.fields.map((field, i) => (
                            <span key={i} className="text-[10px] bg-slate-950 text-sky-400 border border-slate-800 px-2 py-1 rounded-md flex items-center gap-1.5 font-mono">
                              {field}
                              <button
                                type="button"
                                className="text-red-400 hover:text-red-300 font-bold ml-1 text-xs select-none"
                                onClick={() => handleRemoveField(field)}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Add target fields input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Nuevo campo (ej: Interés)"
                            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-1.5 flex-1 text-emerald-300 outline-none"
                            value={newQualifierField}
                            onChange={(e) => setNewQualifierField(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddField();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddField}
                            className="px-3 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CHATS PRESETS & TEST TEXT BOX */}
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-200">Mensaje de Chat Entrante</h3>
                      </div>

                      {/* Presets buttons */}
                      <div className="flex flex-wrap gap-2">
                        {testMessagePresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setIncomingMessageText(preset.text)}
                            className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] rounded px-2.5 py-1 text-slate-300 font-semibold"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      <textarea
                        className="w-full h-[140px] bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs leading-relaxed text-[#dfdfdf] outline-none focus:border-indigo-600 resize-none"
                        value={incomingMessageText}
                        onChange={(e) => setIncomingMessageText(e.target.value)}
                      />

                      <button
                        onClick={handleRunQualifier}
                        disabled={isProcessingLead || !incomingMessageText.trim()}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
                      >
                        {isProcessingLead ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-100" /> Calificando conversación...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-indigo-200" /> Analizar con Gemini AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ANALYSIS & AUTOREPLY RESPONSE VIEW */}
                  <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[450px]">
                    
                    {isProcessingLead && (
                      <div className="my-auto flex flex-col items-center justify-center text-slate-400 gap-3 py-10">
                        <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin" />
                        <h4 className="text-sm font-bold text-slate-200">Analizando el Lead de WhatsApp</h4>
                        <p className="text-[11px] text-slate-500 text-center max-w-xs leading-normal">
                          Llamando al servidor seguro para ejecutar el modelo de inteligencia artificial y extraer datos estructurados...
                        </p>
                      </div>
                    )}

                    {!isProcessingLead && !qualifiedLeadResult && (
                      <div className="my-auto flex flex-col items-center justify-center text-slate-500 py-10">
                        <MessageSquare className="w-12 h-12 text-slate-700 mb-2" />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Esperando Envío</h4>
                        <p className="text-[10px] text-slate-600 max-w-xs text-center mt-1 leading-normal">
                          Coloca un mensaje de WhatsApp entrante a la izquierda y presiona el botón para ver la inteligencia del Lead en vivo.
                        </p>
                      </div>
                    )}

                    {!isProcessingLead && qualifiedLeadResult && (
                      <div className="space-y-6" id="qualifier_results">
                        
                        {/* INTENT & CONFIDENCE RADAR */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                          <div>
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Intención de Conversación</span>
                            <span className={`inline-block mt-1.5 px-3 py-1 rounded text-xs font-mono font-bold tracking-wide uppercase ${
                              qualifiedLeadResult.data.intent === "warm_lead" 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : qualifiedLeadResult.data.intent === "support" 
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : qualifiedLeadResult.data.intent === "spam"
                                ? "bg-red-500/20 text-red-500 border border-red-500/30"
                                : "bg-slate-800 text-slate-300 border border-slate-700"
                            }`}>
                              {qualifiedLeadResult.data.intent.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-right sm:text-right">
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Calidad / Confianza</span>
                            <span className="text-base font-bold font-mono text-cyan-400 block mt-1">
                              {(qualifiedLeadResult.data.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* SUMMARY LINE */}
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-950 text-xs">
                          <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase block">Resumen del Lead:</span>
                          <p className="text-slate-300 mt-1 italic font-sans">
                            &quot;{qualifiedLeadResult.data.summary}&quot;
                          </p>
                        </div>

                        {/* EXTRACTED FIELDS TABLE */}
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Variables capturadas</span>
                          <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-950">
                            <table className="w-full text-xs text-left" id="extracted_fields_table">
                              <thead>
                                <tr className="bg-slate-900 border-b border-slate-950 text-slate-500 text-[10px] uppercase font-mono">
                                  <th className="p-2.5">Variable</th>
                                  <th className="p-2.5">Filtro de Extracción</th>
                                  <th className="p-2.5 text-right">Estatus</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(qualifiedLeadResult.data.extractedFields || {}).map(([key, value]: any, i) => (
                                  <tr key={i} className="border-b border-slate-900/60 text-slate-300">
                                    <td className="p-2.5 font-semibold font-mono text-slate-400">{key}</td>
                                    <td className="p-2.5 max-w-[180px] truncate leading-normal" title={value || ""}>
                                      {value ? (
                                        <span className="text-white font-medium">{value}</span>
                                      ) : (
                                        <span className="text-slate-600 italic">No proporcionado</span>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-right">
                                      {value ? (
                                        <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 font-bold font-mono">OK</span>
                                      ) : (
                                        <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] bg-slate-900 text-slate-500 font-mono">Falta</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* WA AUTO-REPLY MESSAGE BOX */}
                        <div className="bg-slate-950 rounded-xl overflow-hidden border border-[#0f5132]/30 flex flex-col h-[200px]" id="whastapp_auto_reply_drawer">
                          <header className="bg-[#128c7e] px-4 py-2 text-white text-xs font-bold font-sans flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4" /> Borrador de Respuesta para WhatsApp
                            </span>
                            <button
                              onClick={() => triggerCopy(qualifiedLeadResult.data.autoReply, "auto-reply-text")}
                              className="text-[10px] bg-slate-950/30 hover:bg-slate-950/50 hover:text-white px-2 py-0.5 rounded text-teal-200 transition-all font-mono"
                            >
                              {copiedText === "auto-reply-text" ? "Copiado!" : "Copiar"}
                            </button>
                          </header>
                          <div className="flex-1 p-3.5 overflow-auto text-xs font-sans leading-relaxed text-[#e2e8f0]">
                            {qualifiedLeadResult.data.autoReply}
                          </div>
                        </div>

                        {/* TIME TRACE */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-3">
                          <span>Endpoint Status: {qualifiedLeadResult.status === "real_api" ? "Generative IA Exitoso" : "Simulado localmente"}</span>
                          <span>Análisis: {qualifiedLeadResult.model}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------- */}
            {/* TAB 4: LINUX VPS ENVIRONMENT & SETUP FILES           */}
            {/* ----------------------------------------------------- */}
            {activeTab === "vps" && (
              <motion.div
                key="vps"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="tab_vps_workspace"
              >
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-900">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" /> Configuración de Servidor VPS & PM2
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Copiar y pegar plantillas de configuración optimizadas para albergar tus bots de WhatsApp y scraping de Puppeteer de manera persistente en servidores VPS minimalistas de Linux, garantizando un uptime robusto.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CONFIG FILE 1: PM2 ECOSYSTEM */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[340px]">
                    <header className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> ecosystem.config.cjs (PM2)
                      </span>
                      <button
                        onClick={() => triggerCopy(`module.exports = {
  apps: [
    {
      name: 'devnexus-wa-bot',
      script: 'server.ts',
      interpreter: 'tsx',
      instances: 1,
      autorestart: true,
      max_memory_restart: '350M', // Evita fugas de memoria de puppeteer consumiendo el VPS
      cron_restart: '0 4 * * *', // Auto restart a las 4:00 AM para limpiar memoria residual
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};`, "pm2-config")}
                        className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-all"
                      >
                        {copiedText === "pm2-config" ? "Copiado!" : "Copiar"}
                      </button>
                    </header>
                    <div className="flex-1 bg-slate-950 p-4 overflow-auto font-mono text-[11px] text-[#fed7aa] select-all">
                      <pre>{`module.exports = {
  apps: [
    {
      name: 'devnexus-wa-bot',
      script: 'server.ts',
      interpreter: 'tsx',
      instances: 1,
      autorestart: true,
      max_memory_restart: '350M', // Evita fugas de memoria de puppeteer consumiendo el VPS
      cron_restart: '0 4 * * *', // Auto restart a las 4:00 AM para limpiar memoria residual
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};`}</pre>
                    </div>
                  </div>

                  {/* CONFIG FILE 2: NGINX REVERSE PROXY */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[340px]">
                    <header className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> nginx.conf
                      </span>
                      <button
                        onClick={() => triggerCopy(`server {
    listen 80;
    server_name vps.devnexus.com; # Coloca tu IP de VPS o dominio

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`, "nginx-config")}
                        className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-all"
                      >
                        {copiedText === "nginx-config" ? "Copiado!" : "Copiar"}
                      </button>
                    </header>
                    <div className="flex-1 bg-slate-950 p-4 overflow-auto font-mono text-[11px] text-[#93c5fd] select-all">
                      <pre>{`server {
    listen 80;
    server_name vps.devnexus.com; # Coloca tu IP de VPS o dominio

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`}</pre>
                    </div>
                  </div>

                  {/* CONFIG FILE 3: LINUX DEBIAN/UBUNTU PUPPETEER LIBS INSTALLATION */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[340px]">
                    <header className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> setup-puppeteer-libs.sh
                      </span>
                      <button
                        onClick={() => triggerCopy(`# Actualiza los paquetes del sistema
sudo apt-get update && sudo apt-get upgrade -y

# Instala todas las dependencias compartidas requeridas por Chromium para poder correr en modo Headless sin interfaz de escritorio
sudo apt-get install -y \\
  ca-certificates \\
  fonts-liberation \\
  libasound2 \\
  libatk-bridge2.0-0 \\
  libatk1.0-0 \\
  libc6 \\
  libcairo2 \\
  libcups2 \\
  libdbus-1-3 \\
  libexpat1 \\
  libfontconfig1 \\
  libgbm1 \\
  libgcc1 \\
  libglib2.0-0 \\
  libgtk-3-0 \\
  libnspr4 \\
  libnss3 \\
  libpango-1.0-0 \\
  libpangocairo-1.0-0 \\
  libstdc++6 \\
  libx11-6 \\
  libx11-xcb1 \\
  libxcb1 \\
  libxcomposite1 \\
  libxcursor1 \\
  libxdamage1 \\
  libxext6 \\
  libxfixes3 \\
  libxi6 \\
  libxrandr2 \\
  libxrender1 \\
  libxss1 \\
  libxtst6 \\
  lsb-release \\
  wget \\
  xdg-utils

echo "✓ ¡Librerías de Puppeteer instaladas con éxito en el VPS Linux!"`, "sh-config")}
                        className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-all"
                      >
                        {copiedText === "sh-config" ? "Copiado!" : "Copiar"}
                      </button>
                    </header>
                    <div className="flex-1 bg-slate-950 p-4 overflow-auto font-mono text-[11px] text-[#c084fc] select-all whitespace-pre-wrap">
                      <pre>{`# Actualiza los paquetes del sistema
sudo apt-get update && sudo apt-get upgrade -y

# Instala dependencias compartidas necesarias
sudo apt-get install -y \\
  ca-certificates \\
  fonts-liberation \\
  libasound2 \\
  libatk-bridge2.0-0 \\
  libatk1.0-0 \\
  libc6 \\
  libcairo2 \\
  libcups2 \\
  libdbus-1-3 \\
  libexpat1 \\
  libfontconfig1 \\
  libgbm1 \\
  libgcc1 \\
  libglib2.0-0 \\
  libgtk-3-0 \\
  libnspr4 \\
  libnss3 \\
  libpango-1.0-0 \\
  libpangocairo-1.0-0 \\
  libstdc++6 \\
  libx11-6 \\
  libx11-xcb1 \\
  libxcb1 \\
  libxcomposite1 \\
  libxcursor1 \\
  libxdamage1 \\
  libxext6 \\
  libxfixes3 \\
  libxi6 \\
  libxrandr2 \\
  libxrender1 \\
  libxss1 \\
  libxtst6 \\
  lsb-release \\
  wget \\
  xdg-utils`}</pre>
                    </div>
                  </div>

                  {/* CONFIG FILE 4: AUTOMATIC RESIDUAL SCREENSHOTS CLEANUP CRON JOB */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[340px]">
                    <header className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> logs-cleanup-cron
                      </span>
                      <button
                        onClick={() => triggerCopy(`# Añade esta línea a tu crontab ejecutando: crontab -e
# Borra diariamente a las 3:00 AM todas las capturas PNG generadas para evitar saturar el espacio de disco SSD en el VPS
0 3 * * * find /var/www/devnexus-app/ -name "*.png" -type f -mtime +1 -delete
`, "cron-config")}
                        className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-all"
                      >
                        {copiedText === "cron-config" ? "Copiado!" : "Copiar"}
                      </button>
                    </header>
                    <div className="flex-1 bg-slate-950 p-4 overflow-auto font-mono text-[11px] text-[#22d3ee] select-all">
                      <pre>{`# Ingresa a la consola de tareas cron ejecutando:
# crontab -e

# Limpieza residual diaria:
# Borra diariamente a las 3:00 AM todos los screenshots PNG viejos generados por tu bot de WhatsApp web, impidiendo congestiones de almacenamiento:
0 3 * * * find /var/www/devnexus-app/ -name "*.png" -type f -mtime +1 -delete`}</pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </section>
      </main>

      {/* FOOTER GENERAL STATUS BAR */}
      <footer className="border-t border-[#1e293b] bg-slate-950 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono" id="footer">
        <span>Diseñado en exclusiva para Roberto por el motor DevNexus Engine.</span>
        <span>Hora local UTC: 2026-06-08 • VPS Host: On</span>
      </footer>
    </div>
  );
}

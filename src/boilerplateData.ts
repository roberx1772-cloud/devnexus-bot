// Data file to keep /src/App.tsx highly modular and clean from content bloat.

export interface BoilerplateFile {
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export const boilerplateFiles: BoilerplateFile[] = [
  {
    name: "package.json",
    path: "package.json",
    language: "json",
    description: "Configuración esencial del proyecto y declaración de dependencias (Puppeteer).",
    code: `{
  "name": "devnexus-modular-bot",
  "version": "1.0.0",
  "description": "Boilerplate modular con Puppeteer y Event-Emitter para Automatización de Bots (VPS Ready)",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "puppeteer": "^22.1.0"
  },
  "author": "Roberto & DevNexus",
  "license": "ISC"
}`
  },
  {
    name: "BotEventEmitter.js",
    path: "BotEventEmitter.js",
    language: "javascript",
    description: "Clase núcleo que encapsula la instancia de Puppeteer y hereda de EventEmitter para dispatching modular.",
    code: `import { EventEmitter } from 'events';
import puppeteer from 'puppeteer';

/**
 * Clase principal que gestiona el ciclo de vida del bot y el flujo de trabajo
 * basándose en el patrón Observer (EventEmitters).
 */
export class BotEventEmitter extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
      ...config
    };
    this.browser = null;
    this.page = null;
    this.skills = [];
  }

  /**
   * Registra un nuevo skill (módulo/comando) de forma modular.
   * Cada skill es un objeto que define un evento a escuchar y un método de ejecución.
   */
  registerSkill(skill) {
    if (!skill.name || !skill.event || typeof skill.execute !== 'function') {
      this.emit('error', new Error(\`Skill inválido: \${skill.name || 'Sin Nombre'}\`));
      return;
    }
    
    this.skills.push(skill);
    
    // El bot se suscribe al evento especificado por el skill (Patrón Observer)
    this.on(skill.event, async (...args) => {
      try {
        console.log(\`[Core] Despachando evento '\${skill.event}' al skill: \${skill.name}\`);
        await skill.execute(this, ...args);
      } catch (err) {
        this.emit('error', err);
      }
    });
    
    console.log(\`[Core] Skill registrado con éxito: \${skill.name} (Escucha: '\${skill.event}')\`);
  }

  /**
   * Carga dinámica de múltiples skills en lote.
   */
  registerSkills(skillsList) {
    skillsList.forEach(skill => this.registerSkill(skill));
  }

  /**
   * Inicializa la instancia de Puppeteer con ajustes optimizados para VPS.
   */
  async initialize() {
    try {
      this.emit('status', 'Iniciando navegador virtual...');
      
      this.browser = await puppeteer.launch({
        headless: this.config.headless,
        args: this.config.args
      });

      this.page = await this.browser.newPage();
      
      // Evasión básica de firmas automatizadas
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await this.page.setViewport({ width: 1280, height: 800 });

      this.emit('status', 'Navegador listo y configurado.');
      this.emit('initialize_success');
    } catch (error) {
      this.emit('error', error);
      await this.close();
    }
  }

  /**
   * Simula la recepción de un mensaje o evento externo (ej: WhatsApp, webhook, etc.)
   */
  async simulateInboxMessage(sender, messageText) {
    this.emit('status', \`Mensaje entrante detectado de [\${sender}]\`);
    
    // Dispara el evento 'message_received' con los datos correspondientes.
    // Los skills suscritos capturarán este evento asíncronamente de forma automática.
    this.emit('message_received', { sender, text: messageText, timestamp: new Date() });
  }

  /**
   * Cierra el bot de forma segura liberando recursos de la RAM en VPS.
   */
  async close() {
    this.emit('status', 'Cerrando navegador virtual o liberando recursos...');
    if (this.browser) {
      await this.browser.close();
    }
    this.emit('task_completed', 'Proceso finalizado con seguridad.');
  }
}`
  },
  {
    name: "index.js",
    path: "index.js",
    language: "javascript",
    description: "Archivo de orquestación donde se configuran los oyentes del bot y se cargan los skills.",
    code: `/**
 * DevNexus: Robot de Automatización Modular - Entrada Principal (index.js)
 * Autor: Roberto + DevNexus Engine
 * Descripción: Orquestación del bot de Puppeteer utilizando el patrón de diseño Observer (EventEmitter).
 */
import { BotEventEmitter } from './BotEventEmitter.js';

// Importación de Skills (Comportamientos del Bot de forma desacoplada)
import { welcomeSkill } from './skills/welcome.js';
import { crmSyncSkill } from './skills/crm.js';
import { helpSkill } from './skills/help.js';

async function main() {
  console.log('--- DEVNEXUS MODULAR AUTOMATION MOTOR ---');
  
  // 1. Instanciar el Core del Bot con opciones optimizadas para VPS
  const bot = new BotEventEmitter({
    headless: 'new' // 'new' para activar el modo moderno optimizado sin cabecera
  });

  // 2. Suscribir canales globales de eventos (Observer central de logs)
  bot.on('status', (msg) => {
    console.log(\`📢 [LOG STATUS]: \${msg}\`);
  });

  bot.on('error', (err) => {
    console.error(\`❌ [LOG ERROR]: Ha ocurrido un percance en el flujo:\`, err.message);
  });

  bot.on('initialize_success', () => {
    console.log('✓ [EVENT]: El motor de Puppeteer está encendido y listo.');
  });

  bot.on('task_completed', (summary) => {
    console.log(\`🏁 [EVENT FINISHED]: \${summary}\`);
  });

  // 3. Registrar los Skills al Núcleo de forma desacoplada (Patrón Observer)
  // Añadir un nuevo comando es tan fácil como crear su archivo e importarlo aquí
  bot.registerSkills([
    welcomeSkill,
    crmSyncSkill,
    helpSkill
  ]);

  // 4. Inicializar Navegación e hilos de Puppeteer
  await bot.initialize();

  // 5. Simular entrada y procesamiento asíncrono de Mensajes
  // (En producción, esto se gatillaría con capturas en tiempo real de WhatsApp Web, webhooks, etc.)
  console.log('\\n💬 [SIMULACIÓN]: Recibiendo mensajes de prueba de usuarios...');
  
  // Caso A: Mensaje con saludo
  await bot.simulateInboxMessage('+34600112233', 'Hola buenas tardes! Me interesa contratar un plan de bots.');
  
  // Caso B: Mensaje con email (CRM Sync automatizado sin tocar index.js)
  setTimeout(async () => {
    console.log('\\n---');
    await bot.simulateInboxMessage('+34600122334', 'Hola, agrégame al boletín de noticias, mi correo es roberto_vps@example.com.');
  }, 1000);

  // Caso C: Comando de ayuda
  setTimeout(async () => {
    console.log('\\n---');
    await bot.simulateInboxMessage('+34612345678', 'ayuda');
    
    // 6. Cerrar el bot al final de la simulación
    console.log('\\n---');
    await bot.close();
  }, 2000);
}

// Ejecutar el motor
main();`
  },
  {
    name: "skills/welcome.js",
    path: "skills/welcome.js",
    language: "javascript",
    description: "Skill modular de saludos. Intercepta saludos introductorios y provee respuestas rápidas.",
    code: `/**
 * Skill: Saludo de Bienvenida (Welcome Skill)
 * Escucha: 'message_received'
 * Descripción: Envía una respuesta de bienvenida amigable si el usuario saluda.
 */
export const welcomeSkill = {
  name: 'Welcome Skill',
  event: 'message_received',
  async execute(bot, data) {
    const cleanText = data.text.toLowerCase();
    
    if (cleanText.includes('hola') || cleanText.includes('buenos días') || cleanText.includes('buenas')) {
      console.log(\`[Skill: Welcome] Procesando mensaje de \${data.sender}\`);
      
      // Lógica de automatización con Puppeteer: Enviar una respuesta o navegar
      // En este boilerplate, emulamos una acción de tecleado en el navegador usando la página creada
      // await bot.page.keyboard.type('¡Hola! Soy DevNexus Bot...');
      
      console.log(\`[Skill: Welcome] Respuesta generada para \${data.sender}: "¡Hola! Gracias por iniciar contacto. ¿En qué automatización puedo ayudarte?"\`);
      
      // Notificamos al sistema que la tarea de este observador finalizó con éxito
      bot.emit('status', \`Respuesta enviada de forma interactiva por Welcome Skill.\`);
    }
  }
};`
  },
  {
    name: "skills/crm.js",
    path: "skills/crm.js",
    language: "javascript",
    description: "Skill modular para sincronización con CRM. Escanea texto buscando emails para registrarlos en tiempo real.",
    code: `/**
 * Skill: Sincronización Automática con CRM (CRM Sync Skill)
 * Escucha: 'message_received'
 * Descripción: Si el mensaje contiene un correo electrónico, sincroniza asíncronamente con el CRM.
 */
export const crmSyncSkill = {
  name: 'CRM Sync Skill',
  event: 'message_received',
  async execute(bot, data) {
    const cleanText = data.text.toLowerCase();
    
    // Regex simple para detectar emails
    const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
    
    if (emailMatch) {
      const email = emailMatch[0];
      console.log(\`[Skill: CRM] Email detectado: \${email}. Registrando en pipeline de ventas...\`);
      
      // En una implementación real, aquí usarías Puppeteer para navegar o llamarías una API de CRM.
      // E.g., await bot.page.goto(\`https://crm.ejemplo.com/leads?add=\${email}\`);
      
      console.log(\`[Skill: CRM] Lead \${email} sincronizado con éxito.\`);
      bot.emit('status', \`Lead registrado de manera persistente en CRM por CRM Sync Skill.\`);
    }
  }
};`
  },
  {
    name: "skills/help.js",
    path: "skills/help.js",
    language: "javascript",
    description: "Skill modular de comandos de soporte técnico. Intercepta 'ayuda' y expone el listado de comandos.",
    code: `/**
 * Skill: Comando de Ayuda (Help command Skill)
 * Escucha: 'message_received'
 * Descripción: Despliega los comandos disponibles cuando el cliente envía "ayuda".
 */
export const helpSkill = {
  name: 'Help Skill',
  event: 'message_received',
  async execute(bot, data) {
    const cleanText = data.text.toLowerCase();
    
    if (cleanText === 'ayuda' || cleanText === 'help') {
      console.log(\`[Skill: Help] Desplegando catálogo de comandos para \${data.sender}\`);
      
      const commands = \`Comandos Disponibles:\\n- ayuda: Despliega este menú.\\n- hola: Saludo al bot.\\n- [cualquier mensaje con email]: Guarda tu contacto en nuestro CRM.\`;
      
      console.log(\`[Skill: Help] Menú enviado:\\n\${commands}\`);
      bot.emit('status', \`Menú de ayuda despachado por Help Skill.\`);
    }
  }
};`
  },
  {
    name: "README.md",
    path: "README.md",
    language: "markdown",
    description: "README en español con la explicación técnica sobre cómo inicializar, ejecutar y extender la estructura.",
    code: `# DevNexus Boilerplate Automatización Modular 🚀 (VPS Ready)

Estructura de arquitectura modular y desacoplada para bots y scrapers construidos en **Node.js** con **Puppeteer**. 

## Arquitectura: Patrón Observer 🧩

Este boilerplate utiliza una clase \`BotEventEmitter\` que extiende el \`EventEmitter\` oficial de Node.js. 
- El **Núcleo (Core)** se encarga exclusivamente de la configuración, inicialización y cierre de Puppeteer.
- Los **Comportamientos (Skills)** se registran dinámicamente como observadores de eventos como \`message_received\` u \`initialize_success\`.
- **Escalabilidad Infinita**: Puedes añadir decenas de comandos o flujos sin alterar una sola línea de código en \`BotEventEmitter.js\` o \`index.js\`, simplemente creando un nuevo archivo de skill y registrándolo en la colección.

---

## Estructura de Directorios

\`\`\`
/boilerplate-bot
├── index.js                  # Punto de entrada principal y orquestador
├── BotEventEmitter.js        # Clase core que empaqueta Puppeteer y el EventEmitter
├── package.json              # Dependencias de paquetes indispensables
├── README.md                 # Documentación técnica
└── skills/                   # Módulos/Skills de comportamiento desacoplados
    ├── welcome.js            # Lógica para responder a saludos amigables
    ├── help.js               # Menú descriptivo de comandos de ayuda
    └── crm.js                # Sincronización asíncrona de leads calificados con CRM
\`\`\`

## Ejecución Local

1. Instala las dependencias necesarias:
   \`\`\`bash
   npm install
   \`\`\`

2. Ejecuta la simulación reactiva de eventos:
   \`\`\`bash
   npm start
   \`\`\`

---

## ¿Cómo agregar un nuevo comando o Skill?

Crear un nuevo comportamiento es extremadamente sencillo. Sigue estos dos pasos:

1. Crea un nuevo archivo en el directorio \`./skills/\`, por ejemplo: \`skills/mi-comando.js\` que exporte un objeto con el formato estándar:

   \`\`\`javascript
   export const miComandoSkill = {
     name: 'Mi Comando Especial',
     event: 'message_received', // El evento que deseas escuchar
     async execute(bot, data) {
       // Accede directamente a la página de Puppeteer activa con bot.page
       const cleanText = data.text.toLowerCase();
       if (cleanText.includes('ejecutar-bot')) {
         console.log('🤖 Comando Detectado!');
         // Tu lógica automatizada aquí...
       }
     }
   };
   \`\`\`

2. Regístralo en \`index.js\`:
   \`\`\`javascript
   import { miComandoSkill } from './skills/mi-comando.js';
   
   bot.registerSkill(miComandoSkill);
   \`\`\`

¡Listo! El bot escuchará el evento de forma totalmente reactiva sin interferir en los demás comandos.
`
  }
];

/**
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
    console.log(`📢 [LOG STATUS]: ${msg}`);
  });

  bot.on('error', (err) => {
    console.error(`❌ [LOG ERROR]: Ha ocurrido un percance en el flujo:`, err.message);
  });

  bot.on('initialize_success', () => {
    console.log('✓ [EVENT]: El motor de Puppeteer está encendido y listo.');
  });

  bot.on('task_completed', (summary) => {
    console.log(`🏁 [EVENT FINISHED]: ${summary}`);
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
  console.log('\n💬 [SIMULACIÓN]: Recibiendo mensajes de prueba de usuarios...');
  
  // Caso A: Mensaje con saludo
  await bot.simulateInboxMessage('+34600112233', 'Hola buenas tardes! Me interesa contratar un plan de bots.');
  
  // Caso B: Mensaje con email (CRM Sync automatizado sin tocar index.js)
  setTimeout(async () => {
    console.log('\n---');
    await bot.simulateInboxMessage('+34600122334', 'Hola, agrégame al boletín de noticias, mi correo es roberto_vps@example.com.');
  }, 1000);

  // Caso C: Comando de ayuda
  setTimeout(async () => {
    console.log('\n---');
    await bot.simulateInboxMessage('+34612345678', 'ayuda');
    
    // 6. Cerrar el bot al final de la simulación
    console.log('\n---');
    await bot.close();
  }, 2000);
}

// Ejecutar el motor
main();

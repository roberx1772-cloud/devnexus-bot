import { EventEmitter } from 'events';
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
      this.emit('error', new Error(`Skill inválido: ${skill.name || 'Sin Nombre'}`));
      return;
    }
    
    this.skills.push(skill);
    
    // El bot se suscribe al evento especificado por el skill (Patrón Observer)
    this.on(skill.event, async (...args) => {
      try {
        console.log(`[Core] Despachando evento '${skill.event}' al skill: ${skill.name}`);
        await skill.execute(this, ...args);
      } catch (err) {
        this.emit('error', err);
      }
    });
    
    console.log(`[Core] Skill registrado con éxito: ${skill.name} (Escucha: '${skill.event}')`);
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
    this.emit('status', `Mensaje entrante detectado de [${sender}]`);
    
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
}

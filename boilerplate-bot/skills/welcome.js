/**
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
      console.log(`[Skill: Welcome] Procesando mensaje de ${data.sender}`);
      
      // Lógica de automatización con Puppeteer: Enviar una respuesta o navegar
      // En este boilerplate, emulamos una acción de tecleado en el navegador usando la página creada
      // await bot.page.keyboard.type('¡Hola! Soy DevNexus Bot...');
      
      console.log(`[Skill: Welcome] Respuesta generada para ${data.sender}: "¡Hola! Gracias por iniciar contacto. ¿En qué automatización puedo ayudarte?"`);
      
      // Notificamos al sistema que la tarea de este observador finalizó con éxito
      bot.emit('status', `Respuesta enviada de forma interactiva por Welcome Skill.`);
    }
  }
};

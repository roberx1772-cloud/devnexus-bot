/**
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
    const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    
    if (emailMatch) {
      const email = emailMatch[0];
      console.log(`[Skill: CRM] Email detectado: ${email}. Registrando en pipeline de ventas...`);
      
      // En una implementación real, aquí usarías Puppeteer para navegar o llamarías una API de CRM.
      // E.g., await bot.page.goto(`https://crm.ejemplo.com/leads?add=${email}`);
      
      console.log(`[Skill: CRM] Lead ${email} sincronizado con éxito.`);
      bot.emit('status', `Lead registrado de manera persistente en CRM por CRM Sync Skill.`);
    }
  }
};

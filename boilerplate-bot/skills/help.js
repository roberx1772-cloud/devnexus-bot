/**
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
      console.log(`[Skill: Help] Desplegando catálogo de comandos para ${data.sender}`);
      
      const commands = `Comandos Disponibles:\n- ayuda: Despliega este menú.\n- hola: Saludo al bot.\n- [cualquier mensaje con email]: Guarda tu contacto en nuestro CRM.`;
      
      console.log(`[Skill: Help] Menú enviado:\n${commands}`);
      bot.emit('status', `Menú de ayuda despachado por Help Skill.`);
    }
  }
};

# DevNexus Boilerplate Automatización Modular 🚀 (VPS Ready)

Estructura de arquitectura modular y desacoplada para bots y scrapers construidos en **Node.js** con **Puppeteer**. 

## Arquitectura: Patrón Observer 🧩

Este boilerplate utiliza una clase `BotEventEmitter` que extiende el `EventEmitter` oficial de Node.js. 
- El **Núcleo (Core)** se encarga exclusivamente de la configuración, inicialización y cierre de Puppeteer.
- Los **Comportamientos (Skills)** se registran dinámicamente como observadores de eventos como `message_received` u `initialize_success`.
- **Escalabilidad Infinita**: Puedes añadir decenas de comandos o flujos sin alterar una sola línea de código en `BotEventEmitter.js` o `index.js`, simplemente creando un nuevo archivo de skill y registrándolo en la colección.

---

## Estructura de Directorios

```
/boilerplate-bot
├── index.js                  # Punto de entrada principal y orquestador
├── BotEventEmitter.js        # Clase core que empaqueta Puppeteer y el EventEmitter
├── package.json              # Dependencias de paquetes indispensables
├── README.md                 # Documentación técnica
└── skills/                   # Módulos/Skills de comportamiento desacoplados
    ├── welcome.js            # Lógica para responder a saludos amigables
    ├── help.js               # Menú descriptivo de comandos de ayuda
    └── crm.js                # Sincronización asíncrona de leads calificados con CRM
```

## Requisitos de Entorno

- **Node.js (v18+)**
- **Puppeteer**

## Ejecución Local

1. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

2. Ejecuta la simulación reactiva de eventos:
   ```bash
   npm start
   ```

---

## ¿Cómo agregar un nuevo comando o Skill?

Crear un nuevo comportamiento es extremadamente sencillo. Sigue estos dos pasos:

1. Crea un nuevo archivo en el directorio `./skills/`, por ejemplo: `skills/mi-comando.js` que exporte un objeto con el formato estándar:

   ```javascript
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
   ```

2. Regístralo en `index.js`:
   ```javascript
   import { miComandoSkill } from './skills/mi-comando.js';
   
   bot.registerSkill(miComandoSkill);
   ```

¡Listo! El bot escuchará el evento de forma totalmente reactiva sin interferir en los demás comandos.

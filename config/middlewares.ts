module.exports = [
  // Middleware de logger
  'strapi::logger',

  // Middleware de errores
  'strapi::errors',

  // Middleware de seguridad
  'strapi::security',

  // Middleware CORS
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://coffe-shop-ecommerce-730f8ykkz-jose-pablo-garcias-projects.vercel.app'],  // Reemplaza con el dominio de tu frontend
    },
  },

  // Middleware para cabecera "poweredBy"
  'strapi::poweredBy',

  // Middleware de query
  'strapi::query',

  // Middleware de cuerpo
  'strapi::body',

  // Middleware de sesión
  'strapi::session',

  // Middleware de favicon
  'strapi::favicon',

  // Middleware público
  'strapi::public',
];

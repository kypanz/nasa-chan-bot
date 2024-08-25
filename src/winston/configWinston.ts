import winston from 'winston';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
    image: 7 // Nivel personalizado para imágenes
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey',
    image: 'magenta' // Color para el nivel personalizado
  }
};


// Winston config
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({
      filename: 'logs/images.log',
      level: 'image'
    }),
  ],
});

export default logger;

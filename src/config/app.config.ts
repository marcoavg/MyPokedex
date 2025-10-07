
export const appConfig = () => ({   
    environment: process.env.NODE_ENV || 'dev',
    port: process.env.PORT ?? 3000,
    mongodb: process.env.MONGO_DB ?? 'mongodb://localhost:27017/nest-pokedex',
    defaultLimit: +process.env.DEFAULT_LIMIT! || 20,
});

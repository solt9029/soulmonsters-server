declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly FIREBASE_PROJECT_ID: string;
    readonly FIREBASE_PRIVATE_KEY: string;
    readonly FIREBASE_CLIENT_EMAIL: string;
    readonly FIREBASE_DATABASE_URL: string;
    readonly CORS_ORIGIN: string;
  }
}

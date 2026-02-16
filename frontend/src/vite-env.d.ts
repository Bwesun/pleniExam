/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENV: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_TOKEN_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_USER_KEY: string;
  readonly VITE_DEFAULT_EXAM_DURATION: string;
  readonly VITE_AUTO_SAVE_INTERVAL: string;
  readonly VITE_ITEMS_PER_PAGE: string;
  readonly VITE_ENABLE_DARK_MODE: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_ANALYTICS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

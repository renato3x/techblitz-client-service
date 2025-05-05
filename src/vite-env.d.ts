/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAIN_SERVER_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_ACCEPTED_IMAGE_EXTENSIONS: string;
  readonly VITE_STORAGE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

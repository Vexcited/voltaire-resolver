import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = packageJson.version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: packageJson.displayName ?? packageJson.name,
  version: `${major}.${minor}.${patch}.${label}`,
  description: packageJson.description,

  permissions: [
    "storage"
  ],

  action: {
    default_popup: "src/index.html",
    default_icon: "icons/34x34.png"
  },

  icons: {
    "128": "icons/128x128.png",
  },
  
  host_permissions: [
    "https://www.projet-voltaire.fr/*"
  ],
  content_scripts: [
    {
      matches: ["https://www.projet-voltaire.fr/voltaire/com.woonoz.gwt.woonoz.Voltaire/*"],
      js: ["src/utils/content_script.ts"],
      run_at: "document_start",
    },
  ],
  web_accessible_resources: [
    {
      resources: ["assets/*.js"],
      matches: ["*://*/*"],
    },
  ],
}));

export default manifest;
import fs from "node:fs"

const manifest = JSON.parse(fs.readFileSync("dist/manifest.json", "utf8"));

// Rename "action" to "browser_action"
manifest.browser_action = manifest.action;
delete manifest.action;

const resources = [];

for (const resource of manifest.web_accessible_resources) {
  resources.push(...resource.resources)
}

// Flat all the resources into one array.
manifest.web_accessible_resources = resources;

// Before, host_permissions was merged with permissions.
manifest.permissions = [
  ...manifest.permissions,
  ...manifest.host_permissions
];

delete manifest.host_permissions;

manifest.manifest_version = 2;

fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2), "utf8");

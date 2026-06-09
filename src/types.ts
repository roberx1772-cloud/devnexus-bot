// DevNexus Automation - Types definition
export interface AutomationPreset {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface SimulationStepLog {
  time: string;
  type: "info" | "success" | "warn" | "error";
  message: string;
}

export interface SimulatedScreen {
  title: string;
  subtitle: string;
  iconBg: string;
  description: string;
  badge: string;
}

export interface WebhookConfig {
  platform: "whatsapp" | "formspree" | "stripe" | "custom";
  crm: "pipedrive" | "hubspot" | "sql-db";
  verifyToken: string;
}

export interface QualifierConfig {
  agentPersona: string;
  fields: string[];
}

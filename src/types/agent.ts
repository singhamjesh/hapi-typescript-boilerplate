export interface AgentConfig {
  [key: string]: {
    url: string[];
  };
}

export interface UpdateParams {
  id: string;
}

export interface Agent {
  name: string;
  url: string;
}

export interface agentDetailsById {
  color: string;
  label: string;
  url: string;
  name: string;
}

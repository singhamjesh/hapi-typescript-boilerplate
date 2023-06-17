const v1 = `/v1`;
import health from './health';
import agent from './agent';
import organization from './organization';
import agentResponse from './agentResponse';

export default [
  {
    plugin: health,
    routes: {
      prefix: `${v1}/health`
    }
  },
  {
    plugin: agent,
    routes: {
      prefix: `${v1}/agent`
    }
  },
  {
    plugin: organization,
    routes: {
      prefix: `${v1}/organization`
    }
  },
  {
    plugin: agentResponse,
    routes: {
      prefix: `${v1}/agentResponse`
    }
  }
];

export interface Organization {
  profile: {
    name: string;
    logo: string;
    cover: string;
  };
  agents: [
    {
      agentId: string;
      name: string;
      url: string;
    }
  ];
  users: [
    {
      userId: string;
      userName: string;
      avatar: string;
      email: string;
    }
  ];
}

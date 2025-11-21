import gql from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    history: [Conversation]
    settings: Settings
  }

  type Conversation {
    id: ID!
    timestamp: String
    messages: [Message]
  }

  type Message {
    role: String
    content: String
  }

  type Settings {
    voice: String
    systemPrompt: String
  }
`;

import { gql } from "apollo-server";

export default gql`
  type Room {
    id: ID!
    host: User!
    hostId: String!
    url: String!
    title: String!
    password: String
    isLocked: Boolean!
    users: [User!]
    videos: [Video!]
    isLive: Boolean!
    messages: [Message!]
    watching: [User!]
    watchingCount: Int!
    isMine: Boolean
  }

  input VideoInput {
    url: String!
    title: String!
    type: Type
    thumbnail: String!
    channelTitle: String
  }
`;

import { gql } from "apollo-server";

export default gql`
  type Query {
    getMyRooms: [Room!]
    getLives: [Room!]
    searchRooms(term: String): [Room!]
  }
  type Mutation {
    createRoom(
      title: String!
      videos: [VideoInput!]
      url: String!
      isLocked: Boolean
      password: String
    ): Room!
    joinRoom(id: Int!, password: String): Boolean!
    startLive(id: Int!): Boolean!
    endLive(id: Int!): Boolean!
  }

  type Room {
    id: ID!
    host: User!
    url: String!
    title: String!
    password: String
    isLocked: Boolean!
    users: [User!]
    videos: [Video!]
    isLive: Boolean!
    # messages: [Message!]
  }

  input VideoInput {
    url: String!
    title: String!
    type: Type
    thumbnail: String!
  }
`;

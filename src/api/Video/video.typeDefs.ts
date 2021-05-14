import { gql } from "apollo-server";

export default gql`
  type Query {
    getMyVideos: [Video!]
  }

  type Video {
    id: ID!
    url: String!
    title: String!
    thumbnail: String!
    channelTitle: String
    type: Type!
    rooms: [Room!]
    createdAt: String!
  }

  enum Type {
    YOUTUBE
    NETFLIX
  }
`;

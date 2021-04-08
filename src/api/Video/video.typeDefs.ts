import { gql } from "apollo-server";

export default gql`
  type Query {
    getMyVideos: [Video!]
  }
  type Mutation {
    dum2: String
  }

  type Video {
    id: ID!
    url: String!
    title: String!
    thumbnail: String!
    type: Type!
    rooms: [Room!]
  }

  enum Type {
    YOUTUBE
    NETFLIX
  }
`;

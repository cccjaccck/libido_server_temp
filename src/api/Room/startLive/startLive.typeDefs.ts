import { gql } from "apollo-server";

export default gql`
  type Mutation {
    startLive(id: Int!): Boolean!
  }
`;

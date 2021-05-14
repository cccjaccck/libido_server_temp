import { gql } from "apollo-server";

export default gql`
  type Mutation {
    endLive(id: Int!): MutationResponse!
  }
`;

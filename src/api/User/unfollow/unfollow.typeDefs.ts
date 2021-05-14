import { gql } from "apollo-server";

export default gql`
  type Mutation {
    unfollow(id: String!): MutationResponse!
  }
`;

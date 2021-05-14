import { gql } from "apollo-server";

export default gql`
  type Mutation {
    requestChangePassword(email: String!): MutationResponse!
  }
`;

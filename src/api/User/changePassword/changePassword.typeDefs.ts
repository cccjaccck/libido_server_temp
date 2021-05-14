import { gql } from "apollo-server";

export default gql`
  type Mutation {
    changePassword(password: String!, confirm: String!): MutationResponse!
  }
`;

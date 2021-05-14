import { gql } from "apollo-server";

export default gql`
  type Mutation {
    sendMessage(hostId: String!, text: String!): MutationResponse!
  }
`;

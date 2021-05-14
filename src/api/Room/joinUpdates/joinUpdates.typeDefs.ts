import { gql } from "apollo-server";

export default gql`
  type Subscription {
    joinUpdates(hostId: String!): User
  }
`;

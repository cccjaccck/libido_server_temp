import { gql } from "apollo-server";

export default gql`
  type Subscription {
    exitUpdates(hostId: String!): User
  }
`;

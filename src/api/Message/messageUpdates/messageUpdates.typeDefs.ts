import { gql } from "apollo-server";

export default gql`
  type Subscription {
    messageUpdates(hostId: String!): Message
  }
`;

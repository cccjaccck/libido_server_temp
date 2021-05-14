import { gql } from "apollo-server";

export default gql`
  type Query {
    seeViewers(id: Int!): [User]
  }
`;

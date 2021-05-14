import { gql } from "apollo-server";

export default gql`
  type Query {
    getLives: [Room!]
  }
`;

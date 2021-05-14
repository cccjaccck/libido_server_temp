import { gql } from "apollo-server";

export default gql`
  type Mutation {
    joinRoom(id: Int!, password: String): MutationResponse!
  }
`;

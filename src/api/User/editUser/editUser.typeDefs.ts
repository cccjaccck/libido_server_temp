import { gql } from "apollo-server";

export default gql`
  type Mutation {
    editUser(username: String, password: String): MutationResponse!
  }
`;

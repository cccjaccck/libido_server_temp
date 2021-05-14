import { gql } from "apollo-server";

export default gql`
  type Mutation {
    uploadAvatar(file: Upload): MutationResponse!
  }
`;

import { gql } from "apollo-server";

export default gql`
  type Query {
    seeMe: User!
    getMyFriends: [User!]
    searchUsers(term: String): [User!]
  }
  type Mutation {
    createAccount(email: String!, username: String!, password: String!): User!
    login(email: String!, password: String!): String!
    follow(id: String!): Boolean!
    unfollow(id: String!): Boolean!
    changePassword(password: String!, confirm: String!): Boolean!
  }
  type User {
    id: ID!
    password: String!
    email: String!
    username: String!
    following: [User!]
    follower: [User!]
    avatar: String
    currentUsing: Boolean!
    # rooms: [Room]!
    # videos: [Video]!
    # messages: [Message]!
    # hosting: [Room]
  }
`;

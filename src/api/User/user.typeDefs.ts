import { gql } from "apollo-server";

export default gql`
  type User {
    id: ID!
    password: String!
    email: String!
    username: String!
    following: [User!]
    follower: [User!]
    avatar: String
    currentUsing: Boolean!
    rooms: [Room]!
    videos: [Video]!
    messages: [Message]!
    hosting: [Room]
    watching: Room
    isFollowing: Boolean!
    isMe: Boolean!
    viewCount: Int
    followingCount: Int
  }
`;

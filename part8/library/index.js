const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const Book = require("./models/Book.js");
const Author = require("./models/Author.js");
const User = require("./models/User.js");
const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB: ", error.message);
  });

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ) : Book
    editAuthor (name: String!, setBornTo: Int!) : Author
    createUser(
      username: String!
      favoriteGenre: String!
    ) : User
    login(
      username: String!
      password: String!
    ) : Token
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return [];
        }
        query = { author: author._id };
      }
      if (args.genre) {
        query = { ...query, genres: args.genre };
      }
      const filteredBooks = await Book.find(query).populate("author");
      return filteredBooks;
    },
    allAuthors: async () => {
      const newArray = await Author.find({});
      return newArray;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("User not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        const newAuthor = new Author({ name: args.author });
        author = await newAuthor.save().catch((error) => {
          throw new GraphQLError("The name length must be greater than 2", {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
            error,
          });
        });
      }
      const newBook = new Book({
        title: args.title,
        author: author._id,
        published: args.published,
        genres: args.genres,
      });
      console.log(newBook);
      const response = await newBook.save().catch((error) => {
        throw new GraphQLError(
          "The book's title length must be greater than 4",
          {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
            error,
          }
        );
      });
      return response.populate("author");
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("User not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      const response = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      );
      return response;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      const response = await user.save().catch((error) => {
        throw new GraphQLError("The User length must be greater than 3", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
      return response;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password != "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToken = { username: args.username, id: user._id };
      const token = jwt.sign(userForToken, process.env.JWT_SECRET);
      return { value: token };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const { buildSchema } = require('graphql');

const schema = buildSchema(`
type User {
    id: ID!
    username: String!
    email: String!
    remember_token: String
    password: String
    created_at: String
}

type AuthPayload {
    user: User!
}

type Category {
    id: ID!
    name: String!
    image: String!
    createdAt: String
    products: [Product!]
}

type Product {
    id: ID!
    name: String!
    image: String!
    originalPrice: Int!
    discountPrice: Int!
    createdAt: String
    category: Category!
    attributes: [ProductAttribute!]
}

type ProductAttribute {
    id: ID!
    key: String!
    value: String!
}

input ProductAttributeInput {
    key: String!
    value: String!
}

type Query {
    users: [User]
    currentUser: User 
    categories: [Category]
    category(id: ID): Category  
    products(filter: ProductFilterInput): [Product]
    product(id: ID): Product
}

input ProductFilterInput {
    discountedOnly: Boolean
    categoryId: ID
}

type Mutation {
    register(
        username: String!,
        email: String!,
        password: String!
    ): AuthPayload!

    login(
        email: String!,
        password: String!
    ): AuthPayload!



    createCategory(
        name: String!,
        image: String!
    ): Category!
    
    updateCategory(
        id: ID!,
        name: String,
        image: String
    ): Category!
    
    deleteCategory(
        id: ID!
    ): Category!



    createProduct(
        name: String!,
        image: String!,
        originalPrice: Int!,
        discountPrice: Int!,
        categoryId: Int!,
        attributes: [ProductAttributeInput!]!
    ): Product!

    updateProduct(
        id: ID!,
        name: String,
        image: String,
        originalPrice: Int,
        discountPrice: Int,
        categoryId: ID,
        attributes: [ProductAttributeInput!]
    ): Product!

    deleteProduct(
        id: ID!
    ): Product!
}
`);

module.exports = schema;
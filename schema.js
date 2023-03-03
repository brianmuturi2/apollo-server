const { gql } = require("apollo-server");

const typeDefs = gql`
    type Query {
        order(id: String!): Order
        orders(status: String): [Order]
    }

    type Order {
        id: ID!
        deliveryAddress: String!
        items: [ID]!
        total: Float!
        discountCode: String
        comment: String
        status: AllowedStatus
    }
    
    type Mutation {
        updateStatus(id: ID, status: AllowedStatus): Order
    }
    
    enum AllowedStatus {
        PENDING,
        PAID,
        IN_PROGRESS,
        IN_DELIVERY,
        DELIVERED
    }
`;

module.exports = typeDefs;

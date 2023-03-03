const db = require('./db')

const resolvers = {
    Query: {
        async orders(parent, args, contextValue, info) {
            try {
                let ordersList = await db.getOrders();
                if (args.status) {
                    ordersList = ordersList.filter((order) => order.status === args.status).map(order => (
                        {
                            ...order,
                            items: order.items.split(',')
                        }
                    ));
                    return ordersList;
                } else {
                    ordersList = ordersList.map(order => (
                        {
                            ...order,
                            items: order.items.split(',')
                        }
                    ));
                    return ordersList;
                }
            } catch (e) {
                return null
            }

        },
        async order(parent, args, contextValue, info) {
            try {
                const order = await db.getOrder(+args.id);
                return {
                    ...order,
                    items: order.items.split(',')
                }
            } catch (e) {
                return null
            }
        }
    },
    Mutation: {
        async updateStatus(parent, args, contextValue, info) {
            await db.updateOrderStatus(+args.id, args.status);
            const order = await db.getOrder(+args.id);
            return {
                ...order,
                items: order.items.split(',')
            }
        }
    }
}

module.exports = resolvers

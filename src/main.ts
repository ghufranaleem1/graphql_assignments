import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';


const typeDefs = `#graphql
type Address {
  addrNo: Int
  addrLine1: String
  addrLine2: String
  city: String
  postcode: String
  country: String
}

type Customer {
  custID: Int
  firstName: String
  lastName: String
  gender: String
  email: String
  landLine: String
  mobile: String
  address: Address
}

type Product {
  pId: Int
  description: String
  unitPrice: Float
  availableQty: Int
}

type CustomerOrder {
  ordID: Int
  dateOrdered: String
  orderedQty: Int
  customer: Customer
  product: Product
}

type Query {
  getCustomerByID(custID: Int): Customer
  getProductByID(pId: Int): Product
  getCustomerOrderByID(ordID: Int): CustomerOrder
  getCustomerOrdersByProductID(pId: Int): [CustomerOrder]
}
type Mutation {
  saveCustomerWithAddress(customer: CustomerInput!): Customer
  saveProduct(product: ProductInput!): Product
  saveCustomerOrder(customerOrder: CustomerOrderInput!): CustomerOrder
  updateProductAvailableQty(prodId: ID!, availableQty: Int!): Product
}

input CustomerInput {
  firstName: String!
  lastName: String!
  gender: String!
  email: String!
  landLine: String
  mobile: String
  address: AddressInput!
}

input AddressInput {
  addrNo: Int!
  addrLine1: String!
  addrLine2: String
  city: String!
  postcode: String!
  country: String!
}

input ProductInput {
  description: String!
  unitPrice: Float!
  availableQty: Int!
}

input CustomerOrderInput {
  dateOrdered: String!
  orderedQty: Int!
  customerID: ID!
  productID: ID!
}

`;

const addresses = [
  {
    addrNo: 1,
    addrLine1: '123 Main St',
    addrLine2: 'Apt 4B',
    city: 'New York',
    postcode: '10001',
    country: 'USA',
  },
  // Add more addresses if needed
];

const customers = [
  {
    custID: 1,
    firstName: 'John',
    lastName: 'Doe',
    gender: 'Male',
    email: 'john.doe@example.com',
    landLine: '123-456-7890',
    mobile: '987-654-3210',
    address: addresses[0],
  },
  // Add more customers if needed
];

const products = [
  {
    pId: 1,
    description: 'Product 1',
    unitPrice: 9.99,
    availableQty: 100,
  },
  // Add more products if needed
];

const customerOrders = [
  {
    ordID: 1,
    dateOrdered: '2023-10-26',
    orderedQty: 5,
    customer: customers[0],
    product: products[0],
  },
  // Add more customer orders if needed
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getCustomerByID: (parent, args, context, info) => {
      const { custID } = args;
      return customers.find((customer) => customer.custID === custID);
    },
    getProductByID: (parent, args, context, info) => {
      const { pId } = args;
      return products.find((product) => product.pId === pId);
    },
    getCustomerOrderByID: (parent, args, context, info) => {
      const { ordID } = args;
      return customerOrders.find((order) => order.ordID === ordID);
    },
    getCustomerOrdersByProductID: (parent, args, context, info) => {
      const { pId } = args;
      return customerOrders.filter((order) => order.product.pId === pId);
    }, 

  },
  Mutation: {
    saveCustomerWithAddress: (parent, args) => {
      const { customer } = args;
      // Generate a unique customer ID
    const custID = customers.length + 1;

    // Create a new customer with a generated ID
    const newCustomer = { ...customer, custID };

    // Save the address separately if it doesn't exist
    const { address } = customer;
    const addressIndex = addresses.findIndex((a) => a.addrNo === address.addrNo);

    if (addressIndex === -1) {
      addresses.push(address);
    }

    // Assign the address to the customer
    newCustomer.address = address;

    // Save the new customer
    customers.push(newCustomer);

    return newCustomer;
      // Implement logic to save the customer with an address and return the saved customer
      // You need to create and save the address separately if it doesn't exist in your data
    },
    saveProduct: (parent, args) => {
      const { product } = args;
  
      // Generate a unique product ID (You can use a library for this, e.g., uuid)
      const pId = products.length + 1;
  
      // Create a new product with a generated ID
      const newProduct = { ...product, pId };
  
      // Save the new product
      products.push(newProduct);
  
      return newProduct;
    },
    saveCustomerOrder: (parent, args) => {
      const { customerOrder } = args;
      const { customerID, productID, dateOrdered, orderedQty } = customerOrder;
  
      // Validation: Check if the customer and product exist
      const customer = customers.find((c) => c.custID == customerID);
      const product = products.find((p) => p.pId == productID);
  
      if (!customer) {
        throw new Error('Customer not found');
      }
  
      if (!product) {
        throw new Error('Product not found');
      }
  
      // Creating the Customer Order: Generate a unique order ID
      const ordID = customerOrders.length + 1;
  
      // Create a new Customer Order
      const newCustomerOrder = {
        ordID,
        dateOrdered,
        orderedQty,
        customer,
        product,
      };
  
      // Saving the Customer Order: Save the new Customer Order
      customerOrders.push(newCustomerOrder);
  
      return newCustomerOrder;
    },
    updateProductAvailableQty: (parent, args) => {
      const { prodId, availableQty } = args;
  
      // Find the product by its ID
      const product = products.find((p) => p.pId == prodId);
  
      if (!product) {
        throw new Error(`Product with ID ${prodId} not found`);
      }
  
      // Update the product's available quantity
      product.availableQty = availableQty;
  
      return product;
    },
    
  },

 
 
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
//const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
startStandaloneServer(server, { listen: { port: 4000 } })
  .then(({ url }) => {
    console.log(`Server started at ${url}`);
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
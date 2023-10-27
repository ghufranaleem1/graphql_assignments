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
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sample',
});

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
    /*getCustomerByID: (parent, args, context, info) => {
      const { custID } = args;
      return customers.find((customer) => customer.custID === custID);
    },*/
    /*getCustomerByID: (parent, args, context, info) => {
      const { custID } = args;
    
      // Use MySQL to fetch customer data by ID and return the promise
      return db.query( 'SELECT c.*, a.* FROM customers c ' +
      'LEFT JOIN addresses a ON c.addressNo = a.addrNo ' +
      'WHERE c.custID = ?',
      [custID])
        .then(([rows]) => {
          return rows[0]; // Assuming you expect a single customer
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
          throw error; // You can rethrow the error or handle it as needed
        });
    },*/
    getCustomerByID: (parent, args, context, info) => {
      const { custID } = args;
    
      // Use MySQL to fetch customer and address data by joining the "customers" and "addresses" tables
      return db.query(
        'SELECT c.*, a.* FROM customers c ' +
        'LEFT JOIN addresses a ON c.addressNo = a.addrNo ' +
        'WHERE c.custID = ?',
        [custID]
      )
        .then(([rows]) => {
          if (rows.length > 0) {
            const customerData = rows[0];
            const addressData = {
              addrNo: customerData.addrNo,
              addrLine1: customerData.addrLine1,
              addrLine2: customerData.addrLine2,
              city: customerData.city,
              postcode: customerData.postcode,
              country: customerData.country,
            };
    
            const result = {
              custID: customerData.custID,
              firstName: customerData.firstName,
              lastName: customerData.lastName,
              gender: customerData.gender,
              email: customerData.email,
              landLine: customerData.landLine,
              mobile: customerData.mobile,
              address: addressData,
            };
    
            return result;
          }
    
          // Handle cases where the customer with the specified custID is not found
          return null;
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
          throw error; // You can rethrow the error or handle it as needed
        });
    },
     
    
    /*getProductByID: (parent, args, context, info) => {
      const { pId } = args;
      return products.find((product) => product.pId === pId);
    },*/
    getProductByID: (parent, args, context, info) => {
      const { pId } = args;
    
      // Use MySQL to fetch a product by ID
      return db.query('SELECT * FROM products WHERE pId = ?', [pId])
        .then(([rows]) => {
          if (rows.length > 0) {
            return rows[0]; // Assuming you expect a single product
          } else {
            // Handle cases where the product with the specified pId is not found
            return null;
          }
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
          throw error; // You can rethrow the error or handle it as needed
        });
    },
    
    getCustomerOrderByID: (parent, args, context, info) => {
      const { ordID } = args;
    
      // Use MySQL to fetch a customer order by ID
      return db.query('SELECT * FROM customer_orders WHERE ordID = ?', [ordID])
        .then(([rows]) => {
          if (rows.length > 0) {
            return rows[0]; // Assuming you expect a single customer order
          } else {
            // Handle cases where the customer order with the specified ordID is not found
            return null;
          }
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
          throw error; // You can rethrow the error or handle it as needed
        });
    },
    
    getCustomerOrdersByProductID: async (parent, args) => {
      const { pId } = args;
    
      try {
        // Use MySQL to fetch customer orders by product ID with all fields and the customer's address
        const [rows] = await db.query('SELECT co.*, c.*, p.*, a.* ' +
          'FROM customer_orders co ' +
          'INNER JOIN customers c ON co.customerID = c.custID ' +
          'INNER JOIN products p ON co.productID = p.pId ' +
          'LEFT JOIN addresses a ON c.addressNo = a.addrNo ' +
          'WHERE p.pId = ?', [pId]
        );
    
        if (rows.length > 0) {
          // Map the rows to the customer order structure
          const customerOrders = rows.map((row) => ({
            ordID: row.ordID,
            dateOrdered: row.dateOrdered,
            orderedQty: row.orderedQty,
            customer: {
              custID: row.custID,
              firstName: row.firstName,
              lastName: row.lastName,
              gender: row.gender,
              email: row.email,
              landLine: row.landLine,
              mobile: row.mobile,
              address: {
                addrNo: row.addrNo,
                addrLine1: row.addrLine1,
                addrLine2: row.addrLine2,
                city: row.city,
                postcode: row.postcode,
                country: row.country,
              },
              // Add other customer fields here
            },
            product: {
              pId: row.pId,
              description: row.description,
              unitPrice: row.unitPrice,
              availableQty: row.availableQty,
              // Add other product fields here
            },
          }));
    
          return customerOrders;
        }
    
        // Handle cases where no customer orders are found for the specified product ID
        return [];
      } catch (error) {
        // Handle any database errors here
        console.error(error);
        throw error; // You can rethrow the error or handle it as needed
      }
    },
    
    

  },
  Mutation: {
    /*saveCustomerWithAddress: (parent, args) => {
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
    },*/
    saveCustomerWithAddress: async (parent, args) => {
      const { customer } = args;
    
      // Use MySQL to insert customer data
      const { address, ...customerData } = customer;
    
      try {
        // Insert the address into the addresses table
        const [addressResult] = await db.query('INSERT INTO addresses SET ?', address);
        const addressNo = addressResult.insertId;
    
        // Insert the customer data and associate it with the address
        const [customerResult] = await db.query('INSERT INTO customers SET ?', {
          ...customerData,
          addressNo: addressNo, // Associate the customer with the address
        });
    
        const custID = customerResult.insertId;
    
        return { ...customer, custID };
      } catch (error) {
        // Handle any database errors here
        console.error(error);
        throw error; // You can rethrow the error or handle it as needed
      }
    },
    
    saveProduct: async (parent, args) => {
      const { product } = args;
    
      try {
        // Use MySQL to insert the product data into the products table
        const [result] = await db.query('INSERT INTO products SET ?', product);
    
        const pId = result.insertId; // Retrieve the auto-generated product ID
    
        // Create a new product object with the generated ID
        const newProduct = { ...product, pId };
    
        // Add the new product to your in-memory array (if needed)
        products.push(newProduct);
    
        return newProduct;
      } catch (error) {
        // Handle any database errors here
        console.error(error);
        throw error; // You can rethrow the error or handle it as needed
      }
    },
    
    saveCustomerOrder: async (parent, args) => {
      const { customerOrder } = args;
      const { customerID, productID, dateOrdered, orderedQty } = customerOrder;
    
      try {
        // Validation: Check if the customer and product exist in the database
        const [customer] = await db.query('SELECT * FROM customers WHERE custID = ?', [customerID]);
        const [product] = await db.query('SELECT * FROM products WHERE pId = ?', [productID]);
    
        if (customer.length == 0) {
          throw new Error('Customer not found');
        }
    
        if (product.length == 0) {
          throw new Error('Product not found');
        }
    
        // Creating the Customer Order: Generate a unique order ID
        const [result] = await db.query('INSERT INTO customer_orders (customerID, productID, dateOrdered, orderedQty) VALUES (?, ?, ?, ?)', [customerID, productID, dateOrdered, orderedQty]);
        const ordID = result.insertId;
    
        // Retrieve the saved customer order from the database
        const [savedOrder] = await db.query('SELECT * FROM customer_orders WHERE ordID = ?', [ordID]);
    
        return savedOrder[0];
      } catch (error) {
        // Handle any database errors here
        console.error(error);
        throw error; // You can rethrow the error or handle it as needed
      }
    },
    
    updateProductAvailableQty: async (parent, args) => {
      const { prodId, availableQty } = args;
    
      try {
        // Use MySQL to update the product's available quantity in the database
        const [result] = await db.query('UPDATE products SET availableQty = ? WHERE pId = ?', [availableQty, prodId]);
    
        if (result.affectedRows == 0) {
          throw new Error(`Product with ID ${prodId} not found`);
        }
    
        // Fetch the updated product from the database
        const [updatedProduct] = await db.query('SELECT * FROM products WHERE pId = ?', [prodId]);
    
        if (updatedProduct.length == 0) {
          throw new Error(`Product with ID ${prodId} not found`);
        }
    
        return updatedProduct[0];
      } catch (error) {
        // Handle any database errors here
        console.error(error);
        throw error; // You can rethrow the error or handle it as needed
      }
    }
    
    
    
    
    
    
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
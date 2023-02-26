This repository contains the code for showing how to build the blogging service and how to implement contract test for the blogging service as a provider.

## The blogging service
The notification service will publish the message to a Solace broker topic if there's a new blog created.
## The provider contract test
The contract test is implemented using Pact and is stored in `tests/provider.pact.spec.js`. In this contract test file, the provider service (blogging service) will get the current contract expected by the consumer service from Pactflow. Then the provider service will check whether the current implementation at provider side meets the defined contracts from the consumer side or not.

## Prerequisites

- Set up a local [MongoDB database](https://www.mongodb.com/) in your workstation or using [Mongo Atlas (cloud version of MongoDB)](https://www.mongodb.com/atlas/database)
- Set up a Solace cluster using [Solace Pub-Sub cloud](https://solace.com/products/platform/cloud/)
- Set up a [Pactflow](https://pactflow.io/) project to apply contract test

## To run the blogging service

```bash
npm install
export MONGO_CONNECT_URL=your_mongodb_connection_url
export SOLACE_URL=your_solace_url
export SOLACE_USERNAME=your_solace_username
export SOLACE_VPN=your_solace_vpn
export SOLACE_PASS=your_solace_pass
```

## To run the provider test

```bash
export PACT_URL=your_pactflow_url
export PACT_TOKEN=your_pactflow_token
npm run test:pact
```
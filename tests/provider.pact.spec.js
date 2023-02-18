const path = require("path")
const { MessageProviderPact, providerWithMetadata } = require("@pact-foundation/pact")

// 1 Messaging integration client
  function createBlog() {
    return new Promise((resolve, reject) => {
      resolve({
        authorId: "3242424242",
        name: "A great blog",
      });
    });
  }

describe("Message provider tests", () => {
  // 2 Pact setup
  const p = new MessageProviderPact({
    messageProviders: {
      'a noti for a new blog post is created': providerWithMetadata(() => createBlog(),{
        topic: 'services/blogService'
      }),
    },
      stateHandlers: {
        'successfully integrate with Solace broker': () => {
          // TODO: prepare system useful in order to create a dog
          console.log('State handler: setting up "some state" for interaction');
          return Promise.resolve(`state to check integration`);
        },
      },
    provider: 'BlogService',
    // Your version numbers need to be unique for every different version of your provider
    // see https://docs.pact.io/getting_started/versioning_in_the_pact_broker/ for details.
    // If you use git tags, then you can use absolute-version as we do here.
    providerVersion: '0.0.1',
    // For local validation
    // pactUrls: [path.resolve(process.cwd(), "pacts", "myjsmessageconsumer-myjsmessageprovider.json")],
    // Broker validation
    pactBrokerUrl: 'https://vindr.pactflow.io',
    pactBrokerToken: 'filJUep_hevibOxzIpC1lw',
    // pactBrokerUsername:
    //   process.env.PACT_BROKER_USERNAME || 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
    // pactBrokerPassword:
    //   process.env.PACT_BROKER_PASSWORD || 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',
    providerVersionBranch: 'main',
    publishVerificationResult:true,

    // Find _all_ pacts that match the current provider branch
    consumerVersionSelectors: [
      {
        matchingBranch: true,
      },
    ],
  });

  // 3 Verify the interactions
  describe('test integration', () => {
    it('test format in solace', () => {
      return p.verify();
    });
  });
  })

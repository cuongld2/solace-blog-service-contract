const { MessageProviderPact, providerWithMetadata } = require("@pact-foundation/pact")

// 1 Messaging integration client
  function createBlog() {
    return new Promise((resolve, reject) => {
      resolve({
        firstName: "Danilo",
        lastName:"Enketia",
        name: "A great blog",
      });
    });
  }

describe("Message provider tests", () => {
  // 2 Pact setup
  const p = new MessageProviderPact({
    messageProviders: {
      'a noti for a new blog post is created': providerWithMetadata(() => createBlog(),{
        topic: 'service/blog/authorId/blogId/new'
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
    providerVersion: '0.0.1',
    pactBrokerUrl: process.env.PACT_URL,
    pactBrokerToken: process.env.PACT_TOKEN,
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

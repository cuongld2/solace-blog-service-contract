const request = require("supertest")
const baseURL = "http://localhost:3000/v1"

describe("Create new blog", () => {
    var blogId=""
    var userToken=""
    const newBlog = {
      title: "A new testing blog",
      content: "A GitHub Action to track and monitor the resource metrics of your GitHub Action workflow runs. If the run is triggered via a Pull Request, it will create a comment on the connected PR with the results and/or publishes the results to the job summary. The action collects the following metrics.",
      authorId: "631faeedce7d2f5fd7f42a75"
    }
    const authUser={
            email:"donald.le@iamondemand.com",
            password:"tatiana"
    }
    beforeAll(async () => {
      // Get user token
      const response = await request(baseURL).post("/auth").send(authUser);
      expect(response.statusCode).toBe(200);
      userToken=response.body.data.token
    })
    afterAll(async () => {
      const response = await request(baseURL).delete(`/posts/${blogId}`).set("Authorization","JWT " + userToken);
      expect(response.statusCode).toBe(200);
    })
    it("should return 200", async () => {
      const response = await request(baseURL).post("/posts/").set("Authorization","JWT "+userToken).send(newBlog);
      expect(response.statusCode).toBe(200);
      blogId=response.body.data._id;
    });
  });
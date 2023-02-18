const request = require("supertest")
const baseURL = "http://localhost:3000/v1"

describe("Authenticate user", () => {
    const authUser={
            email:"donald.le@iamondemand.com",
            password:"tatiana"
    }
    it("should return 200", async () => {
        const response = await request(baseURL).post("/auth").send(authUser);
        expect(response.statusCode).toBe(200);

        
    });
  });
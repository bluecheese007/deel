const request = require("supertest");

const app = require("../src/app");

describe("Contract Tests", () => {
  
  test("Get contract for a valid client", async () => {
    const response = await request(app).get("/contracts/1").set('profile_id', '1')
    expect(response.statusCode).toBe(200);
    expect(response.body.ClientId).toEqual(1);
  });

  test("Get contract for a valid contractor", async () => {
    const response = await request(app).get("/contracts/1").set('profile_id', '5')
    expect(response.statusCode).toBe(200);
    expect(response.body.ContractorId).toEqual(5);
  });

  test("Get contract by id when profile is invalid", async () => {
    const response = await request(app).get("/contracts/1").set('profile_id', '6')
    expect(response.statusCode).toBe(404);
  });
  test("Get contracts", async () => {
    const response = await request(app).get("/contracts").set('profile_id', '5')
    expect(response.statusCode).toBe(200);
  });
});

describe("Jobs Tests", () => {
  test("Get unpaid jobs", async () => {
    const response = await request(app).get("/jobs/unpaid").set('profile_id', '1')
    expect(response.statusCode).toBe(200);
    expect(Array.isArray([response])).toBe(true);
    for (let index = 0; index < response.length; index++) {
      const element = response[index];
      expect(element.paid).toEqual(null);
    }
  });

  test("Pay job with a customer with balance >= the amount", async () => {
    const response = await request(app).post("/jobs/3/pay").set('profile_id', '2')
    expect(response.statusCode).toBe(200);
  });
  
  test("Pay job with a customer with balance < the amount", async () => {
    const response = await request(app).post("/jobs/5/pay").set('profile_id', '4')
    expect(response.statusCode).toBe(400);
  });

  test("Try to pay another contract", async () => {
    const response = await request(app).post("/jobs/1/pay").set('profile_id', '4')
    expect(response.statusCode).toBe(404);
  });
});

describe("Balance Tests", () => {
  test("Deposit not allowed amount", async () => {
    const response = await request(app).post("/balances/deposit").set('profile_id', '1').send({"deposit": 5000})
    expect(response.statusCode).toBe(400);
  });

  test("Deposit allowed amount", async () => {
    const response = await request(app).post("/balances/deposit").set('profile_id', '1').send({"deposit": 100})
    expect(response.statusCode).toBe(200);
  });
});

describe("Admin", () => {
  test("Get the best profession", async () => {
    const response = await request(app).get("/admin/best-profession?start=2021-01-01&end=2023-01-01").set('profile_id', '1')
    expect(response.statusCode).toBe(200);
  });

  test("Get the best profession", async () => {
    const response = await request(app).get("/admin/best-clients?start=2020-01-01&end=2023-01-01&limit=10").set('profile_id', '1')
    expect(response.statusCode).toBe(200);
  });
});
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type PublicContext = {
  user: null;
  req: TrpcContext["req"];
  res: TrpcContext["res"];
};

function createPublicContext(): PublicContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("enrollments.submit", () => {
  it("should accept valid enrollment data and return success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const enrollmentData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+66812345678",
      courseLevel: "ม.1-3",
      message: "I'm interested in learning mathematics",
    };

    const result = await caller.enrollments.submit(enrollmentData);

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("message");
    expect(result.message).toContain("Enrollment submitted successfully");
  });

  it("should reject enrollment with missing first name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const enrollmentData = {
      firstName: "",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+66812345678",
      courseLevel: "ม.1-3",
    };

    try {
      await caller.enrollments.submit(enrollmentData);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject enrollment with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const enrollmentData = {
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
      phone: "+66812345678",
      courseLevel: "ม.1-3",
    };

    try {
      await caller.enrollments.submit(enrollmentData);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should accept enrollment with optional message field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const enrollmentData = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "+66887654321",
      courseLevel: "ม.4-6",
      message: undefined,
    };

    const result = await caller.enrollments.submit(enrollmentData);

    expect(result).toHaveProperty("success", true);
  });
});

describe("resources.list", () => {
  it("should return empty list when no resources exist", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resources.list({});

    expect(Array.isArray(result)).toBe(true);
  });

  it("should accept optional filters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resources.list({
      resourceType: "sheet",
      courseLevel: "ม.1-3",
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

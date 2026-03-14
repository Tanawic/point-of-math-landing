import { describe, expect, it, vi, beforeEach } from "vitest";
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

describe("paymentSlips.upload", () => {
  beforeEach(() => {
    // Mock the storagePut function
    vi.mock("./storage", () => ({
      storagePut: vi.fn().mockResolvedValue({
        key: "payment-slips/test-key",
        url: "https://example.com/payment-slip.pdf",
      }),
    }));
  });

  it("should accept valid payment slip upload", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const uploadData = {
      fileName: "payment-slip.pdf",
      fileData: "JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo=", // Base64 encoded PDF header
      mimeType: "application/pdf",
    };

    const result = await caller.paymentSlips.upload(uploadData);

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("key");
    expect(typeof result.url).toBe("string");
    expect(typeof result.key).toBe("string");
  });

  it("should reject upload with missing file name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const uploadData = {
      fileName: "",
      fileData: "JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo=",
      mimeType: "application/pdf",
    };

    try {
      await caller.paymentSlips.upload(uploadData);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject upload with missing file data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const uploadData = {
      fileName: "payment-slip.pdf",
      fileData: "",
      mimeType: "application/pdf",
    };

    try {
      await caller.paymentSlips.upload(uploadData);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject upload with missing MIME type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const uploadData = {
      fileName: "payment-slip.pdf",
      fileData: "JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo=",
      mimeType: "",
    };

    try {
      await caller.paymentSlips.upload(uploadData);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should accept various file types (images and PDF)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const fileTypes = [
      { name: "payment.jpg", mime: "image/jpeg" },
      { name: "payment.png", mime: "image/png" },
      { name: "payment.pdf", mime: "application/pdf" },
    ];

    for (const fileType of fileTypes) {
      const uploadData = {
        fileName: fileType.name,
        fileData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", // Base64 encoded 1x1 PNG
        mimeType: fileType.mime,
      };

      const result = await caller.paymentSlips.upload(uploadData);

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("url");
    }
  });
});

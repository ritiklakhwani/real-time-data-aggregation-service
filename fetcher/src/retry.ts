export async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      const waitMs = Math.pow(2, attempt) * 1000;
      console.warn(`attempt ${attempt} failed, retrying in ${waitMs}ms`);
      await new Promise((res) => setTimeout(res, waitMs));
    }
  }
  throw new Error("all retries failed");
}
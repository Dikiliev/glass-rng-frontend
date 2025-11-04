export interface HistoryEntry {
  id: number;
  result: number;
  timestamp: string;
  blockHashes: string[];
  concatenated: string;
  noise: string;
}

export const mockHistory: HistoryEntry[] = [
  {
    id: 1,
    result: 7,
    timestamp: "2025-11-03 14:52:18 UTC",
    blockHashes: [
      "5hVfxQ2w8kLmpTyzR9v7jKm4nX7dwX2d",
      "8kLmQ2xpTyzR9w7jK4mvBnX7hVfd2wX",
      "3nTyR9wzR9w7jK4mvBnX7hVfxQ2d8kL",
      "7vBnjK4mX7hVfxQ2w8kLmpTyzR9wd2X",
    ],
    concatenated: "5hVfxQ2w8kLmpTyzR9v7jKm4nX7dwX2d8kLmQ2xpTyzR9w7jK4mvBnX7hVfd2wX3nTyR9wzR9w7jK4mvBnX7hVfxQ2d8kL7vBnjK4mX7hVfxQ2w8kLmpTyzR9wd2X",
    noise: "a3f8c9e2d1b4f7e6c5a8b2d9f3e1c7b4",
  },
  {
    id: 2,
    result: 3,
    timestamp: "2025-11-03 14:52:10 UTC",
    blockHashes: [
      "9mXy2pLkR8qTvW5nJ7hB3xC6zF4sA1d",
      "4sA1dzF6xC3hB7nJ5vW8qTpR2kLmXy9",
      "8qTpR2kLmXy9sA1dzF6xC3hB7nJ5vW",
      "5vW8qTpR2kLmXy9sA1dzF6xC3hB7nJ",
    ],
    concatenated: "9mXy2pLkR8qTvW5nJ7hB3xC6zF4sA1d4sA1dzF6xC3hB7nJ5vW8qTpR2kLmXy98qTpR2kLmXy9sA1dzF6xC3hB7nJ5vW5vW8qTpR2kLmXy9sA1dzF6xC3hB7nJ",
    noise: "b7e4f2c9d6a1e8f3c5b2d7f9e1c4a6b",
  },
  {
    id: 3,
    result: 9,
    timestamp: "2025-11-03 14:52:02 UTC",
    blockHashes: [
      "2kNpQ7mLx4wR9vT8hJ5bC3zF6sD1yE",
      "6sD1yEzF3bC5hJ8vT9wR4mLx7kNpQ2",
      "9wR4mLx7kNpQ2sD1yEzF3bC5hJ8vT",
      "8vT9wR4mLx7kNpQ2sD1yEzF3bC5hJ",
    ],
    concatenated: "2kNpQ7mLx4wR9vT8hJ5bC3zF6sD1yE6sD1yEzF3bC5hJ8vT9wR4mLx7kNpQ29wR4mLx7kNpQ2sD1yEzF3bC5hJ8vT8vT9wR4mLx7kNpQ2sD1yEzF3bC5hJ",
    noise: "c4e9f1d7b2a6e3f8c9d1b5e7f2a4c6b",
  },
  {
    id: 4,
    result: 1,
    timestamp: "2025-11-03 14:51:54 UTC",
    blockHashes: [
      "7pRwQ3nLm8xT5vJ9hC2bF6zK4sA1yD",
      "4sA1yDzK6bF2hC9vJ5xT8nLm3pRwQ7",
      "5xT8nLm3pRwQ7sA1yDzK6bF2hC9vJ",
      "9vJ5xT8nLm3pRwQ7sA1yDzK6bF2hC",
    ],
    concatenated: "7pRwQ3nLm8xT5vJ9hC2bF6zK4sA1yD4sA1yDzK6bF2hC9vJ5xT8nLm3pRwQ75xT8nLm3pRwQ7sA1yDzK6bF2hC9vJ9vJ5xT8nLm3pRwQ7sA1yDzK6bF2hC",
    noise: "d9f3e6c2b8a4f1e7c5d2b9f6e3a7c1b",
  },
  {
    id: 5,
    result: 5,
    timestamp: "2025-11-03 14:51:46 UTC",
    blockHashes: [
      "3mYqN8kLp5wT7vR9hB4xJ2zC6fD1sE",
      "6fD1sEzC2xJ4hB9vR7wT5kLp8mYqN3",
      "7wT5kLp8mYqN3fD1sEzC2xJ4hB9vR",
      "9vR7wT5kLp8mYqN3fD1sEzC2xJ4hB",
    ],
    concatenated: "3mYqN8kLp5wT7vR9hB4xJ2zC6fD1sE6fD1sEzC2xJ4hB9vR7wT5kLp8mYqN37wT5kLp8mYqN3fD1sEzC2xJ4hB9vR9vR7wT5kLp8mYqN3fD1sEzC2xJ4hB",
    noise: "e2f8c4b9a7d3f6e1c8b5d2f9e4a6c3b",
  },
];

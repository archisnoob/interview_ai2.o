export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  starterCode: { [key: string]: string };
  acceptanceRate: number;
  followUp?: string;
}

export const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array, Hash Table",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`
    },
    acceptanceRate: 89.2,
    followUp: "Can you come up with an algorithm that is less than O(n²) time complexity?"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List, Math",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      },
      {
        input: "l1 = [0], l2 = [0]",
        output: "[0]"
      },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
        explanation: "9999999 + 9999 = 10009998."
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    // Your code here
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # Your code here
        pass`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Your code here
        return null;
    }
}`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Your code here
        return nullptr;
    }
};`
    },
    acceptanceRate: 76.8,
    followUp: "What if the digits are stored in forward order?"
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String, Sliding Window",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is 'abc', with the length of 3."
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: "The answer is 'b', with the length of 1."
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // Your code here
};`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Your code here
        pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Your code here
        return 0;
    }
};`
    },
    acceptanceRate: 65.4
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array, Binary Search, Divide and Conquer",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      }
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // Your code here
};`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # Your code here
        pass`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Your code here
        return 0.0;
    }
}`,
      cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Your code here
        return 0.0;
    }
};`
    },
    acceptanceRate: 42.1
  },
  {
    id: 5,
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward.\n\nFor example, 121 is a palindrome while 123 is not.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome."
      }
    ],
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ],
    starterCode: {
      javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    // Your code here
};`,
      python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Your code here
        pass`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Your code here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(int x) {
        // Your code here
        return false;
    }
};`
    },
    acceptanceRate: 82.1,
    followUp: "Could you solve it without converting the integer to a string?"
  },
  {
    id: 6,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String, Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
    examples: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "()[]{}"',
        output: "true"
      },
      {
        input: 's = "(]"',
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Your code here
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Your code here
        pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your code here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Your code here
        return false;
    }
};`
    },
    acceptanceRate: 78.3
  },
  {
    id: 7,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List, Recursion",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50]",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order"
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    // Your code here
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        # Your code here
        pass`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your code here
        return null;
    }
}`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Your code here
        return nullptr;
    }
};`
    },
    acceptanceRate: 74.5
  },
  {
    id: 8,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array, Divide and Conquer, Dynamic Programming",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    // Your code here
};`,
      python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        # Your code here
        pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Your code here
        return 0;
    }
};`
    },
    acceptanceRate: 68.2
  },
  {
    id: 9,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Math, Dynamic Programming, Memoization",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways to climb to the top. 1. 1 step + 1 step 2. 2 steps"
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways to climb to the top. 1. 1 step + 1 step + 1 step 2. 1 step + 2 steps 3. 2 steps + 1 step"
      }
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    // Your code here
};`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Your code here
        pass`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Your code here
        return 0;
    }
};`
    },
    acceptanceRate: 85.7
  },
  {
    id: 10,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array, Dynamic Programming",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      }
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // Your code here
};`,
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        # Your code here
        pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Your code here
        return 0;
    }
};`
    },
    acceptanceRate: 79.4
  }
];

// Generate 90 more random problems with better variety
for (let i = 11; i <= 100; i++) {
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
  const categories = [
    'Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming',
    'Backtracking', 'Greedy', 'Binary Search', 'Two Pointers', 'Stack', 'Queue',
    'Heap', 'Hash Table', 'Math', 'Sort', 'Recursion', 'Design', 'Bit Manipulation',
    'Sliding Window', 'Monotonic Stack', 'Union Find', 'Trie', 'Segment Tree'
  ];
  
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Generate more realistic problem titles
  const problemTitles = [
    'Reverse String', 'Valid Anagram', 'First Unique Character', 'Move Zeroes',
    'Rotate Array', 'Contains Duplicate', 'Single Number', 'Intersection of Arrays',
    'Plus One', 'Valid Sudoku', 'Rotate Image', 'Spiral Matrix', 'Set Matrix Zeroes',
    'Word Pattern', 'Valid Parentheses', 'Generate Parentheses', 'Simplify Path',
    'Longest Common Prefix', 'Group Anagrams', 'Valid Palindrome', 'Implement strStr',
    'Count and Say', 'String to Integer', 'ZigZag Conversion', 'Add Binary',
    'Multiply Strings', 'Simplify Path', 'Basic Calculator', 'Valid Number',
    'Text Justification', 'Word Break', 'Word Break II', 'Implement Trie',
    'Add and Search Word', 'Word Search', 'Word Search II', 'Palindrome Partitioning',
    'Restore IP Addresses', 'Surrounded Regions', 'Clone Graph', 'Course Schedule',
    'Course Schedule II', 'Redundant Connection', 'Number of Islands', 'Surrounded Regions',
    'Walls and Gates', 'Clone Graph', 'Pacific Atlantic Water Flow', 'Number of Islands II',
    'Graph Valid Tree', 'Reconstruct Itinerary', 'Min Cost to Connect All Points',
    'Network Delay Time', 'Find Critical and Pseudo-Critical Edges', 'Swim in Rising Water'
  ];
  
  const title = problemTitles[Math.floor(Math.random() * problemTitles.length)] || `Problem ${i}`;
  
  const problem: Problem = {
    id: i,
    title,
    difficulty,
    category,
    description: `This is a ${difficulty.toLowerCase()} level problem about ${category.toLowerCase()}. Solve it efficiently using appropriate algorithms and data structures.`,
    examples: [
      {
        input: `input = [1, 2, 3, 4, 5]`,
        output: `[5, 4, 3, 2, 1]`,
        explanation: `Example explanation for ${title}`
      }
    ],
    constraints: [
      `1 <= n <= 10^5`,
      `-10^9 <= values <= 10^9`,
      `Time complexity should be optimal`,
      `Space complexity should be considered`
    ],
    starterCode: {
      javascript: `/**
 * @param {any} input
 * @return {any}
 */
function solution(input) {
    // Your code here
    return input;
}`,
      python: `class Solution:
    def solution(self, input):
        # Your code here
        return input`,
      java: `class Solution {
    public static Object solution(Object input) {
        // Your code here
        return input;
    }
}`,
      cpp: `class Solution {
public:
    auto solution(auto input) {
        // Your code here
        return input;
    }
};`
    },
    acceptanceRate: Math.floor(Math.random() * 60) + 30 // Random between 30-90%
  };
  
  PROBLEMS.push(problem);
}

export const getRandomProblems = (count: number = 3): Problem[] => {
  const shuffled = [...PROBLEMS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getProblemById = (id: number): Problem | undefined => {
  return PROBLEMS.find(problem => problem.id === id);
};

# Draft Title: The Interview-Ready DSA Playbook

## Preface
This manuscript is written one page at a time, daily.

---

# Page 1 — Why DSA Still Matters

Most people don’t fail coding interviews because they are not smart. They fail because they cannot turn intuition into structure under pressure.

DSA is the structure.

Data structures help you model information in a way your code can reason about quickly. Algorithms help you transform that information efficiently. Together, they turn “I think this might work” into “I can prove this works.”

If your goal is to pass interviews, think of DSA as two layers:
1. **Pattern recognition** — identify what kind of problem this is.
2. **Execution quality** — implement clearly, test edge cases, and communicate trade-offs.

A lot of people overfocus on memorizing tricks. That works short-term, but collapses fast when the question changes shape. A better approach is to master first principles: constraints, invariants, and complexity.

In this book, we’ll train for real interview performance: practical patterns, clear thinking, and repeatable execution.

---

# Page 2 — The 5-Step Interview Problem-Solving Loop

When an interviewer gives you a problem, your first job is not coding. Your first job is reducing ambiguity fast.

Use this loop every time:

1. **Clarify the target**
2. **Map constraints and examples**
3. **Choose a strategy with trade-offs**
4. **Implement in small verified chunks**
5. **Test like an adversary**

This sounds simple, but this is the difference between “decent coder” and “hire.”

Start with clarifying questions that change implementation decisions:
- Input size range? (drives complexity budget)
- Are values unique?
- Can input be empty/null?
- Is in-place modification allowed?
- What should happen on invalid input?

Then restate the problem in one sentence. Example: “So we need the first index pair whose values sum to target, in O(n) preferred.” That gives the interviewer confidence you’re aligned.

Next, anchor with examples. Always include:
- a normal case
- a boundary case
- a weird case (duplicates, negatives, empty)

Now pick strategy explicitly. Don’t jump straight to the best-known approach without showing judgment. Walk from brute force to optimized:
- Brute force: easy to verify, often O(n²)
- Optimized: extra space for speed, often O(n)

In interviews, saying this out loud matters: “I’ll start with a hash map to trade O(n) space for O(n) time.” That is senior-level signal.

During implementation, code in checkpoints:
- function signature
- core data structure initialization
- main loop + invariant comment
- return behavior

Example invariant comment:
`# seen maps value -> index for all elements before i`

Invariants reduce bugs because they keep your reasoning local. If you get stuck, re-read the invariant and current index state.

Finally, test with intent. Don’t say “looks good.” Prove it:
- smallest valid input
- no-solution input
- duplicate values
- negative numbers if arithmetic is involved
- off-by-one boundaries

A practical interview script you can memorize:
1. “Let me confirm constraints.”
2. “I’ll outline brute force first.”
3. “Now I’ll optimize with X because Y.”
4. “I’ll code and narrate invariants.”
5. “I’ll run edge cases before finalizing.”

If you build this loop into muscle memory, most DSA questions become pattern execution, not panic management.

---

# Page 3 — Hash Maps Under Pressure: The Two Sum Template

If Page 2 gave you the interview loop, this page gives you your first high-frequency weapon: the hash map lookup pattern.

Use this when a problem sounds like:
- “find pair”
- “check if seen before”
- “first non-repeating”
- “count frequencies fast”

The core trade-off is simple: spend memory to save time.

## Interview Case: Two Sum

Problem (typical): given `nums` and `target`, return indices of two numbers that add up to `target`.

### Step 1: State brute force first
“Try every pair `(i, j)` with `i < j` and check sum.”
- Time: `O(n^2)`
- Space: `O(1)`

This earns points because you show baseline correctness before optimizing.

### Step 2: Optimize with a hash map
Keep a map from `value -> index` for elements already visited.
At each `i`, compute `need = target - nums[i]`.
- If `need` is in map, you found the answer.
- Otherwise store current value and continue.

Time becomes `O(n)` average, space `O(n)`.

### Step 3: Narrate the invariant
Use this sentence while coding:

`seen contains values from indices [0..i-1], mapped to their indices.`

That one line prevents most logic bugs.

### Python implementation

```python
def two_sum(nums, target):
    seen = {}  # value -> index

    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i

    return [-1, -1]  # or raise, depending on spec
```

## Edge cases interviewers actually use

1. **Duplicate values**: `nums = [3,3], target = 6`  
   Works because you check `need` before overwriting.

2. **No solution**: clarify expected output early (`None`? `[-1,-1]`? exception?).

3. **Multiple solutions**: confirm whether any pair is valid or specific pair required.

4. **Negative values**: no change needed; map logic is sign-agnostic.

## Reusable pattern checklist

When you hear “find quickly while scanning once,” ask:
1. What do I need to remember from the past? (value, count, index, position)
2. Can I key it in a hash map?
3. What is the lookup expression? (`need = target - x`, etc.)
4. Should I check before insert, or insert before check?

Memorize this pattern once, then reuse it across dozens of questions. In interviews, that’s how you turn random-looking prompts into familiar execution.

---


# Page 4 — Two Pointers: The Fastest Win on Sorted Data

After hash maps, the next interview pattern you should internalize is **two pointers**. It shows up constantly because it converts many `O(n²)` pair scans into `O(n)` passes.

Use it when:
- the input is already sorted, or
- you can sort first and still satisfy the problem, and
- you need pairs/ranges that meet a condition.

## Interview Case: Valid Pair Sum in Sorted Array

Problem: given a sorted array `nums` and target `k`, determine if any pair sums to `k`.

### 1) Baseline first
State brute force quickly:
- try all `(i, j)` pairs
- `O(n²)` time, `O(1)` space

Then upgrade:
- pointer `l` at start, `r` at end
- compute `s = nums[l] + nums[r]`
- if `s == k`, done
- if `s < k`, move `l += 1` (need a bigger sum)
- if `s > k`, move `r -= 1` (need a smaller sum)

That is `O(n)` time, `O(1)` space.

### 2) Narrate the invariant
Say this while coding:

> “All pairs outside `[l, r]` are already eliminated by sorted-order logic.”

That sentence signals algorithmic control, not memorization.

### Python template

```python
def has_pair_sum_sorted(nums, k):
    l, r = 0, len(nums) - 1

    while l < r:
        s = nums[l] + nums[r]
        if s == k:
            return True
        if s < k:
            l += 1
        else:
            r -= 1

    return False
```

## Common interview traps

1. **Array not sorted**
   - Ask if sorting is allowed.
   - If yes: `O(n log n)` due to sort, then pointer scan.
   - If original indices are required, prefer hash map pattern from previous page.

2. **Duplicates**
   - Decide if duplicates are allowed in result.
   - In “unique pairs” variants, skip repeated values after finding a pair.

3. **Off-by-one errors**
   - Loop must be `while l < r`, not `<=`.

4. **Integer overflow (Java/C++)**
   - Use safer comparisons or wider numeric type when needed.

## Pattern extension map

Once this core is stable, you can branch to:
- **3Sum**: sort + fix one index + inner two pointers
- **Container With Most Water**: pointers + greedy move rule
- **Remove Duplicates from Sorted Array**: fast/slow pointers
- **Sliding window hybrids** on monotonic constraints

Interview takeaway: when data has order, exploit it. Two pointers is often the cleanest way to prove correctness and keep implementation simple under pressure.

---


# Page 5 — Sliding Window: Turn Nested Loops into One Pass

Sliding window is what interviewers reach for when they want to test whether you can control a moving range without recomputing everything. If you still brute-force every subarray/substring, you’ll burn time and likely miss the optimal complexity.

Use this pattern when the prompt says things like:
- “longest/shortest subarray or substring…”
- “…with at most / at least / exactly K …”
- “continuous segment”

The mindset: maintain a valid window `[l..r]` while expanding `r`, and shrink `l` only when constraints are violated.

## Interview Case: Longest Substring Without Repeating Characters

Given a string `s`, return the length of the longest substring with all unique characters.

### 1) Baseline first (quickly)
Brute force all substrings and test uniqueness with a set.
- Time: `O(n^3)` naive, `O(n^2)` with better checks
- Space: depends on check method

Then upgrade immediately.

### 2) One-pass window with last-seen index
Track each character’s most recent index in a hash map.
For each `r`:
- if `s[r]` was seen inside current window, jump `l` right past that index
- update last-seen index
- update best length

### 3) Invariant you should narrate

> “Window `[l..r]` always has unique characters.”

That single line keeps your logic honest and helps the interviewer follow your state transitions.

```python
def length_of_longest_substring(s: str) -> int:
    last = {}      # char -> most recent index
    l = 0
    best = 0

    for r, ch in enumerate(s):
        if ch in last and last[ch] >= l:
            l = last[ch] + 1

        last[ch] = r
        best = max(best, r - l + 1)

    return best
```

Complexity:
- Time: `O(n)` (each pointer moves forward only)
- Space: `O(min(n, alphabet))`

## High-frequency mistakes (and how to avoid them)

1. **Moving `l` backward by accident**
   Always use `if last[ch] >= l` before updating `l`.

2. **Using while-loop shrink when a jump works better**
   For “last seen index” problems, jump directly; don’t remove one char at a time.

3. **Forgetting to update answer after window change**
   Compute `best` every iteration after maintaining validity.

## Reusable interview script

1. “This is a contiguous segment optimization, so I’ll use sliding window.”
2. “I’ll maintain a validity condition and adjust left pointer only when broken.”
3. “Invariant: current window always satisfies constraint.”
4. “Complexity is linear because pointers never move backward.”

If you can spot sliding window fast, you’ll unlock a big chunk of medium-level interview questions with clean, confident code.

---

---

# Page 6 — Prefix Sum + Hash Map: Count Subarrays in Linear Time

Sliding window is great when the constraint is monotonic (you can move left pointer to restore validity). But some problems break that assumption — especially with negative numbers. That’s where prefix sum + hash map becomes your go-to pattern.

Use it when the prompt says:
- “number of subarrays with sum = K”
- “longest subarray with target sum”
- “sum between indices quickly”

## Interview Case: Subarray Sum Equals K

Given an integer array `nums` (can include negatives) and integer `k`, return the **count** of continuous subarrays whose sum is exactly `k`.

### 1) Baseline you can say in 10 seconds
Check every start/end pair and compute sums.
- Time: `O(n^2)` with rolling sum, `O(n^3)` naive
- Space: `O(1)`

Then upgrade.

### 2) Prefix-sum insight
Let `prefix[i]` be sum of first `i` elements.
For current running sum `s`, any earlier prefix `s - k` means the subarray between them sums to `k`.

So while scanning once:
- maintain `s` (running prefix sum)
- maintain frequency map `freq[prefix_sum] -> count`
- add `freq[s - k]` to answer
- increment `freq[s]`

Initialize `freq[0] = 1` so subarrays starting at index 0 are counted.

```python
def subarray_sum(nums: list[int], k: int) -> int:
    freq = {0: 1}
    s = 0
    count = 0

    for x in nums:
        s += x
        count += freq.get(s - k, 0)
        freq[s] = freq.get(s, 0) + 1

    return count
```

Complexity:
- Time: `O(n)`
- Space: `O(n)` in worst case

## Why sliding window fails here

With negatives, expanding the window can decrease the sum, and shrinking can increase it. You lose the monotonic behavior sliding window relies on. Prefix sums don’t care about that — they track exact arithmetic differences.

## Mistakes interviewers see constantly

1. **Forgetting `freq[0] = 1`**  
   This misses valid subarrays that begin at index 0.

2. **Updating `freq[s]` before using `s - k`**  
   That can incorrectly count zero-length/self matches in related variants.

3. **Using set instead of frequency map**  
   You need counts, not just existence, because multiple earlier prefixes can match.

## Reusable interview script

1. “Brute force is all subarrays in `O(n^2)`.”
2. “Because we need exact subarray sums (including negatives), I’ll use prefix sums.”
3. “Invariant: `freq` stores counts of prefix sums seen before current index.”
4. “At each step, matches are exactly `freq[current_sum - k]`.”

This pattern appears everywhere. Master it once, and a whole family of ‘subarray sum’ questions becomes mechanical.

# Page 7 — Monotonic Stack: Solve “Next Greater” Once, Reuse Forever

If prefix-sum problems train arithmetic thinking, monotonic stack problems train **ordering under pressure**. Interviewers love this pattern because many brute-force `O(n²)` scans collapse to `O(n)` when you keep a stack in sorted order.

Use a monotonic stack when you hear:
- “next greater/smaller element”
- “days until warmer temperature”
- “span/range until condition breaks”
- “for each index, find nearest index on left/right with property X”

## Interview Case: Daily Temperatures

Given `temps`, return array `ans` where `ans[i]` is how many days until a warmer temperature. If none, `0`.

### 1) Baseline first
For each day `i`, scan right until you find `temps[j] > temps[i]`.
- Time: `O(n²)`
- Space: `O(1)` (excluding output)

### 2) Monotonic stack idea
Keep a stack of indices whose answers are not resolved yet. Maintain stack so temperatures are **decreasing** from bottom to top.

While current temperature `t` is greater than stack-top temperature, pop index `idx`; now you found its next warmer day at `i`, so `ans[idx] = i - idx`.

Then push `i`.

```python
def daily_temperatures(temps: list[int]) -> list[int]:
    n = len(temps)
    ans = [0] * n
    st = []  # indices, temps[st] is decreasing

    for i, t in enumerate(temps):
        while st and temps[st[-1]] < t:
            idx = st.pop()
            ans[idx] = i - idx
        st.append(i)

    return ans
```

Complexity:
- Time: `O(n)` because each index is pushed once, popped once
- Space: `O(n)` stack in worst case

## Invariant to narrate out loud

> “Stack stores unresolved indices in decreasing temperature order. If current temp is warmer than top, it resolves top immediately.”

That sentence shows you understand *why* it’s linear, not just *that* it is.

## Common mistakes

1. **Storing values instead of indices**
   You need indices to compute distance (`i - idx`).

2. **Using `<=` instead of `<` without thinking**
   Problem says “warmer,” so equal temperature does not resolve.

3. **Forgetting unanswered entries default to 0**
   Leftover stack indices naturally stay 0.

## Pattern extension

Same structure solves:
- Next Greater Element
- Stock Span (with slight direction tweak)
- Largest Rectangle in Histogram (variant with sentinel handling)

Interview move: after coding, explicitly say, “I used a monotonic decreasing stack of unresolved indices; each element is processed at most twice.” That’s concise, correct, and sounds senior.

# Page 8 — Binary Search on Answer: Optimize Without Scanning Every Possibility

A lot of interview problems don’t ask you to find an element — they ask you to find the **smallest/largest feasible value**. That’s your cue for binary search on answer.

Use this pattern when:
- the answer is numeric (time, capacity, speed, threshold)
- you can write a `feasible(x)` check
- feasibility is monotonic (if `x` works, all larger/smaller values also work)

If you miss monotonicity, you’ll brute-force and time out.

## Interview Case: Koko Eating Bananas

Classic prompt: piles of bananas, `h` hours, choose minimum eating speed `k` so all bananas are finished in time.

### 1) Baseline reasoning
Brute force tries every speed from 1 to `max(piles)`, running a full check each time.
- Time: `O(max(piles) * n)`
- Too slow when pile sizes are large.

### 2) Spot monotonicity
Define:
- `feasible(k) = total_hours_needed_at_speed_k <= h`

As `k` increases, required hours never increase. So feasibility flips once:
- slow speeds: not feasible
- fast enough speeds: feasible

That one-way boundary is exactly what binary search needs.

### 3) Tight search range
- `lo = 1`
- `hi = max(piles)`

Then search for the **leftmost feasible** speed.

```python
import math

def min_eating_speed(piles: list[int], h: int) -> int:
    def feasible(k: int) -> bool:
        hours = 0
        for p in piles:
            hours += math.ceil(p / k)
        return hours <= h

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
```

Complexity:
- Feasibility check: `O(n)`
- Binary search steps: `O(log max(piles))`
- Total: `O(n log M)` where `M = max(piles)`

## Interview narration that sounds senior

Use this script:
1. “I’ll binary-search the answer, not the array.”
2. “Predicate is `feasible(k)`: can we finish within `h` hours at speed `k`?”
3. “Feasibility is monotonic, so there’s a boundary from false to true.”
4. “I’ll return the leftmost true value.”

## Common mistakes

1. **Returning `mid` early when feasible**
   You still need to check smaller feasible candidates.

2. **Using floating-point for hours**
   Use integer ceil math (`(p + k - 1) // k`) or `math.ceil`; avoid precision issues.

3. **Wrong search bounds**
   If bounds don’t include the true answer, binary search quietly lies.

Master this once, and you can reuse it for shipping capacity, minimum days, split array largest sum, and many “minimum X such that condition holds” problems.

---

# Page 9 — BFS for Shortest Path: Your Go-To for Unweighted Graphs

When an interview problem asks for the **minimum number of moves/steps/hops** in an unweighted graph, default to BFS.

That includes hidden graph problems like:
- word ladder transformations
- shortest path in a grid with walls
- minimum bus transfers
- minimum operations to reach a value

If every edge has equal cost (usually 1), BFS gives shortest path length by construction.

## Interview Case: Shortest Path in a Binary Matrix

Typical prompt: given an `n x n` grid with `0` (open) and `1` (blocked), find shortest path length from top-left to bottom-right, moving in 8 directions.

### 1) Why BFS (say this out loud)

“Each move has uniform cost, so level-order traversal guarantees first time we reach target is shortest distance.”

That sentence instantly signals algorithm selection skill.

### 2) Core setup

- Use a queue of states `(r, c, dist)`
- Mark visited when enqueuing (not when dequeuing)
- Expand neighbors within bounds, open, and unvisited

Marking visited early avoids duplicate queue inserts and keeps complexity linear.

```python
from collections import deque

def shortest_path_binary_matrix(grid):
    n = len(grid)
    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1

    dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    q = deque([(0, 0, 1)])
    seen = {(0, 0)}

    while q:
        r, c, d = q.popleft()
        if (r, c) == (n - 1, n - 1):
            return d

        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in seen:
                seen.add((nr, nc))
                q.append((nr, nc, d + 1))

    return -1
```

Complexity:
- Time: `O(V + E)` (grid version is `O(n²)`)
- Space: `O(V)` for queue + visited

## Common mistakes interviewers look for

1. **Using DFS for shortest path in unweighted graph**
   DFS can find a path, not guaranteed shortest.

2. **Visited marked too late**
   If you mark on pop, duplicates flood queue.

3. **Distance bookkeeping bugs**
   Either store `dist` in queue (clean) or process by levels consistently.

## Reusable mental trigger

When you hear “minimum steps” + “uniform move cost,” think:
1. model as graph
2. BFS from source
3. first hit target = answer

This one pattern solves a huge slice of medium graph/grid interview questions quickly and reliably.

---

# Page 10 — Dijkstra Fast: Shortest Path in Weighted Graphs (No Negative Edges)

After BFS, the next shortest-path pattern interviewers test is weighted graphs. If edge costs are not uniform, BFS is no longer correct. Your default should be Dijkstra when all weights are non-negative.

Use it for prompts like:
- cheapest flight within a graph of routes
- minimum total delay through a network
- weighted grid movement where each cell has entry cost

## Interview Case: Network Delay Time

Prompt style: given directed edges `(u, v, w)`, time `w`, and a source node `k`, return how long it takes for all nodes to receive the signal. If any node is unreachable, return `-1`.

### 1) Why Dijkstra (say this clearly)

“Edge weights are non-negative and we need shortest paths from one source, so I’ll use Dijkstra with a min-heap.”

That sentence shows correct algorithm selection and constraint awareness.

### 2) Core idea

- Build adjacency list: `u -> [(v, w), ...]`
- Keep min-heap of `(dist, node)`
- `dist[node]` = best known distance so far
- Pop smallest distance first; relax neighbors

```python
import heapq
from collections import defaultdict

def network_delay_time(times, n, k):
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))

    INF = float('inf')
    dist = [INF] * (n + 1)
    dist[k] = 0

    heap = [(0, k)]

    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue  # stale heap entry

        for nei, w in graph[node]:
            nd = d + w
            if nd < dist[nei]:
                dist[nei] = nd
                heapq.heappush(heap, (nd, nei))

    ans = max(dist[1:])
    return -1 if ans == INF else ans
```

Complexity:
- Time: `O((V + E) log V)`
- Space: `O(V + E)`

## Common interview mistakes

1. **Using BFS on weighted edges**  
   BFS assumes equal cost per edge; it can return a non-optimal route.

2. **Forgetting stale-entry check**  
   Heap may contain outdated `(dist, node)` pairs. `if d > dist[node]: continue` keeps runtime sane.

3. **Using Dijkstra with negative edges**  
   Dijkstra’s greedy pop is invalid with negative weights. Mention Bellman-Ford if negatives appear.

## Reusable decision rule

For shortest path questions:
1. Unweighted / uniform cost → BFS
2. Weighted, non-negative → Dijkstra
3. Negative edges present → Bellman-Ford (or detect cycle constraints)

In interviews, this decision tree alone can save you minutes and prevent choosing the wrong pattern before you even code.

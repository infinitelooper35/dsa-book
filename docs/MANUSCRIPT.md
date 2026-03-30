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


---

# Page 11 — Bellman-Ford: When Shortest Paths Can Go Negative

Dijkstra is your default for weighted shortest paths — until a prompt introduces negative edges. The moment you hear “weights may be negative,” switch to Bellman-Ford.

Use Bellman-Ford for:
- shortest path with possible negative edge weights
- detecting whether a negative cycle is reachable
- interview prompts that ask if “arbitrage/profit loop” exists

## Interview Case: Cheapest Path with Potential Discounts

Prompt style: directed edges `(u, v, w)`, where `w` can be negative. Return shortest distance from `src` to all nodes, and report if a reachable negative cycle exists.

### 1) Why Bellman-Ford (say this out loud)

“Because edges can be negative, Dijkstra is not reliable. I’ll use Bellman-Ford, which relaxes all edges `V-1` times and then does one extra pass to detect a negative cycle.”

That sentence signals algorithm selection + correctness reasoning.

### 2) Core implementation

```python
def bellman_ford(n, edges, src):
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0

    # Relax all edges V-1 times
    for _ in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break  # early stop

    # One more pass: if anything improves, negative cycle reachable
    has_neg_cycle = False
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            has_neg_cycle = True
            break

    return dist, has_neg_cycle
```

Complexity:
- Time: `O(V * E)`
- Space: `O(V)`

## Common interview mistakes

1. **Using Dijkstra anyway**  
   If negatives exist, the greedy property breaks.

2. **Forgetting reachability check**  
   Use `dist[u] != INF` before relaxing, otherwise you “propagate” from unreachable nodes.

3. **Skipping the extra cycle pass**  
   Without pass `V`, you cannot prove a reachable negative cycle.

4. **Overexplaining all-pairs**  
   Stay scoped: Bellman-Ford is single-source. Don’t drift into Floyd-Warshall unless asked.

## Fast decision script for shortest-path interviews

1. Unweighted / equal cost → BFS  
2. Weighted, non-negative → Dijkstra  
3. Weighted with negatives → Bellman-Ford

If asked what negative cycle means in practice: “There is no finite shortest path for nodes affected by that cycle, because cost can be reduced indefinitely.”

That line usually earns instant interviewer confidence because it moves from algorithm mechanics to interpretation.

---

# Page 12 — Floyd-Warshall: All-Pairs Shortest Paths in One Matrix

Bellman-Ford solved single-source shortest paths with negative edges. Today’s jump is all-pairs: shortest path between every pair of nodes. In interviews, this usually appears as “you’ll answer many shortest-path queries on a dense graph.”

When you hear **many queries + small/medium `n` + possible negative edges (but no negative cycles)**, think Floyd-Warshall.

## Interview Case: Cheapest Route Between Any Two Cities

Prompt style: `n` cities, weighted directed edges, answer `q` queries `(u, v)` for minimum cost.

### 1) Why Floyd-Warshall (say this out loud)

“I can precompute shortest paths between every pair in `O(n^3)` time using DP over intermediate nodes, then answer each query in `O(1)`.”

That framing shows tradeoff awareness: expensive preprocess, instant queries.

### 2) Core DP idea

Let `dist[i][j]` be the shortest known distance from `i` to `j`.

Initialize:
- `dist[i][i] = 0`
- `dist[u][v] = w` for each edge (keep smallest if multiple edges)
- everything else = `INF`

Transition:
For each intermediate node `k`, try improving every pair `(i, j)` by going through `k`:

`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`

```python
def floyd_warshall(n, edges):
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]

    for i in range(n):
        dist[i][i] = 0

    for u, v, w in edges:
        if w < dist[u][v]:
            dist[u][v] = w

    for k in range(n):
        for i in range(n):
            if dist[i][k] == INF:
                continue
            for j in range(n):
                if dist[k][j] == INF:
                    continue
                cand = dist[i][k] + dist[k][j]
                if cand < dist[i][j]:
                    dist[i][j] = cand

    neg_cycle = any(dist[i][i] < 0 for i in range(n))
    return dist, neg_cycle
```

Complexity:
- Time: `O(n^3)`
- Space: `O(n^2)`

## Common interview mistakes

1. **Using it on huge `n`**  
   If `n` is large (like `10^5`), this is dead on arrival.

2. **Ignoring multi-edge initialization**  
   Always store min weight for duplicate `(u, v)` edges.

3. **Forgetting negative cycle check**  
   If any `dist[i][i] < 0`, shortest paths are not well-defined for affected pairs.

4. **Recomputing per query**  
   The whole point is preprocess once, answer fast.

## Quick shortest-path chooser (extended)

- Single-source, unweighted → BFS  
- Single-source, non-negative weights → Dijkstra  
- Single-source, negative weights → Bellman-Ford  
- All-pairs, many queries, moderate `n` → Floyd-Warshall

In interviews, clearly stating this decision matrix often matters as much as the code.

---

# Page 14 — Kruskal + Union-Find: Minimum Spanning Tree Under Interview Pressure

We just finished shortest paths. Today, switch to a different graph objective: **connect all nodes with minimum total cost**. That is Minimum Spanning Tree (MST), and in interviews the most practical route is usually **Kruskal + Union-Find (DSU)**.

Use this when the prompt sounds like: “Given `n` nodes and weighted edges, connect everything as cheaply as possible.”

## Interview Case: Cheapest Way to Connect Offices

You’re given `n` offices and possible cable links `(u, v, cost)`. Return the minimum cost to connect all offices, or `-1` if impossible.

### 1) Say the strategy clearly

“I’ll sort edges by cost ascending. I’ll greedily take an edge only if it connects two different components. Union-Find lets me detect cycles in near O(1).”

That sentence signals both algorithm choice and data structure pairing.

### 2) Why Kruskal works (quick proof flavor)

Kruskal always chooses the cheapest edge that doesn’t create a cycle. By the cut property, the lightest edge crossing any cut is safe to include in some MST. So the greedy picks stay globally valid.

### 3) Implementation template

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True

def kruskal_mst(n, edges):
    edges.sort(key=lambda e: e[2])
    dsu = DSU(n)
    cost = used = 0

    for u, v, w in edges:
        if dsu.union(u, v):
            cost += w
            used += 1
            if used == n - 1:
                return cost

    return -1
```

Complexity:
- Sorting edges: `O(E log E)`
- DSU ops: almost linear (`O(E α(N))`)
- Overall: `O(E log E)`

## Common interview mistakes

1. **No connectivity check**  
   If you used fewer than `n-1` edges, graph wasn’t fully connectable.

2. **Cycle detection via DFS each time**  
   Works but too slow; DSU is the intended interview tool.

3. **Forgetting edge count early-stop**  
   Stop at `n-1` accepted edges.

4. **Mixing 1-indexed and 0-indexed nodes**  
   Normalize inputs immediately.

## MST chooser in 10 seconds

- Edge list + easy sorting + sparse graph mindset → **Kruskal + DSU**
- Dense graph + adjacency matrix style → **Prim**

In interview rounds, Kruskal is often the fastest path to correct, explainable code.

---

# Page 15 — Topological Sort (Kahn’s Algorithm): Build Order Questions Made Easy

After MST-style graph questions, interviewers often pivot to **dependency graphs**: what must happen before what. That’s your signal for **topological sort** on a **directed acyclic graph (DAG)**.

Use this for prompts like:
- “Can you finish all courses given prerequisites?”
- “Return a valid task execution order.”
- “Detect if dependency rules contain a cycle.”

## Interview Case: Course Schedule II

Given `numCourses` and `prerequisites` pairs `[a, b]` meaning `b -> a`, return one valid course order, or `[]` if impossible.

### 1) State the plan in one sentence

“I’ll build an adjacency list + indegree array, push all zero-indegree nodes into a queue, then do BFS-style processing. If I process all nodes, order exists; otherwise there’s a cycle.”

That’s Kahn’s algorithm in interview language.

### 2) Why it works (quick intuition)

A node with indegree `0` has no unmet prerequisites, so it is safe to take now. Removing it may unlock other nodes. If a cycle exists, every node in the cycle always has indegree `>= 1`, so queue empties early.

### 3) Implementation template

```python
from collections import deque

def find_order(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses

    for a, b in prerequisites:   # b -> a
        graph[b].append(a)
        indegree[a] += 1

    q = deque(i for i in range(numCourses) if indegree[i] == 0)
    order = []

    while q:
        cur = q.popleft()
        order.append(cur)

        for nxt in graph[cur]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)

    return order if len(order) == numCourses else []
```

Complexity:
- Time: `O(V + E)`
- Space: `O(V + E)`

## High-probability interview mistakes

1. **Reversing edge direction**  
   For `[a, b]`, edge is `b -> a`.

2. **Only checking if queue starts non-empty**  
   You must verify `len(order) == V` at the end.

3. **Using DFS cycle detection when order is required**  
   DFS works, but Kahn is usually easier to explain and code cleanly under pressure.

4. **Ignoring disconnected components**  
   Start queue with *all* zero-indegree nodes, not just one.

## 20-second chooser

- Need valid ordering + cycle detection in directed dependencies → **Topological sort (Kahn)**
- Need only cycle existence in directed graph and you prefer recursion → **DFS color/state**

For most interviews, Kahn gives the best signal-to-bug ratio.

---

# Page 16 — Topological Sort with DFS: Cycle Detection + Ordering in One Pass

Kahn’s algorithm (indegree + queue) is usually the cleanest topological sort in interviews. But you should also know the DFS version, because some interviewers ask for recursion-based cycle detection or want to see graph-state modeling.

Use DFS topological sort when:
- you’re comfortable with recursion,
- you need explicit cycle detection,
- or the prompt is framed as “can you finish?” before “return order.”

## Interview Case: Course Schedule (Cycle + Order)

Given `numCourses` and prerequisites `[a, b]` (`b -> a`), return a valid order if possible, otherwise `[]`.

### 1) Core idea

In DFS topo sort, nodes are added to output **after** exploring neighbors (postorder). If you reverse postorder, you get a valid topological order — but only if no cycle exists.

To detect cycles, track node states:
- `0` = unvisited
- `1` = visiting (currently in recursion stack)
- `2` = done

If DFS reaches a node in state `1`, you found a back-edge → cycle.

### 2) Implementation template

```python
def find_order_dfs(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    for a, b in prerequisites:   # b -> a
        graph[b].append(a)

    state = [0] * numCourses
    order = []

    def dfs(u):
        if state[u] == 1:
            return False  # cycle
        if state[u] == 2:
            return True   # already processed

        state[u] = 1
        for v in graph[u]:
            if not dfs(v):
                return False
        state[u] = 2
        order.append(u)
        return True

    for node in range(numCourses):
        if state[node] == 0:
            if not dfs(node):
                return []

    order.reverse()
    return order
```

Complexity:
- Time: `O(V + E)`
- Space: `O(V + E)` including recursion stack in worst case

## What to say in the interview

Use this script:
1. “I’ll model prerequisites as a directed graph.”
2. “I’ll run DFS with 3-state marking to detect back-edges (cycles).”
3. “I’ll push nodes postorder, then reverse for topological order.”
4. “If any DFS sees a visiting node, schedule is impossible.”

## Common mistakes

1. **Using only visited/unvisited flags**  
   Two states are not enough for cycle detection in directed graphs.

2. **Appending before exploring neighbors**  
   That breaks topological ordering.

3. **Forgetting disconnected components**  
   Run DFS from every unvisited node.

4. **Recursion depth concerns in Python**  
   Mention iterative DFS alternative if constraints are huge.

Kahn and DFS topological sort are both valid. In interviews, pick the one you can explain and implement with fewer bugs. Usually, that’s the winning move.

# Page 17 — Alien Dictionary: Topological Sort When the Graph Is Hidden in Strings

Topological sort gets more interesting when the graph is not given directly. In interviews, a classic version is **Alien Dictionary**: you get a sorted list of words from an unknown language and must infer a valid character order.

This tests whether you can build a graph from constraints, not just traverse one.

## Interview Case

Given `words` sorted lexicographically in an alien language, return a string representing one valid order of characters. If invalid, return `""`.

Example:
- `words = ["wrt", "wrf", "er", "ett", "rftt"]`
- Output: `"wertf"` (one valid order)

## 1) Build edges from adjacent words only

Compare each adjacent pair `(w1, w2)`.
Find the first index where characters differ:
- if `w1[i] != w2[i]`, then `w1[i] -> w2[i]` is a required order edge.
- stop after first difference (later chars don’t matter for lexicographic constraint).

Critical invalid case:
- if `w1` starts with `w2` and `len(w1) > len(w2)`, ordering is impossible (`"abc"` before `"ab"`). Return `""`.

## 2) Run Kahn’s topological sort

- Initialize indegree for **every character that appears** in input words.
- Add edges and indegrees.
- Queue all nodes with indegree 0.
- Pop, append to output, decrement neighbors.
- If output length < number of unique chars, there’s a cycle -> return `""`.

```python
from collections import defaultdict, deque

def alien_order(words):
    graph = defaultdict(set)
    indeg = {c: 0 for w in words for c in w}

    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        m = min(len(w1), len(w2))

        if len(w1) > len(w2) and w1[:m] == w2[:m]:
            return ""

        for j in range(m):
            if w1[j] != w2[j]:
                if w2[j] not in graph[w1[j]]:
                    graph[w1[j]].add(w2[j])
                    indeg[w2[j]] += 1
                break

    q = deque([c for c in indeg if indeg[c] == 0])
    order = []

    while q:
        c = q.popleft()
        order.append(c)
        for nei in graph[c]:
            indeg[nei] -= 1
            if indeg[nei] == 0:
                q.append(nei)

    return "".join(order) if len(order) == len(indeg) else ""
```

## 3) What to say out loud

“I’m deriving precedence edges from the first differing character of adjacent sorted words. Then I’ll run topological sort with cycle detection via processed-node count. I also handle the prefix-invalid case explicitly.”

## 4) Common misses

1. Comparing all pairs of words (unnecessary and risky). Adjacent pairs are enough.
2. Forgetting to include isolated chars with no edges.
3. Ignoring duplicate edge protection (`set`) and inflating indegrees.
4. Missing prefix invalidation.

This problem is interview gold because it combines parsing + graph reasoning. If you can do this cleanly, you signal strong algorithmic maturity.

# Page 18 — Evaluate Division: Weighted Graphs for Ratio Queries

After Alien Dictionary, stay in graph mode but switch from ordering to **equations as edges**. Interviewers love this one because it looks like math, but the solution is pure graph traversal.

## Interview Case

You’re given equations like:
- `a / b = 2.0`
- `b / c = 3.0`

Then queries like:
- `a / c` -> `6.0`
- `c / a` -> `1/6`
- `x / x` -> `-1.0` (if `x` never appeared)

This is LeetCode’s **Evaluate Division** pattern.

## 1) Build a weighted bidirectional graph

Each variable is a node.
For `a / b = k`:
- add edge `a -> b` with weight `k`
- add edge `b -> a` with weight `1/k`

Why both directions? Because queries can go either way.

```python
from collections import defaultdict, deque

def build_graph(equations, values):
    g = defaultdict(list)
    for (a, b), k in zip(equations, values):
        g[a].append((b, k))
        g[b].append((a, 1.0 / k))
    return g
```

## 2) Answer each query with BFS/DFS path product

For query `src / dst`:
- if either node missing: `-1.0`
- if `src == dst`: `1.0` (only if node exists)
- otherwise traverse graph; multiply weights along path

```python
def query_ratio(g, src, dst):
    if src not in g or dst not in g:
        return -1.0
    if src == dst:
        return 1.0

    q = deque([(src, 1.0)])
    seen = {src}

    while q:
        node, prod = q.popleft()
        if node == dst:
            return prod
        for nei, w in g[node]:
            if nei not in seen:
                seen.add(nei)
                q.append((nei, prod * w))

    return -1.0
```

Time complexity is `O(E + V)` per query in worst case. In interviews, that’s usually accepted unless query count is massive.

## 3) What to say out loud

“I’m modeling equations as a weighted graph. A division query is a path-product query. I’ll run BFS from source to destination and accumulate the multiplicative weight. Missing nodes or disconnected components return `-1.0`.”

That explanation sounds senior because it separates **modeling** from **traversal**.

## 4) Pitfalls interviewers wait for

1. Forgetting reverse edges (`1/k`).
2. Returning `1.0` for `x/x` even when `x` was never in equations.
3. Not resetting `seen` per query.
4. Trying to do algebraic substitution directly (messy and brittle).

If they ask follow-up optimization, mention **Union-Find with weights** for faster repeated queries. But lead with weighted BFS/DFS first—it’s clearer, easier to code, and less bug-prone under pressure.

# Page 19 — Evaluate Division Follow-Up: Weighted Union-Find for Fast Repeated Queries

Yesterday’s BFS solution is the right first answer for **Evaluate Division**. But interviewers often ask the follow-up: “What if there are tons of queries?”

That’s your cue to upgrade to **Weighted Union-Find (Disjoint Set Union)**.

## When this upgrade is worth it

Use weighted DSU when:
- equations are mostly static,
- query volume is high,
- you want near-constant-time query checks.

Instead of searching paths per query, we maintain connected components with ratio information compressed into parent pointers.

## Core idea

For each variable `x`:
- `parent[x]` = representative parent
- `weight[x]` = ratio from `x` to `parent[x]`

After path compression, `weight[x]` effectively becomes ratio from `x` to root.

If two variables share a root, then:

`x / y = weight[x] / weight[y]`

That is the entire query formula.

## Python template

```python
class WeightedDSU:
    def __init__(self):
        self.parent = {}
        self.weight = {}  # x / parent[x]

    def add(self, x):
        if x not in self.parent:
            self.parent[x] = x
            self.weight[x] = 1.0

    def find(self, x):
        if self.parent[x] != x:
            p = self.parent[x]
            root = self.find(p)
            self.weight[x] *= self.weight[p]
            self.parent[x] = root
        return self.parent[x]

    def union(self, a, b, k):  # a / b = k
        self.add(a); self.add(b)
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return

        # attach ra under rb
        # need: (a/rootA) * (rootA/rootB) / (b/rootB) = k
        # => rootA/rootB = k * weight[b] / weight[a]
        self.parent[ra] = rb
        self.weight[ra] = k * self.weight[b] / self.weight[a]

    def query(self, a, b):
        if a not in self.parent or b not in self.parent:
            return -1.0
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            return -1.0
        return self.weight[a] / self.weight[b]
```

## Interview script (say this out loud)

“I’ll model each equation as a union operation with multiplicative weights. `find` does path compression while preserving ratios to root. Then each query is O(alpha(n)) if both variables share the same root; otherwise `-1.0`.”

## Common failure points

1. Getting the union formula wrong (most common).
2. Doing path compression but forgetting to update weights during compression.
3. Returning `1.0` for unknown `x/x` (should still be `-1.0` if unseen).
4. Recomputing BFS per query even after proposing DSU.

Rule of thumb: start with weighted graph traversal for clarity, then switch to weighted DSU when the interviewer adds heavy-query constraints. That sequencing shows both practical judgment and depth.

---

# Page 20 — Redundant Connection: Use DSU to Detect the First Cycle Edge


Weighted DSU solved ratio queries yesterday. Today, keep the same data structure but switch to a different interview signal: **cycle detection in an undirected graph**.

This is the classic **Redundant Connection** pattern.

## Interview case

You’re given `n` nodes and `n` edges for an undirected graph that started as a tree, then had one extra edge added. Return the edge that creates a cycle.

Brute force is “remove each edge and test connectivity,” but that’s too slow and clunky under pressure. DSU is cleaner: as you process edges, if two endpoints are already in the same component, this edge is redundant.

## Why this is interview-friendly

- One pass through edges
- Compact implementation
- Easy correctness argument
- Reusable for many graph questions

Time is near-linear: `O(E * alpha(V))`.

## Python template

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.rank = [0] * (n + 1)

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False  # already connected -> cycle edge

        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True


def findRedundantConnection(edges):
    n = len(edges)
    dsu = DSU(n)

    for u, v in edges:
        if not dsu.union(u, v):
            return [u, v]
```

## What to say out loud

“I’ll treat each edge as a union attempt. If `find(u) == find(v)`, then `u` and `v` were already connected, so adding this edge creates a cycle. That edge is the redundant one.”

This sounds strong because you’re stating the invariant: **each component is represented by one root**.

## Common mistakes

1. **Wrong DSU size assumption**
   For this specific problem, labels are usually `1..n`, but in general graphs labels can be sparse. If labels aren’t guaranteed dense, map them first.

2. **Skipping path compression/rank**
   It may still pass small tests, but interviewers notice if you ignore standard DSU optimizations.

3. **Mixing directed vs undirected logic**
   This DSU approach is for undirected cycle detection. Directed “redundant connection II” is a different beast.

## Practical pattern to remember

When the prompt says “one extra edge,” “detect cycle edge,” or “dynamic connectivity,” think DSU before DFS. It’s usually shorter to code, easier to reason about, and more robust in a timed interview.


---

# Page 21 — Kruskal in Interviews: Build an MST with DSU

Yesterday you used DSU to detect the first cycle edge. Today you’ll use the same primitive for a bigger interview pattern: **minimum spanning tree (MST)** with **Kruskal’s algorithm**.

If a prompt says “connect all nodes with minimum total cost,” your brain should immediately test MST.

## Interview case

You’re given weighted edges between nodes. Connect every node so total cost is minimal, with no cycles.

Kruskal’s idea is greedy and clean:
1. Sort edges by cost ascending.
2. Try to add each edge.
3. If edge connects two different components, keep it.
4. If it connects nodes already in the same component, skip (would form cycle).

DSU gives you step 3/4 in near O(1).

## Python template

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True


def kruskal_mst(n, edges):
    # edges: (w, u, v)
    edges.sort()
    dsu = DSU(n)
    total = 0
    used = 0

    for w, u, v in edges:
        if dsu.union(u, v):
            total += w
            used += 1
            if used == n - 1:
                break

    return total if used == n - 1 else -1
```

## What to say out loud

“I sort all edges by weight, then greedily take the cheapest edge that connects two different components. DSU prevents cycles and tracks connectivity efficiently. We stop after selecting `n-1` edges.”

That explanation shows both correctness intuition and implementation control.

## Common interview traps

1. **Forgetting disconnected graph handling**  
   If you cannot pick `n-1` edges, MST doesn’t exist. Return `-1` (or follow prompt-specific behavior).

2. **Wrong node indexing**  
   Some questions use `1..n`, others `0..n-1`. Normalize once at input parse.

3. **Not sorting the right tuple shape**  
   Keep edge tuples as `(weight, u, v)` so default sort works and your loop stays readable.

4. **Confusing Kruskal vs Prim**  
   Kruskal = edge-sorted + DSU. Prim = grow from a node with heap.

## Practical decision rule

- Sparse edge list already provided? **Kruskal + DSU** is usually fastest to code in interviews.
- Dense graph or adjacency-heavy setup? Prim may be cleaner.

Kruskal is one of those patterns where “same DSU, different wrapper” unlocks a whole class of graph problems.

---

# Page 22 — Prim’s Algorithm: MST Without Sorting All Edges

Yesterday you used Kruskal + DSU. Today you’ll lock in the other MST pattern interviewers love: **Prim’s algorithm**.

Use Prim when the graph is already in adjacency-list form, or when you want to grow one connected component step by step instead of sorting every edge globally.

## Interview case

“Given `n` nodes and weighted connections, return the minimum cost to connect all nodes.”

Prim’s idea:
1. Start from any node (usually `0`).
2. Push all outgoing edges into a min-heap.
3. Repeatedly take the cheapest edge that reaches an unvisited node.
4. Add that node, push its outgoing edges, continue until all nodes are visited.

If you finish with fewer than `n` visited nodes, the graph is disconnected.

## Python template

```python
import heapq

def prim_mst(n, adj):
    # adj[u] = [(v, weight), ...]
    visited = [False] * n
    min_heap = [(0, 0)]  # (cost, node)
    total = 0
    used_nodes = 0

    while min_heap and used_nodes < n:
        cost, u = heapq.heappop(min_heap)
        if visited[u]:
            continue

        visited[u] = True
        total += cost
        used_nodes += 1

        for v, w in adj[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (w, v))

    return total if used_nodes == n else -1
```

## What to say out loud

“I’m building the MST incrementally from one start node. A min-heap always gives me the cheapest edge crossing from visited to unvisited nodes. I skip stale heap entries with `if visited[u]: continue`.”

That line tells the interviewer you understand real heap behavior, not just textbook pseudocode.

## Complexity you should quote

- With adjacency list + binary heap: **O(E log V)** time
- Space: **O(V + E)** for graph storage and heap growth

In interviews, this is usually good enough. Don’t overcomplicate with Fibonacci heaps.

## Common mistakes

1. **Adding edge cost before visited check**
   If you do that, duplicate heap entries can overcount total.

2. **Forgetting disconnected graph check**
   Always verify `used_nodes == n`.

3. **Using adjacency matrix accidentally**
   That often degrades to `O(V^2)` and is slower to code.

4. **Pushing `(node, weight)` instead of `(weight, node)`**
   Heap ordering breaks silently.

## Kruskal vs Prim: quick interview choice

- **Edge list given directly?** Start with **Kruskal**.
- **Adjacency list / network expansion vibe?** Start with **Prim**.

Both solve MST. Choosing the one that matches input shape is the practical interview move.

---

## 2026-03-19

# Page 23 — Dijkstra’s Algorithm: Shortest Path in Weighted Graphs (No Negative Edges)

Now that you’ve seen MST patterns (Kruskal and Prim), the next interview graph staple is **single-source shortest path**.

Use **Dijkstra’s algorithm** when:
- edges have non-negative weights
- you need shortest distance from one source to all nodes (or one target)

If negative edges exist, call that out immediately and pivot to Bellman-Ford.

## Interview case

“Given `n` nodes and weighted directed edges, return the minimum cost from `src` to every node (or to `dst`).”

Core idea:
1. Keep `dist[]` initialized to infinity, except `dist[src] = 0`.
2. Use a min-heap of `(distance_so_far, node)`.
3. Pop the smallest distance candidate.
4. Relax outgoing edges: if `d + w < dist[v]`, update and push new pair.

This is the same stale-entry pattern as Prim: heap can contain old values, so guard with a skip check.

## Python template

```python
import heapq


def dijkstra(n, adj, src):
    # adj[u] = [(v, w), ...]
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0

    heap = [(0, src)]  # (distance, node)

    while heap:
        d, u = heapq.heappop(heap)

        # stale entry: we already found a better path
        if d != dist[u]:
            continue

        for v, w in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))

    return dist
```

If the prompt asks for just one target, you can early-exit when you pop `dst` from heap (that’s the finalized shortest distance).

## What to say out loud

“I’m using a greedy frontier: the first time a node is popped with its current best distance, that distance is final because all edge weights are non-negative.”

That sentence communicates the correctness condition interviewers care about.

## Complexity to quote

- Time: **O((V + E) log V)** with adjacency list + binary heap
- Space: **O(V + E)**

In sparse graphs, this is efficient and interview-friendly.

## Common mistakes

1. **Forgetting the non-negative requirement**
   Dijkstra is invalid with negative edges.

2. **Marking visited too early**
   Don’t mark at push time. Distances can still improve before pop.

3. **No stale-entry check**
   Without it, code still works but does extra work; with bad “visited” logic it can break.

4. **Overflow worries in other languages**
   In Java/C++, use large sentinels carefully (`Long.MAX_VALUE` checks before add).

## Prim vs Dijkstra mental model

- **Prim:** minimize edge added to grow a tree.
- **Dijkstra:** minimize total path distance from source.

Both use min-heaps, but their optimization target is different. Say that clearly and you’ll sound like someone who understands graph algorithms, not someone reciting them.


---

# Page 24 — Bellman-Ford: When Negative Edges Enter the Interview

Dijkstra is fast, but it has a hard limit: **non-negative edge weights**.  
The moment a prompt includes negative weights, your default shortest-path answer should switch to **Bellman-Ford**.

Use Bellman-Ford when:
- edges can be negative
- you still need single-source shortest paths
- you may need to detect a negative cycle

## Interview case

“Given `n` nodes and weighted directed edges, return shortest distances from `src`. If a negative cycle is reachable from `src`, report it.”

Core idea:
1. Initialize `dist[src] = 0`, everything else = infinity.
2. Relax all edges `n - 1` times.
3. Do one extra pass: if any edge can still relax, a reachable negative cycle exists.

Why `n - 1` passes? Any simple shortest path has at most `n - 1` edges. Each pass lets paths with one more edge settle.

## Python template

```python
def bellman_ford(n, edges, src):
    # edges: list of (u, v, w)
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0

    # Relax edges up to n-1 times
    for _ in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:  # early stop optimization
            break

    # Detect reachable negative cycle
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            return None, True  # distances invalid due to negative cycle

    return dist, False
```

## What to say out loud

“I’ll use Bellman-Ford because negative edges break Dijkstra’s greedy finalization rule. Bellman-Ford systematically relaxes all edges, and an extra pass detects reachable negative cycles.”

That sentence signals you understand **algorithm selection**, not just implementation.

## Complexity to quote

- Time: **O(V × E)**
- Space: **O(V)**

It’s slower than Dijkstra, so say that proactively: “If weights were guaranteed non-negative, I’d prefer Dijkstra with a heap.”

## Common mistakes

1. **Forgetting reachability check (`dist[u] != INF`)**
   Without it, you can incorrectly relax from unreachable nodes.

2. **Skipping the extra pass**
   Then you miss negative cycle detection, which interviewers often test.

3. **Using Bellman-Ford when constraints are huge and non-negative**
   Correct but suboptimal choice; mention Dijkstra alternative.

## Dijkstra vs Bellman-Ford quick rule

- **Non-negative weights** → Dijkstra
- **Negative weights possible** → Bellman-Ford
- **Need negative-cycle detection** → Bellman-Ford

In interviews, this decision line is often more important than writing every line perfectly.



## 2026-03-21

# Page 25 — 0-1 BFS: Beat Dijkstra When Edge Weights Are Only 0 or 1

After Bellman-Ford, here’s a high-value interview optimization most candidates miss: **0-1 BFS**.

If a graph’s edge weights are only `0` or `1`, you don’t need a heap-based Dijkstra. You can get linear performance with a deque.

Use this when prompts look like:
- “minimum cost with free vs paid moves”
- “grid where some moves cost 0, others cost 1”
- “reverse edges costs 1, forward edges costs 0”

## Interview case

You’re in a grid. Moving into a cell with the suggested direction costs `0`; changing direction costs `1`. Find minimum cost to reach bottom-right.

This is a shortest-path problem with non-negative weights, so Dijkstra works. But because weights are only `0/1`, 0-1 BFS is cleaner and often faster.

## Core idea

Maintain `dist[node]` and a deque:
- if relaxing an edge of weight `0`, push neighbor to the **front**
- if weight `1`, push to the **back**

Why this works: deque order preserves the same processing guarantee as a min-priority queue for binary weights.

```python
from collections import deque

def zero_one_bfs(n, adj, src):
    # adj[u] = [(v, w)] where w in {0, 1}
    INF = 10**18
    dist = [INF] * n
    dist[src] = 0

    dq = deque([src])

    while dq:
        u = dq.popleft()
        for v, w in adj[u]:
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                if w == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)

    return dist
```

Complexity:
- Time: `O(V + E)`
- Space: `O(V)`

That beats Dijkstra’s `O((V+E) log V)` when the 0/1 constraint applies.

## What to say out loud

“I’d normally use Dijkstra, but edge weights are binary (0 or 1), so I can use 0-1 BFS with a deque. Zero-cost relaxations go to the front, one-cost relaxations go to the back, which maintains nondecreasing distance processing.”

That answer usually stands out because it shows constraint-driven optimization.

## Common mistakes

1. **Using normal BFS**  
   Regular BFS assumes all edges same weight; it fails for mixed 0 and 1.

2. **Still using a heap by habit**  
   Correct but slower and more code.

3. **Forgetting multiple relaxations**  
   A node can be improved later through a zero-cost path; always compare `nd < dist[v]`.

4. **Applying 0-1 BFS to weights like `{0,2}`**  
   Not valid. The trick is specific to binary edge weights.

Interview shortcut: if weights are exactly `0/1`, reach for deque before heap.


## 2026-03-22

# Page 26 — Bidirectional BFS: Cut Search Space for Word Ladder-Style Problems

After 0-1 BFS, here’s another interview optimization that’s easy to explain and high impact: **bidirectional BFS**.

Use it when:
- the graph is unweighted,
- you need shortest path length,
- and both start and target are known.

Classic trigger: **Word Ladder**.

## Interview case

Given `beginWord`, `endWord`, and a dictionary, return the minimum number of one-letter transformations needed to reach `endWord`, changing one character at a time, and each intermediate word must exist in the dictionary.

Regular BFS works, but can explode when branching factor is high. Bidirectional BFS searches from both ends and meets in the middle.

## Why this is faster

If branching factor is `b` and distance is `d`:
- one-direction BFS explores about `b^d`
- bidirectional BFS explores roughly `2 * b^(d/2)`

In interviews, you don’t need a formal proof—just say: “meeting in the middle shrinks the frontier depth on both sides.”

## Implementation template

```python
def ladder_length(begin, end, word_list):
    words = set(word_list)
    if end not in words:
        return 0

    front = {begin}
    back = {end}
    visited = {begin, end}
    steps = 1

    while front and back:
        # always expand smaller frontier
        if len(front) > len(back):
            front, back = back, front

        nxt = set()
        for w in front:
            arr = list(w)
            for i in range(len(arr)):
                orig = arr[i]
                for c in "abcdefghijklmnopqrstuvwxyz":
                    if c == orig:
                        continue
                    arr[i] = c
                    cand = "".join(arr)

                    if cand in back:
                        return steps + 1
                    if cand in words and cand not in visited:
                        visited.add(cand)
                        nxt.add(cand)
                arr[i] = orig

        front = nxt
        steps += 1

    return 0
```

Complexity depends on dictionary size and word length, but in practice this is often much faster than one-sided BFS for deep paths.

## What to say out loud

“I’ll use bidirectional BFS because this is an unweighted shortest-path problem with known source and target. I’ll expand the smaller frontier each round to reduce branching, and stop when the frontiers intersect.”

That line signals optimization judgment, not just implementation ability.

## Common mistakes

1. **Expanding only one side by habit**
   Then you lose the whole benefit.

2. **Not swapping to smaller frontier**
   Performance can degrade significantly.

3. **Incorrect step counting when frontiers meet**
   Be explicit about what `steps` represents.

4. **Forgetting to restore modified character in loops**
   Causes silent string-generation bugs.

Interview shortcut: when you hear “shortest transformations between two known states,” test bidirectional BFS before coding plain BFS.


## 2026-03-23

# Page 27 — Dijkstra in Interviews: Shortest Path on Weighted Graphs (No Negative Edges)

After bidirectional BFS, the next step is handling **weighted** shortest-path problems where edge costs are not just 0/1. The interview default here is **Dijkstra’s algorithm**.

Use it when:
- graph edges have non-negative weights,
- you need shortest distance from one source,
- and BFS no longer works because weights differ.

If you hear “minimum total cost,” “cheapest route,” or “time to reach each node” with non-negative weights, think Dijkstra immediately.

## Interview case

Given `n` nodes and weighted edges, return the shortest distance from source `s` to target `t`.

## Core idea (what to say)

“Maintain best-known distances. Always expand the node with the smallest current distance using a min-heap. If we pop a stale entry, skip it.”

That one sentence communicates both correctness and implementation detail.

## Python template

```python
import heapq


def dijkstra(n, adj, s):
    INF = 10**18
    dist = [INF] * n
    dist[s] = 0

    pq = [(0, s)]  # (distance, node)

    while pq:
        d, u = heapq.heappop(pq)

        # stale heap entry; better path already found
        if d != dist[u]:
            continue

        for v, w in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    return dist
```

Complexity:
- Time: `O((V + E) log V)`
- Space: `O(V + E)`

In interviews, that complexity statement is enough unless asked to derive.

## Fast decision table

- Unweighted graph → BFS
- Weights only `0/1` → 0-1 BFS (deque)
- Non-negative weights → Dijkstra
- Negative weights exist → Bellman-Ford / SPFA discussion

Saying this table out loud shows strong algorithm selection judgment.

## Common mistakes

1. **Using plain BFS on weighted edges**  
   Gives wrong answers when edge costs differ.

2. **Marking node “visited” too early**  
   With heap-based Dijkstra, rely on `if d != dist[u]: continue` instead.

3. **Forgetting directed vs undirected handling**  
   For undirected graphs, add both directions in adjacency.

4. **Ignoring overflow / large INF choice**  
   Use a safely large sentinel (`10**18` in Python).

5. **Trying Dijkstra with negative edges**  
   It can silently fail; call this out explicitly to the interviewer.

Interview shortcut: when the problem says “shortest path” and costs are non-negative, start from Dijkstra template, then adapt output (single target, all nodes, or path reconstruction).

# Page 28 — Dijkstra Path Reconstruction: Return the Actual Route, Not Just the Cost

Yesterday we focused on computing shortest **distance**. In interviews, the very next follow-up is usually: “Cool, now return the path.”

If you only return a number, you’re halfway done. Production code often needs the route itself (`s -> ... -> t`).

## Interview case

Given weighted edges with non-negative costs, return both:
1. minimum distance from `s` to `t`
2. one valid shortest path as a list of nodes

## Core upgrade to Dijkstra

Keep a `parent[]` array.
- `parent[v] = u` whenever you relax `v` through `u`
- after Dijkstra finishes, backtrack from `t` to `s` using `parent`

This adds almost no complexity and demonstrates strong implementation maturity.

## Python template

```python
import heapq


def shortest_path(n, adj, s, t):
    INF = 10**18
    dist = [INF] * n
    parent = [-1] * n
    dist[s] = 0

    pq = [(0, s)]

    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue  # stale entry

        if u == t:
            break  # early exit is valid in Dijkstra

        for v, w in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                parent[v] = u
                heapq.heappush(pq, (nd, v))

    if dist[t] == INF:
        return -1, []

    path = []
    cur = t
    while cur != -1:
        path.append(cur)
        cur = parent[cur]
    path.reverse()

    return dist[t], path
```

Complexity remains:
- Time: `O((V + E) log V)`
- Space: `O(V + E)`

## Talking points that score in interviews

- “I only set `parent[v]` when I find a strictly better distance.”
- “I can early-exit when target `t` is popped from heap, because that distance is finalized.”
- “If interviewer wants all shortest paths, I’d store predecessor lists instead of one parent.”

Those lines show you understand correctness, not just syntax.

## Edge cases to call out

1. **No route from `s` to `t`** → return `-1` and empty path.
2. **`s == t`** → distance is `0`, path is `[s]`.
3. **Multiple optimal paths** → this returns one of them (depends on relaxation order).
4. **Negative edge present** → reject Dijkstra and propose Bellman-Ford.

## Practical interview move

When you finish the cost-only version, proactively say:
“Want me to add path reconstruction with a parent array?”

That single sentence often turns a passable solution into a strong one.

# Page 29 — 0-1 BFS: Faster Than Dijkstra When Edge Weights Are Only 0 or 1

Dijkstra is the default for weighted shortest path, but interviews love this twist:

“Each edge weight is either `0` or `1`. Find shortest path from `s`.”

If you still run heap-based Dijkstra, it works—but you miss an optimization signal. The better answer is **0-1 BFS** with a deque.

## When to use it

Use 0-1 BFS when:
- graph can be directed or undirected
- edge weights are strictly in `{0, 1}`
- you need single-source shortest distances (or distance to one target)

Time complexity becomes **`O(V + E)`**, better than Dijkstra’s `O((V + E) log V)`.

## Core idea

Maintain `dist[]` and a deque `dq`.

When relaxing edge `u -> v` with weight `w`:
- if `w == 0`, push `v` to the **front** (`appendleft`)
- if `w == 1`, push `v` to the **back** (`append`)

Why this works: nodes reached with no extra cost should be processed earlier, preserving increasing-distance order without a heap.

## Python template

```python
from collections import deque


def zero_one_bfs(n, adj, s):
    INF = 10**18
    dist = [INF] * n
    dist[s] = 0

    dq = deque([s])

    while dq:
        u = dq.popleft()

        for v, w in adj[u]:
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                if w == 0:
                    dq.appendleft(v)
                else:  # w == 1
                    dq.append(v)

    return dist
```

## Interview framing (say this out loud)

“I’d normally use Dijkstra for non-negative weights. Since weights are only 0/1, I can replace the heap with a deque. Zero-cost relaxations go to front, one-cost relaxations to back, giving linear `O(V+E)`.”

That explanation signals pattern recognition and constraint-driven optimization.

## Common pitfalls

1. **Using a visited set too early**
   - Don’t mark a node permanently visited on first pop; a better route can still appear via a `0` edge.
   - Guard with `if nd < dist[v]` relaxations.

2. **Applying it to weights like `{0,2}` or `{1,2}`**
   - Not valid. Use Dijkstra (or transform carefully if problem allows).

3. **Forgetting path reconstruction**
   - Same as Dijkstra: keep `parent[v] = u` on improvement, then backtrack.

## Drill prompt

Given a grid where moving into a free cell costs `0` and breaking a wall costs `1`, find the minimum walls to break from top-left to bottom-right.

If you instantly think “0-1 BFS on implicit graph,” you’re interview-ready for this pattern.

## 2026-03-26

# Page 30 — Multi-Source BFS: Nearest Distance Problems Without Repeating Work

After 0-1 BFS, here’s another interview pattern that saves both time and code: **multi-source BFS**.

Use it when the prompt asks for each cell/node’s distance to the *nearest* target (gate, zero, hospital, treasure, etc.). If you run BFS from every starting node, you’ll usually time out. The better move is to reverse the thinking: start from all targets at once.

## Interview case

Given a grid with:
- `0` = gate
- `-1` = wall
- `INF` = empty room

Fill each empty room with distance to its nearest gate.

This is the classic “Walls and Gates” pattern.

## Core insight

All edges have equal weight (1 step), so BFS gives shortest path. If we push **all gates** into the queue initially, BFS expands in layers from every gate simultaneously. The first time a room is reached is guaranteed to be its nearest gate distance.

That avoids repeated searches and naturally resolves nearest-source competition.

## Python template

```python
from collections import deque


def walls_and_gates(rooms):
    if not rooms or not rooms[0]:
        return

    m, n = len(rooms), len(rooms[0])
    q = deque()

    # Seed queue with all sources (gates)
    for r in range(m):
        for c in range(n):
            if rooms[r][c] == 0:
                q.append((r, c))

    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while q:
        r, c = q.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if not (0 <= nr < m and 0 <= nc < n):
                continue
            if rooms[nr][nc] != 2147483647:  # not INF (wall/gate/already set)
                continue

            rooms[nr][nc] = rooms[r][c] + 1
            q.append((nr, nc))
```

Complexity:
- Time: `O(m * n)`
- Space: `O(m * n)` in worst case queue

## What to say out loud

“I’ll run multi-source BFS by enqueueing all gates first. Since BFS processes by distance layers in an unweighted grid, the first time we set an empty room is its minimum distance to any gate.”

That sentence shows correctness reasoning, not just implementation.

## Common mistakes

1. **Running BFS from each empty room**
   Correct but too slow (`O((mn)^2)` in dense cases).

2. **Using DFS for shortest distance**
   DFS does not guarantee shortest path in unweighted graphs.

3. **Overwriting non-INF cells**
   Walls and gates should stay unchanged.

4. **Forgetting boundary checks**
   Grid bugs here are common under pressure.

Interview trigger to memorize: if many starts share the same shortest-path objective, push all starts first and run one BFS.


## 2026-03-27

# Page 31 — Shortest Bridge: Combine DFS Marking with Multi-Source BFS

Yesterday you learned multi-source BFS for “nearest target” distance. Today’s interview upgrade is a hybrid pattern: **mark one region, then BFS outward from all of it at once**.

This is the core idea behind **Shortest Bridge**.

## Interview case

You’re given an `n x n` binary grid with exactly two islands (`1`s connected 4-directionally). You can flip water cells (`0`) to land. Return the minimum number of flips needed to connect the two islands.

Brute force from every cell on island A is messy and slow. The clean approach is:
1. Find and mark the first island (DFS/BFS).
2. Push all cells of that island into a queue.
3. Run multi-source BFS through water until you hit island B.

## Why this works

Treat the first island as one giant source frontier. BFS expands by layers of water flips:
- layer 0: original first island
- layer 1: water cells one step away (1 flip)
- layer 2: two flips away

The first time BFS touches the second island is the minimum flips by shortest-path layering.

## Python template

```python
from collections import deque


def shortest_bridge(grid):
    n = len(grid)
    q = deque()

    def dfs(r, c):
        if r < 0 or r >= n or c < 0 or c >= n or grid[r][c] != 1:
            return
        grid[r][c] = 2               # mark first island
        q.append((r, c))             # seed BFS frontier
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    # 1) find first island and mark it
    found = False
    for r in range(n):
        if found:
            break
        for c in range(n):
            if grid[r][c] == 1:
                dfs(r, c)
                found = True
                break

    # 2) multi-source BFS to reach second island
    steps = 0
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while q:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if not (0 <= nr < n and 0 <= nc < n):
                    continue
                if grid[nr][nc] == 1:
                    return steps
                if grid[nr][nc] == 0:
                    grid[nr][nc] = 2
                    q.append((nr, nc))
        steps += 1
```

Complexity:
- Time: `O(n^2)`
- Space: `O(n^2)` worst-case queue/recursion

## What to say out loud

“I’ll first mark one island, then run multi-source BFS from all its cells. BFS layer number equals number of flips, so the first time I reach the second island is optimal.”

## Common mistakes

1. Starting BFS from only one island cell (can overcount).
2. Forgetting to mark visited water, causing duplicates.
3. Using 8-direction movement (problem is 4-directional).
4. Mixing island-marking and expansion logic in one pass.

Interview trigger: when a prompt says “connect two regions with minimum expansions,” think **region marking + multi-source BFS**.



# Page 32 — 0-1 BFS: When Edge Weights Are Only 0 or 1

Yesterday you used classic BFS layering to count uniform-cost expansions. Today’s interview upgrade is what to do when moves have **two possible costs**: free (`0`) or paid (`1`).

That pattern shows up in problems like **Minimum Obstacle Removal to Reach Corner** and binary-weight graph paths.

## Interview case

Grid with `0` (empty) and `1` (obstacle). You can move 4-directionally. Entering a `1` cell costs 1 removal; entering `0` costs 0. Return minimum removals from top-left to bottom-right.

If you use plain BFS, it breaks because not all edges cost the same.
If you use Dijkstra + heap, it works, but there’s a faster, cleaner option for `{0,1}` weights: **0-1 BFS with a deque**.

## Core idea

Maintain `dist[r][c] = minimum cost so far`.
When exploring neighbor:
- edge cost `0` → push to **front** of deque
- edge cost `1` → push to **back** of deque

Why this works: deque order simulates Dijkstra’s min-priority behavior when weights are only 0/1.

## Python template

```python
from collections import deque


def minimum_obstacles(grid):
    m, n = len(grid), len(grid[0])
    INF = 10**9
    dist = [[INF] * n for _ in range(m)]
    dist[0][0] = 0

    dq = deque([(0, 0)])
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while dq:
        r, c = dq.popleft()

        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if not (0 <= nr < m and 0 <= nc < n):
                continue

            w = grid[nr][nc]                 # 0 or 1 cost to enter
            nd = dist[r][c] + w

            if nd < dist[nr][nc]:
                dist[nr][nc] = nd
                if w == 0:
                    dq.appendleft((nr, nc))
                else:
                    dq.append((nr, nc))

    return dist[m - 1][n - 1]
```

Complexity:
- Time: `O(V + E)` (linear, unlike heap Dijkstra)
- Space: `O(V)`

## What to say out loud

“Because edge weights are only 0 or 1, I can replace a heap with a deque. Zero-cost moves get processed immediately from the front, one-cost moves wait at the back. This preserves increasing-distance processing like Dijkstra but in linear time.”

## Common mistakes

1. Using `visited` boolean too early. Use distance relaxation (`nd < dist`) instead.
2. Charging cost of the current cell instead of the next cell.
3. Reaching for heap Dijkstra by default and missing the 0-1 optimization.
4. Assuming this works for weight `2+` (it doesn’t).

Interview trigger: if prompt says “minimum cost/path” and costs are strictly `{0,1}`, think **0-1 BFS** before Dijkstra.

# Page 33 — Monotonic Deque: Sliding Window Max in O(n)

Yesterday you used 0-1 BFS to optimize weighted traversal. Today we switch to arrays and interview speed: **Monotonic Deque** for sliding windows.

This pattern solves “best value in every moving window” without recomputing from scratch.

## Interview case

Given `nums` and window size `k`, return an array where each element is the maximum of the current window.

Example: `nums = [1,3,-1,-3,5,3,6,7], k = 3` → `[3,3,5,5,6,7]`

Brute force is easy: for each start index, scan `k` elements.
- Time: `O(n*k)`
- Space: `O(1)` extra

For large `k`, this is too slow. Optimized answer is **O(n)** with a deque of indices.

## Core invariant

Keep deque indices in **decreasing value order**.
- Front (`dq[0]`) always points to the max in current window.
- Before pushing index `i`, pop from back while `nums[back] <= nums[i]`.
- Also pop from front if it falls out of window (`<= i-k`).

Each index enters and leaves deque once → linear time.

## Python template

```python
from collections import deque


def max_sliding_window(nums, k):
    dq = deque()   # stores indices, values decreasing
    out = []

    for i, x in enumerate(nums):
        # 1) remove indices out of this window
        while dq and dq[0] <= i - k:
            dq.popleft()

        # 2) maintain decreasing order by value
        while dq and nums[dq[-1]] <= x:
            dq.pop()

        dq.append(i)

        # 3) record answer once first full window forms
        if i >= k - 1:
            out.append(nums[dq[0]])

    return out
```

Complexity:
- Time: `O(n)`
- Space: `O(k)` (deque size bounded by window)

## What to say out loud

“I’ll use a monotonic decreasing deque of indices. The front is always the max candidate for the current window. I evict stale indices from the front and weaker candidates from the back before adding each new index.”

That explanation demonstrates you understand **why** it’s O(n), not just memorized code.

## Common mistakes

1. Storing values instead of indices (can’t detect expiration cleanly).
2. Forgetting to evict out-of-window indices before reading answer.
3. Using `<` instead of `<=` when popping from back, which mishandles duplicates policy.
4. Appending result before window reaches size `k`.

Interview trigger: phrases like “for each contiguous window” + “max/min quickly” should immediately suggest **monotonic deque**.

---

## 2026-03-30

# Page 34 — Monotonic Stack: Largest Rectangle in Histogram

Yesterday you used a monotonic deque for sliding-window maximum. Today we stay in the same family but switch to **monotonic stack**, one of the highest-yield interview tools.

Classic prompt: given `heights[]` of bars in a histogram (width = 1), return the area of the largest rectangle.

Example: `heights = [2,1,5,6,2,3]` → answer is `10` (bars 5 and 6, width 2).

## Why brute force fails

A straightforward attempt picks every bar as the minimum height, then expands left/right until a smaller bar appears.
- Time: `O(n^2)` in worst case
- Too slow for large `n`

The optimized pattern is `O(n)` using an **increasing stack of indices**.

## Core invariant

Keep stack indices so heights are strictly increasing by value.
- When current height is **smaller** than the stack top height, you found the right boundary for the top bar.
- Pop that index, compute area with:
  - `height = heights[popped]`
  - `right = i`
  - `left = stack[-1]` after pop (or `-1` if empty)
  - `width = right - left - 1`

Each index is pushed once and popped once → linear time.

## Python template

```python
def largest_rectangle_area(heights):
    stack = []  # increasing heights' indices
    best = 0

    for i, h in enumerate(heights + [0]):  # sentinel flushes stack
        while stack and heights[stack[-1]] > h:
            idx = stack.pop()
            height = heights[idx]
            left = stack[-1] if stack else -1
            width = i - left - 1
            best = max(best, height * width)

        stack.append(i)

    return best
```

Complexity:
- Time: `O(n)`
- Space: `O(n)` stack worst case

## What to say out loud

“I maintain an increasing stack of bar indices. When I see a shorter bar, I pop taller bars and compute the maximum rectangle where each popped bar is the limiting height. The current index is the first smaller bar on the right; the new stack top is the first smaller bar on the left.”

That explanation usually lands because it proves you understand boundaries, not just memorized code.

## Common mistakes

1. **Forgetting the sentinel `0`** and missing rectangles that end at array tail.
2. **Using `>=` vs `>` blindly** in the pop condition; both can work, but be consistent with duplicate handling.
3. **Storing heights instead of indices**, which makes width computation awkward.
4. **Wrong width formula** (`i - left - 1` is the key line).

Interview trigger: if prompt says “nearest smaller to left/right”, “span”, or “largest area with contiguous bars,” think **monotonic stack** immediately.

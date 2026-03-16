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

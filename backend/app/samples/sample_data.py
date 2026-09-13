from backend.app.schemas.revision import (
    RevisionPack, LectureMetadata, ExecutiveSummary, RevisionTopic,
    TopicPriority, ConfusionPoint, Flashcard, QuizQuestion, KeyConcept
)

# ---------------------------------------------------------------------------
# SAMPLE 1: OPERATING SYSTEMS — VIRTUAL MEMORY & PAGING
# ---------------------------------------------------------------------------
SAMPLE_OS_PAGING = RevisionPack(
    metadata=LectureMetadata(
        title="Operating Systems — Virtual Memory & Paging",
        subject="Computer Science & Systems",
        total_pages_detected=38,
        estimated_study_time_mins=25,
        has_reliable_page_numbers=True
    ),
    executive_summary=ExecutiveSummary(
        overview="This lecture examines how operating systems virtualize computer memory to provide each process with an isolated, uniform address space larger than physical RAM. It develops the core machinery: page tables for address translation, hardware translation lookaside buffers (TLBs) to overcome memory access overhead, page fault trap handling, and replacement algorithms to avoid thrashing under heavy multi-programming.",
        key_takeaways=[
            "Virtual memory separates logical process memory from physical frames, completely eliminating external fragmentation.",
            "Address translation splits virtual addresses into a Virtual Page Number (VPN) and intra-page offset, resolved via page tables.",
            "The Translation Lookaside Buffer (TLB) caches recent VPN-to-PFN mappings; misses force a walk through main memory page tables.",
            "Page faults are hardware CPU traps triggered by invalid Page Table Entries, requiring the OS to swap frames from secondary storage.",
            "Thrashing occurs when the collective working sets exceed physical memory frames, collapsing CPU execution as processes wait on disk I/O."
        ],
        foundational_prerequisites=[
            "CPU execution cycles and the storage hierarchy (Registers, L1/L2/L3 Cache, RAM, SSD/Disk)",
            "Hardware interrupts vs. software trap exceptions",
            "Process memory layout (Text, Data, BSS, Heap, Stack)"
        ]
    ),
    key_concepts=[
        KeyConcept(
            id="kc_1",
            name="Virtual Address Space",
            definition="The logical view of memory assigned to a process, independent of physical RAM layout.",
            importance_summary="Enables multi-process isolation and non-contiguous allocation.",
            source_page=3
        ),
        KeyConcept(
            id="kc_2",
            name="Page Frame",
            definition="A fixed-size physical memory block that holds a single virtual page of equal size.",
            importance_summary="The fundamental physical unit of RAM allocation in paging systems.",
            source_page=5
        ),
        KeyConcept(
            id="kc_3",
            name="Translation Lookaside Buffer (TLB)",
            definition="An on-chip associative cache that stores recently used page table translations.",
            importance_summary="Crucial hardware component required to avoid doubling memory access latency.",
            source_page=12
        ),
        KeyConcept(
            id="kc_4",
            name="Page Fault",
            definition="A hardware exception raised when an instruction references a page marked not resident in RAM.",
            importance_summary="The bridge between physical RAM and secondary backing storage.",
            source_page=19
        ),
        KeyConcept(
            id="kc_5",
            name="Working Set",
            definition="The set of pages actively referenced by a process during a specific time window Delta.",
            importance_summary="The core metric used by the OS scheduler to detect and prevent thrashing.",
            source_page=32
        )
    ],
    high_priority_topics=[
        RevisionTopic(
            id="topic_1",
            title="Virtual Address Translation & Paging Mechanics",
            priority=TopicPriority.HIGH,
            why_important="High priority because all process memory isolation and dynamic address mapping in modern operating systems build upon this exact hardware-software translation.",
            core_summary="Divides physical memory into fixed-size frames and virtual memory into identical-sized pages. A per-process page table translates virtual page numbers (VPN) into physical frame numbers (PFN) while preserving the lower offset bits directly.",
            key_formulas_or_rules=[
                "Virtual Address = (Page Number [p], Page Offset [d])",
                "Frame Size == Page Size (typically 4 KB = 2^12 bytes, requiring 12 offset bits)",
                "Physical Address = (Frame Number [f] << 12) | Offset [d]"
            ],
            source_page=6,
            source_section="Address Translation Architecture"
        ),
        RevisionTopic(
            id="topic_2",
            title="Translation Lookaside Buffer (TLB) & Effective Access Time",
            priority=TopicPriority.HIGH,
            why_important="High priority because standard paging doubles memory accesses per instruction; understanding TLB hit rates and Effective Access Time explains memory performance in production systems.",
            core_summary="The TLB is an associative hardware cache storing recent page translations. A TLB hit resolves the physical frame in 1 cycle, whereas a TLB miss forces a memory walk of the page table before loading the translation into the cache.",
            key_formulas_or_rules=[
                "EAT = Hit_Ratio * (TLB_time + Mem_time) + (1 - Hit_Ratio) * (TLB_time + 2 * Mem_time)",
                "Context switches require flushing the TLB or tagging entries with Address Space Identifiers (ASID)"
            ],
            source_page=14,
            source_section="Hardware Acceleration: The TLB"
        ),
        RevisionTopic(
            id="topic_3",
            title="Page Fault Handling Sequence & Demand Paging",
            priority=TopicPriority.HIGH,
            why_important="High priority because it defines the exact boundary where hardware traps into the kernel, explaining how systems run programs larger than available physical RAM.",
            core_summary="When a page table entry has a valid bit of 0, reference triggers a CPU page fault trap. The OS kernel locates the missing page on disk backing store, finds a free frame, reads data via DMA, sets valid=1 in the PTE, and restarts the faulting instruction.",
            key_formulas_or_rules=[
                "PTE Valid Bit: 1 = resident in RAM, 0 = on disk backing store or unallocated",
                "Page Fault Service Time directly dominates effective memory latency (milliseconds vs nanoseconds)"
            ],
            source_page=21,
            source_section="Demand Paging & Traps"
        ),
        RevisionTopic(
            id="topic_4",
            title="Page Replacement Algorithms: FIFO, LRU, and Optimal",
            priority=TopicPriority.MEDIUM,
            why_important="Core supporting topic that governs which resident page is evicted when RAM is full, directly controlling system page fault frequency.",
            core_summary="Evaluates theoretical Optimal (MIN), FIFO (vulnerable to Belady's Anomaly where adding frames increases faults), and LRU (approximated in hardware via the Clock reference-bit algorithm).",
            key_formulas_or_rules=[
                "Belady's Anomaly: In FIFO, increasing frame allocation can counter-intuitively increase page faults",
                "LRU is a Stack Algorithm: N frames is always a subset of (N+1) frames"
            ],
            source_page=28,
            source_section="Victim Frame Eviction"
        ),
        RevisionTopic(
            id="topic_5",
            title="Thrashing & The Working-Set Model",
            priority=TopicPriority.MEDIUM,
            why_important="Core supporting topic explaining the catastrophic performance drop when processes spend more time paging than computing.",
            core_summary="Occurs when the sum of working sets across running processes exceeds total physical frames. As page faults cascade, the CPU ready queue empties and utilization drops to near zero.",
            key_formulas_or_rules=[
                "Working-Set Window Δ: The set of distinct pages referenced in the last Δ memory accesses",
                "If Σ WSS_i > total physical frames, the OS must suspend and swap out processes"
            ],
            source_page=34,
            source_section="System Thrashing & Schedulers"
        )
    ],
    common_confusion_points=[
        ConfusionPoint(
            id="conf_1",
            topic_ref="Virtual Address Translation & Paging Mechanics",
            concept_a="Internal Fragmentation",
            concept_b="External Fragmentation",
            key_distinction="Paging completely eliminates External Fragmentation because any free physical frame can be allocated to any process. However, paging still incurs minor Internal Fragmentation because a process rarely uses the exact last byte of its final 4 KB allocated page.",
            common_misconception="Students frequently assume paging eliminates all forms of fragmentation, failing to recognize that unused space within the final allocated frame is internal fragmentation.",
            source_page=8
        ),
        ConfusionPoint(
            id="conf_2",
            topic_ref="Translation Lookaside Buffer (TLB)",
            concept_a="TLB Miss",
            concept_b="Page Fault",
            key_distinction="A TLB Miss is a fast hardware cache miss where the mapping is absent from the TLB, but the page itself is still resident in physical RAM. A Page Fault is a kernel exception meaning the page is NOT in physical RAM at all and must be fetched from disk storage.",
            common_misconception="Assuming every TLB miss requires disk I/O, whereas almost all TLB misses are resolved in RAM within a few nanoseconds.",
            source_page=16
        ),
        ConfusionPoint(
            id="conf_3",
            topic_ref="Page Replacement Algorithms",
            concept_a="FIFO Replacement",
            concept_b="LRU / Stack Replacement",
            key_distinction="Stack algorithms like LRU guarantee that memory allocated with N frames is always a strict subset of memory with N+1 frames (preventing Belady's Anomaly). FIFO does not satisfy the inclusion property.",
            common_misconception="Assuming allocating more physical RAM to a process will always monotonically decrease or maintain its page fault rate.",
            source_page=30
        )
    ],
    flashcards=[
        Flashcard(
            id="card_1",
            topic_id="topic_1",
            front="What two values constitute a virtual address in a paging memory architecture?",
            back="Page Number (p) and Page Offset (d). The page number indexes the page table to find the frame number; the offset specifies the exact byte inside that frame.",
            hint="Think of the pair (p, d)"
        ),
        Flashcard(
            id="card_2",
            topic_id="topic_2",
            front="What is the operational purpose of the Translation Lookaside Buffer (TLB)?",
            back="To act as a high-speed hardware associative cache for page table entries, avoiding a second physical memory access on every memory reference.",
            hint="Hardware memory cache"
        ),
        Flashcard(
            id="card_3",
            topic_id="topic_3",
            front="What specific bit in a Page Table Entry (PTE) triggers a hardware page fault trap?",
            back="The valid-invalid bit. A value of 0 (invalid) signals that the requested page is not currently present in physical RAM.",
            hint="1-bit presence flag"
        ),
        Flashcard(
            id="card_4",
            topic_id="topic_4",
            front="What is Belady's Anomaly and which page replacement algorithm exhibits it?",
            back="Belady's Anomaly is the counter-intuitive phenomenon where increasing the number of physical frames increases total page faults. It can occur in First-In, First-Out (FIFO) replacement.",
            hint="FIFO non-stack behavior"
        ),
        Flashcard(
            id="card_5",
            topic_id="topic_5",
            front="What causes system thrashing in a multi-programmed OS?",
            back="Thrashing happens when active process working sets exceed total physical frames, causing processes to spend more time waiting for disk paging I/O than executing instructions.",
            hint="Working set saturation"
        ),
        Flashcard(
            id="card_6",
            topic_id="topic_2",
            front="Why must the TLB be flushed or use ASID during a process context switch?",
            back="Because virtual address 0x1000 in Process A maps to a different physical frame than 0x1000 in Process B. Flushing or ASID tagging prevents cross-process data leakage.",
            hint="Process isolation"
        )
    ],
    quiz=[
        QuizQuestion(
            id="q_1",
            topic_id="topic_1",
            topic_title="Virtual Address Translation & Paging Mechanics",
            question="In a system with a 32-bit virtual address and a page size of 4 KB (4096 bytes), how many bits are used for the page offset, and how many for the page number?",
            options=[
                "Offset: 12 bits, Page Number: 20 bits",
                "Offset: 16 bits, Page Number: 16 bits",
                "Offset: 10 bits, Page Number: 22 bits",
                "Offset: 14 bits, Page Number: 18 bits"
            ],
            correct_answer_index=0,
            explanation="Since 4 KB = 2^12 bytes, exactly 12 bits are required for the intra-page byte offset. In a 32-bit address space, the remaining 32 - 12 = 20 bits are allocated to the virtual page number (indexing up to 1,048,576 pages).",
            difficulty="MEDIUM"
        ),
        QuizQuestion(
            id="q_2",
            topic_id="topic_2",
            topic_title="Translation Lookaside Buffer (TLB)",
            question="Suppose memory access time is 100 ns, TLB lookup takes 20 ns, and the TLB hit ratio is 90%. What is the Effective Access Time (EAT)?",
            options=[
                "120 ns",
                "130 ns",
                "140 ns",
                "220 ns"
            ],
            correct_answer_index=1,
            explanation="EAT = Hit_Ratio * (TLB + Mem) + (1 - Hit_Ratio) * (TLB + 2 * Mem). Here: 0.90 * (20 + 100) + 0.10 * (20 + 200) = 0.90 * 120 + 0.10 * 220 = 108 + 22 = 130 ns. A miss requires reading the page table from RAM and then reading the target operand.",
            difficulty="HARD"
        ),
        QuizQuestion(
            id="q_3",
            topic_id="topic_3",
            topic_title="Page Fault Handling Sequence",
            question="What is the critical distinction between a TLB Miss and a Page Fault?",
            options=[
                "A TLB miss means the page is on disk; a page fault means the page is in cache",
                "A TLB miss is resolved by reading the page table in RAM; a page fault requires disk I/O to fetch non-resident frames",
                "A page fault is handled entirely in hardware, while a TLB miss always invokes the OS kernel trap handler",
                "Both terms describe the exact same hardware interrupt with zero operational difference"
            ],
            correct_answer_index=1,
            explanation="A TLB miss simply means the translation is absent from the CPU's fast cache, but the page may already reside in RAM. A page fault occurs when the valid bit is 0, meaning the page is not in RAM and requires kernel disk I/O.",
            difficulty="MEDIUM"
        ),
        QuizQuestion(
            id="q_4",
            topic_id="topic_4",
            topic_title="Page Replacement Algorithms",
            question="Which page replacement algorithm can experience an increase in page faults when additional physical memory frames are allocated?",
            options=[
                "Least Recently Used (LRU)",
                "Optimal (OPT / MIN)",
                "First-In, First-Out (FIFO)",
                "Least Frequently Used (LFU)"
            ],
            correct_answer_index=2,
            explanation="FIFO can suffer from Belady's Anomaly because it is not a stack algorithm. LRU and Optimal guarantee that the set of pages in an n-frame allocation is a subset of pages in an (n+1)-frame allocation.",
            difficulty="EASY"
        ),
        QuizQuestion(
            id="q_5",
            topic_id="topic_5",
            topic_title="Thrashing & The Working-Set Model",
            question="When thrashing occurs in a multiprogrammed system, why does CPU utilization drastically drop?",
            options=[
                "The CPU clock frequency throttles due to thermal overheating",
                "Processes are stuck waiting for disk paging I/O rather than executing instructions in the ready queue",
                "The Operating System kernel enters an infinite loop inside the TLB handler",
                "All user processes terminate due to segmentation faults"
            ],
            correct_answer_index=1,
            explanation="During thrashing, processes continuously fault on missing pages and queue up for disk swap I/O. Because almost every process is blocked waiting for paging, the ready queue empties and CPU utilization plummets.",
            difficulty="MEDIUM"
        )
    ]
)

# ---------------------------------------------------------------------------
# SAMPLE 2: MACHINE LEARNING — NEURAL NETWORKS & BACKPROPAGATION
# ---------------------------------------------------------------------------
SAMPLE_NEURAL_NETWORKS = RevisionPack(
    metadata=LectureMetadata(
        title="Machine Learning — Neural Networks, Backpropagation & Optimization",
        subject="Artificial Intelligence & Machine Learning",
        total_pages_detected=44,
        estimated_study_time_mins=30,
        has_reliable_page_numbers=True
    ),
    executive_summary=ExecutiveSummary(
        overview="This lecture builds the mathematical and computational foundations of Artificial Neural Networks. It begins with the artificial neuron (perceptron) and forward propagation through multi-layer architectures, presents the rigorous derivation of Backpropagation via the multivariate chain rule, and analyzes optimization strategies including Mini-batch Gradient Descent, Momentum, and Adam.",
        key_takeaways=[
            "Feedforward neural networks map inputs to outputs via sequential affine transformations followed by non-linear activations.",
            "Non-linear activation functions (ReLU, Sigmoid, GELU) allow networks to approximate arbitrary continuous functions (Universal Approximation Theorem).",
            "Backpropagation computes the gradient of the scalar loss function with respect to all layer weights using reverse-mode automatic differentiation.",
            "Vanishing and exploding gradients occur when derivative terms chain across deep layers, mitigated by ReLU activations and He/Xavier weight initialization.",
            "Modern optimizers like Adam combine adaptive per-parameter learning rates (RMSProp) with moving average momentum."
        ],
        foundational_prerequisites=[
            "Multivariable calculus: partial derivatives, gradient vector, chain rule",
            "Linear algebra: matrix multiplication, transpose, vector dot products",
            "Supervised learning concepts: loss functions (MSE, Cross-Entropy), training vs test datasets"
        ]
    ),
    key_concepts=[
        KeyConcept(
            id="kc_ml_1",
            name="Forward Propagation",
            definition="The pass that computes layer activations sequentially from input to output: z = W*x + b, a = sigma(z).",
            importance_summary="Produces the network prediction and computes the forward loss value.",
            source_page=4
        ),
        KeyConcept(
            id="kc_ml_2",
            name="Non-Linear Activation Function",
            definition="A mathematical function (e.g., ReLU, Sigmoid) applied element-wise to linear layer outputs.",
            importance_summary="Without non-linearities, any deep neural network collapses mathematically into a single linear model.",
            source_page=9
        ),
        KeyConcept(
            id="kc_ml_3",
            name="Backpropagation",
            definition="Reverse-mode automatic differentiation algorithm calculating dLoss/dWeight for all network parameters.",
            importance_summary="The computational backbone of deep learning training, scaling linearly with parameters.",
            source_page=17
        ),
        KeyConcept(
            id="kc_ml_4",
            name="Vanishing Gradient Problem",
            definition="Exponential decay of error gradients as they propagate backward through saturating activation functions.",
            importance_summary="Historically prevented training deep architectures; overcome by ReLU and residual connections.",
            source_page=26
        ),
        KeyConcept(
            id="kc_ml_5",
            name="Adam Optimizer",
            definition="Adaptive moment estimation optimizer combining exponential moving average gradients and squared gradients.",
            importance_summary="The default optimization algorithm in modern deep learning.",
            source_page=38
        )
    ],
    high_priority_topics=[
        RevisionTopic(
            id="topic_ml_1",
            title="Multilayer Perceptron (MLP) & Forward Propagation",
            priority=TopicPriority.HIGH,
            why_important="High priority because all deep learning models depend on matrix transformations composed with non-linear activation functions.",
            core_summary="Maps input vectors to outputs through stacked hidden layers. Each layer performs an affine transformation z^[l] = W^[l] * a^[l-1] + b^[l], followed by an element-wise non-linear activation a^[l] = g(z^[l]).",
            key_formulas_or_rules=[
                "Linear transformation: z^[l] = W^[l] * a^[l-1] + b^[l]",
                "Activation: a^[l] = g^[l](z^[l])",
                "Binary Cross-Entropy Loss: L(y, y_hat) = -[y*log(y_hat) + (1-y)*log(1-y_hat)]"
            ],
            source_page=6,
            source_section="Network Architecture & Forward Pass"
        ),
        RevisionTopic(
            id="topic_ml_2",
            title="The Backpropagation Algorithm & Chain Rule Derivation",
            priority=TopicPriority.HIGH,
            why_important="High priority because it provides the exact mathematical mechanism for updating weights in any supervised neural network.",
            core_summary="Uses the multivariate chain rule to propagate error gradients backward from the loss. Computes error delta^[l] = (W^[l+1]^T * delta^[l+1]) element-wise multiplied by g'^[l](z^[l]), yielding parameter gradients dW^[l] = delta^[l] * (a^[l-1])^T.",
            key_formulas_or_rules=[
                "Output layer error: delta^[L] = dL/da^[L] * g'^[L](z^[L])",
                "Hidden layer error: delta^[l] = (W^[l+1]^T * delta^[l+1]) ⊙ g'^[l](z^[l])",
                "Weight gradient: dW^[l] = delta^[l] * (a^[l-1])^T",
                "Bias gradient: db^[l] = delta^[l]"
            ],
            source_page=18,
            source_section="Mathematical Backpropagation"
        ),
        RevisionTopic(
            id="topic_ml_3",
            title="Vanishing & Exploding Gradients: Mitigation via ReLU & Initialization",
            priority=TopicPriority.HIGH,
            why_important="High priority because unstable gradients represent the primary failure mode when scaling from shallow to deep networks.",
            core_summary="Saturating activations like Sigmoid have maximum derivatives of 0.25; chaining these across multiple layers causes exponential decay of gradients towards the input layer. Mitigated using ReLU (derivative = 1 for positive inputs) and He/Xavier variance-scaled weight initialization.",
            key_formulas_or_rules=[
                "Sigmoid derivative max: sigma'(z) <= 0.25",
                "ReLU: f(x) = max(0, x), f'(x) = 1 for x > 0, 0 for x < 0",
                "He Initialization variance: Var(W) = 2 / n_in"
            ],
            source_page=27,
            source_section="Gradient Dynamics & Stabilization"
        ),
        RevisionTopic(
            id="topic_ml_4",
            title="Gradient Descent Variants: Batch, Stochastic (SGD), and Mini-Batch",
            priority=TopicPriority.MEDIUM,
            why_important="Core supporting topic that balances computational efficiency, memory consumption, and convergence stability.",
            core_summary="Batch GD computes gradients across the entire dataset (stable but slow and memory-heavy). SGD updates weights per single sample (fast but noisy). Mini-batch GD strikes the optimal balance using GPU vectorization over batch sizes of 32 to 512.",
            key_formulas_or_rules=[
                "Weight update: W = W - alpha * dW",
                "Batch size trade-off: larger batches maximize hardware parallelism; smaller batches provide regularizing noise"
            ],
            source_page=33,
            source_section="Optimization Algorithms"
        ),
        RevisionTopic(
            id="topic_ml_5",
            title="Adaptive Optimizers: Momentum, RMSProp, and Adam",
            priority=TopicPriority.MEDIUM,
            why_important="Core supporting topic covering the standard optimization algorithms used in modern practice to escape saddle points and speed up convergence.",
            core_summary="Momentum dampens oscillations by tracking an exponentially decaying average of past gradients. RMSProp scales learning rates inversely by root-mean-square past squared gradients. Adam unifies both techniques with bias correction.",
            key_formulas_or_rules=[
                "Momentum: v_t = beta_1 * v_{t-1} + (1 - beta_1) * g_t",
                "RMSProp: s_t = beta_2 * s_{t-1} + (1 - beta_2) * (g_t)^2",
                "Adam update: W = W - alpha * (v_hat / (sqrt(s_hat) + epsilon))"
            ],
            source_page=39,
            source_section="Advanced Adaptive Optimizers"
        )
    ],
    common_confusion_points=[
        ConfusionPoint(
            id="conf_ml_1",
            topic_ref="Multilayer Perceptron (MLP) & Forward Propagation",
            concept_a="Softmax Function",
            concept_b="Sigmoid Function",
            key_distinction="Sigmoid squashes a single scalar value into [0, 1] independently (ideal for binary classification). Softmax operates over a vector of logits, normalizing them such that the sum of all class probabilities equals exactly 1.0 (for mutually exclusive multi-class problems).",
            common_misconception="Students often use Sigmoid across multi-class outputs, assuming it produces a valid probability distribution, even though independent sigmoids do not sum to 1.",
            source_page=12
        ),
        ConfusionPoint(
            id="conf_ml_2",
            topic_ref="The Backpropagation Algorithm",
            concept_a="Parameter (Weights & Biases)",
            concept_b="Hyperparameter (Learning Rate, Epochs, Batch Size)",
            key_distinction="Parameters (W, b) are learned directly from training data via backpropagation gradients. Hyperparameters (learning rate, batch size, network depth) must be set prior to training and cannot be learned by gradient descent on the training set.",
            common_misconception="Treating learning rate as a parameter adjusted by backpropagation, rather than an externally configured hyperparameter.",
            source_page=22
        ),
        ConfusionPoint(
            id="conf_ml_3",
            topic_ref="Adaptive Optimizers",
            concept_a="L1 Regularization (Lasso)",
            concept_b="L2 Regularization (Ridge / Weight Decay)",
            key_distinction="L1 penalizes the absolute value of weights (|W|), driving non-essential weights to exact zero and inducing parameter sparsity. L2 penalizes squared weights (W^2), shrinking weights smoothly towards zero without driving them to exact zeros.",
            common_misconception="Assuming L2 regularization creates sparse networks with zeroed-out features, which is actually a property unique to L1.",
            source_page=36
        )
    ],
    flashcards=[
        Flashcard(
            id="card_ml_1",
            topic_id="topic_ml_1",
            front="Why can a deep neural network without non-linear activation functions only model linear relationships?",
            back="Because the composition of consecutive linear transformations is mathematically equivalent to a single linear transformation: W2*(W1*x) = (W2*W1)*x = W_combined*x.",
            hint="Matrix associativity"
        ),
        Flashcard(
            id="card_ml_2",
            topic_id="topic_ml_2",
            front="What mathematical principle enables backpropagation to calculate gradients efficiently across layers?",
            back="The chain rule of calculus. Backpropagation traverses from output to input, reusing intermediate error terms (reverse-mode automatic differentiation).",
            hint="Chain rule"
        ),
        Flashcard(
            id="card_ml_3",
            topic_id="topic_ml_3",
            front="Why does the Rectified Linear Unit (ReLU) activation prevent vanishing gradients for positive inputs?",
            back="Because for any positive input (z > 0), the derivative of ReLU is exactly 1.0, ensuring gradients do not decay when chained across deep layers.",
            hint="Constant slope"
        ),
        Flashcard(
            id="card_ml_4",
            topic_id="topic_ml_4",
            front="What is the key advantage of Mini-Batch Gradient Descent over pure Stochastic Gradient Descent (SGD)?",
            back="Mini-batch leverages GPU vectorized matrix operations for high computational throughput while smoothing gradient noise compared to single-sample updates.",
            hint="Hardware parallelism"
        ),
        Flashcard(
            id="card_ml_5",
            topic_id="topic_ml_5",
            front="What two distinct mechanisms are combined in the Adam optimizer?",
            back="Momentum (tracking first moment: exponentially decaying average of gradients) and RMSProp (tracking second moment: exponentially decaying average of squared gradients).",
            hint="First and second moments"
        ),
        Flashcard(
            id="card_ml_6",
            topic_id="topic_ml_3",
            front="What is the purpose of He (Kaiming) weight initialization?",
            back="It initializes weights with a variance of 2/n_in to keep activation variance consistent across layers when using ReLU activations, preventing exploding or vanishing signals.",
            hint="Variance scaling"
        )
    ],
    quiz=[
        QuizQuestion(
            id="q_ml_1",
            topic_id="topic_ml_1",
            topic_title="Multilayer Perceptron (MLP) & Forward Propagation",
            question="If all non-linear activation functions are removed from a 10-layer deep neural network, what is the effective expressive capacity of the model?",
            options=[
                "It can approximate any non-linear polynomial function up to degree 10",
                "It collapses mathematically into an ordinary single-layer linear model",
                "It becomes an unconstrained radial basis function network",
                "It cannot compute forward propagation because matrices will be singular"
            ],
            correct_answer_index=1,
            explanation="Without non-linear activations, composing 10 linear transformations is just repeated matrix multiplication: W10 * W9 * ... * W1 * x = W_effective * x + b_effective. A 10-layer linear network has the exact same representation power as a 1-layer linear model.",
            difficulty="EASY"
        ),
        QuizQuestion(
            id="q_ml_2",
            topic_id="topic_ml_2",
            topic_title="The Backpropagation Algorithm",
            question="During backpropagation in a neural network, what is the relationship between the computational complexity and the number of model weights?",
            options=[
                "Exponential in the number of layers",
                "Linear in the number of weights and operations",
                "Quadratic in the number of weights due to Hessian matrix calculations",
                "Independent of the number of parameters"
            ],
            correct_answer_index=1,
            explanation="Backpropagation utilizes reverse-mode automatic differentiation, caching intermediate forward activations and backward errors. This allows calculating all parameter gradients in O(W) operations—linear in the number of weights and connections.",
            difficulty="MEDIUM"
        ),
        QuizQuestion(
            id="q_ml_3",
            topic_id="topic_ml_3",
            topic_title="Vanishing & Exploding Gradients",
            question="Why does using the Sigmoid activation function in deep networks with 10+ layers frequently cause the vanishing gradient problem?",
            options=[
                "The maximum derivative of the Sigmoid function is 0.25, so multiplying many such derivatives rapidly approaches zero",
                "Sigmoid outputs negative values that cancel out positive gradients",
                "Sigmoid is non-differentiable at the origin z = 0",
                "Sigmoid forces all weights to become exactly equal to zero during forward propagation"
            ],
            correct_answer_index=0,
            explanation="The derivative of sigmoid is sigma(z)*(1 - sigma(z)), which achieves its maximum of 0.25 at z = 0. When chaining these derivatives across 10 layers, the product (<= 0.25^10 ~ 9.5e-7) diminishes exponentially, preventing early layers from updating.",
            difficulty="MEDIUM"
        ),
        QuizQuestion(
            id="q_ml_4",
            topic_id="topic_ml_4",
            topic_title="Gradient Descent Variants",
            question="What is the primary operational trade-off of using Stochastic Gradient Descent (SGD with batch size = 1) instead of Mini-batch Gradient Descent (batch size = 64)?",
            options=[
                "SGD requires higher GPU VRAM but guarantees monotonic decrease of loss on every step",
                "SGD updates parameters faster per step but suffers from high gradient variance and underutilizes GPU parallel tensor hardware",
                "SGD can only be used for convex optimization problems, whereas Mini-batch works for non-convex problems",
                "SGD completely eliminates the need to set a learning rate"
            ],
            correct_answer_index=1,
            explanation="With a batch size of 1, SGD updates weights after every single sample. While computationally cheap per step, the gradient estimate is noisy and fluctuating, and single-vector operations fail to exploit vectorized SIMD tensor cores on GPUs.",
            difficulty="MEDIUM"
        ),
        QuizQuestion(
            id="q_ml_5",
            topic_id="topic_ml_5",
            topic_title="Adaptive Optimizers",
            question="How does the Adam optimizer dynamically adjust the step size for individual parameters?",
            options=[
                "It scales step size inversely proportional to the root-mean-square of recent squared gradients, taking smaller steps for frequently updated parameters",
                "It randomly resets weights to zero whenever a saddle point is encountered",
                "It adjusts the batch size dynamically based on training loss curvature",
                "It calculates the exact second-order Hessian inverse for every single parameter"
            ],
            correct_answer_index=0,
            explanation="Adam maintains an exponential moving average of squared gradients (v_t). Dividing by sqrt(v_hat) + epsilon normalizes parameter updates: parameters with historically large gradients receive scaled-down step sizes, while infrequent or sparse features receive proportionally larger updates.",
            difficulty="HARD"
        )
    ]
)

SAMPLE_LECTURES = {
    "os_paging": SAMPLE_OS_PAGING,
    "neural_networks": SAMPLE_NEURAL_NETWORKS
}

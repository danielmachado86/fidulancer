export const fullTerms = [
    {
        name: "fixed_term",
        description: "",
        category: "",
        facts: [
            { name: "duration", input_type: "number" },
            { name: "duration_unit", input_type: "string" }, // Options: day, week, month, year
        ],
    },
    {
        name: "indefinite_term",
        description: "",
        category: "",
        facts: [
            { name: "duration", value: null },
            { name: "duration_unit", value: null },
        ],
    },
    {
        name: "start_date",
        description: "",
        category: "",
        facts: [
            { name: "signatures" },
            { name: "start_date", input_type: "date" },
        ],
    },
    {
        name: "end_date",
        description: "",
        category: "",
        facts: [
            { name: "start_date" },
            { name: "fixed_term" },
            { name: "indefinite_term" },
        ],
    },
    {
        name: "payment_type",
        description: "",
        category: "",
        facts: [
            { name: "payment_type", input_type: "string" }, // Options: recurring, installments, progress, one_payment
        ],
    },
    {
        name: "payment_term",
        description: "",
        category: "",
        facts: [
            { name: "payment_term", input_type: "string" }, // Options: advance, arrears, net-30, net-60, net-90
        ],
    },
    {
        name: "payment_recurrence",
        description: "",
        category: "",
        facts: [
            { name: "payment_recurrence", input_type: "string" }, // Options: day, week, month, year
        ],
    },
    {
        name: "payment_amount",
        description: "",
        category: "",
        facts: [
            { name: "payment_amount", input_type: "number" },
            { name: "payment_currency", input_type: "string" }, // Options: COP, USD
        ],
    },
    {
        name: "avanced_payment",
        description: "",
        category: "",
        facts: [{ name: "payment_term", value: "advance" }],
    },
    {
        name: "number_of_payments",
        description: "",
        category: "",
        facts: [{ name: "payment_schedule" }, { name: "payment_recurrence" }],
    },
    {
        name: "payment_period",
        description: "",
        category: "",
        facts: [
            { name: "payment_schedule" }, // Options: day, week, month, year
            { name: "payment_recurrence" }, // Options: COP, USD
            { name: "payment_amount" }, // Options: COP, USD
        ],
    },
    {
        name: "monthly_recurring_payment_schedule",
        description: "",
        category: "",
        facts: [
            { name: "payment_schedule", value: "recurring" },
            { name: "payment_recurrence", value: "month" },
        ],
    },
    {
        name: "termination_notice",
        description: "",
        category: "",
        facts: [
            { name: "notice_period", input_type: "number" },
            { name: "end_date" },
        ],
    },
    {
        name: "grace_period",
        description: "",
        category: "",
        facts: [
            { name: "grace_period", input_type: "number" },
            { name: "grace_period_unit", input_type: "string" }, // Options: day, week, month, year
        ],
    },
    {
        name: "payment_grace_period_5_days",
        description: "",
        category: "",
        facts: [
            { name: "grace_period", value: 5 },
            { name: "grace_period_unit", value: "day" },
        ],
    },
];

export const testTerms = [
    {
        name: "definite_end_date",
        category: "",
        facts: [
            { name: "start_date", input_type: "date" },
            { name: "duration", input_type: "number" },
        ],
        result: { name: "end_date" },
    },
    {
        name: "indefinite_end_date",
        category: "",
        facts: [],
        result: { name: "end_date" },
    },
    {
        name: "monthly_recurrent_payment",
        category: "",
        facts: [{ name: "payment_value", input_type: "number" }],
        result: { name: "payment_schedule" },
    },
    {
        name: "termination_notice",
        category: "",
        facts: [{ name: "notice_period", input_type: "number" }],
        result: { name: "termination_notice_date" },
    },
    {
        name: "payment_grace_period_5_days",
        category: "",
        facts: [],
        result: { name: "grace_period" },
    },
];

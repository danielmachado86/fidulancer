export const fullTerms = [
    {
        name: "fixed_term",
        category: "",
        facts: [
            { name: "duration", input_type: "number" },
            { name: "duration_unit", value: "month" },
        ],
    },
    {
        name: "indefinite_term",
        category: "",
        facts: [
            { name: "duration", value: null },
            { name: "duration_unit", value: null },
        ],
    },
    {
        name: "start_date",
        category: "",
        facts: [
            { name: "signatures" },
            { name: "start_date", input_type: "date" },
        ],
    },
    {
        name: "end_date",
        category: "",
        facts: [
            { name: "start_date" },
            { name: "duration" },
            { name: "duration_unit" },
        ],
    },
    {
        name: "payment_schedule",
        category: "",
        facts: [
            { name: "payment_schedule", input_type: "string" }, // Options: recurring, advance, installments, progress
        ],
    },
    {
        name: "payment_recurrence",
        category: "",
        facts: [
            { name: "payment_recurrence", input_type: "string" }, // Options: day, week, month, year
        ],
    },
    {
        name: "monthly_recurring_payment_schedule",
        category: "",
        facts: [
            { name: "payment_schedule", value: "recurring" },
            { name: "payment_recurrence", value: "month" },
        ],
    },
    {
        name: "termination_notice",
        category: "",
        facts: [
            { name: "notice_period", input_type: "number" },
            { name: "end_date" },
        ],
    },
    {
        name: "grace_period",
        category: "",
        facts: [
            { name: "grace_period", input_type: "number" },
            { name: "grace_period_unit", input_type: "string" }, // Options: day, week, month, year
        ],
    },
    {
        name: "payment_grace_period_5_days",
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

export const fullTerms = [
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
        result: { name: "end_date", value: false },
    },
    {
        name: "monthly_recurrent_payment",
        category: "",
        facts: [
            { name: "start_date" },
            { name: "duration" },
            { name: "payment_value" },
            { name: "end_date" },
            { name: "recurrence", value: "Month" },
        ],
        result: { name: "payment_schedule" },
    },
    {
        name: "termination_notice",
        category: "",
        facts: [
            { name: "notice_period", input_type: "number" },
            { name: "end_date" },
        ],
        result: { name: "termination_notice_date" },
    },
    {
        name: "payment_grace_period_5_days",
        category: "",
        facts: [],
        result: { name: "grace_period", value: 5, unit: "day" },
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

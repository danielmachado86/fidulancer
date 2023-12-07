export const fullTerms = [
    {
        name: "end_date",
        category: "",
        facts: [
            { name: "start_date", input_type: "date" },
            { name: "duration", input_type: "number" },
            { name: "duration_unit", value: "month" },
            { name: "open_ended" },
        ],
        result: { name: "end_date" },
    },
    {
        name: "open_ended",
        category: "",
        facts: [],
        result: { name: "open_ended" },
    },
    {
        name: "payment_schedule",
        category: "",
        facts: [],
        result: { name: "payment_schedule", value: "recurring" },
    },
    {
        name: "monthly_recurring_payment_schedule",
        category: "",
        facts: [],
        result: { name: "payment_recurrence", value: "month" },
    },
    {
        name: "recurring_payment_schedule",
        category: "",
        facts: [
            { name: "start_date" },
            { name: "duration" },
            { name: "duration_unit" },
            { name: "payment_value", input_type: "number" },
            { name: "payment_currency", value: "COP" },
            { name: "end_date" },
            { name: "payment_recurrence", value: "month" },
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

export type Term = {
    name: string;
    category: string;
    facts: { name: string; input_type: string }[];
    result: { name: string };
};

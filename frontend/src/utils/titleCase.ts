export const titleCase = (s: string) =>
    s.replace(/^_*(.)|_+(.)/g, (s, c: string, d: string) =>
        c ? c.toUpperCase() : " " + d.toUpperCase()
    );

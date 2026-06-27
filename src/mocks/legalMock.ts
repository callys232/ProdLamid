import { Contract, Invoice, Bill, Doc } from "@/types/legal";

export const contractsMock: Contract[] = [
    { id: 1, title: "Service Agreement", status: "Signed", docUrl: "https://docs.google.com/document/d/example" },
    { id: 2, title: "Partnership Contract", status: "Pending" },
];

export const invoicesMock: Invoice[] = [
    { id: 1, title: "Invoice #001", amount: 500, dueDate: "2026-03-15", status: "Pending", docUrl: "https://docs.google.com/document/d/example" },
    { id: 2, title: "Invoice #002", amount: 1200, dueDate: "2026-04-01", status: "Paid" },
];

export const billsMock: Bill[] = [
    { id: 1, title: "Electricity installation", dueDate: "2026-03-10", status: "Pending" },
    { id: 2, title: "Internet ISP", dueDate: "2026-03-05", status: "Paid" },
];

export const docsMock: Doc[] = [
    { id: 1, title: "[poultry starter]", status: "Uploaded", docUrl: "https://docs.google.com/document/d/example" },
    { id: 2, title: "Team Handbook mass print", status: "Uploaded" },
];

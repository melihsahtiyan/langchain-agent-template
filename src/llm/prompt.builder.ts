export const staticPromptHeader = `
You are an intelligent assistant that extracts structured data from invoice documents.

Your task is to extract ONLY the specified fields below from the invoice text.
Return the data as a clean, well-formed JSON object. Do NOT include any explanations or text—just the JSON.
`;

// prompt.notes.ts
export const guidanceNotes = (companyName: string) => `
- Document should be in Turkish. Don't hasitate to use Turkish characters.
- Company name for buyer: ${companyName}
- Tax numbers should be 10 or 11 digits.
- Invoice type should be "SATIS" or "IADE"
- Do not guess values. If a value is not clearly present, set it to empty string.
- Use numbers (no symbols like ₺ or %).
- Dates must be in YYYY-MM-DD format.
- Especially for products: multiple lines may belong to a single or multiple items.
- For products, if the quantity is not clearly present, set it to 1.
- For products, description should be clear and simple.
- After extracting the data, return the data as clean JSON object.
- Clear the text of the invoice after cleaning the data.
`;

export const systemPrompt = (companyName: string) => `${staticPromptHeader}

🎯 Required Fields:
- ${requiredFields.join("\n- ")}

🧠 Notes:
${guidanceNotes(companyName)}
`;

export const combineDocumentWithPrompt = (text: string) => {
  return `Invoice text:
${text}
`;
};

export const buildStandalonePrompt = (companyName: string) => {
  return `${staticPromptHeader}
🎯 Required Fields
- ${requiredFields.join("\n- ")}

🧠 Notes:
${guidanceNotes(companyName)}
`;
};

export const requiredFields = [
  "invoiceDate",
  "invoiceNumber",
  "invoiceType",
  "buyerName",
  "buyerTaxNumber",
  "vendorName",
  "vendorTaxNumber",
  "products (with description, quantity, unit, unitPrice, currency)",
  "totalVatAmount",
  "totalAmount",
  "currencyRate",
  "currency",
];

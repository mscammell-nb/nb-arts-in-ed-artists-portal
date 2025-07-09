import { Calendar, Download, FileText, Hash, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const TestPage = () => {
  const imageSource =
    "https://resources.finalsite.net/images/f_auto,q_auto/v1726066240/Branding/fczgbgadj3knyvi9wura/NB-Logo-Color.png";
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    from: {
      name: "",
      email: "",
      address: "",
      city: "",
      country: "",
    },
    to: {
      name: "",
      email: "",
      address: "",
      city: "",
      country: "",
    },
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
    tax: 0,
    discount: 0,
    currency: "USD",
  });

  const printRef = useRef();

  const updateInvoice = (path, value) => {
    setInvoice((prev) => {
      const newInvoice = { ...prev };
      const keys = path.split(".");
      let current = newInvoice;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newInvoice;
    });
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    if (invoice.items.length > 1) {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const updateItem = (index, field, value) => {
    setInvoice((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === "quantity" || field === "rate") {
        newItems[index].amount =
          newItems[index].quantity * newItems[index].rate;
      }

      return { ...prev, items: newItems };
    });
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * invoice.tax) / 100;
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * invoice.discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const generatePDF = () => {
    const printContent = printRef.current;
    const windowPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0",
    );

    windowPrint.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body class="bg-white">
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    windowPrint.document.close();
    windowPrint.focus();

    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8" />
                <h1 className="text-2xl font-bold">Invoice Generator</h1>
              </div>
              <button
                onClick={generatePDF}
                className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 font-semibold text-blue-600 transition-colors hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Invoice Details */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Hash className="h-4 w-4" />
                  <span>Invoice Number</span>
                </label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) =>
                    updateInvoice("invoiceNumber", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => updateInvoice("date", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>Due Date</span>
                </label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => updateInvoice("dueDate", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* From/To Section */}
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">
                  From
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Company/Name"
                    value={invoice.from.name}
                    onChange={(e) => updateInvoice("from.name", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={invoice.from.email}
                    onChange={(e) =>
                      updateInvoice("from.email", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={invoice.from.address}
                    onChange={(e) =>
                      updateInvoice("from.address", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={invoice.from.city}
                      onChange={(e) =>
                        updateInvoice("from.city", e.target.value)
                      }
                      className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={invoice.from.country}
                      onChange={(e) =>
                        updateInvoice("from.country", e.target.value)
                      }
                      className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">
                  To
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={invoice.to.name}
                    onChange={(e) => updateInvoice("to.name", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={invoice.to.email}
                    onChange={(e) => updateInvoice("to.email", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={invoice.to.address}
                    onChange={(e) =>
                      updateInvoice("to.address", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={invoice.to.city}
                      onChange={(e) => updateInvoice("to.city", e.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={invoice.to.country}
                      onChange={(e) =>
                        updateInvoice("to.country", e.target.value)
                      }
                      className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Items</h3>
                <button
                  onClick={addItem}
                  className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "quantity",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-16 rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "rate",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-20 rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-700">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 transition-colors hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Section */}
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Additional Options
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <label className="w-20 text-sm font-medium text-gray-700">
                      Tax %:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={invoice.tax}
                      onChange={(e) =>
                        updateInvoice("tax", parseFloat(e.target.value) || 0)
                      }
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="w-20 text-sm font-medium text-gray-700">
                      Discount %:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={invoice.discount}
                      onChange={(e) =>
                        updateInvoice(
                          "discount",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="w-20 text-sm font-medium text-gray-700">
                      Currency:
                    </label>
                    <select
                      value={invoice.currency}
                      onChange={(e) =>
                        updateInvoice("currency", e.target.value)
                      }
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({invoice.tax}%):</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({invoice.discount}%):</span>
                    <span>-${calculateDiscount().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Notes
              </h3>
              <textarea
                rows={4}
                placeholder="Additional notes or payment terms..."
                value={invoice.notes}
                onChange={(e) => updateInvoice("notes", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Print Preview */}
        <div className="hidden">
          <div ref={printRef}>
            <div className="mx-auto max-w-4xl bg-white p-8">
              <div className="mb-6 border-b-2 border-gray-200 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <img
                      src={imageSource}
                      alt="Nassau BOCES logo"
                      className="w-1/4"
                    />

                    <p className="mt-2 text-gray-600">
                      #{invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-nowrap text-sm text-gray-600">
                      Date: {invoice.date}
                    </p>
                    <p className="text-nowrap text-sm text-gray-600">
                      Due: {invoice.dueDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">From:</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{invoice.from.name}</p>
                    <p>{invoice.from.email}</p>
                    <p>{invoice.from.address}</p>
                    <p>
                      {invoice.from.city}, {invoice.from.country}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">To:</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{invoice.to.name}</p>
                    <p>{invoice.to.email}</p>
                    <p>{invoice.to.address}</p>
                    <p>
                      {invoice.to.city}, {invoice.to.country}
                    </p>
                  </div>
                </div>
              </div>

              <table className="mb-8 w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 text-left font-semibold text-gray-800">
                      Description
                    </th>
                    <th className="py-2 text-center font-semibold text-gray-800">
                      Qty
                    </th>
                    <th className="py-2 text-center font-semibold text-gray-800">
                      Rate
                    </th>
                    <th className="py-2 text-right font-semibold text-gray-800">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-gray-700">{item.description}</td>
                      <td className="py-2 text-center text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-2 text-center text-gray-700">
                        ${item.rate.toFixed(2)}
                      </td>
                      <td className="py-2 text-right text-gray-700">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-8 flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Tax ({invoice.tax}%):</span>
                    <span className="text-gray-800">
                      ${calculateTax().toFixed(2)}
                    </span>
                  </div>
                  {/* <div className="flex justify-between py-1">
                    <span className="text-gray-600">
                      Discount ({invoice.discount}%):
                    </span>
                    <span className="text-gray-800">
                      -${calculateDiscount().toFixed(2)}
                    </span>
                  </div> */}
                  <div className="flex justify-between border-t-2 border-gray-200 py-2 text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="border-t pt-6">
                  <h3 className="mb-2 font-semibold text-gray-800">Notes:</h3>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;

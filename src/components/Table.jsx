import { cn } from "@/lib/utils";

const Table = ({ headings, rows }) => {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="m-0 border p-0 even:bg-muted">
            {headings.map((heading, index) => (
              <th
                key={index}
                className={cn(
                  "px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                  headings.length > 1 && "border",
                )}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="m-0 border-t p-0 even:bg-muted">
              {row.map((item, index) => (
                <td
                  key={index}
                  className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                >
                  {item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

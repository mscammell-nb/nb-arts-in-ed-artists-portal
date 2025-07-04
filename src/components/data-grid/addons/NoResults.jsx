const NoResultsFound = ({ message = "No results found", icon = true }) => {
  return (
    <tr className="bg-foreground dark:border-gray-700 dark:bg-neutral-800">
      <td colSpan="100%" className="p-8 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          {icon && (
            <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-neutral-700">
              <svg
                className="h-6 w-6 text-tertiary dark:text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
          <h3 className="mb-1 text-lg font-semibold dark:text-white">
            {message}
          </h3>
        </div>
      </td>
    </tr>
  );
};

export default NoResultsFound;

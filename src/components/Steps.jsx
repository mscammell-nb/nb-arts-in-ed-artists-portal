import { Check } from "lucide-react";

const Steps = ({ stepTitles, formStep }) => {
  return (
    <>
      <div>
        <h2 className="sr-only">Steps</h2>

        <ol className="relative z-10 flex justify-between text-sm font-medium w-[965px]">
          {stepTitles.map((stepTitle, index) => (
            <li
              key={index}
              className={`relative flex items-center gap-2 bg-gray-50 p-2 ${
                index < stepTitles.length - 1 &&
                `after:absolute after:left-full after:top-1/2 after:h-0.5 after:w-full after:-translate-y-1/2 ${index < formStep ? "after:bg-bocesPrimary" : "after:bg-gray-300"} after:content-[""]`
              }`}
            >
              <span
                className={`flex size-11 items-center justify-center rounded-full font-bold ${index === formStep && "border-2 border-bocesPrimary"} ${index < formStep ? "bg-bocesPrimary text-white" : "bg-gray-300"}`}
              >
                {index < formStep ? <Check size="18px" /> : index + 1}
              </span>
              <span
                className={`hidden sm:block ${index <= formStep && "text-bocesPrimary"}`}
              >
                {stepTitle}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

export default Steps;

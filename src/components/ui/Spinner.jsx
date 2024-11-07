const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-lighter border-t-transparent"></div>
      <p className="text-primary">Loading...</p>
    </div>
  );
};

export default Spinner;

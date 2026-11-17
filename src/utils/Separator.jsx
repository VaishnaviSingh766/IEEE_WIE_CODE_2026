const Separator = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex w-full items-center justify-center py-6 ${className}`}
    >
      <div className="relative h-[2px] w-[220px] sm:w-[240px] bg-gradient-to-r from-transparent via-[#B0008D] to-transparent">
        <span className="absolute left-1/2 top-1/2 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-[#B0008D] bg-black" />
      </div>
    </div>
  );
};

export default Separator;
"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="font-sans text-[8px] text-skims-accent tracking-[4px] uppercase block">
          Something went wrong
        </span>
        <h2 className="font-serif text-2xl md:text-3xl text-white uppercase tracking-wide font-light">
          Storefront Error
        </h2>
        <p className="font-sans text-sm text-skims-sand/55 leading-relaxed">
          There was an issue loading this page. This is usually temporary —
          try again and it should resolve itself.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-10 py-4 bg-skims-accent hover:bg-white text-black font-sans font-bold text-[9.5px] tracking-[3px] uppercase transition-all duration-300 rounded-full hover:scale-[1.02] cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

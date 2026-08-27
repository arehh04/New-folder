export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-royalty-nude-dark shadow-xs flex flex-col pointer-events-none h-full">
      <div className="h-64 bg-royalty-nude/70 animate-pulse relative">
        <div className="absolute top-4 right-4 w-16 h-5 bg-royalty-nude-dark/60 rounded-full"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="h-5 bg-royalty-nude-dark/50 rounded animate-pulse w-3/4 mb-4"></div>
        <div className="h-4 bg-royalty-nude/80 rounded animate-pulse w-full mb-2"></div>
        <div className="h-4 bg-royalty-nude/80 rounded animate-pulse w-2/3 mb-6"></div>
        <div className="mt-auto pt-4 border-t border-royalty-nude flex justify-between items-center">
          <div className="h-5 w-14 bg-royalty-nude-dark/50 rounded-full animate-pulse"></div>
          <div className="h-9 w-24 bg-royalty-nude-dark/60 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

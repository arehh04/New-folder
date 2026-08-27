import { FC } from 'react';

export const CardSkeleton: FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-royalty-nude-dark shadow-xs flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-72 bg-royalty-nude/70 relative">
        <div className="absolute top-4 left-4 w-20 h-6 bg-royalty-nude-dark rounded-full"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="w-3/4 h-5 bg-royalty-nude rounded-md mb-2"></div>
          <div className="w-1/2 h-4 bg-royalty-nude/80 rounded-md"></div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-royalty-nude">
          <div className="w-20 h-6 bg-royalty-nude rounded-md"></div>
          <div className="w-24 h-10 bg-royalty-nude-dark rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;

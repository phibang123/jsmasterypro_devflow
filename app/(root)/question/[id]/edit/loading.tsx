import { Skeleton } from "@/components/ui/skeleton";

const EditQuestionLoading = () => {
  return (
    <div>
      <Skeleton className="h-10 w-[200px]" />

      <div className="mt-9 space-y-8">
        {/* Title Input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-[350px] w-full" />
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        {/* Submit Button */}
        <Skeleton className="ml-auto h-10 w-[100px]" />
      </div>
    </div>
  );
};

export default EditQuestionLoading;

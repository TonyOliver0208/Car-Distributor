import { Button } from "@/components/ui/button";
import { Filter, Star } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const ReviewControls = ({
  sortBy,
  setSortBy,
  filterByRating,
  setFilterByRating,
  t,
}) => (
  <div className="flex items-center gap-3">
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter size={16} />
          {t("ratingAndComment.filter")}
          {filterByRating && (
            <span className="ml-1 text-xs font-medium">
              (
              {filterByRating === 5
                ? "5★"
                : `${filterByRating}★${filterByRating === 1 ? " only" : "+"}`}
              )
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${
              filterByRating === null ? "bg-blue-50" : ""
            }`}
            onClick={() => setFilterByRating(null)}
          >
            {t("ratingAndComment.allRatings")}
          </Button>
          {[5, 4, 3, 2, 1].map((starCount) => (
            <Button
              key={starCount}
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${
                filterByRating === starCount ? "bg-blue-50" : ""
              }`}
              onClick={() => setFilterByRating(starCount)}
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(starCount)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill="#facc15"
                      className="text-yellow-400"
                    />
                  ))}
                </div>
                <span>
                  {starCount === 5
                    ? t("ratingAndComment.excellent")
                    : starCount === 1
                    ? t("ratingAndComment.poor")
                    : `${starCount}+`}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>

    {/* Sort Select */}
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("ratingAndComment.sortBy")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mostRecent">
          {t("ratingAndComment.mostRecent")}
        </SelectItem>
        <SelectItem value="highestRating">
          {t("ratingAndComment.highestRating")}
        </SelectItem>
        <SelectItem value="lowestRating">
          {t("ratingAndComment.lowestRating")}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default ReviewControls;

import { Button } from "@/components/ui/button";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="flex justify-center gap-2 mt-8">
    <Button
      variant="outline"
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="rounded-lg"
    >
      &larr;
    </Button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <Button
        key={page}
        variant={currentPage === page ? "default" : "outline"}
        onClick={() => setCurrentPage(page)}
        className={`rounded-lg ${
          currentPage === page ? "bg-blue-500 hover:bg-blue-600" : ""
        }`}
      >
        {page}
      </Button>
    ))}

    <Button
      variant="outline"
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="rounded-lg"
    >
      &rarr;
    </Button>
  </div>
);

export default Pagination;

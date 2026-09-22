import { JSX } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { getPageWindow } from '@/lib/pageWindow';

interface RankingListPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

// eslint-disable-next-line import/prefer-default-export
export function RankingListPagination({ page, pageCount, onPageChange }: RankingListPaginationProps): JSX.Element | null {
  if (pageCount <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>
        {getPageWindow(page, pageCount).map((token) => (
          <PaginationItem key={token}>
            {typeof token === 'number' ? (
              <Button
                variant={token === page ? 'outline' : 'ghost'}
                size="icon"
                onClick={() => onPageChange(token)}
                aria-label={`Page ${token}`}
                aria-current={token === page ? 'page' : undefined}
                className="tabular-nums"
              >
                {token}
              </Button>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
            aria-label="Page suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

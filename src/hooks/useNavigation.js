import { useState, useCallback } from 'react';

export function useNavigation(initial = 'dashboard') {
  const [page, setPage] = useState(initial);
  const [pageData, setPageData] = useState(null);

  const go = useCallback((id, data = null) => {
    setPage(id);
    setPageData(data);
  }, []);

  return { page, pageData, go };
}

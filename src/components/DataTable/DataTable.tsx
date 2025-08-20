import React, { useState, useMemo, useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  sorter?: (a: T, b: T) => number;
}

export interface DataTableProps<T extends { id: React.Key }> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  rowClassName?: (row: T) => string;
  emptyMessage?: React.ReactNode;
  loadingMessage?: React.ReactNode;
}

type SortConfig<T> = {
  key: keyof T;
  direction: 'ascending' | 'descending';
} | null;

export const DataTable = <T extends { id: React.Key }>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  rowClassName,
  emptyMessage,
  loadingMessage,
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<React.Key>>(new Set());

  const selectAllRef = useRef<HTMLInputElement>(null);

  // Keep indeterminate state in sync
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedRowIds.size > 0 && selectedRowIds.size < data.length;
    }
  }, [selectedRowIds, data]);

  // Clear selection when data changes
  useEffect(() => {
    setSelectedRowIds(new Set());
  }, [data]);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig) {
      const { key, direction } = sortConfig;
      const col = columns.find((c) => c.dataIndex === key);

      const multiplier = direction === 'ascending' ? 1 : -1;
      sortableData = sortableData
        .map((item, idx) => ({ item, idx })) // stable sort trick
        .sort((a, b) => {
          let cmp: number;
          if (col?.sorter) {
            cmp = col.sorter(a.item, b.item);
          } else {
            const aValue = a.item[key];
            const bValue = b.item[key];
            if (aValue < bValue) cmp = -1;
            else if (aValue > bValue) cmp = 1;
            else cmp = 0;
          }
          if (cmp !== 0) return cmp * multiplier;
          return a.idx - b.idx;
        })
        .map(({ item }) => item);
    }
    return sortableData;
  }, [data, sortConfig, columns]);

  const requestSort = (key: keyof T) => {
    setSortConfig((prev) =>
      prev && prev.key === key && prev.direction === 'ascending'
        ? { key, direction: 'descending' }
        : { key, direction: 'ascending' }
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedRowIds = event.target.checked
      ? new Set<React.Key>(data.map((row) => row.id))
      : new Set<React.Key>();
    setSelectedRowIds(newSelectedRowIds);
    onRowSelect?.(data.filter((row) => newSelectedRowIds.has(row.id)));
  };

  const handleSelectRow = (id: React.Key, event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedRowIds = new Set(selectedRowIds);
    event.target.checked ? newSelectedRowIds.add(id) : newSelectedRowIds.delete(id);
    setSelectedRowIds(newSelectedRowIds);
    onRowSelect?.(data.filter((row) => newSelectedRowIds.has(row.id)));
  };

  // --- Render States ---
  if (loading) {
    return (
      <div className="p-4 border rounded-lg">
        {loadingMessage || (
          <div className="space-y-2 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-full" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-full" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="p-10 text-center border rounded-lg">
        {emptyMessage || (
          <>
            <h3 className="text-lg font-medium text-gray-700">No Data</h3>
            <p className="text-sm text-gray-500">Nothing to display right now.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th scope="col" className="px-6 py-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  aria-label="Select all rows"
                  onChange={handleSelectAll}
                  checked={selectedRowIds.size === data.length && data.length > 0}
                  className="rounded border-gray-300"
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortConfig?.key === col.dataIndex;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    col.sortable
                      ? isSorted
                        ? sortConfig!.direction === 'ascending'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => requestSort(col.dataIndex)}
                      className="flex items-center gap-1 hover:text-gray-800"
                    >
                      {col.title}
                      {isSorted && (
                        <span aria-hidden>
                          {sortConfig!.direction === 'ascending' ? '▲' : '▼'}
                        </span>
                      )}
                    </button>
                  ) : (
                    col.title
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row) => (
            <tr
              key={row.id}
              className={clsx(
                selectedRowIds.has(row.id) && 'bg-blue-50',
                rowClassName?.(row)
              )}
            >
              {selectable && (
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    aria-label={`Select row ${row.id}`}
                    checked={selectedRowIds.has(row.id)}
                    onChange={(e) => handleSelectRow(row.id, e)}
                    className="rounded border-gray-300"
                  />
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                >
                  {String(row[col.dataIndex])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
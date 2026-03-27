import React from 'react';
import { clsx } from 'clsx';

const Table = ({ children, className = '', ...props }) => (
  <div className="overflow-x-auto">
    <table
      className={clsx(
        'w-full text-sm',
        className
      )}
      {...props}
    >
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, className = '' }) => (
  <thead className={clsx('border-b border-border', className)}>
    {children}
  </thead>
);

const TableBody = ({ children, className = '' }) => (
  <tbody className={clsx('divide-y divide-border', className)}>
    {children}
  </tbody>
);

const TableRow = ({ children, className = '', hover = true, ...props }) => (
  <tr
    className={clsx(
      'transition-colors duration-150',
      hover && 'hover:bg-accent/50',
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

const TableHead = ({ children, className = '', align = 'left', ...props }) => (
  <th
    className={clsx(
      'px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider',
      {
        'text-center': align === 'center',
        'text-right': align === 'right',
      },
      className
    )}
    {...props}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = '', align = 'left', ...props }) => (
  <td
    className={clsx(
      'px-4 py-3 text-foreground',
      {
        'text-center': align === 'center',
        'text-right': align === 'right',
      },
      className
    )}
    {...props}
  >
    {children}
  </td>
);

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export { Table };
export default Table;
export { TableHeader, TableBody, TableRow, TableHead, TableCell };

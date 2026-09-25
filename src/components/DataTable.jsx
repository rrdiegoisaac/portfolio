import './DataTable.css'

// columns: [{ key, label, numeric?, format? }] · rows: array de objetos
function DataTable({ columns, rows, rowKey }) {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.numeric ? 'data-table__num' : undefined}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((col) => {
                const value = row[col.key]
                return (
                  <td key={col.key} className={col.numeric ? 'data-table__num' : undefined}>
                    {value == null
                      ? '—'
                      : col.format
                        ? col.format(value, row)
                        : typeof value === 'number'
                          ? value.toLocaleString('es-CL')
                          : value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable

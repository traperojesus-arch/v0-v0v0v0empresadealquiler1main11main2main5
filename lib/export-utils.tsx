export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert("No hay datos para exportar")
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escapar valores que contengan comas o comillas
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: any[], filename: string) {
  if (data.length === 0) {
    alert("No hay datos para exportar")
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function printDocument(elementId: string) {
  const printContent = document.getElementById(elementId)
  if (!printContent) {
    alert("No se encontró el contenido para imprimir")
    return
  }

  const windowPrint = window.open("", "", "width=800,height=600")
  if (!windowPrint) {
    alert("No se pudo abrir la ventana de impresión")
    return
  }

  windowPrint.document.write(`
    <html>
      <head>
        <title>Imprimir</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `)

  windowPrint.document.close()
  windowPrint.focus()
  windowPrint.print()
  windowPrint.close()
}

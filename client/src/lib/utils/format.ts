const priceFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export const formatPrice = (value: number) => {
  return priceFormatter.format(value)
}

export const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return dateFormatter.format(date)
  } catch {
    return dateStr
  }
}

export const formatOrderNumber = (orderNumber: string) => {
  return `#${orderNumber}`
}


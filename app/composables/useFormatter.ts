export const useFormatter = () => {

  // ================= PRICE =================
  const formatPrice = (value?: number | null) => {
    if (value === null || value === undefined) return '-'

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  // ================= DATE =================
  const formatDate = (date?: string | null) => {
    if (!date) return '-'

    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date))
  }

  // ================= DATE SHORT =================
  const formatDateShort = (date?: string | null) => {
    if (!date) return '-'

    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short'
    }).format(new Date(date))
  }

  return {
    formatPrice,
    formatDate,
    formatDateShort
  }
}
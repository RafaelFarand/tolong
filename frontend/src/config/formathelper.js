export const formatPrice = (price) => {
  return Number(price).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
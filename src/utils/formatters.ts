export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const calculateTotal = (price: number, quantity: number = 1, width: number = 2.90, height: number = 1.90): number => {
  // Calculate net dimensions (subtract 5cm from each dimension)
  const netWidth = width - 0.05;
  const netHeight = height - 0.05;
  const netArea = netWidth * netHeight;
  return price * quantity * netArea;
};

export const getDefaultValidityDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 7); // 7 days validity by default
  return date;
};
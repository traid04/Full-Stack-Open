export const isNotAnArrayNumber = (array: string[]): boolean => {
  return array.some((num) => isNaN(Number(num)));
};

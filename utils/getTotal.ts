import { Fee } from "~/types/enums";

export default function getTotal(base: number) {
  const total =
    Fee.AKONTACIJA_POREZA * base +
    Fee.NEZAPOSLENOST * base +
    Fee.PIO * base +
    Fee.ZDRAVSTVO * base;

  return total.toFixed(2);
}

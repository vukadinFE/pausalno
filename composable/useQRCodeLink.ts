import { format, getYear } from "date-fns";
import { srLatn } from "date-fns/locale";
import { useDataStore } from "~/store/useDataStore";
import { Fee, FeeType } from "~/types/enums";

export default function useQRCodeLink(
  id: Ref<string>,
  type: Ref<FeeType>,
  month: Ref<number>
) {
  const dataStore = useDataStore(id.value)();

  const feeMultiplier = new Map([
    [FeeType.AKONTACIJA_POREZA, Fee.AKONTACIJA_POREZA],
    [FeeType.ZDRAVSTVO, Fee.ZDRAVSTVO],
    [FeeType.PIO, Fee.PIO],
    [FeeType.NEZAPOSLENOST, Fee.NEZAPOSLENOST],
  ]);

  const fee = computed(() => {
    return (
      (dataStore.data?.osnovica || 1) * (feeMultiplier.get(type.value) || 1)
    );
  });

  const accounts = computed(() => {
    return new Map([
      [FeeType.AKONTACIJA_POREZA, dataStore.data?.akontacijaRacun],
      [FeeType.ZDRAVSTVO, dataStore.data?.zdravstvoRacun],
      [FeeType.PIO, dataStore.data?.pioRacun],
      [FeeType.NEZAPOSLENOST, dataStore.data?.nezaposlenostRacun],
    ]);
  });

  const models = computed(() => {
    return new Map([
      [FeeType.AKONTACIJA_POREZA, dataStore.data?.akontacijaBroj],
      [FeeType.ZDRAVSTVO, dataStore.data?.zdravstvoBroj],
      [FeeType.PIO, dataStore.data?.pioBroj],
      [FeeType.NEZAPOSLENOST, dataStore.data?.nezaposlenostBroj],
    ]);
  });

  const monthName = computed(() => {
    return format(new Date(2022, month.value, 1), "LLLL", {
      locale: srLatn,
    });
  });

  const typeReasons = new Map([
    [FeeType.AKONTACIJA_POREZA, "POREZ"],
    [FeeType.ZDRAVSTVO, "ZDRAVSTVO"],
    [FeeType.PIO, "PIO"],
    [FeeType.NEZAPOSLENOST, "NEZAPOSLENOST"],
  ]);

  const link = computed(() => {
    const account = accounts.value.get(type.value);
    const model = models.value.get(type.value);
    const amount = fee.value.toFixed(2).toString().replace(".", ",");
    const reason = `${typeReasons.get(type.value)} za ${
      monthName.value
    } ${getYear(new Date())}.`;

    if (!dataStore.data) return "";
    return `K:PR|V:01|C:1|R:${account}|N:Poreska uprava Republike Srbije|I:RSD${amount}|P:Moja Firma|SF:153|S:${reason}|RO:${model}`;
  });

  return link;
}

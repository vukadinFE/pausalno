import { format, getYear } from "date-fns";
import { srLatn } from "date-fns/locale";
import { useDataStore } from "~/store/useDataStore";
import { Fee, FeeType } from "~/types/enums";

export default function useQRCodeLink(type: Ref<FeeType>, month: Ref<number>) {
  const dataStore = useDataStore();

  const feeMultiplier = new Map([
    [FeeType.AKONTACIJA_POREZA, Fee.AKONTACIJA_POREZA],
    [FeeType.ZDRAVSTVO, Fee.ZDRAVSTVO],
    [FeeType.PIO, Fee.PIO],
    [FeeType.NEZAPOSLENOST, Fee.NEZAPOSLENOST],
  ]);

  const fee = computed(() => {
    console.log({
      osnovica: dataStore.data?.osnovica,
      feeMultiplier: feeMultiplier.get(type.value),
    });
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
    return `K:PR|V:01|C:1|R:${account}|N:Poreska uprava Republike Srbije|I:RSD${amount}|P:${dataStore.data.firma}|SF:153|S:${reason}|RO:${model}`;
  });

  return link;
}

// K:PR|V:01|C:1|R:845000000040484987|N:JP EPS BEOGRAD
// BALKANSKA 13|I:RSD3596,13|P:MRĐO MAČKATOVIĆ
// ŽUPSKA 13
// BEOGRAD 6|SF:189|S:UPLATA PO RAČUNU ZA EL. ENERGIJU|RO:97163220000111111111000

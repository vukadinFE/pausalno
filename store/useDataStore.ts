import useLocalForage from "~/composable/useLocalForage";
import { DATA_PATH } from "~/consts";
import type { TData } from "~/types/data";

export const useDataStore = defineStore("data-store", () => {
  const localForage = useLocalForage();
  const validateData = (data: TData) => {
    try {
      const requiredFields = [
        "osnovica",
        "firma",
        "akontacijaRacun",
        "akontacijaBroj",
        "zdravstvoRacun",
        "zdravstvoBroj",
        "pioRacun",
        "pioBroj",
        "nezaposlenostRacun",
        "nezaposlenostBroj",
      ];

      for (const field of requiredFields) {
        if (!data.hasOwnProperty(field)) {
          throw new Error(`Missing field: ${field}`);
        }
      }

      return data;
    } catch (error) {
      console.error("Invalid data:", error);
      return null;
    }
  };

  const data = ref<TData | null>(null);
  const fetching = ref(false);
  const error = ref<string | null>(null);

  const getData = async () => {
    try {
      error.value = null;
      fetching.value = true;
      const res = await localForage.getItem<TData>(DATA_PATH);

      fetching.value = false;

      console.log("DATA FETCH RESULT--", res);

      if (!res) {
        throw new Error("Data not found");
      }

      const parsetData = validateData(res);

      data.value = parsetData;
    } catch (er) {
      const e = er as Error;
      console.log("DATA FETCH ERROR--", e.message);
      error.value = e.message;
    } finally {
      fetching.value = false;
    }
  };

  onMounted(() => {
    getData();
  });

  return {
    data,
    error,
    fetching,
  };
});

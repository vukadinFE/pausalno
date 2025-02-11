import useLocalForage from "~/composable/useLocalForage";
import type { TData } from "~/types/data";

export const useDataStore = (id: string) =>
  defineStore(`data-store-${id}`, () => {
    const localForage = useLocalForage();
    const validateData = (data: TData) => {
      try {
        const requiredFields: (keyof TData)[] = [
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
        const storageKey = dataStorage(companyName(id));
        const res = await localForage.getItem<TData>(storageKey);

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

<script setup lang="ts">
import { object, string, number } from "yup";
import type { Form, FormSubmitEvent } from "@nuxt/ui";
import useThemeColor from "~/composable/useThemeColor";
import axios from "axios";
import useLocalForage from "~/composable/useLocalForage";
import type { TData } from "~/types/data";
import { DATA_PATH } from "~/consts";

const router = useRouter();

const required = "Обавезно поље";

const requiredField = string().required(required);

const schema = object<TData>({
  osnovica: number().typeError(required).required(required),
  firma: requiredField,
  akontacijaRacun: requiredField,
  akontacijaBroj: requiredField,
  zdravstvoRacun: requiredField,
  zdravstvoBroj: requiredField,
  pioRacun: requiredField,
  pioBroj: requiredField,
  nezaposlenostRacun: requiredField,
  nezaposlenostBroj: requiredField,
});

const state = reactive<Partial<TData>>({
  osnovica: undefined,
  firma: undefined,
  akontacijaRacun: undefined,
  akontacijaBroj: undefined,
  zdravstvoRacun: undefined,
  zdravstvoBroj: undefined,
  pioRacun: undefined,
  pioBroj: undefined,
  nezaposlenostRacun: undefined,
  nezaposlenostBroj: undefined,
});

const toast = useToast();
const form = ref<Form<TData>>();

const errorROStart = "Таг RO";
const errorRStart = "Таг R ";

const cleanErrorMessage = (message: string, start: string) => {
  if (!message.startsWith(start)) {
    return null;
  }
  return message
    .replace(start, "")
    .replace(" - ", "")
    .replace("- ", "")
    .replace(/ Унето: '.*'/, "")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

const validate = async (R: string, RO: string) => {
  const request = `K:PR|V:01|C:1|R:${R}|N:TEST_NAME|I:RSD2000,00|P:TEST_SENDER|SF:153|S:TEST_RESON|RO:${RO}`;
  const { data } = await axios.post<{
    s: { code: number; desc: string };
    e: string[];
  }>("https://nbs.rs/QRcode/api/qr/v1/validate?lang=sr_RS", request, {
    headers: {
      "Content-Length": 0,
      "Content-Type": "text/plain",
    },
  });

  if (data.s.code === 0) {
    return true;
  }

  const rError = data.e.findLast((e) => e.startsWith(errorRStart));
  const roError = data.e.findLast((e) => e.startsWith(errorROStart));

  return {
    r: rError && cleanErrorMessage(rError, errorRStart),
    ro: roError && cleanErrorMessage(roError, errorROStart),
    desc: data.s.desc,
  };
};

const validatePart = async (
  rKey: keyof TData,
  r: string,
  roKey: keyof TData,
  ro: string
) => {
  const validated = await validate(r, ro);

  console.log(validated);

  if (validated !== true) {
    toast.add({
      title: "Грешка",
      description: validated.desc,
      color: "error",
    });
    if (validated.r) {
      form.value!.setErrors([
        {
          message: validated.r,
          name: rKey,
        },
      ]);
    }
    if (validated.ro) {
      form.value!.setErrors([
        {
          message: validated.ro,
          name: roKey,
        },
      ]);
    }
    return false;
  }
  return true;
};

const localForage = useLocalForage();

async function onSubmit(event: FormSubmitEvent<TData>) {
  form.value!.clear();

  // SECTION: Validate akontacija
  const validateAkontacija = await validatePart(
    "akontacijaRacun",
    event.data.akontacijaRacun,
    "akontacijaBroj",
    event.data.akontacijaBroj
  );
  if (!validateAkontacija) return;

  // SECTION: Validate zdravstvo
  const validateZdravstvo = await validatePart(
    "zdravstvoRacun",
    event.data.zdravstvoRacun,
    "zdravstvoBroj",
    event.data.zdravstvoBroj
  );
  if (!validateZdravstvo) return;

  // SECTION: Validate pio
  const validatePio = await validatePart(
    "pioRacun",
    event.data.pioRacun,
    "pioBroj",
    event.data.pioBroj
  );
  if (!validatePio) return;

  // SECTION: Validate nezaposlenost
  const validateNezaposlenost = await validatePart(
    "nezaposlenostRacun",
    event.data.nezaposlenostRacun,
    "nezaposlenostBroj",
    event.data.nezaposlenostBroj
  );
  if (!validateNezaposlenost) return;

  await localForage.setItem(DATA_PATH, { ...event.data });

  router.push("/ips");

  toast.add({
    title: "Успешно",
    description: "Подаци су сачувани.",
    color: "success",
  });
}

const accountPlaceholder = "840000012345678912";
const modelPlaceholder = "970822345677843231";

const onPasteAccount = (e: ClipboardEvent) => {
  if (!e.clipboardData) return;
  e.preventDefault();
  let pastedText = e.clipboardData.getData("text").replace(/[-\s]/g, "").trim();

  if (pastedText.length > 18) {
    toast.add({
      title: "Грешка",
      description: "Рачун не може бити дужи од 18 карактера.",
      color: "error",
    });
  }

  if (pastedText.length < 18) {
    pastedText = pastedText.slice(0, 3) + pastedText.slice(3).padStart(15, "0");
  }

  (e.target as HTMLInputElement).value = pastedText;
  (e.target as HTMLInputElement).dispatchEvent(new Event("input"));
};

const onPastModel = (e: ClipboardEvent) => {
  if (!e.clipboardData) return;
  e.preventDefault();
  let pastedText = e.clipboardData.getData("text").replace(/[-\s]/g, "").trim();

  if (!pastedText.startsWith("97")) {
    pastedText = "97" + pastedText;
  }

  (e.target as HTMLInputElement).value = pastedText;
  (e.target as HTMLInputElement).dispatchEvent(new Event("input"));
};

const { color } = useThemeColor();
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
    @error="console.log"
  >
    <UFormField :class="color" name="osnovica" required>
      <template #label>
        Паушално утврђена <b>основица</b> за текућу годину
      </template>
      <UInput
        class="w-full &input:pl-4"
        type="number"
        step="0.01"
        v-model="state.osnovica"
        placeholder="90000.00"
        min="0"
      >
        <template #trailing> RSD </template>
      </UInput>
    </UFormField>

    <UFormField :class="color" name="firma" required>
      <template #label> Име агенције/фирме </template>
      <UInput placeholder="Моја фирма" v-model="state.firma" class="w-full" />
    </UFormField>

    <UFormField :class="color" name="akontacijaRacun">
      <template #label> Рачун за <b>аконтацију пореза</b> </template>
      <UInput
        @paste="onPasteAccount"
        :placeholder="accountPlaceholder"
        v-model="state.akontacijaRacun"
        class="w-full"
      />
    </UFormField>

    <UFormField :class="color" name="akontacijaBroj" required>
      <template #label>
        Модел и позив на број за <b>аконтацију пореза</b>
      </template>
      <UInput
        @paste="onPastModel"
        :placeholder="modelPlaceholder"
        v-model="state.akontacijaBroj"
        class="w-full"
      />
    </UFormField>

    <UFormField :class="color" name="zdravstvoRacun" required>
      <template #label> Рачун за <b>здравствено осигурање</b> </template>
      <UInput
        @paste="onPasteAccount"
        :placeholder="accountPlaceholder"
        v-model="state.zdravstvoRacun"
        class="w-full"
      />
    </UFormField>

    <UFormField :class="color" name="zdravstvoBroj" required>
      <template #label>
        Модел и позив на број за <b>здравствено осигурање</b>
      </template>
      <UInput
        @paste="onPastModel"
        :placeholder="modelPlaceholder"
        v-model="state.zdravstvoBroj"
        class="w-full"
      />
    </UFormField>

    <UFormField :class="color" name="pioRacun" required>
      <template #label>
        <div class="inline-flex items-center gap-1">
          Рачун за <b>ПИО</b>
          <UTooltip text="Пензионо и здравствено осигурање">
            <UIcon name="i-lucide-info" />
          </UTooltip>
        </div>
      </template>
      <UInput
        @paste="onPasteAccount"
        :placeholder="accountPlaceholder"
        v-model="state.pioRacun"
        class="w-full"
      />
    </UFormField>

    <UFormField :class="color" name="pioBroj" required>
      <template #label>
        <div class="inline-flex items-center gap-1">
          Модел и позив на број за
          <b>ПИО</b>
          <UTooltip text="Пензионо и здравствено осигурање">
            <UIcon name="i-lucide-info" />
          </UTooltip>
        </div>
      </template>
      <UInput
        @paste="onPastModel"
        :placeholder="modelPlaceholder"
        v-model="state.pioBroj"
        class="w-full"
      />
    </UFormField>

    <UFormField :class="color" name="nezaposlenostRacun" required>
      <template #label> Рачун за <b>доприносе за незапосленост</b> </template>
      <UInput
        @paste="onPasteAccount"
        :placeholder="accountPlaceholder"
        v-model="state.nezaposlenostRacun"
        class="w-full"
      />
    </UFormField>

    <UFormField :class="color" name="nezaposlenostBroj" required>
      <template #label>
        Модел и позив на број за <b>доприносе за незапосленост</b>
      </template>
      <UInput
        @paste="onPastModel"
        :placeholder="modelPlaceholder"
        v-model="state.nezaposlenostBroj"
        class="w-full"
      />
    </UFormField>
    <div class="flex justify-end">
      <UButton type="submit" trailing-icon="i-lucide-qr-code">
        Генериши
      </UButton>
    </div>
  </UForm>
</template>

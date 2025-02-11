<script setup lang="ts">
import { object, string, number } from "yup";
import type { Form, FormSubmitEvent } from "@nuxt/ui";
import axios from "axios";
import useLocalForage from "~/composable/useLocalForage";
import type { TData } from "~/types/data";

type Props = {
  hideButton?: boolean;
};

defineProps<Props>();

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

class FormError extends Error {
  override name: string;

  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

const validatePart = async (
  rKey: keyof TData,
  r: string,
  roKey: keyof TData,
  ro: string
) => {
  const validated = await validate(r, ro);

  if (validated !== true) {
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
    throw new FormError("Грешка", validated.desc);
  }
};

const localForage = useLocalForage();

const submitting = ref(false);

async function onSubmit(event: FormSubmitEvent<TData>) {
  try {
    submitting.value = true;

    // SECTION: Validate akontacija
    await validatePart(
      "akontacijaRacun",
      event.data.akontacijaRacun,
      "akontacijaBroj",
      event.data.akontacijaBroj
    );

    // SECTION: Validate zdravstvo
    await validatePart(
      "zdravstvoRacun",
      event.data.zdravstvoRacun,
      "zdravstvoBroj",
      event.data.zdravstvoBroj
    );

    // SECTION: Validate pio
    await validatePart(
      "pioRacun",
      event.data.pioRacun,
      "pioBroj",
      event.data.pioBroj
    );

    // SECTION: Validate nezaposlenost
    await validatePart(
      "nezaposlenostRacun",
      event.data.nezaposlenostRacun,
      "nezaposlenostBroj",
      event.data.nezaposlenostBroj
    );

    const cName = companyName(event.data.firma);

    const storageKey = dataStorage(cName);

    await localForage.setItem(storageKey, {
      ...event.data,
    });

    router.push(`/company/${cName}`);

    toast.add({
      title: "Успешно",
      description: "Подаци су сачувани.",
      color: "success",
    });
    form.value!.clear();
  } catch (e) {
    if (e instanceof FormError) {
      toast.add({
        title: e.name,
        description: e.message,
        color: "error",
      });
    }
  } finally {
    submitting.value = false;
  }
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

defineExpose({
  submit: () => form.value?.submit(),
  submitting: submitting,
});
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    @error="console.log"
  >
    <div class="flex flex-col gap-4">
      <UFormField class="text-[13px] sm:text-sm" name="osnovica" required>
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

      <UFormField class="text-[13px] sm:text-sm" name="firma" required>
        <template #label> Име агенције/фирме </template>
        <UInput placeholder="Моја фирма" v-model="state.firma" class="w-full" />
      </UFormField>

      <UFormField class="text-[13px] sm:text-sm" name="akontacijaRacun">
        <template #label> Рачун за <b>аконтацију пореза</b> </template>
        <UInput
          @paste="onPasteAccount"
          :placeholder="accountPlaceholder"
          v-model="state.akontacijaRacun"
          class="w-full"
        />
      </UFormField>

      <UFormField class="text-[13px] sm:text-sm" name="akontacijaBroj" required>
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

      <UFormField class="text-[13px] sm:text-sm" name="zdravstvoRacun" required>
        <template #label> Рачун за <b>здравствено осигурање</b> </template>
        <UInput
          @paste="onPasteAccount"
          :placeholder="accountPlaceholder"
          v-model="state.zdravstvoRacun"
          class="w-full"
        />
      </UFormField>

      <UFormField class="text-[13px] sm:text-sm" name="zdravstvoBroj" required>
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

      <UFormField class="text-[13px] sm:text-sm" name="pioRacun" required>
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

      <UFormField class="text-[13px] sm:text-sm" name="pioBroj" required>
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

      <UFormField
        class="text-[13px] sm:text-sm"
        name="nezaposlenostRacun"
        required
      >
        <template #label> Рачун за <b>доприносе за незапосленост</b> </template>
        <UInput
          @paste="onPasteAccount"
          :placeholder="accountPlaceholder"
          v-model="state.nezaposlenostRacun"
          class="w-full"
        />
      </UFormField>

      <UFormField
        class="text-[13px] sm:text-sm"
        name="nezaposlenostBroj"
        required
      >
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
      <div class="flex justify-end" v-if="!hideButton">
        <UButton type="submit" trailing-icon="i-lucide-qr-code">
          Генериши
        </UButton>
      </div>
    </div>
  </UForm>
</template>

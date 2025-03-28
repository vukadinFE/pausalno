<script setup lang="ts">
import { UButton } from "#components";

definePageMeta({
  layout: "fullscreen",
});

const generateModalOpen = ref(false);

useServerSeoMeta({
  title: "IPS за паушалце",
  description:
    "Генериши QR кодове за плаћање паушалног пореза за сваки месец у години",
  ogImage: "https://pausalno.rs/ips-za-pausalce.png",
});
</script>

<template>
  <HeroWrapper class="fency-bg before:!bg-[50%_70%]">
    <UContainer class="pb-10 pt-(--header-height)">
      <div class="text-center mx-auto">
        <h1
          class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl"
        >
          Олакшај себи плаћање <br />
          <span class="text-primary">паушалног пореза</span> 🚀
        </h1>
      </div>

      <p
        class="mt-6 text-lg tracking-tight text-center text-gray-600 dark:text-gray-300"
      >
        Плаћаш паушално порез?<br />
        Овде можеш генерисати IPS кодове за сваки месец у години.
      </p>

      <GenerateModal v-model="generateModalOpen">
        <div class="mt-8 gap-3 flex justify-center">
          <UButton
            size="xl"
            class="py-2.5 px-3.5"
            trailing-icon="i-lucide-qr-code"
          >
            Генериши
          </UButton>
        </div>
      </GenerateModal>
    </UContainer>
  </HeroWrapper>

  <UContainer class="grid grid-cols-[1fr_auto] gap-5">
    <main>
      <section id="how" class="mt-16 pb-16 md:pb-30">
        <div class="md:flex items-start gap-4">
          <div class="mr-auto mb-4">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              Како функционише?
            </h2>
            <p class="mt-4 mb-10 text-lg text-gray-600 dark:text-gray-300">
              Упиши своје податке и генериши IPS код за сваки месец у години.
            </p>
            <div class="text-sm max-w-[500px] leading-relaxed">
              <p class="mb-4">
                Генерисање IPS кодова је једноставно! Потребно је само да
                унесете податке из решења које сте добили од Пореске управе.
              </p>

              <p class="mb-4">
                Ови подаци обухватају број рачуна и позив на број за сваки
                појединачни порез или допринос.
              </p>

              <p>
                Након што их унесете у предвиђена поља, једним кликом на дугме
                <strong>"Генериши"</strong> добићете исправне IPS кодове,
                спремне за брзо и лако плаћање.
              </p>
            </div>
            <UButton
              class="mt-4"
              variant="subtle"
              @click="generateModalOpen = true"
            >
              Попуни формулар
            </UButton>
          </div>
          <div class="max-w-[400px]">
            <img src="/how.png" alt="Како функционише?" class="rounded" />
          </div>
        </div>
      </section>

      <section class="py-16 md:py-30" id="isolate">
        <div class="md:flex flex-row-reverse items-start gap-4">
          <div class="ml-auto mb-4">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">
              Изолуј код и плати
            </h2>
            <div class="text-sm max-w-[400px] leading-relaxed">
              <p class="mb-4">
                Након што попуните формулар, отвориће се страница са приказом
                свих месеци у години. Одабиром жељеног месеца, добићете QR
                кодове за све порезе и доприносе који се односе на тај период.
              </p>
              <p>
                За лакше скенирање, можете користити опцију изолације кода.
                Након што извршите уплату, означите да је рачун плаћен, а
                апликација ће аутоматски архивирати тај месец.
              </p>
            </div>
          </div>
          <div class="max-w-[500px]">
            <img
              src="/isolate.png"
              alt="Како функционише?"
              class="rounded -mt-4"
            />
          </div>
        </div>
      </section>

      <section class="py-16 md:py-30" id="why">
        <div class="md:flex items-start gap-4">
          <div class="mr-auto mb-4">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">
              Зашто користити?
            </h2>
            <div class="text-sm max-w-[500px] leading-relaxed">
              <p class="mb-4">
                Наша апликација вам омогућава да уштедите време и новац,
                поједностављујући процес плаћања пореза за паушалце.
              </p>

              <p class="mb-4">
                <strong>✅ Уштеда на књиговођи</strong> – Већина књиговођа
                наплаћује између 30 и 100 евра месечно за вођење КПО књиге и
                слање налога за уплату. Осим тога, налози које шаљу често не
                садрже QR код за IPS плаћање, што значи да ручно уносите податке
                при свакој уплати.
              </p>

              <p class="mb-4">
                <strong>✅ Прецизни QR кодови</strong> – Иако решење Пореске
                управе садржи QR кодове, они изостављају битне податке, попут
                износа и месеца уплате, што може довести до грешака.
              </p>

              <p>
                🔹 Ова апликација аутоматски генерише исправне IPS QR кодове за
                сваки месец, чиме вам олакшава и убрзава процес плаћања. 🚀
              </p>
            </div>
          </div>
          <div class="max-w-[400px] rounded">
            <img src="/why.png" alt="Како функционише?" class="rounded" />
          </div>
        </div>
      </section>

      <section class="py-16 md:py-30" id="q&a">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">
          Најчешћа питања
        </h2>
        <UAccordion
          class="w-full"
          type="multiple"
          :defaultValue="['0']"
          :ui="{
            label: 'font-bold text-lg',
            item: 'leading-relaxed whitespace-pre-line',
          }"
          :items="[
            {
              label: 'Где да нађем податке за формулар?',
              content:
                'Потребне податке можете пронаћи у решењу које сте добили од Пореске управе на почетку године. \n\nАко нисте примили решење на адресу фирме или сте га изгубили, можете га преузети са портала еПорези. Приликом пријаве, идите у „Пореско сандуче“, где ћете пронаћи два документа: Решење о утврђивању аконтација пореза на доходак грађана и Решење о утврђивању аконтација доприноса за обавезно социјално осигурање. Ова два документа садрже све податке потребне за формулар.\n\nУколико немате приступ решењу, обратите се Пореској управи.',
            },
            {
              label: 'Како да платим порез преко рачунара?',
              content:
                'QR кодови које генеришете у овој апликацији могу се користити искључиво за плаћање путем м-банкинга на мобилном телефону. Нажалост, плаћање путем рачунара није могуће. \n\nАко желите да платите порез са рачунара, мораћете ручно да унесете потребне податке.',
            },
            {
              label: 'Шта ако погрешим при уносу података?',
              content:
                'Апликација има уграђену валидацију која вам неће дозволити да унесете нетачну комбинацију броја рачуна и позива на број.\n\n Међутим, ако случајно унесете исправно форматиране, али погрешне податке, не брините! У заглављу апликације, у секцији „Моје фирме“, можете пронаћи и обрисати погрешно унету форму.\n\nПре него што извршите уплату, увек проверите податке приликом скенирања QR кода, јер у случају уплате на погрешан рачун, одговорност сносите сами.',
            },
            {
              label: 'Ко има приступ мојим подацима?',
              content:
                'Нико! Сви подаци које унесете у формулар чувају се искључиво на вашем уређају и не прослеђују се на сервер. \n\nВаши подаци остају безбедни и заштићени од приступа трећих лица.',
            },
          ]"
        />
      </section>
    </main>
    <aside
      class="mt-16 sticky top-(--header-height) self-start hidden lg:block"
    >
      <ul>
        <li>
          <UButton variant="link" href="#how">Како функционише?</UButton>
        </li>
        <li>
          <UButton variant="link" href="#isolate">Изолуј код и плати</UButton>
        </li>
        <li>
          <UButton variant="link" href="#why">Зашто користити?</UButton>
        </li>
        <li>
          <UButton variant="link" href="#q&a">Најчешћа питања</UButton>
        </li>
      </ul>
    </aside>
  </UContainer>
</template>

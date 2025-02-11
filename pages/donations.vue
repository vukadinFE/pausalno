<script lang="ts" setup>
export type Donation = {
  title: string;
  name: string;
  logo: string;
  logoClass?: string;
  account: string;
  callNumber?: string;
};

const donations: Donation[] = [
  {
    title: "Donacija organizaciji Srbi za srbe",
    name: "Humanitarna organizaciji Srbi za srbe",
    logo: "https://hendikepmagazin.rs/wp-content/uploads/2022/08/srbizasrbe.jpg",
    account: "160000000027949171",
  },
  {
    title: "Donacija organizaciji Fondacija Budi human",
    name: "Humanitarna organizaciji Fondacija Budi human",
    logo: "https://www.budihuman.rs/_next/image?url=%2Fimg%2Flogo.png&w=640&q=75",
    account: "160000000040310851",
    logoClass: "p-4",
  },
  {
    title: "Donacija Fondacija Pokreni Zivot",
    name: "Humanitarna Fondacija Pokreni Zivot",
    logo: "https://pokrenizivot.com/_next/static/media/Logo-za-sajt.2655151d.svg",
    logoClass: "p-4",
    account: "160600000206535941",
  },
  {
    title: "Donacija organizaciji Versko Dobrovoljno Starateljstvo",
    name: "Versko Dobrovoljno Starateljstvo",
    logo: "https://starateljstvo.info/assets/vds_logo-11d3515d.svg",
    logoClass: "p-4",
    account: "205000000005821931",
    callNumber: "97230102",
  },
  {
    title: "Donacija organizaciji Crveni krst",
    name: "Crveni krst Srbije",
    logo: "https://www.redcross.org.rs/media/7347/cks.jpg",
    account: "205000000020581839",
  },
  {
    title: "Donacija organizaciji Fondacija Ana i Vlade Divac",
    name: "Fondacija Ana i Vlade Divac",
    logo: "https://www.divac.com/images/header-logo.png",
    account: "265163031001039567",
  },
];

const selectedDonation = ref<(Donation & { amount: number }) | null>(null);

const modalOpen = computed<boolean>({
  get: () => selectedDonation.value !== null,
  set: (value) => {
    if (!value) {
      selectedDonation.value = null;
    }
  },
});

const qrCode = computed(() => {
  if (selectedDonation.value) {
    return `K:PR|V:01|C:1|R:${selectedDonation.value.account}|N:${selectedDonation.value.name}|I:RSD${selectedDonation.value.amount},00|SF:187|S:Donacija`;
  }
  return "";
});
</script>

<template>
  <section class="my-20">
    <UContainer>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        📢 Подржите хуманитарне организације – Донацијом помажете онима којима
        је најпотребније!
      </h1>

      <p class="mt-4 mb-10 text-lg text-gray-600 dark:text-gray-300">
        Ваша подршка може направити разлику! На овој страници можете пронаћи IPS
        QR кодове за донације хуманитарним организацијама које се баве помоћи
        угроженима.
      </p>
      <p class="mb-4">
        ✅ Брзо и једноставно – Скенирaјте QR код у својој м-банкинг апликацији
        и донирајте у неколико секунди.
      </p>
      <p class="mb-4">
        ✅ Без додатних трошкова – Свака донација иде директно на рачун изабране
        организације.
      </p>
      <p class="mb-4">
        ✅ Хуманост на делу – Ваш допринос помаже онима којима је најпотребније.
      </p>
      <p class="mb-4">Хвала вам што подржавате праве вредности! ❤️</p>
      <div class="items gap-3">
        <DonationCard
          v-for="donation in donations"
          :key="donation.name"
          v-bind="donation"
          @show-code="selectedDonation = $event"
        />
      </div>
    </UContainer>
  </section>
  <UModal
    :title="selectedDonation?.title"
    v-model:open="modalOpen"
    @update:open="$event ? (selectedDonation = null) : undefined"
  >
    <template #body>
      <div class="flex flex-col justify-center items-center">
        <h3 class="text-xl">
          Донација у вреднсти од <b>{{ selectedDonation?.amount }}RSD</b>
        </h3>
        <div class="my-10">
          <QRCode :data="qrCode" logo-url="/give.svg" color="#fda5d6" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.items {
  @apply grid self-start;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
}
</style>

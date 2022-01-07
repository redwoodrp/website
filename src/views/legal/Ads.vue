<template>
  <div>
    <div class="text-4xl font-bold text-gray-800 mt-4">
      Ads on our site
    </div>

    <div class="mt-1">
      RedwoodRP ("we", "our", "Redwood") only shows you fake ads for fake in-game companies that do
      not exist in the real world. Our ads are moderated so they contain content friendly for all
      age classes. If you ever find inappropriate ads, please contact us.

      <div class="mt-3">
        <div class="text-lg font-semibold">
          What are "fake" companies/businesses?
        </div>
        Fake companies are businesses that are not registered and do not operate and the real world.
        Such businesses as, for example, SUS Performance do not exist in the real non-game world. We
        have multiple BeamMP multiplayer servers where we have "roleplay" rules. The roleplay done
        on
        those servers, is supposed to simulate the real world as closely as possible. Everyone has
        in-game bank accounts with in-game currency that they use to buy vehicles or properties
        with.
        Fake companies are companies that make in-game money, that is not trade-able to real money,
        with, for example selling cars or food.
      </div>

      <div class="mt-5 text-gray-600 text-sm">
        Any more questions? Visit our other legal pages:
        <router-link to="/legal/privacy" class="l">Data Privacy</router-link>
        ,
        <router-link to="/legal/tos" class="l">Terms of Service</router-link>
        ,
        <router-link to="/legal/ads" class="l">Ads</router-link>
        or contact JustMe#8491 on Discord.
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.l {
  color: theme('colors.blue.500')
}
</style>

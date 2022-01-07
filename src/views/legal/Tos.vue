<template>
  <div>
    <div class="text-4xl font-bold text-gray-800 mt-4">
      Our terms of service
    </div>

    <div class="mt-1">
      Once you sign up, you agree to us, RedwoodRP ("we", "our", "us", "Redwood") storing your data
      (
      <router-link to="/legal/privacy" class="l">What we store</router-link>
      ) in a secure place on our servers. You also agree to us using your data to improve our
      systems and to server more appropriate ads. (
      <router-link to="/legal/ads" class="l">Read more about those here</router-link>
      ). We do not give any of your data to any third party.
      Although some services we use, may use your data.

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

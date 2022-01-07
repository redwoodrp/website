<template>
  <div>
    <div class="text-4xl font-bold text-gray-800 mt-4">
      Data Privacy
    </div>

    <div class="mt-1">
      RedwoodRP ("we", "our", "Redwood") uses your Discord account for login.
      <br />
      Information we store about you:
      <ul class="list-disc ml-5 mb-5">
        <li>
          createdAt: The data the account has been registered
        </li>
        <li>
          discordId: The id the user has on Discord
        </li>
        <li>
          discriminator: The discriminator the user has on Discord (#0000)
        </li>
        <li>
          locale: The language the user has set on Discord (en-US)
        </li>
        <li>
          mfaEnabled: If the user has enabled two factor auth
        </li>
        <li>
          updatedAt: When we last updated the information
        </li>
        <li>
          username: The username the user has on Discord
        </li>
        <li>
          verified: If the user is verified on Discord
        </li>
      </ul>

      We store your data in a safe and encrypted SQLite3 database on our server. We do not store
      your email address or password and we do not leak out any information. By creating an account
      you agree to us tracking what you do on our website (On which page you are). We do not send
      any data to any third parties. All the data we have about you, will be deleted on demand. If
      you want to know what data we have stored about you: Contact JustMe#8491 on Discord to get a
      data packet.

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

<template>
  <div class="p-4 bg-slate-800 dark:bg-black text-gray-100">
    <div class="flex flex-row justify-between text-gray-400">
      <div class="flex flex-col">
        <div>© RedwoodRP 2021-{{ year }} — All rights reserved</div>
        <div>Made by JustMe#8491 with ❤</div>
      </div>

      <div id="DMCA-badge" class="mt-3 rounded">
        <div class="dm-1 dm-1-b flex justify-center items-center"
             style="left: 0; background-color: rgb(28, 106, 153); border: none !important;">
          <a href="https://www.dmca.com/" title="DMCA">DMCA</a>
        </div>
        <div class="dm-2 dm-2-b flex justify-center items-center" style="border: none !important;">
          <a
            href="https://www.dmca.com/Protection/Status.aspx?ID=d4687be4-081f-4cbf-80a9-5789dd7d781f&refurl=https://rdwrp.com/"
            title="DMCA">PROTECTED</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {
  private year = 0;
  private exclude = ['*', '/oauth/done', '/error'];

  mounted (): void {
    this.year = new Date().getFullYear();
  }
}
</script>

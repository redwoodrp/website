<template>
  <div class="w-4/5 dark:text-neutral-300">
    <div class="mt-11 font-bold text-4xl text-gray-800 dark:text-neutral-300">Manage Users</div>
    <div class="mb-2 mt-0.5 font-medium text-gray-500 dark:text-neutral-500">
      Values here are temporary and only saved once you press 'save'!
    </div>
    <div v-if="users.length !== 0">
      <button class="w-full btn bg-green-500 dark:bg-green-700 hover:bg-green-800 mb-3"
              @click="saveDialog = true;">
        Save
      </button>

      <table class="table-auto w-full overflow-auto">
        <thead>
        <tr>
          <th>actions</th>
          <th
            v-for="(header, i) in Object.keys(users[0]).filter((k) => !Object.keys(hiddenKeys).includes(k))"
            :key="i">
            {{ header }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, i) in users" :key="i">
          <td>
            <button class="btn bg-green-500 dark:bg-green-700 hover:bg-green-800 whitespace-nowrap text-sm"
                    @click="permissionDialog.show = true; permissionDialog.workIndex = i">
              Mod. perms
            </button>
          </td>
          <td
            v-for="(val, idx) in Object.values(user).filter((u,_i) => !Object.values(hiddenKeys).includes(_i))"
            :key="idx"
            class="whitespace-nowrap overflow-hidden max-w truncate hover:whitespace-normal">
            {{ val }}
          </td>
        </tr>
        </tbody>
      </table>

      <Modal v-model="permissionDialog.show" max-width="500px">
        <div class="modal-title">
          Change permissions for {{ getFullUsername(permissionDialog.workIndex) }}
        </div>
        <div class="modal-description">You can only change permissions of people below you!</div>

        <div class="mt-3">
          <div v-for="(permission, i) in permissions.filter((p) => typeof p === 'string')" :key="i">
            <input type="checkbox" :id="`permission-${i}`" class="w-6"
                   @click="togglePermissionCheckbox(permissionDialog.workIndex, permission)"
                   :checked="users[permissionDialog.workIndex].strPermissions.includes(permission)">
            <label :for="`permission-${i}`">{{ permission }}</label>
          </div>
        </div>

        <div class="flex flex-row space-x-0.5 mt-5">
          <button class="btn bg-gray-400 hover:bg-gray-700 w-full"
                  @click="permissionDialog.show = false;">
            Cancel
          </button>
          <button
            class="btn bg-green-600 hover:bg-green-900 w-48"
            @click="savePermissions(permissionDialog.workIndex); permissionDialog.show = false">
            Save
          </button>
        </div>
      </Modal>

      <Modal v-model="saveDialog" max-width="500px" :close-outside="true" :close-esc="true">
        <div class="modal-title">Are you sure?</div>
        <div class="modal-description">For this to take effect on the affected users it might take
          some time or require a reload.
        </div>

        <div class="flex flex-row space-x-0.5 mt-5">
          <button class="btn bg-gray-400 hover:bg-gray-700 w-full"
                  @click="saveDialog = false;">
            Cancel
          </button>
          <button
            class="btn bg-green-600 hover:bg-green-900 w-36" @click="saveUsers">
            Save
          </button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import User, { UserPermissions } from '@/helpers/interfaces/user';
import Modal from '@/components/Modal.vue';

interface UserMod extends User {
  strPermissions: string[];
  tmpPermissions: number[];
  modified: boolean;
}

@Component({
  components: {
    Modal,
  },
})
export default class Users extends Vue {
  private users: UserMod[] = [];
  private permissionDialog = {
    show: false,
    workIndex: 0,
  };
  private permissions: (string | number)[] = [];
  private saveDialog = false;
  private hiddenKeys = {};

  async mounted (): Promise<void> {
    const service = feathersClient.service('users');
    const res = await service.find();
    console.log(res);

    this.permissions = Object.values(UserPermissions) as unknown as string[];
    console.log(Object.values(UserPermissions));

    (res as User[]).forEach((user: User) => {
      const newUser: UserMod = {
        ...user,
        strPermissions: [],
        modified: false,
        tmpPermissions: [],
      };

      console.log('Users.vue', user.permissions);

      newUser.createdAt = (new Date(this.toISO(newUser.createdAt))).toDateString();
      newUser.updatedAt = (new Date(this.toISO(newUser.updatedAt))).toDateString();
      newUser.avatarURI = 'hidden';
      newUser.verified = Boolean(newUser.verified);
      newUser.mfaEnabled = Boolean(newUser.mfaEnabled);
      newUser.permissions = newUser.permissions.length === 0 ? [] : user.permissions;
      newUser.strPermissions = newUser.permissions.length === 0 ? [] : this.permissionsToString(newUser.permissions as unknown as string[]);
      newUser.tmpPermissions = newUser.permissions;

      this.users.push(newUser);
    });

    this.hiddenKeys = {
      modified: Object.values(this.users[0]).length - 2,
      tmpPermissions: Object.values(this.users[0]).length - 1,
    };
  }

  togglePermissionCheckbox (userIndex: number, permission: string | number): void {
    const user = this.users[userIndex];
    if (typeof permission === 'number') return;

    if (user.strPermissions.includes(permission)) {
      const i = user.tmpPermissions.indexOf(UserPermissions[permission as unknown as number] as unknown as number);

      user.tmpPermissions.splice(i);
      return;
    }

    user.tmpPermissions.push(UserPermissions[permission as unknown as number] as unknown as number);
  }

  savePermissions (index: number): void {
    const user = this.users[index];

    user.modified = true;
    user.permissions = user.tmpPermissions;
    user.strPermissions = user.tmpPermissions.map((p) => UserPermissions[p as unknown as number]);
  }

  permissionsToString (permissions: string[]): string[] {
    const res: string[] = [];
    permissions.forEach((perm: string) => {
      res.push(UserPermissions[perm as unknown as number]);
    });
    return res;
  }

  getFullUsername (userIndex: number): string {
    return `${this.users[userIndex].username}#${this.users[userIndex].discriminator}`;
  }

  toISO (date: string): string {
    return date.replace(' ', 'T')
      .replace(' ', '');
  }

  saveUsers (): void {
    this.users.forEach(async (u) => {
      if (u.modified) {
        await feathersClient.service('users')
          .patch(u.id, {
            permissions: u.permissions,
          });
      }
    });
  }
}
</script>

<style>
.max-w {
  max-width: 230px;
}
</style>

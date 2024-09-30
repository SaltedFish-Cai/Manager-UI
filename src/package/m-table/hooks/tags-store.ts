// _Message useTagsStore

import { defineStore } from "pinia";
import { Obj } from "@/package/global";
import piniaPersistConfig from "../../store/piniaPersist";

export interface GlobalState {
  tagMaps: Obj;
}

export const useTagsStore = defineStore({
  id: "m-table-tag-maps",
  state: (): GlobalState => ({
    tagMaps: {}
  }),
  getters: {
    getTagMaps: (state: GlobalState) => {
      return (id, prop, value) => {
        if (!state.tagMaps[id] || !state.tagMaps[id][prop] || !state.tagMaps[id][prop][value]) return undefined;
        return state.tagMaps[id][prop][value];
      };
    }
  },
  actions: {
    setTagMaps(id, prop, opt, color) {
      if (!this.tagMaps[id]) this.tagMaps[id] = {};
      if (!this.tagMaps[id][prop]) this.tagMaps[id][prop] = {};
      this.tagMaps[id][prop][opt] = color;
    }
  },
  persist: piniaPersistConfig("m-table-tag-maps")
});

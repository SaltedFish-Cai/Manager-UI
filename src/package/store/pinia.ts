// _Import
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// _Message pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

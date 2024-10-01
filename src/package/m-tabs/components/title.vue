<template>
  <RenderTableColumn v-bind="_props.slots" />
</template>

<script lang="tsx" setup name="TableColumn">
// _Import
import { MTabsItemTitleType } from "../type";

//  _Var
const _props = defineProps<MTabsItemTitleType>();

// _Function Render方法
const RenderTableColumn = slots => {
  const _slots: any = [];
  for (const key in slots) {
    _slots.push(slots[key]);
  }

  const className = props => {
    let name = "";
    if (!_props?.card) {
      name = props?.name == _props.activeName ? "m-tab-title m-tab-title_action" : "m-tab-title";
    } else {
      name = props?.name == _props.activeName ? "m-tab-title_card m-tab-title_card_action" : "m-tab-title_card";
    }
    if (_props?.portrait) {
      name += " m-tab-title_portrait";
    }
    return name;
  };
  if (!_slots) return <></>;
  return (
    <>
      {_slots.map(({ props, children }, index) => {
        return (
          <div class={className(props)} onClick={() => _props.changeTabs(props?.name, index)}>
            {props?.name && children.label ? "" : <m-icon class="mr3" name={props?.icon ? props?.icon : "grid_adaptive_line"} />}
            {props?.name && children.label ? children.label() : props?.label}
          </div>
        );
      })}
    </>
  );
};
</script>

<style lang="scss"></style>

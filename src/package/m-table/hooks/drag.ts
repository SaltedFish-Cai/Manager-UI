import inBrowser from "@/package/tools/inBrowser";

// _Function 标题拖拽初始方法
function columnDrop(id: string, dropCol: any, el: "col" | "table", tableColumns: any) {
  if (!inBrowser) return;

  if (id == "default-table") {
    window.log.warning(`建议给每一个table创建唯一id,防止拖拽功能失效`);
  }
  const roots = window.document?.querySelectorAll(`#${id}`);
  if (roots && roots.length > 1) {
    window.log.warning(`出现多个相同ID表格(${id})`);
  }

  // 去除原监听
  if (window.MTableSortableData && window.MTableSortableData[id] && window.MTableSortableData[id].destroy) {
    try {
      window.MTableSortableData[id].destroy();
    } catch (error) {
      window.log.error(String(error));
    }
  }

  // 初始化对象
  if (!window.MTableSortableData) window.MTableSortableData = {};

  const root = window.document?.getElementById(el == "table" ? id : "table-col-" + id);
  if (root) {
    const body = el == "table" ? ".el-table__header-wrapper tr" : ".el-table__body tbody";
    const handle = ".drag-el";
    const filter = el == "table" ? ".el-table-fixed-column--left,.el-table-fixed-column--right,.el-table-column--selection" : " ";
    const wrapperTr: any = root.querySelector(body);
    window.MTableSortableData[id] = window.Sortable.create(wrapperTr, {
      animation: 180,
      sort: true,
      handle,
      preventOnFilter: true,
      filter,
      onMove: function (evt: any) {
        const element = evt.related;
        const classList = element.classList.value;
        if (
          el == "table" &&
          (classList.indexOf("el-table-fixed-column--left") > -1 || classList.indexOf("el-table-fixed-column--right") > -1)
        ) {
          return false;
        } else if (el == "col" && element.innerHTML.indexOf("drag-el") < 0) {
          return false;
        }
      },
      onEnd: (evt: any) => {
        let addIndex = 0;

        if (el != "col") {
          addIndex--;
          if (tableColumns.findIndex(item => item.type == "row") > -1) {
            addIndex--;
          }
        }
        const oldIndex = evt.oldIndex + addIndex;
        const newIndex = evt.newIndex + addIndex;
        const oldItem = dropCol[oldIndex];
        dropCol[oldIndex] = dropCol[newIndex];
        dropCol[newIndex] = oldItem;
      }
    });
  } else {
    window.log.info(`初始化监听排序元素失败（id：${id}）`);
  }
  return dropCol;
}

export { columnDrop };

// var sortable = new Sortable(el, {
//     group: "name",  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
//     sort: true,  // boolean 定义是否列表单元是否可以在列表容器内进行拖拽排序
//     delay: 0, // number 定义鼠标选中列表单元可以开始拖动的延迟时间；
//     touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
//     disabled: false, // boolean 定义是否此sortable对象是否可用，为true时sortable对象不能拖放排序等功能，为false时为可以进行排序，相当于一个开关；
//     store: null,  // @see Store
//     animation: 150,  // ms, number 单位：ms，定义排序动画的时间
//     easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
//     handle: ".my-handle",  // 格式为简单css选择器的字符串，使列表单元中符合选择器的元素成为拖动的手柄，只有按住拖动手柄才能使列表单元进行拖动
//     filter: ".ignore-elements",  // 过滤器，不需要进行拖动的元素
//     preventOnFilter: true, //  在触发过滤器`filter`的时候调用`event.preventDefault()`
//     draggable: ".item",  // 允许拖拽的项目类名
//     ghostClass: "sortable-ghost",  // drop placeholder的css类名
//     chosenClass: "sortable-chosen",  // 被选中项的css 类名
//     dragClass: "sortable-drag",  // 正在被拖拽中的css类名
//     dataIdAttr: 'data-id',

//     swapThreshold: 1, // Threshold of the swap zone
//     invertSwap: false, // Will always use inverted swap zone if set to true
//     invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
//     direction: 'horizontal', // 拖拽方向 (默认情况下会自动判断方向)

//     forceFallback: false,  // 忽略 HTML5拖拽行为，强制回调进行

//     fallbackClass: "sortable-fallback",  // 当使用forceFallback的时候，被复制的dom的css类名
//     fallbackOnBody: false,  // 将cloned DOM 元素挂到body元素上。
//     fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

//     scroll: true, // or HTMLElement
//     scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) { ... }, // if you have custom scrollbar scrollFn may be used for
//     scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
//     scrollSpeed: 10, // px
//     bubbleScroll: true, // apply   to all parent elements, allowing for easier movement

//     dragoverBubble: false,
//     removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
//     emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it

//     setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
//       dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
//     },

//     // 元素被选中
//     onChoose: function (/**Event*/evt) {
//       evt.oldIndex;  // element index within parent
//     },

//     // 元素未被选中的时候（从选中到未选中）
//     onUnchoose: function(/**Event*/evt) {
//       // same properties as onEnd
//     },

//     // 开始拖拽的时候
//     onStart: function (/**Event*/evt) {
//       evt.oldIndex;  // element index within parent
//     },

//     // 结束拖拽
//     onEnd: function (/**Event*/evt) {
//       var itemEl = evt.item;  // dragged HTMLElement
//       evt.to;    // target list
//       evt.from;  // previous list
//       evt.oldIndex;  // element's old index within old parent
//       evt.newIndex;  // element's new index within new parent
//       evt.clone // the clone element
//       evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
//     },

//     // 元素从一个列表拖拽到另一个列表
//     onAdd: function (/**Event*/evt) {
//       // same properties as onEnd
//     },

//     // 列表内元素顺序更新的时候触发
//     onUpdate: function (/**Event*/evt) {
//       // same properties as onEnd
//     },

//     // 列表的任何更改都会触发
//     onSort: function (/**Event*/evt) {
//       // same properties as onEnd
//     },

//     // 元素从列表中移除进入另一个列表
//     onRemove: function (/**Event*/evt) {
//       // same properties as onEnd
//     },

//     // 试图拖拽一个filtered的元素
//     onFilter: function (/**Event*/evt) {
//       var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
//     },

//     // 拖拽移动的时候
//     onMove: function (/**Event*/evt, /**Event*/originalEvent) {
//       // Example: https://jsbin.com/nawahef/edit?js,output
//       evt.dragged; // dragged HTMLElement
//       evt.draggedRect; // DOMRect {left, top, right, bottom}
//       evt.related; // HTMLElement on which have guided
//       evt.relatedRect; // DOMRect
//       evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
//       originalEvent.clientY; // mouse position
//       // return false; — for cancel
//       // return -1; — insert before target
//       // return 1; — insert after target
//     },

//     // clone一个元素的时候触发
//     onClone: function (/**Event*/evt) {
//       var origEl = evt.item;
//       var cloneEl = evt.clone;
//     },

//     // 拖拽元素改变位置的时候
//     onChange: function(/**Event*/evt) {
//       evt.newIndex // most likely why this event is used is to get the dragging element's current index
//       // same properties as onEnd
//     }
//     });

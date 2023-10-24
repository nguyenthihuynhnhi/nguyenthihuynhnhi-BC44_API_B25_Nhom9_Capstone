import control from "./main_control.js";
import Product from "../model/admin_model.js";

const admin = {
  // BASE_URL: "https://643a58bdbd3623f1b9b164ba.mockapi.io/admin/",
  BASE_URL: "https://643a58c290cd4ba563f773cd.mockapi.io/admin/",
  arrProducts: [],
  init: async function () {
    control.loadding("on", ".body_loading");

    const result = await control.readAllItem(this.BASE_URL);
    this.render(result.data);
    control.$("#update").disabled = true;

    control.loadding("off", ".body_loading");
  },
  render: function (arrData) {
    this.arrProducts = arrData;
    const productItemsEl = control.$(".product_items");
    let string = "";
    arrData.reverse().forEach((el) => {
      string += `
            <li id="item${
              el.id
            }" class="product_item flex flex-col lg:flex-row gap-4 py-4">
                <div class="lg:w-5% font-medium">
                    <span class="lg:hidden underline decoration-1">ID:</span> 
                    <span>${el.id}</span>
                </div>
                <div class="lg:w-[10%] font-medium">
                    <span class="lg:hidden underline decoration-1">Tên:</span>
                    <span>${el.name}</span>
                </div>
                <div class="lg:w-[10%] ">
                    <span class="lg:hidden underline decoration-1">Giá:</span>
                    <span class="text-slate-500">${control.formatCurrency(
                      el.price
                    )} <sup>₫</sup></span>
                </div>
                <div class="lg:w-[7%] ">
                    <span class="lg:hidden underline decoration-1">Màn hình:</span>
                    <span class="text-slate-500">${el.screen}</span>
                </div>
                <div class="lg:w-[10%] ">
                    <span class="lg:hidden underline decoration-1">Camera trước:</span>
                    <span class="text-slate-500">${el.frontCamera}</span>
                </div>
                <div class="lg:w-[10%] ">
                    <span class="lg:hidden underline decoration-1">Camera sau:</span>
                    <span class="text-slate-500">${el.backCamera}</span>
                </div>
                <div class="lg:w-[7%] w-2/5">
                    <span class="lg:hidden underline decoration-1">Hình:</span>
                    <img
                        src="${el.img}"
                        alt="img"
                        class="bg-white border border-slate-200 rounded-md lg:h-28 w-full h-full object-cover object-center lg:w-full"
                    />
                </div>
                <div class="flex-1">
                    <span class="lg:hidden underline decoration-1">Mô tả:</span>
                    <span class="text-slate-500">${el.desc}</span>
                    
                </div>
                <div class="lg:w-5%">
                    <span class="lg:hidden underline decoration-1">Hãng:</span>
                    <span class="text-slate-500">${el.type}</span>
                </div>
                <div class="lg:w-[10%] flex justify-around font-semibold text-sky-500 text-right pr-2">
                    <span data-id="${
                      el.id
                    }" class="edit_item cursor-pointer">Edit</span>
                    <span data-id="${
                      el.id
                    }" class="delete_item cursor-pointer">Delete</span>
                </div>
            </li>`;
    });
    productItemsEl.innerHTML = string;
  },
  getValueForm: function () {
    const id = control.$("#fid").value;
    const name = control.$("#fname").value;
    const price = control.$("#fprice").value;
    const screen = control.$("#fscreen").value;
    const frontCamera = control.$("#ffront").value;
    const backCamera = control.$("#fback").value;
    const img = control.$("#fimage").value;
    const desc = control.$("#fdesc").value;
    const type = control.$("#ftype").value;

    const objValueForm = new Product(
      id,
      name,
      price,
      screen,
      frontCamera,
      backCamera,
      img,
      desc,
      type
    );
    return objValueForm;
  },
  fillForm: function (obj) {
    control.resetValidate();
    control.$("#search-input").value = "";
    control.$("#fid").value = obj === "" ? "" : obj.id;
    control.$("#fname").value = obj === "" ? "" : obj.name;
    control.$("#fprice").value = obj === "" ? "" : obj.price;
    control.$("#fscreen").value = obj === "" ? "" : obj.screen;
    control.$("#ffront").value = obj === "" ? "" : obj.frontCamera;
    control.$("#fback").value = obj === "" ? "" : obj.backCamera;
    control.$("#fimage").value = obj === "" ? "" : obj.img;
    control.$("#fdesc").value = obj === "" ? "" : obj.desc;
    control.$("#ftype").value = obj === "" ? "" : obj.type;
  },
  edit: async function (id) {
    try {
      control.loadding("on", ".body_loading");

      const result = await control.readOneItem(this.BASE_URL, id);

      this.fillForm(result.data);

      control.$(`.focus-edit`)?.classList.remove("focus-edit");

      control.$(`#item${id}`).classList.add("focus-edit");

      control.$("#add").disabled = true;

      control.$("#update").disabled = false;

      control.loadding("off", ".body_loading");
    } catch (error) {
      console.error("👙  error: ", error);
    }
  },
  delete: async function (id) {
    try {
      control.loadding("on", ".body_loading");

      const resultDelete = await control.deleteItem(admin.BASE_URL, id);

      const resultRead = await control.readAllItem(admin.BASE_URL);

      this.render(resultRead.data);

      control.$("#add").disabled = false;

      control.$("#update").disabled = true;

      this.fillForm("");

      control.loadding("off", ".body_loading");

      control.notification(
        `Đã xóa thành công sản phẩm "${resultDelete.data.name}"`
      );
    } catch (error) {
      console.error("👙  error: ", error);
    }
  },
  searchByName: function (name) {
    return axios.get(this.BASE_URL, {
      params: {
        name: name,
      },
    });
  },
};
export default admin;

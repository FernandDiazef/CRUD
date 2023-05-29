const APi = "https://api.escuelajs.co/api/v1";

const Tablas_Creadas_Contenedor = document.querySelector("#Tablas_Creadas_Contenedor");
const My_Modal = document.querySelector("#staticBackdrop");
const spinner = document.querySelector("#spinner_Modal");
const form = document.querySelector("#myForm");
const btn_Modal = document.querySelector("#btnModal");

let deleteP;

const Creador_De_Tablas = async () => {
    let url = `${APi}/products?offset=0&limit=10`;
    let products = await fechData(url);
    let Guardar_Tablas = "";
    products.forEach((element, index) => {
        let tabla = `
            <tr>
                <th>${index + 1}</th>
                <th>${element.title}</td>
                <td>${element.description} </td>
                <td>Q${element.price}</td>
                <td>${element.category.id}</td>
                <td class="text-center"><img src="${element.images[0]}" style="width: 150px;"></td>
                <td class="text-center">
                    <button type="button" onclick="delete_product(${element.id})" value="${element.id}" class="btn btn-outline-danger m-1" name="eleminar" >Eliminar</button>
                    <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" value="${element.id}" name="Actualizar" class="btn btn-outline-success m-1">Actualizar</button>
                </td>
            </tr>`;
        Guardar_Tablas += tabla;
    });
    Tablas_Creadas_Contenedor.innerHTML = Guardar_Tablas;
}
const fechData = async (url, options = {}) => {
    try{
        const response = await fetch(url, options);
        const data = await response.json();
    
        return data;
    
    }catch (error){
        console.log(error);
    };
}
Creador_De_Tablas()
const Create_Update_Product = async (event) => {
    let title = document.querySelector(".name").value;
    let description = document.querySelector(".Description").value;
    let price = document.querySelector(".Price").value;
    let category = document.querySelector("#Select_category").value;
    let image = document.querySelector(".Image").value;

    let option = {
                    headers: {
                               "Content-Type": "application/json"
                             },
                    method: "POST",
                    body: JSON.stringify({
                                            title,
                                            description,
                                            price,
                                            "categoryId": category,
                                            "images": [image]
                                        })
                 };
    let url = `${APi}products/`;
    let product;
    switch(event.target.name){
        case "crear":
            console.log("Esta Creando Un Producto");
            product = await fechData(url, option);        
            alert(`su producto ${product.title} ha sido agregado`);
            break;
        case "actualizar":
            console.log("Esta Actualizando Producto");  
            option = {
                        headers: {
                                    "Content-Type": "application/json"
                                 },
                        method: "PUT",
                        body: JSON.stringify({
                                                title,
                                                description,
                                                price,
                                                "categoryId": category,
                                                "images": [image]
                                            })
                     };
            product = await fechData(`${url}${event.target.value}`, option);
            alert(`${product.title} fue Actualizado`)
            break;
    };
}
My_Modal.addEventListener("show.bs.modal", async (event) => {

    switch(event.relatedTarget.name){
        case "Nuevo Producto":
            btn_Modal.textContent = "Crear Nuevo Producto";
            btn_Modal.value = "";
            btn_Modal.name = "crear";
            form.classList.remove("d-none");
            spinner.classList.add("d-none");
            break;
        case "Actualizar":
            btn_Modal.textContent = "Actualizar Producto";
            let id = event.relatedTarget.value;
            btn_Modal.value = id;
            btn_Modal.name = "actualizar";

            let product = await fechData(`${APi}products/${id}`);
            spinner.classList.add("d-none");
            form.classList.remove("d-none");

            document.querySelector(".name").value = product.title;
            document.querySelector(".Description").value = product.description;
            document.querySelector(".Price").value = product.price;
            document.querySelector("#Select_category").value = product.category.id;
            document.querySelector(".Image").value = product.images;
            break;
    }
})
My_Modal.addEventListener("hidden.bs.modal", () => {
    form.reset();
    spinner.classList.remove("d-none");
    form.classList.add("d-none");
})

const delete_product = (id) => {
    const toastLiveExample = document.getElementById("liveToast");
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();

    let option = {
                    headers: {
                                "Content-Type": "application/json"
                             },
                    method: "DELETE"
                 };

    let btn_Confirm = document.querySelector("#btnComfirm");
    btn_Confirm.removeEventListener("click", deleteP);

    deleteP = async () => {
        try{
            await fechData(`${APi}products/${id}`, option);
            alert("Se ha eliminado");
            toast.hide();
        }catch (error){
            console.error(error);
        }
    }
    btn_Confirm.addEventListener("click", deleteP);
}

const categories = async () => {
    let categories_Product = await fechData(`${APi}categories`);
    const Select_category = document.querySelector("#Select_category");

    categories_Product.forEach(element => {
        Select_category.innerHTML += `<option value="${element.id}">${element.name}</option>`
    });
}
categories();





const regex = /(\d{4})-(\d{2})-(\d{2})/;
const matchers = regex.exec("2022-01-01");
console.table(matchers);
$(document).ready(function(){

//добавление товара в корзину

    $('.buyme').on('click', function(){
        var id_good = $(this).attr("id").substr(5);

        $.ajax({
            url: "/basket/add/",
            type: "POST",
            data:{
                id_good: id_good,
                quantity: 1
            },
            error: function() {alert("Что-то пошло не так...");},
            success: function(answer){
                if(answer.result == 1)
                    alert("Товар добавлен в корзину!");
                else
                    alert("Что-то пошло не так...");
            },
            dataType : "json"
        })
    });

//удаление товара из корзины

    $('.remove').on('click', function(){
        var id_basket = $(this).attr("id").substr(7);
        var item = $(this);

        $.ajax({
            url: "/basket/remove/",
            type: "POST",
            data:{
                id_basket: id_basket,
            },
            error: function() {alert("Что-то пошло не так...");},
            success: function(answer){
                if(answer.result == 1) {
                    alert("Товар удалён из корзины!");
                    item.parent().remove();
                    }
                else
                    alert("Что-то пошло не так...");
            },
            dataType : "json"
        })
    });

//детали заказа в личном кабинете пользователя

    $('.details').on('click', function(){
        var id_order = $(this).attr("id").substr(6);
        var elem = $(this);
        var  str = "id_order=" + id_order;

        $.ajax({
            url: "/cabinet/getdetails/",
            type: "POST",
            data:str,
            error: function() {alert("Что-то пошло не так...");},
            success: function(answer){                                
                    elem.parent().html(answer);
                    elem.remove();
            }
        })
    });

//удаление товара из каталога - функционал админинстратора

        $('.deleteme').on('click', function(){
        var id_good = $(this).attr("id").substr(12);
        var item = $(this);

        $.ajax({
            url: "/catalogue/remove/",
            type: "POST",
            data:{
                id_good: id_good
            },
            error: function() {alert("Что-то пошло не так...");},
            success: function(answer){
                if(answer.result == 1){
                    alert("Товар успешно удален!");
                    item.parent().remove();
                }
                else
                    alert("Что-то пошло не так...");
            },
            dataType : "json"
        })
    });

//изменение товара в каталоге - функционал админинстратора

        $('.changeme').on('click', function(){
        var itemGood = $(this).parent();
        var id_good = $(this).attr("id").substr(12);
        var good_name = $('#name_good_' + id_good).val();
        var good_price = $('#price_good_' + id_good).val();
        var good_description = $('#description_good_' + id_good).val();
        var isactive = $('#isactive_good_' + id_good).is(':checked') ? 1 : 0;

        $.ajax({
            url: "/catalogue/change/",
            type: "POST",
            data:{
                id: id_good,
                name: good_name,
                price: good_price,
                description: good_description,
                isactive: isactive
            },
            error: function() {alert("Что-то пошло не так...");},
            success: function(answer){
                if(answer.result == 1){
                    alert("Товар успешно изменен!");
                }
                else
                    alert("Что-то пошло не так...");
            },
            dataType : "json"
        })
    });

//изменение статуса заказа - функционал админинстратора

        $('.changeOrderStatus').change(function(){
        var id_order = $(this).attr("id").substr(14);
        var order_status = $(this).val();

        $.ajax({
            url: "/orders/changeStatus/",
            type: "POST",
            data:{
                id: id_order,
                order: order_status
            },
            error: function() {alert("Что-то пошло не так...");},
            success: function(answer){
                if(answer.result == 1){
                    alert("Стстус заказа успешно изменен!");
                }
                else
                    alert("Что-то пошло не так...");
            },
            dataType : "json"
        })
    });

//удаление заказа - функционал админинстратора

$('.deleteOrder').on('click', function(){
        var id_order = $(this).attr("id").substr(13);
        var item = $(this);

        $.ajax({
            url: "/orders/remove/",
            type: "POST",
            data:{
                id_order: id_order
            },
            error: function() {alert("Что-то пошло не так...");},
            success: function(answer){
                if(answer.result == 1){
                    alert("Заказ успешно удален!");
                    item.parent().remove();
                }
                else
                    alert("Что-то пошло не так...");
            },
            dataType : "json"
        })
    });

});

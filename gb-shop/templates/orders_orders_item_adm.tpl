<div class="orders_order_{{ID_ORDER}}">

    <span>Заказ №:<b>{{ID_ORDER}}</b> </span>
    <span>Пользователь:<b>{{USER}}</b> </span>
    <span>Дата заказа: <b>{{DATE}} </b></span>
    <span>Сумма заказа: <b>{{AMOUNT}}</b></span>

	<select class="changeOrderStatus" id="orders_status_{{ID_ORDER}}">
   		<option>Новый</option>
   		<option>Принят</option>
   		<option>Выполнен</option>
   		<option>Отменён</option>
 	</select>
	
    <button class='details' id='order_{{ID_ORDER}}' style="cursor: pointer">Детали</button>
    <button class='deleteOrder' id='delete_order_{{ID_ORDER}}' style="cursor: pointer">Удалить заказ!</button>
    <script>
   		$("#orders_status_{{ID_ORDER}}").val("{{STATUS}}");  
	</script>

    <hr>
</div>

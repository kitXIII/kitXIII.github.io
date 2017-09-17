<h2>Каталог товаров</h2>
<div class="catalogue_action_response">
    {{RESPONSE}}
</div>
<div>
    {{GOODS}}
</div>
<hr>
<form method="POST">
	<h3>Добавление товара</h3>
	<p><span>Наименование:</span><br>
	<input type="text" name="name"></p>
	<p><span>Стоимость:</span><br>
	<input type="number" step="0.01" min="0" name="price"></p>
	<p><span>Описание:</span><br>
	<textarea name="description" cols="50" rows="5"></textarea></p>
	<p><span>Активен:</span><input name="isactive" type="checkbox" name="isactive" /></p>
	<input type="submit" value="Добавить">
</form>
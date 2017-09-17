<div class="catalogue_item catalogue_item_adm good_{{ID_GOOD}}">
	<input name="name" type="text" value="{{GOOD_NAME}}" id="name_good_{{ID_GOOD}}">
	<input name="price" type="number" step="0.01" min="0" value="{{GOOD_PRICE}}" id="price_good_{{ID_GOOD}}">
	<textarea name="description" cols="50" rows="1" id="description_good_{{ID_GOOD}}">{{GOOD_DESCRIPTION}}</textarea>
	<span>Активен:</span>
	<input name="isactive" type="checkbox" id="isactive_good_{{ID_GOOD}}" {{IS_ACTIVE}}>
	<button class='changeme' id='change_good_{{ID_GOOD}}' style="cursor: pointer">Изменить</button>
	<button class='deleteme' id='delete_good_{{ID_GOOD}}' style="cursor: pointer">Удалить</button>
</div>

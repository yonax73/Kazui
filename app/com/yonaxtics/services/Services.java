package com.yonaxtics.services;

import java.util.ArrayList;
import java.util.List;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import com.fasterxml.jackson.databind.JsonNode;

import com.yonaxtics.entity.ListItem;


/**
 * Class : Services.java<br/>
 * Copyright : (c) 2014<br/>
 * Company : yonaxtics<br/>
 * date : Dec 7, 2014<br/>
 * User : yonatan<br/>
 * 
 * @author Yonatan Alexis Quintero Rodriguez<br/>
 */

public class Services extends Controller {

	public static Result categories() {

		List<ListItem> categories = new ArrayList<ListItem>();
		categories.add(new ListItem(0, "-Select Category-"));
		categories.add(new ListItem(1, "Milk"));
		categories.add(new ListItem(2, "Meat"));
		categories.add(new ListItem(3, "Fruits"));
		categories.add(new ListItem(4, "Vegetables"));

		return ok(Json.toJson(categories));
	}

	public static Result productsByCategory() {
		JsonNode jsonNode = request().body().asJson();
		if (jsonNode == null) {
			return badRequest("Expecting Json data");
		} else {
			int categoryId = jsonNode.findPath("categoryId").asInt();
			List<ListItem> products = null;
			if (categoryId > 0) {
				products = new ArrayList<ListItem>();
				products.add(new ListItem(0, "-Select Product-"));
				switch (categoryId) {
				case 1:
					products.add(new ListItem(1, "Cheese"));
					products.add(new ListItem(2, "Yogurt"));
					products.add(new ListItem(3, "butter"));
					products.add(new ListItem(4, "Milk"));
					break;
				case 2:
					products.add(new ListItem(1, "Bacon"));
					products.add(new ListItem(2, "Beef"));
					products.add(new ListItem(3, "Chicken"));
					products.add(new ListItem(4, "Duck"));
					break;
				case 3:
					products.add(new ListItem(1, "Apple"));
					products.add(new ListItem(2, "Pine apple"));
					products.add(new ListItem(3, "Strawberry"));
					products.add(new ListItem(4, "Peach"));
					break;
				case 4:
					products.add(new ListItem(1, "Lettuce"));
					products.add(new ListItem(2, "Carrot"));
					products.add(new ListItem(3, "Cucumber"));
					products.add(new ListItem(4, "Tomato"));
					break;
				}
			}
			return ok(Json.toJson(products));
		}

	}
}

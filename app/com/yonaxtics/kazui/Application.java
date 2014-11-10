package com.yonaxtics.kazui;

import play.mvc.Controller;
import play.mvc.Result;

public class Application extends Controller {

    public static Result kazui() {
        return ok(views.html.index.kazui.render());
    }    

    public static Result components() {
        return ok(views.html.components.components.render());
    }

}

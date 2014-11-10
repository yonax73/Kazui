package com.yonaxtics.kazui;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {

    public static Result kazui() {
        return ok(views.html.index.kazui.render());
    }

}

package com.yonaxtics.kazui;
import static play.mvc.Results.badRequest;
import static play.mvc.Results.internalServerError;
import static play.mvc.Results.notFound;
import play.Application;
import play.GlobalSettings;
import play.Logger;
import play.libs.F.Promise;
import play.mvc.Http.RequestHeader;
import play.mvc.Result;


public class Global extends GlobalSettings {	
	

	
    public void onStart(Application app) {  
        Logger.info("Application has started");
    }    
    
    public void onStop(Application app) {    
        Logger.info("Application shutdown...");
    }	
    
    public Promise<Result> onBadRequest(RequestHeader request, String error) {
    	Logger.error("Bad Request uri: "+request.uri());
    	Logger.error("Bad Request Error: "+error);
        return Promise.<Result>pure(badRequest("Don't try to hack the URI!"));
    }
    
    public Promise<Result> onHandlerNotFound(RequestHeader request) {
    	Logger.error("Not found Page: "+request.uri());
        return Promise.<Result>pure(notFound(
            views.html.sec.error.notFoundPage.render()
        ));
    }
    
    public Promise<Result> onError(RequestHeader request, Throwable t) {
    	Logger.error(t.getMessage(),t);
        return Promise.<Result>pure(internalServerError(        		  
            views.html.sec.error.errorPage.render()        
        ));
    }

    



    




}

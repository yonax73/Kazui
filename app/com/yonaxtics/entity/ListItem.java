package com.yonaxtics.entity;

/** 
 * Class     : ListItem.java<br/>
 * Copyright : (c) 2014<br/>
 * Company   : yonaxtics<br/>
 * date      : Dec 7, 2014<br/> 
 * User      : yonatan<br/> 
 * @author Yonatan Alexis Quintero Rodriguez<br/>
 */

public class ListItem {

	private int option;
	private  String value;
	
	public ListItem(int option,String value){
		this.option = option;
		this.value = value;
	}
	/**
	 * @return the option
	 */
	public int getOption() {
		return option;
	}
	/**
	 * @param option the option to set
	 */
	public void setOption(int option) {
		this.option = option;
	}
	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}
	/**
	 * @param value the value to set
	 */
	public void setValue(String value) {
		this.value = value;
	}
}

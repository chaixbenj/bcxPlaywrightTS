import { Page } from '@playwright/test';
import { BasePage } from '../../src/base/web/BasePage';
import { BaseElement } from '../../src/base/web/element/BaseElement';
import { List } from '../../src/base/web/element/List';
import { Checkbox } from '../../src/base/web/element/Checkbox';
import { Radio } from '../../src/base/web/element/Radio';

export class AutomationExerciseNewUserAccount2 extends BasePage {
    public idGender1: Radio = new Radio(this.page, `id_gender1`, this.page.locator(`#id_gender1`)); //input
    public idGender2: Radio = new Radio(this.page, `id_gender2`, this.page.locator(`#id_gender2`)); //input
    public name: BaseElement = new BaseElement(this.page, `name`, this.page.locator(`#name`)); //input
    public email: BaseElement = new BaseElement(this.page, `email`, this.page.locator(`#email`)); //input
    public password: BaseElement = new BaseElement(this.page, `password`, this.page.locator(`#password`)); //input
    public days: List = new List(this.page, `days`, this.page.locator(`#days`)); //select
    public months: List = new List(this.page, `months`, this.page.locator(`#months`)); //select
    public years: List = new List(this.page, `years`, this.page.locator(`#years`)); //select
    public newsletter: Checkbox = new Checkbox(this.page, `newsletter`, this.page.locator(`#newsletter`)); //input
    public optin: Checkbox = new Checkbox(this.page, `optin`, this.page.locator(`#optin`)); //input
    public firstName: BaseElement = new BaseElement(this.page, `first_name`, this.page.locator(`#first_name`)); //input
    public lastName: BaseElement = new BaseElement(this.page, `last_name`, this.page.locator(`#last_name`)); //input
    public company: BaseElement = new BaseElement(this.page, `company`, this.page.locator(`#company`)); //input
    public address1: BaseElement = new BaseElement(this.page, `address1`, this.page.locator(`#address1`)); //input
    public address2: BaseElement = new BaseElement(this.page, `address2`, this.page.locator(`#address2`)); //input
    public country: List = new List(this.page, `country`, this.page.locator(`#country`)); //select
    public state: BaseElement = new BaseElement(this.page, `state`, this.page.locator(`#state`)); //input
    public city: BaseElement = new BaseElement(this.page, `city`, this.page.locator(`#city`)); //input
    public zipcode: BaseElement = new BaseElement(this.page, `zipcode`, this.page.locator(`#zipcode`)); //input
    public mobileNumber: BaseElement = new BaseElement(this.page, `mobile_number`, this.page.locator(`#mobile_number`)); //input
    public createAccount: BaseElement = new BaseElement(this.page, `Create Account`, this.page.getByText(`Create Account`)); //button
    
    constructor(page: Page) {
    super(page);
    this.addElement(this.idGender1);
    this.addElement(this.idGender2);
    this.addElement(this.name);
    this.addElement(this.email);
    this.addElement(this.password);
    this.addElement(this.days);
    this.addElement(this.months);
    this.addElement(this.years);
    this.addElement(this.newsletter);
    this.addElement(this.optin);
    this.addElement(this.firstName);
    this.addElement(this.lastName);
    this.addElement(this.company);
    this.addElement(this.address1);
    this.addElement(this.address2);
    this.addElement(this.country);
    this.addElement(this.state);
    this.addElement(this.city);
    this.addElement(this.zipcode);
    this.addElement(this.mobileNumber);
    this.addElement(this.createAccount);
    
    }
    }
    
    
    /*jdd csv :
    test-id;Title;uniform-id_gender1;uniform-id_gender2;id_gender1;id_gender2;name;email;password;Date of Birth;uniform-days;days;uniform-months;months;uniform-years;years;newsletter;optin;Address Information;first_name;last_name;company;(Street address, P.O. Box, Company name, etc.);address1;address2;country;state;city;zipcode;mobile_number;Create Account;
    
    
    jdd json :
    [
    {
    "test-id":"",
    "id_gender1":"", //input
    "id_gender2":"", //input
    "name":"", //input
    "email":"", //input
    "password":"", //input
    "days":"", //select
    "months":"", //select
    "years":"", //select
    "newsletter":"", //input
    "optin":"", //input
    "first_name":"", //input
    "last_name":"", //input
    "company":"", //input
    "address1":"", //input
    "address2":"", //input
    "country":"", //select
    "state":"", //input
    "city":"", //input
    "zipcode":"", //input
    "mobile_number":"", //input
    "Create Account":"", //button
    }
    ]*/
import { test as baseTest } from '@playwright/test';
import { AutomationExerciseLogin } from './pages/AutomationExerciseLogin';
import { AutomationExerciseHome } from './pages/AutomationExerciseHome';
import { AutomationExerciseNewUserAccount } from './pages/AutomationExerciseNewUserAccount';
import { DataUtil } from '../src/utils/DataUtil'
import { AutomationExerciseDeleteAccount } from './pages/AutomationExerciseDeleteAccount';
import { Headers } from '../src/base/test/Headers';


let name: string;
let email: string;

baseTest.describe('Tests compte @git', () => {

    baseTest.beforeAll(async () => {
        name = DataUtil.randomAlphaString();
        email = name + "@test.fr";
    });


    baseTest('créer un compte : cas passant @git', { tag: '@acceptance' }, async ({ page }) => {
        Headers.feature('FT01 - gestion des comptes');
        Headers.story('US01 - création compte');
        const homePage = new AutomationExerciseHome(page);
        await homePage.navigateTo();
        await homePage.consent.click();
        await homePage.signupLogin.click();

        const loginPage = new AutomationExerciseLogin(page);
        await loginPage.demandeDeCreationDeCompte(name, email);

        const newAccountPage = new AutomationExerciseNewUserAccount(page);
        await newAccountPage.creerUnCompte('newAccount.json', 'tc1');

        await homePage.loggedInAs0.injectValues({"{0}": name}).assertVisible(true);
    });

    baseTest('Test 2: Supprimer un compte 2 @git', { tag: '@acceptance' }, async ({ page }) => {
        Headers.feature('FT01 - gestion des comptes');
        Headers.story('US02 - suppression compte');

        const homePage = new AutomationExerciseHome(page);
        await homePage.navigateTo();
        await homePage.consent.click();
        await homePage.signupLogin.click();

        const loginPage = new AutomationExerciseLogin(page);
        await loginPage.connexion(email,'Password01!');
        await homePage.deleteAccount.click();

        const deleteAccountPage = new AutomationExerciseDeleteAccount(page);
        await deleteAccountPage.accountDeletedMessage.assertVisible(true);
        await deleteAccountPage.continueButton.click();

        //await page.screenshot();
    });
});


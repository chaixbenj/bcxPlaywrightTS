import { test } from '@playwright/test';
import { feature, story, issue, tag, severity } from 'allure-js-commons';
import config from '../../../playwright.config';

export class Headers {
    static feature(value: string): void {
        if (this.isAzureReport()) feature(value);
        test.info().annotations.push(
                    { type: 'feature', description: value }
                );
    }

    static story(value: string): void {
        if (this.isAzureReport()) story(value);
        test.info().annotations.push(
                    { type: 'story', description: value }
                );
    }

    static issue(value: string): void {
        if (this.isAzureReport()) issue(value);
        test.info().annotations.push(
                    { type: 'issue', description: value }
                );
    }

    static tag(value: string): void {
        if (this.isAzureReport()) tag(value);
        test.info().annotations.push(
                    { type: 'tag', description: value }
                );
    }

    static severity(value: string): void {
        if (this.isAzureReport()) severity(value);
        test.info().annotations.push(
                    { type: 'severity', description: value }
                );
    }

    private static isAzureReport(): boolean {
        const reporters = config.reporter;
        return reporters?.some(([reporter]) => reporter === 'allure-playwright');
    }
}
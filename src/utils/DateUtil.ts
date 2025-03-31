class DateUtil {
    static day(offset: number): string {
        let date = new Date();
        date.setDate(date.getDate() + offset);
        return date.getDate().toString();
    }

    static month(offset: number): string {
        let date = new Date();
        date.setMonth(date.getMonth() + offset);
        return (date.getMonth() + 1).toString();
    }

    static year(offset: number): string {
        let date = new Date();
        date.setFullYear(date.getFullYear() + offset);
        return date.getFullYear().toString();
    }

    static todayPlusDays(format: string, days: number): string {
        let date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split("T")[0];
    }
}
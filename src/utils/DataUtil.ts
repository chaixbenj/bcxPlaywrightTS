import { EOL } from "os";

export class DataUtil {

    static randomAlphaString(): string {
        const timestamp = String(Date.now());
        const replacementChars = "abeciropus";
        return timestamp.replace(/\d/g, (match) => replacementChars[parseInt(match)]);
    }

    static replacePlaceholders(s: string, replacements: Record<string, string>): string {
        return Object.entries(replacements).reduce((acc, [key, value]) => {
            return acc.split(key).join(value);
        }, s);
    }


    static normalizeText(value: string | null): string {
        if (!value) return ""; // Si null ou undefined, retourner une chaîne vide
        const lineSeparator = EOL ; //"\n";    
        value = value
            .replace(/ /g, " ")  // Remplace le NNBSP (U+202F) par un espace normal
            .replace(/ /g, " ")  // Remplace le NBSP (U+00A0) par un espace normal
            .replace(/’/g, "'")  // Remplace l’apostrophe typographique par un apostrophe simple
            .replace(/\s/g, " ")  // Remplace tous les espaces (y compris tabulations et retours à la ligne) par un espace normal
            .replace(/\s{2,}/g, " ")  // Remplace plusieurs espaces consécutifs par un seul espace
            .replace(/\r\n|\n/g, lineSeparator)  // Normalise les sauts de ligne
            .trim();  // Supprime les espaces en début et fin de chaîne
        return value.trim().replace(/\s+/g, ' ');    
    }
    
    static capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    /**
     * cette méthode est utile pour remplacer des variables dans un chaine, notamment dans le jeu de donnée csv/json.
     * Elle remplace les valeurs suivantes dans une chaine par :
     * {RANDOMSTRING} est remplacé par une chaine aléatoire en majuscule
     * {randomstring} est remplacé par une chaine aléatoire en minuscule
     * {Randomstring} est remplacé par une chaine aléatoire en minuscule, premier caractère en majuscule
     * {DAY+2} est remplacé par le jour courant +2 jours format dd ({DAY+/n} ou {DAY} tout court)
     * {MONTH+2} est remplacé par le mois courant +2 mois format MM ({MONTH+/n} ou {MONTH} tout court)
     * {YEAR+2} est remplacé par l'année courante +2 ans format yyyy ({YEAR+/n} ou {YEAR} tout court)
     * {CURRENTDATE_dd/MM/yyyy_+2} est remplacé par la date courante +2 jours au format dd/MM/yyyy ({CURRENTDATE_format_+/-n} ou {CURRENTDATE_format} tout court)
     * @param value
     * @return
     */
    static replaceVariable(value: string | null): string | null {
        let v = String(value);
        let variabilised = false;
    
        if (v && v.includes("{")) {
            v = v.replace(/{/g, "|").replace(/}/g, "|");
            let tabV = v.split("|");
    
            tabV = tabV.map((tabVi) => {
                if (tabVi === "RANDOMSTRING") {
                    variabilised = true;
                    return DataUtil.randomAlphaString().toUpperCase();
                } else if (tabVi === "randomstring") {
                    variabilised = true;
                    return DataUtil.randomAlphaString();
                } else if (tabVi === "Randomstring") {
                    variabilised = true;
                    return DataUtil.capitalize(DataUtil.randomAlphaString());
                } else if (tabVi.startsWith("DAY")) {
                    variabilised = true;
                    return DateUtil.day(tabVi === "DAY" ? 0 : parseInt(tabVi.replace("DAY", "")));
                } else if (tabVi.startsWith("MONTH")) {
                    variabilised = true;
                    return DateUtil.month(tabVi === "MONTH" ? 0 : parseInt(tabVi.replace("MONTH", "")));
                } else if (tabVi.startsWith("YEAR")) {
                    variabilised = true;
                    return DateUtil.year(tabVi === "YEAR" ? 0 : parseInt(tabVi.replace("YEAR", "")));
                } else if (tabVi.startsWith("CURRENTDATE")) {
                    let currentDateParams = tabVi.split("_");
                    variabilised = true;
                    return DateUtil.todayPlusDays(
                        currentDateParams[1],
                        currentDateParams.length === 2 ? 0 : parseInt(currentDateParams[2])
                    );
                }
                return tabVi;
            });
    
            v = tabV.join("");
        }
    
        return variabilised ? v : value;
    }
}
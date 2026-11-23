# RB-030 – SharePoint-Datei nicht erreichbar (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Bearbeitungsstand:** 22.11.2026 · **Version:** 1.0  
**Status:** Offizielle Microsoft-Quellen ausgewertet, **praktische Laborvalidierung noch ausstehend**. Beide Praxisfälle sind fiktiv; keine produktiven Systeme verändert.

## Komplettpaket – genau sechs Dateien

```text
RB-030_SharePoint-Datei-nicht-erreichbar/
├── README.md
├── RB-030_Lernartikel.md
├── RB-030_Praxis-Runbook.md
└── assets/
    ├── rb030_henne_ei_sharepoint.png
    ├── rb030_diagnosebaum.svg
    └── rb030_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-030_Lernartikel.md` | Ausführliche Fallanalyse mit 15 Kapiteln, technischen Hintergründen, Diagnosematrix, lesenden Prüfungen, zwei fiktiven Praxisfällen und Active Recall |
| `RB-030_Praxis-Runbook.md` | Kompakte L1-/L2-Arbeitsanweisung mit 10 Abschnitten, vier Diagnosepfaden, Sicherheits-Gate, Erfolgskontrolle und Muster-Ticketkommentar |
| `assets/rb030_henne_ei_sharepoint.png` | Henne-und-Ei-Infografik im professionellen Comic-Stil für Schulung und Website |
| `assets/rb030_diagnosebaum.svg` | Skalierbarer technischer Entscheidungsbaum mit getrennten 403-/404-/Sync-/Site-Pfaden |
| `assets/rb030_diagnosebaum_preview.png` | Einbindbare PNG-Vorschau des technischen Entscheidungsbaums |
| `README.md` | Dateiübersicht, Arbeitsregeln, Quellen und Veröffentlichungshinweise |

**Grafikhinweis:** Die Henne-und-Ei-Illustration ist eine **eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT**. Der technische Diagnosebaum wurde separat als SVG aus fachlich geprüften Entscheidungsschritten erstellt. Nicht mit einem ausgeführten Laborversuch verwechseln.

## Kerngedanke dieses Tickets

**Ein Fehlerbild ist keine Ursache.** 403, 404 und ein nur lokal auftretender Explorerfehler weisen auf **unterschiedliche Prüfpfade**, beweisen deren Ursache aber nicht schon allein.

1. **Identität:** Richtiges Unternehmenskonto und Tenant?
2. **Speicherort:** Existieren Site, Bibliothek und Datei? Funktioniert der direkte Aufruf?
3. **Link/Recht:** Welche Freigabeart, Zielgruppe, direkte/geerbte/Gruppenrechte sind wirksam?
4. **Schutzregeln:** Gibt es zusätzlich Site Access Restriction, externe Freigabebeschränkung oder Conditional Access?
5. **Client:** Funktioniert die Datei nur im Browser, aber nicht im synchronisierten Explorerpfad?
6. **Nachweis:** Kann die ursprünglich betroffene Person mit **Minimalrechten** ihre Fachaufgabe wieder erledigen?

## Empfohlener Lern- und Validierungsablauf

1. **Vorwissen:** Aus dem Kopf erklären, weshalb „Access denied“ nicht automatisch „Berechtigung fehlt“ bedeutet.
2. **Gezielt lernen:** Zuerst `RB-030_Lernartikel.md` mit der Abhängigkeitskette und den Fehlerpfaden durcharbeiten.
3. **Eigenständige Diagnose:** Die fiktiven Fälle erst **ohne** Lösungshinweise in eine Hypothesen-/Testmatrix übertragen.
4. **Praxis:** Die entsprechenden Zustände später in einem berechtigten SharePoint-/OneDrive-Testtenant nachbilden und mit dem Runbook untersuchen.
5. **Validierung:** Ausgangsfehler, Prüfungen, tatsächliche Ursache, freigegebene Änderung und Ende-zu-Ende-Funktionstest dokumentieren.
6. **Active Recall / Spaced Repetition:** Wissens-, Verständnis- und Diagnosekarten anfertigen; nach ca. 7 und 21 Tagen erneut ohne Vorlage lösen.

**Wichtig:** Bis zu einem realen, autorisierten Test darf kein Abschnitt als „praktisch bestätigt“ oder als tatsächlich ausgeführtes Ticket dargestellt werden.

## Sicherheits- und Freigaberegeln

- Keine Authentifizierungstokens, vollständigen sensiblen Freigabelinks, Passwörter, Cookies oder vertrauliche Dokumentinhalte in Tickets übernehmen.
- Berechtigungen, Site-/Gast-/Conditional-Access-Regeln nur nach fachlich bestätigtem Sollrecht und Freigabe verändern.
- Keine pauschale „Jeder mit dem Link“-Freigabe, keine unnötigen Vollzugriffs-/Site-Owner-Rechte.
- Nicht synchronisierte lokale Dateien/Änderungen vor einer OneDrive-Reparatur oder Neuverknüpfung sichern.
- Löschungen/Wiederherstellungen im SharePoint-Papierkorb nicht ohne Prüfung von Eigentümer, Retention, Inhalt und Konflikten durchführen.
- Lesende PowerShell- und Admin-Prüfungen nur in zulässigem Berechtigungs- und Tenantkontext; `Get-SPOSite` ersetzt nicht die Prüfung effektiver Dateiberechtigungen.
- **Service Health und dokumentierte Changes** berücksichtigen, wenn mehrere User/Sites betroffen sind.

## Integration in die GitHub-Pages-Website (später)

Die vorbereiteten Markdown-Dateien verlinken ihre Bilder **relativ** zum Paketordner. Bei der späteren Integration in die Website `https://marcf46.github.io/it-support-troubleshooting-50-tickets.html` sollte die bestehende Projektstruktur und der schon vorhandene `support-case`-Aufbau verwendet werden. Grafik-Dateinamen und Markdown-Links bei der Übernahme konsistent anpassen. Diese Erstellung **ändert das Repository nicht**.

**Vorgeschlagener Bildnachweis:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.

**Empfohlene Transparenzkennzeichnung:** „Recherchierte und theoretisch nachvollzogene Fallanalyse. Die beschriebene Lösung wurde noch nicht vollständig praktisch validiert.“

## Quellen – offizielle Microsoft-Dokumentation (abgerufen 22.11.2026)

1. [Unable to access SharePoint Online](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/administration/sharepoint-online-inaccessible)
2. [403 Forbidden in OneDrive or SharePoint](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/sharing-and-permissions/error-403-forbidden)
3. [404 File/Page not found in OneDrive or SharePoint](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/administration/error-404-onedrive-sharepoint)
4. [Anzeigen, für wen eine Datei in OneDrive oder SharePoint freigegeben ist](https://support.microsoft.com/de-de/sharepoint/sharepoint-sharing-and-permissions/see-who-a-file-is-shared-with-in-onedrive-or-sharepoint)
5. [Verwalten von Teilen und Berechtigungen in OneDrive und SharePoint](https://support.microsoft.com/de-de/onedrive/sharepoint/manage-sharing-and-permissions-in-onedrive-and-sharepoint)
6. [Restrict SharePoint site access with groups](https://learn.microsoft.com/en-us/sharepoint/restricted-access-control)
7. [Overview of external sharing in SharePoint and OneDrive](https://learn.microsoft.com/en-us/sharepoint/external-sharing-overview)
8. [Beheben von Synchronisierungsproblemen mit SharePoint Online](https://support.microsoft.com/de-de/sharepoint/sync/fix-sharepoint-online-sync-problems)
9. [Wiederherstellen gelöschter Elemente aus dem Papierkorb der Websitesammlung](https://support.microsoft.com/de-de/sharepoint/admin/restore-deleted-items-from-the-site-collection-recycle-bin)
10. [Conditional Access policy for SharePoint](https://learn.microsoft.com/en-us/sharepoint/authentication-context-example)
11. [Get-SPOSite (SharePoint Online Management Shell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.online.sharepoint.powershell/get-sposite)

**Abgrenzung:** Die Herstellerquellen unterstützen die beschriebenen Fehlerklassen und Maßnahmen. Eine individuelle Ursache entsteht erst aus einem konkreten Diagnosebefund – nicht aus einem Fehlercode allein.

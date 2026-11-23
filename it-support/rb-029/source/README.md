# RB-029 – Microsoft-365-Lizenz fehlt (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Recherche und Erstellung:** 22.11.2026  
**Fachstatus:** Anhand offizieller Microsoft-Dokumentationen erstellt; **praktische Validierung ausstehend**.

## Komplettpaket – sechs Dateien

```text
RB-029_Microsoft-365-Lizenz-fehlt/
├── RB-029_Lernartikel.md
├── RB-029_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb029_henne_ei_m365_lizenz.png
    ├── rb029_diagnosebaum.svg
    └── rb029_diagnosebaum_preview.png
```

| Datei | Verwendung |
|---|---|
| `RB-029_Lernartikel.md` | 15 Kapitel: Grundlagen, SKU vs. Serviceplan, Admin Center, direkte/gruppenbasierte Vergabe, lokale Aktivierung, lesende Graph-PowerShell, Fälle, Active Recall |
| `RB-029_Praxis-Runbook.md` | Zehn Abschnitte: L1/L2-Aufnahme, vier Fehlerpfade, Sicherheits-Gate, Umsetzung nur mit Freigabe, Re-Tests, Ticketkommentar |
| `assets/rb029_henne_ei_m365_lizenz.png` | **Einzige** Henne-und-Ei-Infografik – professionellerer Look, wechselnde Haltung/Mimik, fünf Diagnosephasen |
| `assets/rb029_diagnosebaum.svg` | Skalierbarer technischer Diagnose-Entscheidungsbaum |
| `assets/rb029_diagnosebaum_preview.png` | PNG-Vorschau des technischen Diagnosebaums |
| `README.md` | Struktur, Lern- und Prüfhinweise, Quellen und Website-Integration |

**Keine Zusatz-Bildergalerie.** Die Projektwebsite ist durch die Erstellung dieser ZIP-Datei nicht verändert worden.

## Kerngedanke

> **Eine korrekt zugewiesene Lizenz ist weder ein Beweis für den passenden Serviceplan noch für eine erfolgreiche lokale Office-Aktivierung.**

Prüfreihenfolge für den Support:

1. Richtige Identität im richtigen Tenant.
2. Erwartete SKU, verfügbarer Platz, direkte oder gruppenbasierte Zuweisung.
3. Serviceplan vorhanden, aktiviert und die Zuweisung fehlerfrei verarbeitet.
4. Falls nur der Desktop-Client betroffen ist: richtige Office-Anmeldung und Aktivierung.
5. Fachlich passende, freigegebene Korrektur plus nachweisbarer Re-Test der ursprünglichen Funktion.

*Ein Benutzer mit Business Basic kann z. B. Word Web nutzen und trotzdem kein Recht zur Desktop-Aktivierung besitzen. Der aktuelle konkrete Produktumfang muss im Tenant und beim Hersteller geprüft werden.*

## Empfohlener Lernablauf

**Vorwissen → Ursachenhypothese → Herstellerbeleg → Diagnosebaum → Runbook → eigener Prüfplan → Active Recall → spätere Praxisvalidierung.**

- Zuerst in eigenen Worten erklären: Was sind SKU, Serviceplan, Zuweisungsstatus und Aktivierung?
- Für beide fiktiven Musterfälle selbst eine wahrscheinlichste Hypothese und einen unterscheidenden Test formulieren.
- Das Runbook nachvollziehen, aber **keine produktiven Berechtigungen verändern**.
- Den Diagnosebaum nutzen, um einen unbekannten Fall eigenständig in die richtige Fehlerklasse einzuordnen.
- Beim späteren erlaubten Testtenant-Versuch Hypothese, Soll/Ist und Re-Test getrennt protokollieren.
- Nach etwa sieben und 21 Tagen die wichtigsten Diagnoseentscheidungen ohne Textvorlage abrufen.

## Sicherheit und Berechtigungen

1. Microsoft-365-Lizenzen, Serviceplans, Gruppen und Benutzer **nur nach Freigabe und mit vorgesehenen Administratorrollen** ändern.
2. **Nicht** als Erstmaßnahme Profile, Office-Lizenzdateien, Tokens oder Registry-Schlüssel löschen.
3. Beim Wechsel zwischen lizenzierten Gruppen die Zielzuweisung **zuerst verifizieren**, bevor die alte Mitgliedschaft entfernt wird.
4. Lizenzänderungen können Nutzungsrechte und Dienste beeinflussen; Folgen vorab bewerten.
5. PowerShell-Beispiele in den Dokumenten sind **lesend** (`Get-Mg...`), bis auf die interaktive Verbindung (`Connect-MgGraph`), die nur eine Sitzung eröffnet; nicht im Kundentenant ohne Autorisierung ausführen.
6. Inhalte der beispielhaften Tickets sind **fiktiv**; kein Ergebnis ist ein belegter Lab-Test.

## Einbindung in GitHub Pages – später

Das Paket lässt sich analog zu den bisherigen Supportfällen als gesondertes Ticket in der Website integrieren. Empfohlen: Lernartikel und Runbook in bestehendes Layout überführen; Infografik und Diagnosebaum als `assets/` übernehmen; Quellenlinks zugänglich halten; den Hinweis **„recherchiert, nicht praktisch validiert“** sichtbar beibehalten. Diese ZIP-Datei allein veröffentlicht nichts.

**Bildnachweis-Vorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“

## Quellen – offizielle Microsoft-Dokumentation (Recherche 22.11.2026)

- [Q1] Microsoft 365 Admin Center: Lizenzzuweisung und Fehler: https://learn.microsoft.com/en-us/microsoft-365/admin/manage/assign-licenses-to-users?view=o365-worldwide
- [Q2] Gruppenbasierte Lizenzierung: https://learn.microsoft.com/en-us/microsoft-365/admin/manage/manage-group-licenses?view=o365-worldwide
- [Q3] Nicht lizenziertes Produkt / Aktivierung: https://support.microsoft.com/de-de/microsoft-365-activation-licensing/office-install/unlicensed-product-and-activation-errors-in-office
- [Q4] Microsoft 365 Apps – Lizenz und Aktivierungsmodelle: https://learn.microsoft.com/en-us/microsoft-365-apps/licensing-activation/overview-licensing-activation-microsoft-365-apps
- [Q5] Shared Computer Activation: https://learn.microsoft.com/en-us/microsoft-365-apps/licensing-activation/troubleshoot-shared-computer-activation
- [Q6] Microsoft 365 Business-Tarifvergleich: https://www.microsoft.com/de-de/microsoft-365/business/compare-all-microsoft-365-business-products
- [Q7] Aktivierungsstatus zurücksetzen (nur gezielt): https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/activation/reset-activation-state
- [Q8] Microsoft Graph Lizenzdetails anzeigen: https://learn.microsoft.com/en-us/microsoft-365/enterprise/view-account-license-and-service-details-with-microsoft-365-powershell
- [Q9] Graph-Befehle zu Gruppenlizenzierung: https://learn.microsoft.com/en-us/entra/identity/users/licensing-powershell-graph-examples
- [Q10] `Get-MgUserLicenseDetail`: https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.users/get-mguserlicensedetail?view=graph-powershell-1.0

**Hinweis:** Lizenzprodukte, Admin-Center-Oberflächen und Microsoft-365-Lizenzregeln können sich ändern. Vor produktiven Eingriffen aktuelle Herstellerinformationen und interne Richtlinien bestätigen.

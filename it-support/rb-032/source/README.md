# RB-032 – Outlook-Kalender oder Terminproblem (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Offizielle Microsoft-Dokumentation recherchiert; **praktische Validierung noch ausstehend**. Keine produktiven Kalendereinträge oder Berechtigungen geändert; Beispiele fiktiv.

## Komplettpaket – genau sechs Dateien

```text
RB-032_Outlook-Kalender-Terminproblem/
├── README.md
├── RB-032_Lernartikel.md
├── RB-032_Praxis-Runbook.md
└── assets/
    ├── rb032_henne_ei_kalender.png
    ├── rb032_diagnosebaum.svg
    └── rb032_diagnosebaum_preview.png
```

| Datei | Inhalt und Zweck |
|---|---|
| `RB-032_Lernartikel.md` | 15 Kapitel: Kalender/Meeting-Grundlagen, OWA-A/B-Test, Einladung/Update, Sync/Freigaben, Zeitzonen, CDL/PowerShell, 2 fiktive Fälle und Active Recall |
| `RB-032_Praxis-Runbook.md` | 10 Arbeitsabschnitte für L1/L2 mit Triage, Sicherheits-Gate, Diagnosepfaden, Erfolgskontrolle, Muster-Ticketkommentar |
| `assets/rb032_henne_ei_kalender.png` | Henne-und-Ei-Infografik im abgestimmten, professionelleren Stil |
| `assets/rb032_diagnosebaum.svg` | Technischer Entscheidungsbaum, skalierbar |
| `assets/rb032_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums |
| `README.md` | Übersicht, Quellen, Sicherheit, Veröffentlichungs- und Lernhinweise |

**Bildnachweisvorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“. Illustration; kein Screenshot aus einer produktiven Umgebung.

## Kernaussage

**Fehlender Termin ≠ gelöschter Termin.** Entscheidend sind zunächst **richtiges Konto/Kalender**, **Organisator und Einladung**, **OWA/Desktop-Vergleich**, **Rechte/Delegation** und **Zeitzone/Serie**. Die Client-Anzeige allein beweist weder Datenverlust noch einen Berechtigungsfehler.

## Diagnoseweg als Kurzfassung

1. Exaktes Fehlerbild, Kalenderbesitzer, Organisator, Konto, Datum, Zone und Client erfassen.
2. **Gleiches Konto, gleicher Kalender, gleicher Termin** in OWA und Desktop vergleichen.
3. Bei OWA korrekt und Desktop fehlerhaft Clientansicht, Synchronisierung und Shared-Calendar-Modell eingrenzen.
4. Bei OWA ebenfalls fehlerhaft Einladung, Update, Absage, Serie und Organisator-/Teilnehmerkopie prüfen; L2 nutzt ggf. CDL.
5. Bei geteiltem Kalender Zugriffsrolle/Delegation kontrollieren; bei Zeitabweichung Zeitzonen und DST vergleichen.
6. Nach Freigabe kleinste Maßnahme, mit Originalnutzer reproduzierbar retesten und dokumentieren.

## Lernablauf

**Vorwissen aktivieren → Lernartikel mit Quellen → fiktive Fälle eigenständig diagnostizieren → Runbook gegenprüfen → später im Lab reproduzieren → ohne Vorlage erklären → nach 7/21 Tagen abrufen.**

Anki-Karten nur aus tatsächlich verstandenen und geprüften Zusammenhängen auswählen. Die Recherche ist ausdrücklich **kein Nachweis praktischer Erfahrung**.

## Sicherheit und Datenschutz

- Keine echten Termine, Serien, Einladungen, Stellvertretungen, Profile oder Berechtigungen auf Verdacht verändern oder löschen.
- Auch Betreff, Teilnehmer und Kalenderdiagnoseprotokolle können personenbezogene/vertrauliche Informationen enthalten; minimal dokumentieren.
- Für Kalendereingriffe und Testeinladungen organisatorische Freigabe einholen; Rückbau und Information betroffener Teilnehmer planen.
- `Get-EXOMailboxFolderPermission` und `Get-CalendarDiagnosticObjects` nur mit genehmigter Rolle und Anwendungszweck; hier sind nur lesende Beispiele enthalten.
- Zeitangaben, Serieninstanzen und Organisator-/Teilnehmerkopien getrennt untersuchen; eine Anzeigeabweichung ist noch keine veränderte Meeting-Ursache.

## Spätere Website-Integration

Nicht veröffentlicht und nicht am GitHub-Repository geändert. Relative Markdown-Bildpfade bleiben im Archiv erhalten; beim späteren Website-Einbau an das vorhandene Layout anpassen.

**Transparenzsatz:** „Recherchierte und theoretisch nachvollzogene Fallanalyse; eine vollständige praktische Validierung der beschriebenen Maßnahmen ist noch nicht belegt.“

---

## Quellen – offizielle Microsoft-Dokumentation (geprüft am 22.11.2026)

- **[Q1]** [Calendar sharing in Microsoft 365 – Synchronisierung und neues/älteres Modell](https://support.microsoft.com/en-us/outlook/calendar-sharing-in-microsoft-365)
- **[Q2]** [Share your calendar in Outlook on the web – Freigabestufen und Kalenderansicht](https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web)
- **[Q3]** [Manage calendar permissions in Exchange Online – Kalenderberechtigungen und Delegationen](https://learn.microsoft.com/de-de/exchange/collaboration-exo/shared-calendars/manage-calendar-permissions)
- **[Q4]** [Manage time zone settings in Outlook – Zeitzonen/UTC](https://support.microsoft.com/de-de/outlook/getstarted/manage-time-zone-settings-in-outlook)
- **[Q5]** [Get calendar diagnostic logs for Exchange Online mailboxes – CDL](https://learn.microsoft.com/en-us/troubleshoot/exchange/calendars/cdl/get-calendar-diagnostic-logs)
- **[Q6]** [Analyze Calendar diagnostic logs for Exchange Online mailboxes – Zeitstrahl](https://learn.microsoft.com/en-us/troubleshoot/exchange/calendars/cdl/analyze-calendar-diagnostic-logs)
- **[Q7]** [Get-EXOMailboxFolderPermission – Exchange Online PowerShell](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-exomailboxfolderpermission?view=exchange-ps)
- **[Q8]** [Get-EXOMailboxFolderStatistics – Kalenderordner finden](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-exomailboxfolderstatistics?view=exchange-ps)
- **[Q9]** [Get-CalendarDiagnosticObjects – Kalenderereignisse](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-calendardiagnosticobjects?view=exchange-ps)
- **[Q10]** [Get-MailboxCalendarConfiguration – Arbeitszeiten/Zeitzone](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-mailboxcalendarconfiguration?view=exchange-ps)
- **[Q11]** [Get-MailboxRegionalConfiguration – Postfachregion/Zeitzone](https://learn.microsoft.com/de-de/powershell/module/exchangepowershell/get-mailboxregionalconfiguration?view=exchange-ps)
- **[Q12]** [Known issues with classic Outlook desktop shared calendar improvements](https://support.microsoft.com/en-us/support/known-issues/known-issues-with-classic-outlook-desktop-shared-calendar-improvements)
- **[Q13]** [Calendar Checking Tool for Outlook (CalCheck)](https://learn.microsoft.com/en-us/troubleshoot/outlook/calendaring/calendar-checking-tool-for-outlook)
- **[Q14]** [Change an appointment, meeting or event in Outlook](https://support.microsoft.com/en-us/outlook/calendar/change-an-appointment-meeting-or-event-in-outlook)
- **[Q15]** [Get-CalendarProcessing – Ressourcen-/Raumbuchung, Spezialpfad](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-calendarprocessing?view=exchange-ps)
- **[Q16]** [Bekanntes Problem: klassisches Outlook stürzt beim Akzeptieren einer freigegebenen Kalender-Einladung ab](https://support.microsoft.com/de-de/support/known-issues/classic-outlook-crash-accept-shared-calendar-invite)

**Quellenstatus und Grenzen:** Die Quellen dokumentieren Produktfunktionen, typische Fehler und Diagnosewerkzeuge; sie beweisen keine Ursache in einer konkreten Umgebung. Benutzeroberflächen, Bugs und Rolloutstände können sich ändern. Der Forschungsstand bezieht sich auf den 22.11.2026, die beschriebenen Tests wurden nicht an produktiven Systemen ausgeführt. Microsoft-Tools und Cmdlets können je nach Mandant, Exchange-Online-Modul und Rolle abweichen.

# RB-031 – Gemeinsames Postfach fehlt (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Anhand offizieller Microsoft-Dokumentation recherchiert; **praktische Validierung noch ausstehend**. Keine produktiven Berechtigungen geändert; Beispiele fiktiv.

## Komplettpaket – genau sechs Dateien

```text
RB-031_Gemeinsames-Postfach-fehlt/
├── README.md
├── RB-031_Lernartikel.md
├── RB-031_Praxis-Runbook.md
└── assets/
    ├── rb031_henne_ei_shared_mailbox.png
    ├── rb031_diagnosebaum.svg
    └── rb031_diagnosebaum_preview.png
```

| Datei | Inhalt / Verwendung |
|---|---|
| `RB-031_Lernartikel.md` | 15 Kapitel: Exchange Online Shared Mailbox, Full Access vs. Send As, Web-/Client-A/B-Test, Automapping, lesende PowerShell-Befehle, 2 fiktive Praxisfälle und Active Recall |
| `RB-031_Praxis-Runbook.md` | 10 Arbeitsabschnitte für L1/L2 mit Triage, Berechtigungs- und Clientpfaden, Sicherheits-Gate, Testplan und Ticketkommentar |
| `assets/rb031_henne_ei_shared_mailbox.png` | Professionelle Henne-und-Ei-Infografik für Schulung und spätere GitHub-Pages-Veröffentlichung |
| `assets/rb031_diagnosebaum.svg` | Separater, skalierbarer technischer Diagnosebaum mit nachvollziehbaren Entscheidungspfaden |
| `assets/rb031_diagnosebaum_preview.png` | PNG-Vorschau des technischen Diagnosebaums |
| `README.md` | Paketübersicht, Quellen, Handhabung, Sicherheits- und Transparenzhinweise |

**Bildnachweisvorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“. Die Comic-Infografik ist eine didaktische Illustration, kein Screenshot aus produktiver Microsoft-Umgebung. Der technische Diagnosebaum wurde aus recherchierten Entscheidungsschritten separat erstellt.

## Kernaussage

**Nicht in Outlook sichtbar ≠ kein Zugriff:** Ein Shared Mailbox kann in Exchange Online bestehen und im Browser erreichbar sein, aber im klassischen Outlook nicht automatisch eingebunden werden. Besonders **Full Access über eine Sicherheitsgruppe** liefert nach Microsoft nicht das normale Automapping für Gruppenmitglieder. **Full Access ≠ Send As**; Öffnen und Senden sind unterschiedliche Berechtigungen.

**Reihenfolge:**

1. Betroffene Person, SMTP-Adresse, Outlook-Variante und Fehlermeldung aufnehmen.
2. Gleichen Benutzer in Outlook im Web beim manuellen Öffnen des Shared Mailbox testen.
3. Bei Webfehlern Postfachexistenz, Identität und effektiven Full Access durch autorisierte L2-Administration prüfen.
4. Bei erfolgreichem Webtest lokale Outlook-Ansicht, Einbindemethode, Gruppen-/direkte Delegation und Automapping prüfen.
5. Nur bei Bedarf Send As bzw. Send on Behalf separat kontrollieren.
6. Nach begründeter, freigegebener Änderung die ursprüngliche Aufgabe mit dem ursprünglichen Benutzer verifizieren und dokumentieren.

## Lern- und Trainingsstandard

1. **Active Recall:** Erkläre vor Lektüre die Unterschiede Full Access, Send As und Automapping.
2. **Lernen:** Lies den Lernartikel und beurteile die Entscheidungen im Diagnosebaum.
3. **Selbst diagnostizieren:** Bearbeite zuerst die zwei fiktiven Fälle ohne deren Lösungen zu lesen; Hypothesen und den billigsten/sichersten Trenn-Test formulieren.
4. **Praxisvalidierung:** Nur in einer geeigneten, autorisierten Microsoft-365-Testumgebung die Delegation und Outlook-Einbindung vergleichen.
5. **Retest:** Zugriff und Sichtbarkeit im betroffenen Client, bei Bedarf zusätzlich Sendefunktion, nachweisen.
6. **Nachhaltige Kompetenz:** Geeignete Wissens-, Verständnis- und Diagnosekarten in Anki/FSRS übernehmen und nach ungefähr 7 und 21 Tagen wieder abrufen.

## Sicherheit und Rollen

- Keine Postfachkennwörter, Sitzungstokens, MFA-Codes oder vertrauliche Nachrichten in Tickets/Logs speichern.
- Keine Vollzugriffs- oder Senderechte ohne festgelegten Sollzustand und Freigabe ändern.
- **Gruppenberechtigung ohne Automapping** ist nicht automatisch ein Fehler des Rechtesystems; manuelle Einbindung kann sachgerecht sein.
- Keine Outlook-Profile löschen, Postfächer doppelt hinzufügen oder Rechte entfernen/neu vergeben, nur um eine Anzeige zu erzwingen.
- Exchange-Online-PowerShell nur mit genehmigter Rolle; hier gezeigte Befehle prüfen Objekte und Rechte **lesend**.
- Bei Hybrid, verwalteten Sonderprofilen, Compliance/Policy oder mehreren Betroffenen gezielt L2-/Exchange-Administration einschalten.

## Website-Integration (später)

Das Paket wurde **nicht** in `https://marcf46.github.io/it-support-troubleshooting-50-tickets.html` veröffentlicht. Markdown-Bilder sind relativ verlinkt; bei der späteren Integration die vorhandenen Layouts des Repositorys beibehalten und Bildpfade passend übernehmen.

**Empfohlener Transparenzsatz:** „Recherchierte und theoretisch nachvollzogene Fallanalyse; eine vollständige praktische Validierung der beschriebenen Maßnahmen ist noch nicht belegt.“

## Quellen – Microsoft-Dokumentation (abgerufen 22.11.2026)

1. [Open and use a shared mailbox in Outlook](https://support.microsoft.com/en-us/outlook/sharing/open-and-use-a-shared-mailbox-in-outlook)
2. [Create a shared mailbox](https://learn.microsoft.com/en-us/microsoft-365/admin/email/create-a-shared-mailbox?view=o365-worldwide)
3. [Manage permissions for recipients in Exchange Online](https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-permissions-for-recipients)
4. [Shared Mailboxes in Exchange Online](https://learn.microsoft.com/en-us/exchange/collaboration-exo/shared-mailboxes)
5. [Full Access mailbox not automapped](https://learn.microsoft.com/en-us/troubleshoot/outlook/profiles-and-accounts/full-access-mailbox-not-automapped-outlook-profile)
6. [About shared mailboxes in Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes?view=o365-worldwide)
7. [Manage shared mailbox settings in new Outlook](https://support.microsoft.com/en-us/outlook/sharing/manage-shared-mailbox-settings-in-new-outlook)
8. [Get-EXOMailboxPermission](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-exomailboxpermission?view=exchange-ps)
9. [Get-EXORecipientPermission](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-exorecipientpermission?view=exchange-ps)
10. [Exchange hybrid permissions](https://learn.microsoft.com/en-us/exchange/permissions)

**Grenzen:** Die Artikel erklären bekannte Produktmechanismen; der individuelle Fehlerursachennachweis erfordert reale Tests. Microsoft-UI und Mandantenrichtlinien können sich ändern; vor produktivem Einsatz aktuelle Dokumentation und firmeninterne Verfahren abgleichen.

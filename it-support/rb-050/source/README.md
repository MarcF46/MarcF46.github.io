# RB-050 – Offboarding: Benutzerzugänge sicher deaktivieren (L1/L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle  
**Stand:** 23.11.2026 · **Paketversion:** 1.0  
**Status:** Recherchiert, mit Microsoft-Herstellerdokumentation verglichen, **nicht praktisch validiert**.

## Paketstruktur – genau sechs Dateien

| Datei | Inhalt / Verwendungszweck |
|---|---|
| `RB-050_Lernartikel.md` | 15 Kapitel: Kontosperrung, Tokens, Hybrid-AD, App-Sitzungen, Intune, Exchange, OneDrive, Lizenzen, 2 fiktive Fälle, Active Recall |
| `RB-050_Praxis-Runbook.md` | 10 Arbeitsabschnitte mit freigabepflichtigen Eingriffen, Verantwortlichkeiten, STOP-Kriterien, Nachweis und Muster-Ticketkommentar |
| `assets/rb050_henne_ei_offboarding.png` | Professionelle Henne-und-Ei-Infografik zum Offboarding-End-to-End-Prozess |
| `assets/rb050_diagnosebaum.svg` | Skalierbarer Entscheidungsbaum zur Prüfung von Identität, Sessions, Apps, Daten und Abschluss |
| `assets/rb050_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums für Website und Lernen |
| `README.md` | Dieses Dokument: Struktur, Sicherheit, Quellen und Validierungsstatus |

## Fachliche Leitlinien

- **Konto gesperrt ≠ alle bestehenden App-Sitzungen beendet.** Refresh-/Access-/Session-Tokens unterscheiden. [Q2][Q3]
- **Lokales AD deaktiviert ≠ Cloudzugang sofort gesperrt.** Hybrid-Quellsystem und Sync berücksichtigen. [Q2]
- **Lizenz entfernt ≠ geordnete Datenübergabe.** Exchange-/OneDrive-Aufbewahrung und rechtliche Holds vorher prüfen. [Q1][Q6][Q7]
- **Shared Mailbox weiterverwenden ≠ Benutzerobjekt löschen.** Der zugehörige Account muss für das Postfach bestehen bleiben und darf nicht mehr zur Anmeldung verwendbar sein. [Q5]
- **Retire ≠ Wipe.** Eigentum, Plattform, Datenverlust und offline ausstehende Device-Aktionen unterscheiden. [Q8][Q9][Q10]
- **Sperr- und Datenprozess sind zwei getrennte Abschlusskriterien.** Ein offener Retention-Folgeauftrag verhindert nicht grundsätzlich die dokumentierte zeitkritische Sperre. [Q1]

## Sicherheitsstandard

1. Nur eindeutige Identität + autorisierte HR-/Security-Freigabe + definiertes Zeitfenster.
2. Keine Benutzer- oder Lizenzlöschung auf Verdacht; keine unkontrollierte Datenweitergabe.
3. Keine Secrets, Sitzungs-Cookies, Tokens oder BitLocker-Schlüssel in Tickets/Unterlagen.
4. Administrative Änderungen nur mit passender Rolle, dokumentierter Freigabe und Audit-Nachweis.
5. Private Geräte niemals ohne Eigentums-/Plattformprüfung mit einem vollständigen Wipe behandeln.
6. Nicht behaupten, alle Sessions seien sofort beendet, wenn nur Entra-Sitzungen widerrufen wurden.
7. Getrennte Verantwortlichkeiten für Sicherheitszugänge, Daten, Lizenzen und Assetrückgabe.
8. Benutzerdaten sparsam dokumentieren; Beispiele in dieser Lernversion vollständig fiktiv.

## Vorgeschlagener Praxistrainingsablauf

1. Das fiktive Eingangsticket lesen und selbst einen Stop-/Sperr-/Datenplan formulieren.
2. Welche Zugänge könnten trotz Kontosperrung bestehen bleiben? Hypothesen ohne Musterliste aufstellen.
3. In eigener Testumgebung zunächst **nur lesend** AD-/Entra-Status prüfen.
4. Mit Testkonto und ausdrücklichem Rückfallplan kontrolliert die Sperrung und Nachweise erproben.
5. Alle nicht verfügbaren Dienste/Tenant-Funktionen **als nicht getestet** kennzeichnen.
6. Eigenes L2-Runbook aus dem Gedächtnis schreiben; mit dem Muster vergleichen.
7. Bei Bedarf Wissen/Verständnis/Diagnose als Anki-Karten ergänzen; spätere Abrufübungen nach 7 und 21 Tagen.

## Herstellerquellen und Recherchegrundlage (Microsoft Learn; recherchiert am 23.11.2026)

- [Q1] Microsoft 365 – Remove a former employee (Prozessüberblick): https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee
- [Q2] Microsoft Entra – Revoke user access in an emergency: https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access
- [Q3] Microsoft Graph v1.0 – user: revokeSignInSessions: https://learn.microsoft.com/en-us/graph/api/user-revokesigninsessions?view=graph-rest-1.0
- [Q4] Microsoft 365 – Step 1: Prevent user sign-in: https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee-step-1
- [Q5] Microsoft 365 – Convert a user mailbox to a shared mailbox: https://learn.microsoft.com/en-us/microsoft-365/admin/email/convert-user-mailbox-to-shared-mailbox
- [Q6] Microsoft 365 – Step 5: Give another employee access to OneDrive/Outlook: https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee-step-5
- [Q7] SharePoint/OneDrive – Retention and deletion: https://learn.microsoft.com/en-us/sharepoint/retention-and-deletion
- [Q8] Microsoft Intune – Remote device actions: https://learn.microsoft.com/en-us/intune/device-management/actions/
- [Q9] Microsoft Intune – Retire: https://learn.microsoft.com/en-us/intune/device-management/actions/retire
- [Q10] Microsoft Intune – Wipe: https://learn.microsoft.com/en-us/intune/device-management/actions/wipe
- [Q11] Microsoft 365 – Step 7: Delete a former employee’s user account: https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee-step-7
- [Q12] Microsoft 365 – About shared mailboxes: https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes
- [Q13] Microsoft Entra – Disable on-prem AD account / cloud account and revoke sessions: siehe [Q2]
- [Q14] Microsoft 365 – Assign or unassign licenses: https://learn.microsoft.com/en-us/microsoft-365/admin/manage/assign-licenses-to-users

**Einordnung:** Die Quellen dokumentieren Herstellerfunktionen und technische Einschränkungen. Die Reihenfolge im Runbook ist eine **abgeleitete, sicherheitsorientierte Musterprozesslogik**, kein universeller Rechts- oder Tenant-Standard. Aufbewahrungspflichten, Rollen und Löschfristen sind im konkreten Unternehmen verbindlich abzuklären.

## Veröffentlichungs- und Transparenzhinweise

- Relative Dateipfade der Markdown-Dokumente erhalten oder beim Website-Import gezielt anpassen.
- **Die Website wurde durch dieses ZIP nicht verändert.**
- Bildkennzeichnung: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“**
- Inhaltlicher Status für die Website: **„Herstellerrecherche und theoretische Dokumentation abgeschlossen; praktische Validierung steht aus.“**
- Keine realen Personaldaten, Tokens, Zugangsdaten oder Administrationsnachweise öffentlich machen.

**Projektstatus:** RB-050 ist als Musterfall fertig vorbereitet. Das 50-Tickets-Gesamtprojekt ist damit in seiner **Dokumentationsphase** vollständig, soweit RB-001 bis RB-049 vorliegen; die praktische Prüfung der Verfahren ist ein eigener Arbeitsschritt.

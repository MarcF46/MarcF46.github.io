# RB-049 – Onboarding: Arbeitsplatz und Zugänge bereitstellen (L1/L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle  
**Stand:** 23.11.2026 · **Paketversion:** 1.0  
**Status:** Technische Recherche / hypothetischer Diagnose- und Prozessablauf – **noch nicht praktisch validiert**.

## Paketstruktur – genau sechs Dateien

| Datei | Zweck |
|---|---|
| `RB-049_Lernartikel.md` | 15 Kapitel: HR-Freigabe, Cloud/Hybrid-Identität, Gruppen, SKU/Servicepläne, MFA, Intune, Endtests, zwei fiktive Fälle, Active Recall |
| `RB-049_Praxis-Runbook.md` | 10 Arbeitsabschnitte: Onboarding-Checkliste, Rollen, Lizenzen, MFA, Geräte, STOP-Kriterien, Abnahme und Ticketkommentar |
| `assets/rb049_henne_ei_onboarding.png` | Professionelle Henne-und-Ei-Infografik |
| `assets/rb049_diagnosebaum.svg` | Skalierbarer technischer Entscheidungsbaum mit Soll-Ist-Prüfungen und Eskalationspfaden |
| `assets/rb049_diagnosebaum_preview.png` | PNG-Version des Entscheidungsbaums für Website/Lernmaterialien |
| `README.md` | Dieses Dokument: Nutzung, Sicherheit, Quellen, Validierungsstatus |

## Kernunterscheidungen

- **Benutzerkonto angelegt ≠ Mitarbeiter arbeitsfähig.** Es fehlen ggf. Gruppen, Lizenzen, MFA, Gerät oder Fachrollen.
- **In AD sichtbar ≠ in Entra korrekt synchronisiert.** Quellsystem und Authoritative Source vorher klären.
- **Lizenzzuweisung ≠ Dienstbereitstellung.** Exchange-Postfach und App-Nutzung prüfen.
- **Geräteidentität ≠ Intune-Enrollment ≠ Compliance ≠ Fachanwendung verfügbar.**
- **Gruppenmitgliedschaft ≠ effektive Ressourcenerlaubnis.** Zielsystem und Benutzerfunktion prüfen.
- **Anmeldeerfolg ≠ zulässiger Zugriff auf alle Ressourcen.** Conditional Access und Minimalrechte sind Teil des Solls.

## Verbindliche Sicherheitsregeln

1. Erst Auftrag, Rolle, Freigabe und eindeutige Person klären; ohne Nachweis STOP.
2. Keine unkontrollierte Übernahme von Kollegengruppen und keine Adminrechte auf Verdacht.
3. Keine Passwörter, TAPs, MFA-Codes oder BitLocker-Recovery-Schlüssel in Tickets, E-Mails oder Laborunterlagen.
4. Nutzeridentität und rechtmäßigen Übergabeempfänger verifizieren; MFA wird vom Nutzer registriert.
5. Keine Test- oder Admin-Anmeldung im Namen eines Nutzers ohne zulässigen Prozess.
6. Kein unbegründeter CA-Bypass, kein Intune-Reset, keine Lizenzentfernung/Neuzuweisung auf Verdacht.
7. Nur genehmigte Identitäts-, Gruppen-, Lizenz- und Gerätemanagementänderungen; Rollen- und Auditkontext beachten.
8. Teilfertige Onboardings mit Verantwortlichem, Blocker und Termin offen dokumentieren; nicht fälschlich als erfolgreich abschließen.

## Lernablauf für spätere Praxis

1. Eingangsticket lesen und aus dem Gedächtnis eine Soll-Ist-Checkliste entwerfen.
2. Mindestens drei mögliche Ausfallstellen pro Schwerpunkt (Identität, Lizenz, MFA, Gerät) notieren.
3. Verfügbare Prüfungen in einer **eigenen Testumgebung** durchführen; ohne Tenant/Intune-Lizenz entsprechende Äste nur theoretisch behandeln.
4. Ein Problem nach dem anderen simulieren, Ursache nachweisen und freigegebene Änderung durchführen.
5. Fachlichen Endtest **unter berechtigtem Benutzerkontext** bestätigen.
6. Eigenes Runbook schreiben und mit diesem Muster kritisch vergleichen.
7. Bei Bedarf drei Anki-Kartentypen erstellen: Wissen, Verständnis und Diagnose; neue Fallvarianten später prüfen (ca. 7/21 Tage).

## Quellen (offizielle Microsoft-Learn-Dokumentation; geprüft am 23.11.2026)

1. https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/add-users
2. https://learn.microsoft.com/en-us/entra/fundamentals/how-to-create-delete-users
3. https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups
4. https://learn.microsoft.com/en-us/entra/fundamentals/license-users-groups
5. https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-temporary-access-pass
6. https://learn.microsoft.com/en-us/intune/device-enrollment/windows/guide
7. https://learn.microsoft.com/en-us/autopilot/user-driven
8. https://learn.microsoft.com/en-us/intune/intune-service/protect/create-conditional-access-intune
9. https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/create-user-mailboxes
10. https://learn.microsoft.com/en-us/troubleshoot/exchange/user-and-shared-mailboxes/delays-provision-mailbox-sync-changes
11. https://learn.microsoft.com/en-us/microsoft-365/enterprise/deploy-identity-solution-identity-model
12. https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-configuration/troubleshoot-policies-in-microsoft-intune
13. https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access
14. https://learn.microsoft.com/en-us/entra/architecture/governance-deployment-employee-lifecycle
15. https://learn.microsoft.com/en-us/entra/fundamentals/concept-group-based-licensing

## Veröffentlichung / Transparenz

- Die relative Assetstruktur beim Website-Import vollständig erhalten oder Verweise gezielt anpassen.
- **Keine Website-Änderung** durch die Erstellung dieses Pakets.
- Bildkennzeichnung: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“**
- Veröffentlichungsstatus: **„Recherchierte und theoretisch nachvollzogene Fallanalyse. Die praktische Validierung steht noch aus.“**
- Fiktive Benutzer und Beispiele ausdrücklich als solche kennzeichnen. Keine tatsächlichen Nutzerdaten veröffentlichen.

**Paketfazit:** RB-049 ist zur späteren praktischen Überprüfung und möglichen Website-Veröffentlichung **vorbereitet**, aber noch **nicht produktiv validiert**.

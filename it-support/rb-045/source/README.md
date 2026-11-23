# RB-045 – Gerät wird nicht korrekt in Intune verwaltet (L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle · **Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Recherchiert und dokumentiert; **noch nicht praktisch validiert**. Beispiele sind fiktiv.

## Paketstruktur – sechs Dateien

| Datei | Zweck |
|---|---|
| `RB-045_Lernartikel.md` | Ausführlicher 15-Kapitel-Lernartikel mit Architektur, Diagnosebefehlen, zwei fiktiven Fällen und Active Recall |
| `RB-045_Praxis-Runbook.md` | Zehnteilige L2-Checkliste für kontrollierte Fehleranalyse und Eskalation |
| `assets/rb045_henne_ei_intune_geraeteverwaltung.png` | Professionelle Henne-und-Ei-Grafik mit den fünf Verwaltungsstationen |
| `assets/rb045_diagnosebaum.svg` | Skalierbarer technischer Entscheidungsbaum |
| `assets/rb045_diagnosebaum_preview.png` | PNG-Vorschau für Lernunterlagen und spätere Website |
| `README.md` | Paketübersicht, Quellen, Sicherheits- und Validierungsstatus |

## Kernaussagen

1. **Entra Join oder Registrierung sind kein Beweis für Intune-MDM-Enrollment.**
2. Eine erfolgreiche Enrollmentmeldung beweist noch nicht die **aktuelle** Kommunikation oder Verarbeitung jeder Policy.
3. `dsregcmd /status` ist eine lesende Prüfung des Registrierungszustands; **kein vollständiger MDM-/Compliance-Test**.
4. `Get-WinEvent` erlaubt gezielte **lesende** Prüfung vorhandener MDM-Ereignisse; bei GPO-Autoenrollment sind Event 75/76 relevant.
5. **Sync kann Richtlinien, Skripte und Appaktionen auslösen** und ist daher keine folgenlose Diagnose.
6. `Pending`, `Not applicable`, `Conflict`, `Error`, `Noncompliant` und `Compliant` sauber unterscheiden.
7. **Keine Geräteobjekte löschen, keine MDM-Verbindung entfernen und keine Geräte zurücksetzen ohne Freigabe und Wiederherstellungsplan.**
8. Erst nach erneutem Check-in, Policy-Status **und lokalem Wirkungstest** ist der Fall überprüfbar abgeschlossen.

## Vorbereitung eines späteren Labs

Für realistische Tests ist ein **autorisierter Testtenant und ein ausdrücklich freigegebenes Windows-Testgerät** nötig. Ein reines Windows-Lab ohne Intune-Enrollment kann Logauswertung und Architektur konzeptionell üben, aber keinen echten Intune-End-to-End-Test ersetzen. Nicht für Lernzwecke produktive Unternehmensgeräte aus der Verwaltung entfernen.

**Lerntraining:** Diagnosehypothese ohne Vorlage formulieren → lesende Befunde auswählen → dokumentieren → Runbook kritisch abgleichen → nach 7 und 21 Tagen erneut abrufen.

## Quellen (offizielle Microsoft-Informationen, 22.11.2026)

- https://learn.microsoft.com/en-us/windows/client-management/mdm-diagnose-enrollment
- https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-enrollment/troubleshoot-windows-enrollment-errors
- https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-configuration/troubleshoot-policies-in-microsoft-intune
- https://learn.microsoft.com/en-us/intune/device-security/compliance/monitor-policy
- https://learn.microsoft.com/en-us/windows/client-management/mdm-collect-logs
- https://learn.microsoft.com/en-us/intune/device-management/actions/sync
- https://learn.microsoft.com/en-us/intune/device-enrollment/windows/guide

## Hinweise zur späteren Veröffentlichung

Diese ZIP-Datei **ändert keine Website**. Die relativen Bildpfade sind für eine spätere Einbindung in das GitHub-Pages-Portfolio ausgelegt.

**KI-Kennzeichnung:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“  
**Transparenz:** „Recherchierte und theoretisch nachvollzogene Fallanalyse. Die praktische Validierung der beschriebenen Maßnahmen steht noch aus.“

**Nummerierung:** RB-045 entspricht der Projektliste. RB-044 wurde in dieser Unterhaltung **noch nicht als fertiges Komplettpaket nachgewiesen** und bleibt separat zu prüfen.

# RB-026 – Windows startet nicht korrekt (L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Stand:** 22.11.2026  
**Fachlicher Status:** Anhand offizieller Microsoft-Quellen recherchiert, theoretisch dokumentiert und **noch nicht praktisch validiert**.

## Inhalt des Komplettpakets

```text
RB-026_Windows-startet-nicht-korrekt/
├── RB-026_Lernartikel.md
├── RB-026_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb026_henne_ei_windows_start.png
    ├── rb026_diagnosebaum.svg
    └── rb026_diagnosebaum_preview.png
```

| Datei | Inhalt / Zweck |
|---|---|
| `RB-026_Lernartikel.md` | **15 Kapitel:** Startkette, Abhängigkeiten, Startphasen, WinRE, Starthilfe, Safe Mode, Update-/Restore-Optionen, Risiken, lesende Befehle, zwei fiktive Praxisfälle und Diagnosefragen. |
| `RB-026_Praxis-Runbook.md` | **10 Abschnitte:** L1-Aufnahme/L2-Pfade, Backup-/BitLocker-Gate, WinRE, Entscheidungstabelle, Abschlusscheck und Muster-Ticketkommentar. |
| `assets/rb026_henne_ei_windows_start.png` | Henne-und-Ei-Comic-Infografik der Ticketreihe, als eigener Lernanker. |
| `assets/rb026_diagnosebaum.svg` | Separater **skalierbarer** technischer Entscheidungsbaum mit Stop-Kriterien und Erfolgskontrolle. |
| `assets/rb026_diagnosebaum_preview.png` | PNG-Vorschau des Diagnosebaums, alternativ zur SVG-Einbettung. |
| `README.md` | Dateibeschreibung, Sicherheitshinweise, Quellen, Veröffentlichungsstatus. |

**Genau sechs Dateien**, keine zusätzliche Galerie, keine Veröffentlichung auf der Website in diesem Arbeitsschritt.

## Empfohlene Lern- und Validierungsreihenfolge

1. **Artikel lesen:** UEFI, Bootmanager, Loader, Kernel ohne Vorlage als Abhängigkeitskette erklären.
2. **Fehlerbild zuordnen:** Verschiedene plausible Ursachen unterscheiden, statt voreilig einen Reparaturbefehl auszuwählen.
3. **Runbook:** Die sichere L1-/L2-Übergabe und das Daten-/BitLocker-Gate beherrschen.
4. **Praxis nur mit Erlaubnis:** Im autorisierten Labor bzw. auf einem geeigneten Testgerät einen **nachvollziehbaren, kontrollierten** Startfehler analysieren. Nicht auf Produktivgeräten künstlich Bootfehler erzeugen.
5. **Erfolg belegen:** Normalstart, Anmeldung, Arbeitsanwendungen und ggf. zweiter Start; Ergebnis ins technische Journal übernehmen, sofern ausdrücklich beauftragt.
6. **Active Recall:** Nach 7/21 Tagen einen neuen Diagnosefall bearbeiten. Karteikarten in Wissen/Verständnis/Diagnose unterteilen, wenn gewünscht.

## Sicherheit & Abgrenzung

Dieses Paket ist **keine Freigabe**, Bootpartitionen, BCD, Secure Boot, TPM, Diskpart-Partitionen oder Recovery-Optionen in einem Unternehmenssystem eigenmächtig zu ändern.

- **Keine Neuinstallation/Formatierung/Reset** vor geklärtem Backup und Freigabe.
- **BitLocker-Recovery-Keys** nur über autorisierte Stellen, nie im Ticket.
- **Keine BCD- oder `bootrec`-Reparaturbefehlsserien** ohne ermittelten Bootmodus, korrekte Zielpartitionen und L2-Verfahren.
- **Keine erzwungenen Startabbrüche** bei laufenden Updates, Firmwareoperationen, möglichem Storage-Schaden oder ungeklärten Datenrisiken.
- Ein „SrtTrail.txt“-Hinweis beschreibt eine **Protokolldatei der Starthilfe**, nicht automatisch die defekte Komponente.
- Nicht dokumentierte oder nur hypothetische Praxislösungen nicht als **validiert** veröffentlichen.

## Für die spätere Website-Veröffentlichung

- Hauptartikel und den vollständigen `assets/`-Ordner gemeinsam übernehmen; relative Links erhalten.
- Technikartikel, Runbook, Comic-Infografik und separaten Diagnosebaum in bisherigem Website-Layout einbinden.
- Bis zum eigenen nachweisbaren Test deutlich kennzeichnen: „Recherchierte und theoretisch nachvollzogene Fallanalyse; praktische Validierung ausstehend.“
- KI-Grafikkennzeichnung gemäß Projektstandard: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“**.
- Die Website wurde beim Erstellen dieses Pakets **nicht** geändert.

## Quellen (offizielle Microsoft-Dokumentation, geprüft am 22.11.2026)

- Startphasen & Windows-Bootdiagnose: https://learn.microsoft.com/de-de/troubleshoot/windows-client/performance/windows-boot-issues-troubleshooting
- Windows-Wiederherstellungsumgebung: https://support.microsoft.com/de-de/windows/experience/backup-recovery/windows-recovery-environment
- Starthilfe: https://support.microsoft.com/de-de/windows/experience/startup-boot/startup-repair
- Starteinstellungen / abgesicherter Modus: https://support.microsoft.com/de-de/windows/experience/startup-boot/windows-startup-settings
- Wiederherstellungsoptionen: https://support.microsoft.com/de-de/windows/experience/backup-recovery/recovery-options-in-windows
- Updates deinstallieren: https://support.microsoft.com/de-de/windows/deployment/updates-lifecycle/how-to-uninstall-a-windows-update
- Systemwiederherstellung: https://support.microsoft.com/de-de/windows/experience/backup-recovery/system-restore
- BitLocker-Recovery: https://learn.microsoft.com/de-de/windows/security/operating-system-security/data-protection/bitlocker/recovery-overview

**Transparenz:** Grafische und textliche Aufbereitung wurde für das Lernprojekt eigenständig zusammengestellt. Die Übungsfälle sind erfunden, keine beschriebenen Diagnoseschritte wurden auf einer realen Störung ausgeführt, und die Wirksamkeit einer Maßnahme ist nicht experimentell überprüft.
